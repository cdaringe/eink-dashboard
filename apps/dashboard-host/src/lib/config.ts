import os from "os";
const isMacOs = os.version().match(/darwin/i);
import path from "node:path";

/**
 * ENV supported configuration options.
*/
const PORT = process.env.PORT ?? "8000";
const {
  DISPLAY_WIDTH = "820",
  DISPLAY_HEIGHT = "1200",
  SNAP_INTERVAL_S = String(60 * 60),
  SNAP_WRITE_DIRNAME = "./public",
  SNAP_URL_ORIGIN = `http://localhost:${PORT}`,
  SNAP_URL_PATHNAME = "/",
  SNAP_URL_SEARCH = "?kind=airquality",
  SNAP_TZ = process.env.TZ,
  SNAP_IMAGE_BASENAME = "airquality.png",
} = process.env;

const SNAP_SCRIPT_RELATIVE_FILENAME = `./dist/bin/snap.js`;
const DASHBOARD_GUI_ASSETS_RELATIVE_DIRNAME = `./dist/web-dashboard`;

export type Config = {
  os: "linux" | "macos";
  display: {
    dims: {
      width: number;
      height: number;
    };
  };
  port: number;
  snap: {
    url: {
      origin: string;
      pathname: string;
      search: string;
    };
    guiAssetsDirname: string;
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
    snap: {
      imageBasename: SNAP_IMAGE_BASENAME,
      timezone: SNAP_TZ,
      url: {
        origin: SNAP_URL_ORIGIN,
        pathname: SNAP_URL_PATHNAME,
        search: SNAP_URL_SEARCH,
      },
      writeDirname: SNAP_WRITE_DIRNAME,
      guiAssetsDirname: DASHBOARD_GUI_ASSETS_RELATIVE_DIRNAME,
      scriptEntryFilename: SNAP_SCRIPT_RELATIVE_FILENAME,
      intervalSeconds: Number(SNAP_INTERVAL_S),
      ...config?.snap,
      get grayFilename() {
        return `${this.writeDirname}/${path.basename(this.imageBasename)}`
      }
    },
  };
};
