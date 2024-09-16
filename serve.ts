const http = require('http');
const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
const { dashkinds } = require('./src/common');

const randIndex = (n: number) => Math.floor(Math.random() * n);

const server = http.createServer(async (req, res) => {
  const pathnameParts = new URL(req.url).pathname
    .split("/")
    .map((it) => it.toLowerCase().trim())
    .filter(Boolean);
  const [p1, p2] = pathnameParts;
  switch (p1) {
    case "dashboard": {
      const kind =
        p2 && dashkinds.some((kind) => kind === p2)
          ? p2
          : dashkinds[randIndex(dashkinds.length)]!;
      const relativeFilename = `./public/${kind}.png`;
      const fileSize = (await Deno.stat(relativeFilename)).size;
      const file = await Deno.open(relativeFilename, { read: true });
      await file.lock();
      return new Response(file.readable, {
        headers: {
          "Content-Type": "image/png",
          "Content-Length": fileSize.toString(),
        }
      });
    }
    default: {
      if (req.headers.get("accept")?.match(/html/i)) {
        return new Response(
          `<html>
          <body>
            <h1>Not found</h1>
            <p>Did you mean to access /dashboards/{${dashkinds.join("|")}}
          </body>
        </html>`,
          { headers: { "content-type": "text/html" }, status: 404 },
        );
      }
      return new Response('{ "status": "not found" }', {
        headers: { "content-type": "application/json" },
        status: 404,
      });
    }
  }
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function runSnapWorkflow() {
  let devServerProcess: Deno.ChildProcess | undefined;
  try {
    const devServerCmd = new Deno.Command("npm", {
      args: ["run", "dev"],
      stdin: "null",
      stdout: "inherit",
      stderr: "inherit",
    });
    devServerProcess = devServerCmd.spawn();
    await sleep(10000);
    const snapCmd = new Deno.Command("npm", {
      args: ["run", "snapshot"],
      stdin: "null",
      stdout: "inherit",
      stderr: "inherit",
    }).spawn();
    await snapCmd.status;
  } catch (error) {
    console.error(`failed: ${error}`);
    await sleep(60_000 * 60);
  } finally {
    devServerProcess?.kill("SIGKILL");
    const intervalMs = 1000 /*ms / s*/ * 60 /*s/min */ * 59; /* min */
    // const intervalMs = 1000 * 60;
    setTimeout(runSnapWorkflow, intervalMs);
  }
}

runSnapWorkflow();
