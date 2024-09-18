import http from "http";
import fs from "fs/promises";
import child_process from "child_process";
import { dashkinds } from "@eink-dashboard/common";

const SNAP_SCRIPT_PATH = `${__dirname}/snap.js`;
const { PORT = "8000", SNAP_DURATION_S = String(60 * 60) } = process.env;

const log = (msg: string) => console.log(`[edh]: ${msg}`);
const port = Number(PORT);
const intervalMs = 1000 * Number(SNAP_DURATION_S);

const randIndex = (n: number) => Math.floor(Math.random() * n);

const server = http.createServer(async (req, res) => {
  const pathnameParts = req.url!
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
      const fileSize = (await fs.stat(relativeFilename)).size;
      const file = await fs.open(relativeFilename, "r");
      res.setHeader("Content-Type", "image/png");
      res.setHeader("Content-Length", fileSize.toString());
      log(`serving ${kind}.png to ${req.socket.remoteAddress ?? "unknown"}`);
      return file.createReadStream().pipe(res, { end: true });
    }
    default: {
      const isHtml = req.headers.accept?.match(/html/i);
      res.setHeader("content-type", isHtml ? "text/html" : "application/json");
      res.statusCode = 404;
      if (isHtml) {
        res.end(
          `<html>
          <body>
            <h1>Not found</h1>
            <p>Did you mean to access /dashboards/{${dashkinds.join("|")}}
          </body>
        </html>`,
        );
      }
      return res.end('{ "status": "not found" }');
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
    setTimeout(runSnapWorkflow, intervalMs);
  }
}

server.listen(port, () => console.log(`server listening on port ${port}`));

runSnapWorkflow();
