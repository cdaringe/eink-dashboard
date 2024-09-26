import { DashboardContext } from "./context";
import http from "node:http";
import fs from "node:fs/promises";

export const streamFile = async (
  ctx: DashboardContext,
  req: http.IncomingMessage,
  res: http.ServerResponse,
) => {
  const fileSize = (await fs.stat(ctx.filenameToServe)).size;
  const file = await fs.open(ctx.filenameToServe, "r");
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Content-Length", fileSize.toString());
  ctx.logger.log(
    `serving ${ctx.filenameToServe} ${req.socket.remoteAddress ?? "unknown"}`,
  );
  return file.createReadStream().pipe(res, { end: true });
};
