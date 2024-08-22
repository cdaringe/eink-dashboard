import { Component } from "solid-js";
import { config } from "../common";
import { landscapify } from "../layout";

const px = (n: number) => `${n}px`;
const { height, width } = config.resolution;

export const AirQuality: Component<{ landscape?: boolean }> = ({
  landscape: isLandscape = false,
}) => {
  const [score, co2, voc] = [8, 2, 4].map(
    (panelId) =>
      `${config.airGrafanaUri}/d-solo/d46HuYvnz/freshawair?orgId=1&theme=light&from=now-24h&to=now&panelId=${panelId}`,
  );
  const styles = {
    root: { height: px(height), width: px(width) },
    panels: {
      column: {
        display: "inline-block",
        height: px(height),
        width: px(width / 2),
      },
      secondary: {
        display: "block",
        height: px(height / 2),
        width: px(width / 2),
      },
    },
  };
  return (
    <div style={styles.root}>
      <div style={styles.panels.column}>
        <iframe
          src={score}
          style={styles.panels.column}
          frameborder="0"
        ></iframe>
      </div>
      <div style={styles.panels.column}>
        <iframe
          style={styles.panels.secondary}
          src={co2}
          frameborder="0"
        ></iframe>
        <iframe
          style={styles.panels.secondary}
          src={voc}
          frameborder="0"
        ></iframe>
      </div>
    </div>
  );
};
