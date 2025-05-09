import { Config } from "./config";
import { Logger } from "./logging";
import { routes } from "./routes";

export type State = {
  config: Config;
  lastSnapshotDateMs: number;
  isSnapshotRunning: boolean;
  snapshotInterval: NodeJS.Timeout;
  logger: Logger;
  routes: typeof routes;
};
