import { createEffect } from "solid-js";
import "./App.css";
import { Dashkind } from "../../../libs/eink-dashboard-common";
import { AirQuality } from "./components/AirQuality";
import CatImage from "./components/CatImage";

function App() {
  const params = new URL(window.location.href).searchParams;
  const kind = params.get("kind") as Dashkind | undefined;
  const isLandscape = !!params.get("landscape");
  createEffect(() => {
    if (isLandscape) {
      const el = document.getElementById("root")!;
      el.classList.add("landscape");
    }
  });
  return (
    <>
      {kind === "cat"
        ? <CatImage />
        : kind === "airquality"
        ? <AirQuality />
        : kind === "onion"
        ? <p>onion</p>
        : (
          <>
            <h4>Welcome</h4>
            <ul>
              <li>
                <a href="/?kind=airquality">airquality</a>
              </li>
            </ul>
          </>
        )}
    </>
  );
}

export default App;
