import * as sdk from "..";
import http from "node:http";

export const route = {
  method: "GET",
  path: "/api/dashboard/refresh",
  handler:
    (state: sdk.state.State): http.RequestListener =>
    async (_req, res) => {
      if (state.isSnapshotRunning) {
        res.statusCode = 409;
        return res.end(
          JSON.stringify({ error: "snapshot workflow already running" }),
        );
      }
      sdk.snap.run(state);
      res.statusCode = 200;
      return res.end(JSON.stringify({ ok: true }));
    },
};
