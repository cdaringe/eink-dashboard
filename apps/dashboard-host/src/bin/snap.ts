import cw from "capture-website";
import os from "os";
import cp from "child_process";
import { setTimeout } from "timers/promises";
import { display } from "../lib";

const log = (msg: string) =>
  console.log(`[snapshot (${new Date().toISOString()})]: ${msg}`);

const isMacOs = os.version().match(/darwin/i);

const {
  IMAGE_KIND = "airquality",
  PORT = "8000",
} = process.env;

async function main({ port, kind }: { port: number; kind: string }) {
  log('starting snapshot');
  const destColorFilename = `./public/${kind}-color.png`;
  const destGrayFilename = `./public/${kind}.png`;
  await setTimeout(10_000);
  await cw.file(`http://localhost:${port}/?kind=${kind}`, destColorFilename, {
    ...display.dims,
    element: "#root",
    overwrite: true,
    delay: 20,
    scaleFactor: isMacOs ? 1 : undefined,
    timeout: 60_000 * 2,
    launchOptions: {
      headless: 'new',
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
      ],
      // // @warn guess n check hack
      // env: {
      //   TZ: "America/Los_Angeles",
      // }
    },
  });
  log(`snapshot saved to ${destColorFilename}`);
  cp.execSync(`convert ${destColorFilename} -depth 8 -colors 256 ${destGrayFilename}`);
  [destColorFilename, destGrayFilename].forEach(filename => {
    cp.execSync(`chmod ugo+rw ${filename}`);
  });
  log("converted to 256 colors");
}

main({ kind: IMAGE_KIND, port: Number(PORT) }).then(
  () => log("complete"),
  (err) => log(String(err)),
);
