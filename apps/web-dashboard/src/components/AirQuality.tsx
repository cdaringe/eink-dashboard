"use client";
import React from "react";
import { config } from "@eink-dashboard/common";
import LoadingIframe from "./LoadingIframe";
import { Header } from "./Header";

const AirQuality: React.FC<
  {
    from: string;
    to: string;
    theme: string;
  }
> = ({
  from,
  to,
  theme,
}) => {
  const [loadCount, setLoadCount] = React.useState(0);

  const incrLoadCount = () => {
    setTimeout(() => {
      setLoadCount((last) => last + 1);
    }, /* give time for vis rendering */ 5000);
  };

  const [score, co2, pm25, voc] = [8, 2, 4, 9].map(
    (panelId) =>
      `${config.airGrafanaUri}/d-solo/d46HuYvnz/freshawair?orgId=1&theme=${theme}&from=${from}&to=${to}&panelId=${panelId}`,
  );
  return (
    <div id="panel_grid" className="airquality">
      <Header
        logo={(props, Image) =>
          /* When the logo is shown, we're ready! */
          loadCount >= 4
            // eslint-disable-next-line jsx-a11y/alt-text
            ? <Image {...props} />
            : <span>Loaded {loadCount}</span>}
      >
      </Header>
      <LoadingIframe
        onLoad={incrLoadCount}
        id="panel_1"
        label={"score"}
        src={score}
      />
      <LoadingIframe
        onLoad={incrLoadCount}
        id="panel_2"
        label={"co2"}
        src={co2}
      />
      <LoadingIframe
        onLoad={incrLoadCount}
        id="panel_3"
        label={"pm25"}
        src={pm25}
      />
      <LoadingIframe
        onLoad={incrLoadCount}
        id="panel_4"
        label={"voc"}
        src={voc}
      />
    </div>
  );
};

export default AirQuality;
