// getAll

import execa from "execa";
import { Overlay } from "./common";
import * as convert from "../convert";
/**
 * Add text overlay to the image. You can add MANY text overlay query params.
 * Fonts available can be found in the docker image by asking for them:
 * > docker run --rm --entrypoint sh edh -c 'convert -list font'
 * @interface textoverlay=text,x-offset,y-offset,size,color,font
 * @example: http://localhost:8000/dashboard/airquality.png?textoverlay=3.7v,508,1175,16
 */
export const overlay: Overlay = async (ctx) => {
  if (!ctx.textOverlay) {
    return ctx;
  }
  let ith = 0;
  for (const textOverlay of ctx.textOverlay) {
    ++ith;
    const [
      text,
      xOffset = "0",
      yOffset = "0",
      size = "24",
      color = "black",
      font = ctx.config.os === "macos" ? "Arial" : "FreeMono",
    ] = textOverlay
      .split(",")
      .map((it) => it.trim())
      .filter(Boolean);
    const lastFileToServe = ctx.filenameToServe;
    ctx.filenameToServe = ctx.filenameToServe.replace(
      ".png",
      `.text${ith}.png`,
    );
    const compositeCommand = convert.compositeTextCommand({
      filenames: {
        background: lastFileToServe,
        output: ctx.filenameToServe,
      },
      text: decodeURIComponent(text),
      pointsize: Number(size),
      fill: color,
      font,
      offset: {
        x: Number(xOffset),
        y: Number(yOffset),
      },
    });
    await execa(...compositeCommand);
  }
  return ctx;
};
