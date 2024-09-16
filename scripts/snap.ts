import cw from "capture-website";
import os from "os";
import cp from "child_process";
const isMacOs = os.version().match(/darwin/i);

const { IMAGE_KIND = "airquality", ORIGIN = "http://localhost:5173" } =
  process.env;

async function main({ origin, kind }: { origin: string; kind: string }) {
  const destFilename = `./public/${kind}.png`;
  await cw.file(`${origin}/?kind=${kind}`, destFilename, {
    // width: 600,
    // height: 800,
    width: 820,
    height: 1200,
    element: "#root",
    overwrite: true,
    delay: 5,
    scaleFactor: isMacOs ? 1 : undefined,
  });

  cp.execSync(`convert ${destFilename} -depth 8 -colors 256 ${destFilename}`);
}

main({ kind: IMAGE_KIND, origin: ORIGIN }).then(
  () => console.log("[snapshot (ok)]: complete"),
  (err) => console.error(`[snapshot (error)]: ${err}`),
);
