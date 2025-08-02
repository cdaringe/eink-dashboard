/**
 * snapshotting is a separate process to simply clear more mem/resource
 * out of the default server process.
 */

import cw from "capture-website";
import * as sdk from "../lib";
import execa from "execa";
import path from "node:path";
const { CHROME_PATH, NODE_ENV, SNAP_IMAGE_BASENAME } = process.env;

const logger = sdk.logging.createLogger({ level: "info", name: "snap" });
const config = sdk.config.createConfig();

async function main() {
  // Use SNAP_IMAGE_BASENAME if provided, otherwise fall back to config
  const imageBasename = SNAP_IMAGE_BASENAME || config.snap.imageBasename;
  const grayFilename = path.join(config.snap.writeDirname, imageBasename);
  const colorFilename = `${grayFilename}.color`;

  /**
   * Visit the eink-dashboard-host server and take a snapshot of the dashboard.
   */
  const imageUrl =
    `${config.snap.url.hostname}:${config.snap.url.port}${config.snap.url.pathname}`;
  const headless = !!NODE_ENV;
  logger.log(`starting snapshot (headless: ${headless}) ${imageUrl}`);
  await cw.file(imageUrl, colorFilename, {
    ...config.display.dims,
    element: "#root",
    overwrite: true,
    waitForElement: ".snapshot_ready",
    delay: 20,
    scaleFactor: config.os === "macos" ? 1 : undefined,
    timeout: 60_000 * 2,
    launchOptions: {
      headless,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      ...(CHROME_PATH ? { executablePath: CHROME_PATH } : {}),
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
  logger.log(`converted to 256 colors ${grayFilename}`);
}

main().then(() => logger.log("complete"), (err) => {
  logger.error(`snapshot script failed: ${String(err)}`);
  logger.error(err);
  process.exit(1);
});
