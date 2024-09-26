import { Config } from "./config";
import { Logger } from "./logging";

export type DashboardContext = {
  filenameToServe: string;
  /**
   * 0-100
   */
  batteryOverlay?: string;
  textOverlay?: string[];
  logger: Logger;
  config: Config;
};
