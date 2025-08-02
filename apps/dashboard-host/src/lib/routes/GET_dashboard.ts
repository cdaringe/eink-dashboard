import { Dashkind, dashkinds } from "@eink-dashboard/common";
import * as sdk from "..";
import http from "node:http";

export const route = {
  method: "GET",
  path: "/dashboard",
  handler: (state: sdk.state.State): http.RequestListener => {
    let dashIndex = 0;
    let currDashboard: Dashkind = dashkinds[0]!;
    setInterval(function updatePrimaryDashboard() {
      dashIndex = (dashIndex + 1) % dashkinds.length;
      currDashboard = dashkinds[dashIndex]!;
    }, state.config.snap.intervalSeconds);
    return async (_req, res) => {
      /**
       * Return a HTTP 301 redirect to the current dashboard.
       * This is useful for clients that want to always access the latest dashboard.
       */
      res.statusCode = 301;
      res.setHeader("Location", `/dashboard/${currDashboard}`);
      res.setHeader("Cache-Control", "no-cache");
      res.end();
    };
  },
};
