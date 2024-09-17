import cw from "capture-website";
import os from "os";
import cp from "child_process";
import http from "http";
import path  from 'path';
import serveStatic from "serve-static";
import finalhandler from 'finalhandler';

const projectDirname = path.resolve(__dirname, '..', "public");
const serve = serveStatic(projectDirname)

const isMacOs = os.version().match(/darwin/i);

const { NODE_ENV,  IMAGE_KIND = "airquality", ORIGIN = "http://localhost:5173" } =
  process.env;

const isProduction = NODE_ENV?.match(/prod/i);

async function createServer(origin: string) {
  const server = http.createServer(function onRequest (req, res) {
    serve(req, res, finalhandler(req, res))
  })
  const port = new URL(origin).port;
  await new Promise<void>(res => server.listen(port, undefined, () => res()));
  return server;
};

async function main({ origin, kind }: { origin: string; kind: string }) {
  const server = await (isProduction
  ? (createServer(origin))
  : null);

  const destFilename = `./public/${kind}.png`;
  await cw.file(`${origin}/?kind=${kind}`, destFilename, {
    width: 820,
    height: 1200,
    element: "#root",
    overwrite: true,
    delay: 5,
    scaleFactor: isMacOs ? 1 : undefined,
  });

  cp.execSync(`convert ${destFilename} -depth 8 -colors 256 ${destFilename}`);

  server?.close();
}

main({ kind: IMAGE_KIND, origin: ORIGIN }).then(
  () => console.log("[snapshot (ok)]: complete"),
  (err) => console.error(`[snapshot (error)]: ${err}`),
);
