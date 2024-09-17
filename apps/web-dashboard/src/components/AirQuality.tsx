import { Component } from "solid-js";
import { config } from "../../../../libs/eink-dashboard-common";
import "./AirQuality.css";
import logo from '../assets/logo.png'

export const AirQuality: Component = ({}) => {
  const searchParams = new URLSearchParams(window.location.search);
  const from = searchParams.get('from') || 'now-12h';
  const to = searchParams.get('to') || 'now';
  const theme = searchParams.get('theme') || 'light';

  const [score, co2, pm25, voc] = [8, 2, 4, 9].map(
    (panelId) =>
      `${config.airGrafanaUri}/d-solo/d46HuYvnz/freshawair?orgId=1&theme=${theme}&from=${from}&to=${to}&panelId=${panelId}`,
  );
  // const [score, co2, pm25, voc] = [8, 2, 4, 9].map(
  //   (panelId) =>
  //     `${config.airGrafanaUri}/d-solo/d46HuYvnz/freshawair?orgId=1&theme=light&from=now-24h&to=now&panelId=${panelId}`,
  // );
  return (
    <div id='panel_grid'>
      <header id="panel_header"><img id='panel_logo' src={logo} />
      <div>
  {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
</div></header>
      <iframe id='panel_1' class='scaled-iframe' src={score}></iframe>
      <iframe id='panel_2' class='scaled-iframe' src={co2}></iframe>
      <iframe id='panel_3' class='scaled-iframe' src={pm25}></iframe>
      <iframe id='panel_4' class='scaled-iframe' src={voc}></iframe>
    </div>
  );
};
