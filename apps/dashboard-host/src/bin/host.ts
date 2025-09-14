import http from "http";
import * as sdk from "../lib/";
import assert from "assert";

const handleRequest = async (
  state: sdk.state.State,
  req: http.IncomingMessage,
  res: http.ServerResponse,
) => {
  state.logger.log({ method: req.method, url: req.url, type: "request" });

  const url = new URL(
    req.url!,
    `http://${req.headers.host ?? "http://localhost"}`,
  );

  try {
    const route = state.routes.find(
      (it) => {
        if ("test" in it) {
          return req.url && it.test(req.url) &&
            (it.method === req.method || it.method === "*");
        } else {
          return (it.method === req.method || it.method === "*") &&
            (it.path === url.pathname || it.path === "*");
        }
      },
    );
    assert(route, "No handler found");
    const handler = route.handler(state);
    return handler(req, res);
  } catch (error) {
    state.logger.error(error);
    res.statusCode = 500;
    res.end(`internal server error: ${String(error)}`);
  }
};

const createServer = (state: sdk.state.State) =>
  http.createServer(async (req, res: http.ServerResponse) => {
    try {
      await handleRequest(state, req, res);
    } catch (error) {
      state.logger.error(error);
      res.statusCode = 500;
      res.end(`internal server error: ${String(error)}`);
    }
  });

function main() {
  const logger = sdk.logging.createLogger({ level: "info", name: "edh" });
  const config = sdk.config.createConfig();

  logger.log({ config });

  const state: sdk.state.State = {
    config,
    isSnapshotRunning: false,
    lastSnapshotDateMs: Date.now(),
    logger,
    snapshotInterval: setTimeout(() => void 0, 0),
    routes: sdk.routes.routes,
  };
  createServer(state).listen(config.port, () => {
    logger.log(`server listening on :${config.port}`);
    sdk.snap.run(state);
  });
}

main();
