import cw from "capture-website";
import os from "os";
import cp from "child_process";
import { setTimeout } from "timers/promises";
import http from "http";
import path from "path";
import serveHandler from "serve-handler";

const log = (msg: string) => console.log(`[snapshot]: ${msg}`);

const { PORT_STATIC = "8001" } = process.env;

const port = Number(PORT_STATIC);

const webDashboardDirname = path.resolve(process.cwd(), "dist/web-dashboard");

const isMacOs = os.version().match(/darwin/i);

const {
  NODE_ENV,
  IMAGE_KIND = "airquality",
} = process.env;

const isProduction = NODE_ENV?.match(/prod/i);

async function createServer({ port }: { port: number }) {
  const server = http.createServer(function onRequest(req, res) {
    serveHandler(req, res, {
      public: webDashboardDirname,
    });
  });
  await new Promise<void>((res) => server.listen(port, "0.0.0.0", () => res()));
  return server;
}

async function main({ port, kind }: { port: number; kind: string }) {
  log(
    `starting snapshot (${
      JSON.stringify({ isProduction, webDashboardDirname })
    })}`,
  );
  const server = await createServer({ port });
  const origin = `http://localhost:${port}`;
  log(`static server started on ${origin}`);
  const destFilename = `./public/${kind}.png`;
  await setTimeout(10_000);
  await cw.file(`${origin}/?kind=${kind}`, destFilename, {
    width: 820,
    height: 1200,
    element: "#root",
    overwrite: true,
    delay: 5,
    scaleFactor: isMacOs ? 1 : undefined,
    timeout: 60_000 * 2,
    launchOptions: {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    }
  });
  log(`snapshot saved to ${destFilename}`);
  cp.execSync(`convert ${destFilename} -depth 8 -colors 256 ${destFilename}`);
  log("converted to 256 colors");
  server?.close();
}

main({ kind: IMAGE_KIND, port }).then(
  () => log("complete"),
  (err) => log(String(err)),
);
