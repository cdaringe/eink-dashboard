"use client";
import { Entry } from "@/app/dashboard/onion/page";
import Image from "next/image";
import QRCode from "react-qr-code";
import React from "react";
import { Header } from "./Header";

export const Onion: React.FC<{
  rss: Entry[];
}> = ({
  rss,
}) => {
  const [isReady, setIsReady] = React.useState(false);
  return (
    <div id="panel_grid" className="onion max-w-[100vw]">
      <Header />
      <div className="onion">
        <header className="flex justify-center items-center w-full p-2">
          <Image
            alt="The Onion"
            className={[
              "object-contain max-w-full max-h-full",
              isReady ? "snapshot_ready" : "",
            ].join(" ")}
            src="https://theonion.com/wp-content/uploads/2024/07/site-logo.svg"
            width={400}
            height={50}
            onLoad={() => {
              setIsReady(true);
            }}
          />
        </header>
        <ul>
          {rss.map((item) => (
            <li key={item.id} className="p-2 flex items-center w-full h-36">
              <div className="w-[90%] pr-1">
                <span className="text-xs italic">
                  Published: {new Date(item.published).toLocaleDateString()}
                </span>
                <h2 className="text-xl">{item.title}</h2>
                <p>{item.description}</p>
              </div>
              <QRCode className="w-[10%]" size={100} value={item.link} />
            </li>
          ))}
        </ul>

        {
          /* {(item) => (
            <article className="p-2">
              <h2 className="text-xl">{ item.title }</h2>
              <p>{ item.description }</p>
              <a href={item.link}>Read more</a>
            </article>
          )} */
        }
      </div>
    </div>
  );
};

export default Onion;
