import * as sdk from "..";
import http from "node:http";

export const route = {
  method: "GET",
  path: "/dashboard",
  handler:
    (state: sdk.state.State): http.RequestListener =>
    async (req, res) => {
      const url = new URL(
        req.url!,
        `http://${req.headers.host ?? "http://localhost"}`,
      );

      let context: sdk.context.DashboardContext = {
        filenameToServe: state.config.snap.grayFilename,
        config: state.config,
        logger: state.logger,
        batteryOverlay: url.searchParams.get("batteryoverlay") ?? undefined,
        textOverlay: url.searchParams.getAll("textoverlay"),
      };

      context = await sdk.overlays.battery(context);
      context = await sdk.overlays.text(context);
      return sdk.request.streamFile(context, req, res);
    },
};
