import http from "http";
import fs from "fs/promises";
import child_process from "child_process";
import { dashkinds } from "@eink-dashboard/common";
import path from "path";
import serveHandler from "serve-handler";
import execa from 'execa';
import { display } from "../lib";

const SNAP_SCRIPT_PATH = `${__dirname}/snap.js`;
const { PORT = "8000", SNAP_DURATION_S = String(60 * 60) } = process.env;

const log = (msg: string) =>
  console.log(`[edh ${new Date().toISOString()}]: ${msg}`);
const port = Number(PORT);
const intervalMs = 1000 * Number(SNAP_DURATION_S);

const randIndex = (n: number) => Math.floor(Math.random() * n);
const webDashboardDirname = path.resolve(process.cwd(), "dist/web-dashboard");
// const publicDirname = path.resolve(process.cwd(), "public");

const server = http.createServer(async (req, res) => {
  const uri = new URL(req.url!, `http://${req.headers.host ?? "http://localhost"}`);
  const pathnameParts = uri.pathname
    .split("/")
    .map((it) => it.toLowerCase().trim())
    .filter(Boolean);
  const [p1, p2] = pathnameParts;
  switch (p1) {
    case "dashboard": {
      const kind = p2 && dashkinds.some((kind) => kind === p2)
        ? p2
        : dashkinds[randIndex(dashkinds.length)]!;
      const relativeFilename = `./public/${kind}.png`;
      let filenameToServe = relativeFilename;
      const batteryPercentStr = uri.searchParams.get('batterypercent')
      if (batteryPercentStr) {
        const batteryPercent = Number(batteryPercentStr);
        // given a battery percent, find the closest number from 0 to 100 in increments of 5
        const batteryPercentIncr5 = Math.max(5, Math.round(batteryPercent / 5) * 5);
        const batteryPngFilename = `./public/icon/battery/${batteryPercentIncr5}_battery.png`;
        const lastFileToServe = filenameToServe;
        filenameToServe = filenameToServe.replace('.png', `.${batteryPercentIncr5}_battery.png`);
        await execa.command(`convert ${lastFileToServe} ( ${batteryPngFilename} -resize x24 ) -geometry +${display.dims.width - 280}+${display.dims.height-28} -composite ${filenameToServe}`);
      }
      const fileSize = (await fs.stat(filenameToServe)).size;
      const file = await fs.open(filenameToServe, "r");
      res.setHeader("Content-Type", "image/png");
      res.setHeader("Content-Length", fileSize.toString());
      log(`serving ${kind}.png to ${req.socket.remoteAddress ?? "unknown"}`);
      return file.createReadStream().pipe(res, { end: true });
    }
    case "public": {
      // log(`serving public dir ${publicDirname} to ${req.socket.remoteAddress ?? "unknown"}`);
      return serveHandler(req, res);
    }
    default: {
      return serveHandler(req, res, {
        public: webDashboardDirname,
      });
    }
  }
});

function createDeferred<T>() {
  let resolve: (value: T | PromiseLike<T>) => void = undefined!;
  let reject: (reason?: any) => void = undefined!;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

async function runSnapWorkflow() {
  log("running snapshot workflow");
  const deferred = createDeferred<void>();
  const proc = child_process.exec(
    `node ${SNAP_SCRIPT_PATH}`,
    (err) => err ? deferred.reject(err) : deferred.resolve(),
  );
  proc.stdout?.pipe(process.stdout);
  proc.stderr?.pipe(process.stderr);
  try {
    await deferred.promise;
  } catch (error) {
    console.error(`failed: ${error}`);
  } finally {
    proc.kill(9);
    log(`next snapshot in ${SNAP_DURATION_S} seconds (${intervalMs} ms)`);
    setTimeout(runSnapWorkflow, intervalMs);
  }
}

server.listen(port, () => console.log(`server listening on port ${port}`));

runSnapWorkflow();
