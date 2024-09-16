import { Component } from "solid-js";
import { config } from "../common";
import "./AirQuality.css";
import logo from '../assets/logo.png'

export const AirQuality: Component = ({}) => {
  const [score, co2, pm25, voc] = [8, 2, 4, 9].map(
    (panelId) =>
      `${config.airGrafanaUri}/d-solo/d46HuYvnz/freshawair?orgId=1&theme=light&from=now-24h&to=now&panelId=${panelId}`,
  );
  return (
    <div id='panel_grid'>
      <header id="panel_header"><img id='panel_logo' src={logo} />
      <div>
  {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
</div></header>
      <iframe id='panel_1' src={score}></iframe>
      <iframe id='panel_2' src={co2}></iframe>
      <iframe id='panel_3' src={pm25}></iframe>
      <iframe id='panel_4' src={voc}></iframe>
    </div>
  );
};
