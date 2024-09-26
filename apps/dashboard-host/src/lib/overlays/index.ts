import { Overlay } from "./common";
import { overlay as batteryOverlay } from "./battery";
import { overlay as textOverlay } from "./text";

const runSafeOverlay: (name: string, overlay: Overlay) => Overlay = (
  name,
  overlay,
) => {
  return async (ctx) => {
    try {
      await overlay(ctx);
    } catch (err) {
      ctx.logger.error(`error running overlay ${name}`);
      ctx.logger.error(err);
    }
    return ctx;
  };
};

export const battery = runSafeOverlay("battery", batteryOverlay);
export const text = runSafeOverlay("text", textOverlay);
