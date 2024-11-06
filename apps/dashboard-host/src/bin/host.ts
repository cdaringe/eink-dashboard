import http from "http";
import serveHandler from "serve-handler";
import * as path from "path";
import * as sdk from "../lib/";
import execa from "execa";
import { match } from "ts-pattern";
import waitOn from "wait-on";

let snapshotInterval = setTimeout(() => void 0, 0);

const logger = sdk.logging.createLogger({ level: "info", name: "edh" });
const config = sdk.config.createConfig();

logger.log({ config });

const createContext = ({
  url,
}: {
  url: URL;
}): sdk.context.DashboardContext => ({
  filenameToServe: "/does/not/exist",
  config,
  logger,
  batteryOverlay: url.searchParams.get("batteryoverlay") ?? undefined,
  textOverlay: url.searchParams.getAll("textoverlay"),
});

const state = {
  lastSnapshotDateMs: Date.now(),
};

type State = typeof state;

const handleRequest = async (
  state: State,
  req: http.IncomingMessage,
  res: http.ServerResponse,
) => {
  logger.log({ method: req.method, url: req.url, type: "request" });

  const url = new URL(
    req.url!,
    `http://${req.headers.host ?? "http://localhost"}`,
  );

  let context = createContext({ url });

  match([req.method, url.pathname])
    .with(["GET", "/api/dashboard/refresh"], () => {
      if (isSnapshotRunning) {
        res.statusCode = 409;
        return res.end(
          JSON.stringify({ error: "snapshot workflow already running" }),
        );
      }
      runSnapWorkflow(state);
      res.statusCode = 200;
      return res.end(JSON.stringify({ ok: true }));
    })
    .with(["GET", "/api/dashboard/version"], () => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain");
      const version = state.lastSnapshotDateMs.toString().substr(-12);
      logger.log({ version });
      return res.end(version);
    })
    .with(["GET", "/dashboard"], async () => {
      context.filenameToServe = config.snap.grayFilename;
      if (config.snap.lastSnappedKind === "airquality") {
        context = await sdk.overlays.battery(context);
        context = await sdk.overlays.text(context);
      }
      return sdk.request.streamFile(context, req, res);
    })
    .with(["GET", "/public"], () => {
      return serveHandler(req, res);
    })
    .otherwise(() => {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      return res.end(
        JSON.stringify({
          error: "missing valid api action. did you mean any of: [refresh]?",
        }),
      );
    });
};

const createServer = (state: State) =>
  http.createServer(async (req, res: http.ServerResponse) => {
    try {
      await handleRequest(state, req, res);
    } catch (error) {
      logger.error(error);
      res.statusCode = 500;
      res.end(`internal server error: ${String(error)}`);
    }
  });

let isSnapshotRunning = false;
const dashboardOptions = ['airquality', 'onion', 'recipes'] as const;
let snapIndex = new Date().getHours();
async function runSnapWorkflow(state: State) {
  if (isSnapshotRunning) {
    return logger.error("snapshot workflow already running");
  }
  isSnapshotRunning = true;
  clearInterval(snapshotInterval);
  logger.log("running snapshot workflow");
  const intervalMs = config.snap.intervalSeconds * 1000;

  ++snapIndex;
  snapIndex = snapIndex % dashboardOptions.length;
  const option = dashboardOptions[snapIndex]

  const dashboardServerProcess = execa("node", [
    path.basename(config.dashboardServer.entrypoint),
  ], {
    stdio: "inherit",
    cwd: path.dirname(config.dashboardServer.entrypoint),
    env: {
      ...process.env,
      /**
       * @warn critical to bind to all interfaces. secret next.js api.
       */
      HOSTNAME: "0.0.0.0",
      PORT: config.dashboardServer.port.toString(),
    },
  });
  dashboardServerProcess.then(() => {
    config.snap.lastSnappedKind = option;
  }, logger.error).finally(() => {
    logger.log("dashboard server down");
    dashboardServerProcess.kill(9);
  });
  const pathname = `/dashboard/${option}`;
  const waitOnURI =
    `http://localhost:${config.dashboardServer.port}${pathname}`;
  logger.log(`waiting on ${waitOnURI}`);
  await waitOn({
    resources: [waitOnURI],
    timeout: 30_000,
  });
  const proc = execa("node", [config.snap.scriptEntryFilename], {
    stdio: "inherit",
    env: {
      ...process.env,
      PORT: config.dashboardServer.port.toString(),
      SNAP_URL_PATHNAME: pathname,
    },
  });
  proc.catch(logger.error).finally(() => {
    state.lastSnapshotDateMs = Date.now();
    isSnapshotRunning = false;
    proc.kill(9);
    dashboardServerProcess.kill();
    setTimeout(() => {
      try {
        dashboardServerProcess.kill(9);
      } catch {}
    }, 1_000);
    logger.log(`next snapshot in ${config.snap.intervalSeconds} seconds`);
    clearInterval(snapshotInterval);
    snapshotInterval = setTimeout(() => runSnapWorkflow(state), intervalMs);
  });
}

function main() {
  const state: State = {
    lastSnapshotDateMs: Date.now(),
  };
  createServer(state).listen(config.port, () => {
    logger.log(`server listening on :${config.port}`);
    runSnapWorkflow(state);
  });
}

main();
