export const landscapify = <
  T extends {
    display?: string;
    width: number | string;
    height: number | string;
  },
>(
  isLandscape: boolean,
  t: T,
): T => {
  const w = !isLandscape ? t.width : t.height;
  const h = !isLandscape ? t.height : t.width;
  const display = isLandscape
    ? t.display
      ? t.display === "block"
        ? "inline-block"
        : t.display === "inline-block"
        ? "block"
        : t.display
      : t.display
    : t.display;
  return {
    ...t,
    display,
    width: w,
    height: h,
  };
};
