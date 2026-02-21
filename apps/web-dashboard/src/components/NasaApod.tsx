/* eslint-disable @next/next/no-img-element */
"use client";
import { ApodEntry } from "@/app/dashboard/nasa/page";
import React from "react";
import { Header } from "./Header";

const formatRetry = (ms: number): string => {
  const minutes = Math.ceil(ms / 60_000);
  return minutes <= 1 ? "~1 min" : `~${minutes} min`;
};

export const NasaApod: React.FC<{
  entry: ApodEntry;
  retryInMs: number | undefined;
}> = ({ entry, retryInMs }) => {
  const [ready, setReady] = React.useState(false);
  const imageUrl = entry.hdurl ?? entry.url;

  return (
    <div id="panel_grid" className="nasa max-w-[100vw]">
      <div id="panel_1">
        <header className="flex justify-center items-center w-full p-2">
          <h1 className="text-2xl font-bold">NASA Astronomy Photo</h1>
        </header>

        <div className="p-2 pt-0">
          <div className="relative w-full h-[52rem] mb-2">
            <img
              alt={entry.title}
              className={[
                "object-cover w-full h-full rounded",
                ready ? "snapshot_ready" : "",
              ].join(" ")}
              src={imageUrl}
              onLoad={() => setReady(true)}
            />
          </div>
          <h2 className="text-lg font-semibold">{entry.title}</h2>
          <p className="text-sm mt-1">
            {entry.date}
            {entry.copyright ? ` · ${entry.copyright}` : ""}
          </p>
          <p className="text-xs mt-2 line-clamp-4">{entry.explanation}</p>
          {retryInMs !== undefined && (
            <p className="text-xs mt-1 italic text-gray-500">
              Cached · next refresh in {formatRetry(retryInMs)}
            </p>
          )}
        </div>
      </div>
      <Header />
    </div>
  );
};
