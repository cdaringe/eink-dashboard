import execa from "execa";
import waitOn from "wait-on";
import { State } from "./state";
import * as sdk from "../lib/";

const dashboardOptions = ["airquality", "onion", "recipes"] as const;
let snapIndex = new Date().getHours();

export async function run(state: State) {
  const { config, logger } = state;
  if (state.isSnapshotRunning) {
    return state.logger.error("snapshot workflow already running");
  }
  state.isSnapshotRunning = true;
  clearInterval(state.snapshotInterval);
  state.logger.log("running snapshot workflow");
  const intervalMs = config.snap.intervalSeconds * 1000;

  ++snapIndex;
  snapIndex = snapIndex % dashboardOptions.length;
  const option = dashboardOptions[snapIndex];

  const { bin, args, cwd } = config.dashboardServer;
  const dashboardServerProcess = execa(
    bin,
    args,
    {
      stdio: "inherit",
      cwd,
      env: {
        ...process.env,
        /**
         * @warn critical to bind to all interfaces. secret next.js api.
         */
        HOSTNAME: "0.0.0.0",
        PORT: config.dashboardServer.port.toString(),
      },
    },
  );
  dashboardServerProcess
    .then(() => {
      config.snap.lastSnappedKind = option;
    }, logger.error)
    .finally(() => {
      logger.log("dashboard server down");
      dashboardServerProcess.kill(9);
    });
  const pathname = `/dashboard/${option}`;
  const waitOnURI =
    `http://localhost:${config.dashboardServer.port}${pathname}`;
  logger.log(`waiting on ${waitOnURI}`);
  await waitOn({
    resources: [waitOnURI],
    timeout: 30_000,
  });
  const proc = execa(config.snap.scriptBin, [config.snap.scriptEntryFilename], {
    stdio: "inherit",
    env: {
      ...process.env,
      PORT: config.dashboardServer.port.toString(),
      SNAP_URL_PATHNAME: pathname,
    },
  });
  proc.then(
    () => {
      logger.log("snapshot script complete");
    },
    (err) => {
      logger.error(`error running snapshot script: ${String(err)}`);
      logger.error(err);
    },
  ).finally(() => {
    state.lastSnapshotDateMs = Date.now();
    state.isSnapshotRunning = false;
    proc.kill(9);
    dashboardServerProcess.kill();
    setTimeout(() => {
      try {
        dashboardServerProcess.kill(9);
      } catch {}
    }, 1_000);
    logger.log(`next snapshot in ${config.snap.intervalSeconds} seconds`);
    clearInterval(state.snapshotInterval);
    state.snapshotInterval = setTimeout(() => sdk.snap.run(state), intervalMs);
  });
}
