export const dashkinds = ["onion", "airquality", "cat"] as const;
export type Dashkind = (typeof dashkinds)[number];

export const config = {
  resolution: { width: 800, height: 600 },
  airGrafanaUri: "http://bignas.local:3000",
};
