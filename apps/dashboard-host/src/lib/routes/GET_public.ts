import * as sdk from "..";
import http from "node:http";
import serveHandler from "serve-handler";

export const route = {
  method: "GET",
  path: "/public/",
  test: (url: string) => url.startsWith("/public"),
  handler:
    (_state: sdk.state.State): http.RequestListener => async (req, res) => {
      return serveHandler(req, res);
    },
};
