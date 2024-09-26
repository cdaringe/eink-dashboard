import http from "http";
import path from "node:path";
import serveHandler from "serve-handler";
import * as sdk from "../lib/";
import execa from "execa";

const logger = sdk.logging.createLogger({ level: "info", name: "edh" });
const config = sdk.config.createConfig();

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
    const [scope, imageBaseName] = url.pathname
      .split("/")
      .map((it) => it.toLowerCase().trim())
      .filter(Boolean);

    let context = createContext({ url });

    switch (scope) {
      case "dashboard":
        context.filenameToServe = `./public/${path.basename(imageBaseName)}`;
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

async function runSnapWorkflow() {
  logger.log("running snapshot workflow");
  const intervalMs = config.snap.intervalSeconds * 1000;
  const proc = execa("node", [config.snap.scriptEntryFilename], {
    stdio: "inherit",
  });
  proc.catch(logger.error).finally(() => {
    proc.kill(9);
    logger.log(`next snapshot in ${config.snap.intervalSeconds} seconds`);
    setTimeout(runSnapWorkflow, intervalMs);
  });
}

function main() {
  createServer().listen(config.port, () => {
    logger.log(`server listening on :${config.port}`);
    runSnapWorkflow();
  });
}

main();
