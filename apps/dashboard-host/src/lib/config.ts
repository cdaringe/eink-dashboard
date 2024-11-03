import os from "os";
const isMacOs = os.version().match(/darwin/i);
import path from "node:path";

/**
 * ENV supported configuration options.
 */
const PORT = process.env.PORT ?? "8000";
const {
  DASHBOARD_SERVER_PORT = "8001",
  DISPLAY_WIDTH = "820",
  DISPLAY_HEIGHT = "1200",
  SNAP_INTERVAL_S = String(60 * 60),
  SNAP_WRITE_DIRNAME = "./public",
  SNAP_URL_HOSTNAME = `http://localhost`,
  SNAP_URL_PATHNAME = "/",
  SNAP_TZ = process.env.TZ,
  SNAP_IMAGE_BASENAME = "snapshot.png",
} = process.env;

const SNAP_SCRIPT_RELATIVE_FILENAME = `./dist/bin/snap.js`;
const DASHBOARD_NODEJS_SERVER_ENTRYPOINT = `./dist/web-dashboard/apps/web-dashboard/server.js`;

export type Config = {
  os: "linux" | "macos";
  display: {
    dims: {
      width: number;
      height: number;
    };
  };
  port: number;
  dashboardServer: {
    entrypoint: string;
    port: number;
  },
  snap: {
    lastSnappedKind?: "onion" | "airquality";
    url: {
      hostname: string;
      port: number;
      pathname: string;
    };
    imageBasename: string;
    intervalSeconds: number;
    scriptEntryFilename: string;
    timezone?: string;
    writeDirname: string;
    grayFilename: string;
  };
};

export const createConfig = (config?: Partial<Config>): Config => {
  return {
    os: isMacOs ? "macos" : "linux",
    port: Number(PORT),
    ...config,
    display: {
      ...config?.display,
      dims: {
        width: Number(DISPLAY_WIDTH),
        height: Number(DISPLAY_HEIGHT),
        ...config?.display?.dims,
      },
    },
    dashboardServer: {
      entrypoint: DASHBOARD_NODEJS_SERVER_ENTRYPOINT,
      port: Number(DASHBOARD_SERVER_PORT),
    },
    snap: {
      imageBasename: SNAP_IMAGE_BASENAME,
      timezone: SNAP_TZ,
      url: {
        hostname: SNAP_URL_HOSTNAME,
        port: Number(DASHBOARD_SERVER_PORT),
        pathname: SNAP_URL_PATHNAME,
      },
      writeDirname: SNAP_WRITE_DIRNAME,
      scriptEntryFilename: SNAP_SCRIPT_RELATIVE_FILENAME,
      intervalSeconds: Number(SNAP_INTERVAL_S),
      ...config?.snap,
      get grayFilename() {
        return `${this.writeDirname}/${path.basename(this.imageBasename)}`;
      },
    },
  };
};
