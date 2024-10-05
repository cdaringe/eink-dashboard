import http from "http";
import fs from "node:fs/promises";
import serveHandler from "serve-handler";
import * as sdk from "../lib/";
import execa from "execa";

let snapshotInterval = setTimeout(() => void 0, 0);

const logger = sdk.logging.createLogger({ level: "info", name: "edh" });
const config = sdk.config.createConfig();

logger.log({config});

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

const handleRequest = async (req: http.IncomingMessage, res: http.ServerResponse) => {
  logger.log({ method: req.method, url: req.url, type: "request" });

  const url = new URL(
    req.url!,
    `http://${req.headers.host ?? "http://localhost"}`,
  );
  const [scope, part2, part3] = url.pathname
    .split("/")
    .map((it) => it.toLowerCase().trim())
    .filter(Boolean);

  let context = createContext({ url });

  const dashboardBasename = "airquality.png";

  switch (scope) {
    case "api": {
      if (part2 === "dashboard" && part3 === "refresh") {
        if (isSnapshotRunning) {
          res.statusCode = 409;
          return res.end(JSON.stringify({ error: "snapshot workflow already running" }));
        }
        runSnapWorkflow();
        res.statusCode = 200;
        return res.end(JSON.stringify({ ok: true}));
      }
      if (part2 === "dashboard" && part3 === "version") {
        if (!part3) throw new Error("missing filename");
        const mtime = await fs.stat(config.snap.grayFilename).then((it) => it.mtime);
        logger.log({ filename: config.snap.guiAssetsDirname, mtime: mtime.getTime() });
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        return res.end(String(mtime.getTime()));
      }
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      return res.end(JSON.stringify({ error: "missing valid api action. did you mean any of: [refresh]?" }));
    }
    case "dashboard":
      context.filenameToServe = `./public/${dashboardBasename}`;
      context = await sdk.overlays.battery(context);
      context = await sdk.overlays.text(context);
      return sdk.request.streamFile(context, req, res);
    case "public":
      return serveHandler(req, res);
    default:
      return serveHandler(req, res, {
        public: config.snap.guiAssetsDirname,
      });
  }
};

const createServer = () =>
  http.createServer(async (req, res) => {
    try {
      await handleRequest(req, res);
    } catch (error) {
      logger.error(error);
      res.statusCode = 500;
      res.end(`internal server error: ${String(error)}`);
    }
  });

let isSnapshotRunning = false;
async function runSnapWorkflow() {
  if (isSnapshotRunning) {
    return logger.error("snapshot workflow already running");
  }
  isSnapshotRunning = true;
  clearInterval(snapshotInterval);
  logger.log("running snapshot workflow");
  const intervalMs = config.snap.intervalSeconds * 1000;
  const proc = execa("node", [config.snap.scriptEntryFilename], {
    stdio: "inherit",
  });
  proc.catch(logger.error).finally(() => {
    isSnapshotRunning = false;
    proc.kill(9);
    logger.log(`next snapshot in ${config.snap.intervalSeconds} seconds`);
    clearInterval(snapshotInterval);
    snapshotInterval = setTimeout(runSnapWorkflow, intervalMs);
  });
}

function main() {
  createServer().listen(config.port, () => {
    logger.log(`server listening on :${config.port}`);
    runSnapWorkflow();
  });
}

main();
