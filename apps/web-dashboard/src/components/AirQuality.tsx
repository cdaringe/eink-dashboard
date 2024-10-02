import { Component, createSignal } from "solid-js";
import { config } from "../../../../libs/eink-dashboard-common";
import "./AirQuality.css";
import logo from "../assets/logo.png";
import LoadingIframe from "./LoadingIframe";

export const AirQuality: Component = ({}) => {
  const [loadCount, setLoadCount] = createSignal(0);

  const incrLoadCount = () => {
    setTimeout(() => {
      setLoadCount(last => last + 1);
    }, /* give time for vis rendering */ 5000);
  };
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
        {/* When the logo is shown, we're ready! */}
        {loadCount() >= 4 ? <img id="panel_logo" class='snapshot_ready' src={logo} /> : <span>Loaded {loadCount()}</span>}
        <div>
          {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
        </div>
      </header>
      <LoadingIframe onLoad={incrLoadCount} id="panel_1" label={"score"} src={score} />
      <LoadingIframe onLoad={incrLoadCount} id="panel_2" label={"co2"} src={co2} />
      <LoadingIframe onLoad={incrLoadCount} id="panel_3" label={"pm25"} src={pm25} />
      <LoadingIframe onLoad={incrLoadCount} id="panel_4" label={"voc"} src={voc} />
    </div>
  );
};
