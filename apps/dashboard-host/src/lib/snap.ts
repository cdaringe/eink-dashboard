import execa from "execa";
import { State } from "./state";
import * as sdk from "../lib/";

export const dashboardOptions = [
  "airquality",
  "onion",
  "recipes",
  "rover",
] as const;
export type DashboardName = typeof dashboardOptions[number];

export async function generateSingle(
  state: State,
  dashboardName: DashboardName,
): Promise<void> {
  const { logger } = state;

  if (state.isSnapshotRunning) {
    throw new Error("snapshot workflow already running");
  }

  state.isSnapshotRunning = true;

  try {
    logger.log(`generating single dashboard: ${dashboardName}`);
    await runSnapshotForDashboard(state, dashboardName);
    logger.log(`single dashboard generation complete: ${dashboardName}`);
  } finally {
    state.isSnapshotRunning = false;
  }
}

/**
 * Generate all dashboard images
 */
export async function generateAll(state: State): Promise<void> {
  const { logger } = state;

  if (state.isSnapshotRunning) {
    throw new Error("snapshot workflow already running");
  }

  state.isSnapshotRunning = true;

  try {
    logger.log("generating all dashboard images");
    for (const dashboardName of dashboardOptions) {
      await runSnapshotForDashboard(state, dashboardName);
      logger.log(`completed: ${dashboardName}`);
    }
    logger.log("all dashboard generation complete");
  } finally {
    state.isSnapshotRunning = false;
  }
}

/**
 * Core snapshot logic for a specific dashboard
 */
async function runSnapshotForDashboard(
  state: State,
  dashboardName: DashboardName,
): Promise<void> {
  const { config, logger } = state;

  const { bin, args, cwd } = config.dashboardServer;
  const dashboardServerProcess = execa(
    bin,
    args,
    {
      stdio: "inherit",
      cwd,
      env: {
        ...process.env,
        HOSTNAME: "0.0.0.0",
        PORT: config.dashboardServer.port.toString(),
      },
    },
  );

  try {
    const pathname = `/dashboard/${dashboardName}`;
    const waitOnURI =
      `http://localhost:${config.dashboardServer.port}${pathname}`;
    logger.log(`waiting on ${waitOnURI}`);

    // Wait for dashboard server to be ready
    let interval: NodeJS.Timeout;
    await Promise.race([
      new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error("timeout waiting for dashboard server"));
        }, 30_000);
      }),
      new Promise((resolve) => {
        interval = setInterval(() => {
          fetch(waitOnURI)
            .then((res) => {
              if (res.ok) {
                clearInterval(interval);
                resolve(true);
              }
            }, () => {});
        }, 1_000);
      }),
    ]).finally(() => {
      clearInterval(interval);
    });

    // Run snapshot script
    const proc = execa(
      config.snap.scriptBin,
      [config.snap.scriptEntryFilename],
      {
        stdio: "inherit",
        env: {
          ...process.env,
          PORT: config.dashboardServer.port.toString(),
          SNAP_URL_PATHNAME: pathname,
          SNAP_IMAGE_BASENAME: `${dashboardName}.png`,
        },
      },
    );

    await proc;
    config.snap.lastSnappedKind = dashboardName;
  } finally {
    dashboardServerProcess.kill();
    setTimeout(() => {
      try {
        dashboardServerProcess.kill(9);
      } catch {}
    }, 1_000);
  }
}

/**
 * Original run function - now generates all dashboards hourly instead of cycling through one
 */
export async function run(state: State) {
  const { config, logger } = state;
  if (state.isSnapshotRunning) {
    return state.logger.error("snapshot workflow already running");
  }

  clearInterval(state.snapshotInterval);
  state.logger.log("running scheduled snapshot workflow for all dashboards");
  const intervalMs = config.snap.intervalSeconds * 1000;

  try {
    await generateAll(state);
    state.lastSnapshotDateMs = Date.now();
  } catch (err) {
    logger.error(`error running snapshot workflow`);
    logger.error(err);
  } finally {
    logger.log(`next snapshot in ${config.snap.intervalSeconds} seconds`);
    clearInterval(state.snapshotInterval);
    state.snapshotInterval = setTimeout(() => sdk.snap.run(state), intervalMs);
  }
}
