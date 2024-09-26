import execa from "execa";
import { Overlay } from "./common";
import * as convert from "../convert";

const getImageFilename = (batteryPercent: number) =>
  `./public/icon/battery/${Number.isSafeInteger(batteryPercent) && batteryPercent >= 0 && batteryPercent <= 100 ? batteryPercent : "unknown"}_battery.png`;

/**
 * perecentage-text,x-offset,y-offset,convert-resize-arg
 * @example: http://localhost:8000/dashboard/airquality.png?batteryoverlay=33,540,1172,x24
 */
export const overlay: Overlay = async (ctx) => {
  if (!ctx.batteryOverlay) {
    return ctx;
  }
  const [batteryPercentage, xOffset = "0", yOffset = "0", resizeArg = "x24"] =
    ctx.batteryOverlay
      .split(",")
      .map((it) => it.trim())
      .filter(Boolean);
  /**
   * given a battery percent, find the closest number from 0 to 100 in increments of 5
   * @see public/icon/battery/generate.sh
   */
  const batteryPercentIncr5 = Math.max(
    5,
    Math.round(Number(batteryPercentage) / 5) * 5,
  );
  const batteryPngFilename = getImageFilename(batteryPercentIncr5);
  const lastFileToServe = ctx.filenameToServe;
  ctx.filenameToServe = ctx.filenameToServe.replace(
    ".png",
    `.${batteryPercentIncr5}_battery.png`,
  );
  const compositeCommand = convert.compositeCommand({
    filenames: {
      foreground: batteryPngFilename,
      background: lastFileToServe,
      output: ctx.filenameToServe,
    },
    offset: {
      x: Number(xOffset),
      y: Number(yOffset),
    },
    resizeForegroundArg: resizeArg,
  });
  await execa.command(compositeCommand);
  return ctx;
};
