import { Component } from "solid-js";
import { config } from "../../../../libs/eink-dashboard-common";
import "./AirQuality.css";
import logo from "../assets/logo.png";
import LoadingIframe from "./LoadingIframe";

export const AirQuality: Component = ({}) => {
  const searchParams = new URLSearchParams(window.location.search);
  const from = searchParams.get("from") || "now-12h";
  const to = searchParams.get("to") || "now";
  const theme = searchParams.get("theme") || "light";

  const [score, co2, pm25, voc] = [8, 2, 4, 9].map(
    (panelId) =>
      `${config.airGrafanaUri}/d-solo/d46HuYvnz/freshawair?orgId=1&theme=${theme}&from=${from}&to=${to}&panelId=${panelId}`,
  );
  return (
    <div id="panel_grid">
      <header id="panel_header">
        <img id="panel_logo" src={logo} />
        <div>
          {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
        </div>
      </header>
      <LoadingIframe id="panel_1" label={"score"} src={score} />
      <LoadingIframe id="panel_2" label={"co2"} src={co2} />
      <LoadingIframe id="panel_3" label={"pm25"} src={pm25} />
      <LoadingIframe id="panel_4" label={"voc"} src={voc} />
    </div>
  );
};
