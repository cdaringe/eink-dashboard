export const compositeCommand = (opts: {
  filenames: {
    foreground: string;
    background: string;
    output: string;
  };
  /**
   * -resize argument for convert
   */
  resizeForegroundArg?: string;
  offset: {
    x: number;
    y: number;
  };
}): string => {
  const { filenames, offset, resizeForegroundArg } = opts;
  return [
    `convert ${filenames.background}`,
    resizeForegroundArg
      ? `( ${filenames.foreground} -resize ${resizeForegroundArg} )`
      : filenames.foreground,
    `-geometry +${offset.x}+${offset.y}`,
    `-composite ${filenames.output}`,
  ].join(" ");
};

export const compositeTextCommand = (opts: {
  filenames: {
    background: string;
    output: string;
  };
  text: string;
  pointsize: number;
  font?: string;
  fill?: string;
  offset: {
    x: number;
    y: number;
  };
}): [string, string[]] => {
  return [
    `convert`,
    [
      opts.filenames.background,
      `-font`,
      opts.font ?? "Arial",
      `-gravity`,
      `NorthWest`,
      `-pointsize`,
      String(opts.pointsize),
      `-fill`,
      opts.fill ?? "black",
      `-annotate`,
      `+${opts.offset.x}+${opts.offset.y}`,
      opts.text,
      opts.filenames.output,
    ],
  ];
};
