import { createEffect } from "solid-js";
import "./App.css";
import { Dashkind } from "./common";
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
      <div style={{ position: "fixed", top: 0, right: 0 }}>
        {new Date().toISOString()}
      </div>
      {kind === "cat" ? (
        <CatImage />
      ) : kind === "airquality" ? (
        <AirQuality landscape={isLandscape} />
      ) : kind === "onion" ? (
        <p>onion</p>
      ) : (
        <h1>{`Not found (kind: ${kind})`}</h1>
      )}
    </>
  );
}

export default App;
