import http from "http";
import path from "node:path";
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

const createServer = () =>
  http.createServer(async (req, res) => {
    logger.log({ method: req.method, url: req.url, type: "request" });

    const url = new URL(
      req.url!,
      `http://${req.headers.host ?? "http://localhost"}`,
    );
    const [scope, part2] = url.pathname
      .split("/")
      .map((it) => it.toLowerCase().trim())
      .filter(Boolean);

    let context = createContext({ url });

    switch (scope) {
      case "api": {
        if (part2 === "refresh") {
          runSnapWorkflow();
          res.statusCode = 200;
          return res.end(JSON.stringify({ ok: true}));
        }
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        return res.end(JSON.stringify({ error: "missing valid api action. did you mean any of: [refresh]?" }));
      }
      case "dashboard":
        context.filenameToServe = `./public/${path.basename(part2)}`;
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
  });

let isSnapshotRunning = false;
async function runSnapWorkflow() {
  if (isSnapshotRunning) {
    return logger.error("snapshot workflow already running");
  }
  clearInterval(snapshotInterval);
  isSnapshotRunning = true;
  logger.log("running snapshot workflow");
  const intervalMs = config.snap.intervalSeconds * 1000;
  const proc = execa("node", [config.snap.scriptEntryFilename], {
    stdio: "inherit",
  });
  proc.catch(logger.error).finally(() => {
    proc.kill(9);
    logger.log(`next snapshot in ${config.snap.intervalSeconds} seconds`);
    clearInterval(snapshotInterval);
    snapshotInterval = setTimeout(runSnapWorkflow, intervalMs);
    isSnapshotRunning = false;
  });
}

function main() {
  createServer().listen(config.port, () => {
    logger.log(`server listening on :${config.port}`);
    runSnapWorkflow();
  });
}

main();
