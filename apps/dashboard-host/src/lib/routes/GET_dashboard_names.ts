import * as sdk from "..";
import http from "node:http";

export const route = {
  path: "/api/dashboard/names",
  method: "GET", // Add method for documentation purposes
  handler:
    (_state: sdk.state.State): http.RequestListener => async (_req, res) => {
      res.statusCode = 200;
      res.write(JSON.stringify(sdk.snap.dashboardOptions));
      res.end();
    },
};
