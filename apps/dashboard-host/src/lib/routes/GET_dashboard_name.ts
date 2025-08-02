import * as sdk from "..";
import http from "node:http";
import path from "node:path";
import fs from "node:fs";

export const route = {
  pathnameDisplay: "/dashboard/:name",
  test: (url: string) => /\/dashboard\/[^\/]+$/.test(url),
  method: "GET", // Add method for documentation purposes
  handler:
    (state: sdk.state.State): http.RequestListener => async (req, res) => {
      const url = new URL(
        req.url!,
        `http://${req.headers.host ?? "http://localhost"}`,
      );

      const pathSegments = url.pathname.split("/");
      const dashboardName = pathSegments[2] as sdk.snap.DashboardName;

      // Validate dashboard name
      if (!sdk.snap.dashboardOptions.includes(dashboardName)) {
        res.statusCode = 404;
        res.end(
          `Dashboard '${dashboardName}' not found. Available: ${
            sdk.snap.dashboardOptions.join(", ")
          }`,
        );
        return;
      }

      const filename = `${dashboardName}.png`;
      const filenameToServe = path.join(
        state.config.snap.writeDirname,
        filename,
      );

      // Check if image exists, if not generate it on-demand
      if (!fs.existsSync(filenameToServe)) {
        state.logger.log(
          `Image for ${dashboardName} not found, generating on-demand`,
        );
        await sdk.snap.generateSingle(state, dashboardName);
      }

      let context: sdk.context.DashboardContext = {
        filenameToServe,
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
