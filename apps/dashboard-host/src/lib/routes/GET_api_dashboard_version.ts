import * as sdk from "..";
import http from "node:http";

export const route = {
  method: "GET",
  path: "/api/dashboard/version",
  handler:
    (state: sdk.state.State): http.RequestListener => async (_req, res) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain");
      const version = state.lastSnapshotDateMs.toString().substr(-12);
      state.logger.log({ version });
      return res.end(version);
    },
};
