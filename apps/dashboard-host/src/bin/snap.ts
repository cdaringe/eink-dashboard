/**
 * snapshotting is a separate process to simply clear more mem/resource
 * out of the default server process.
 */

import cw from "capture-website";
import os from "os";
import path from "node:path";
import * as sdk from "../lib";
import execa from "execa";

const logger = sdk.logging.createLogger({ level: "info", name: "snap" });
const config = sdk.config.createConfig();

const isMacOs = os.version().match(/darwin/i);

async function main() {
  const grayFilename = `${config.snap.writeDirname}/${path.basename(config.snap.imageBasename)}`;
  const colorFilename = `${grayFilename}.color`;

  /**
   * Visit the eink-dashboard-host server and take a snapshot of the dashboard.
   */
  const imageUrl = `${config.snap.url.origin}${config.snap.url.pathname}${config.snap.url.search}`;
  logger.log(`starting snapshot ${imageUrl}`);
  await cw.file(imageUrl, colorFilename, {
    ...config.display.dims,
    element: "#root",
    overwrite: true,
    delay: 20,
    scaleFactor: isMacOs ? 1 : undefined,
    timeout: 60_000 * 2,
    launchOptions: {
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      env: {
        ...process.env,
        TZ: config.snap.timezone,
      },
    },
  });
  logger.log(`snapshot saved to ${colorFilename}`);
  await execa.command(
    `convert ${colorFilename} -depth 8 -colors 256 ${grayFilename}`,
  );
  for (const filename of [colorFilename, grayFilename]) {
    await execa.command(`chmod ugo+rw ${filename}`);
  }
  logger.log("converted to 256 colors");
}

main().then(() => logger.log("complete"), logger.error);
