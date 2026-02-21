import React from "react";
import path from "node:path";
import { NasaApod } from "../../../components/NasaApod";
import { connection } from "next/server";
import { Err, Ok } from "../../../lib/types";
import { createFileCache } from "../../../lib/file-cache";

export type ApodEntry = {
  date: string;
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: "image" | "video";
  copyright?: string;
  thumbnail_url?: string;
};

const fetchApod = createFileCache<ApodEntry>({
  filepath: path.join(process.cwd(), ".apod-cache.json"),
  ttlMs: 30 * 60 * 1000,
  fetch: async () => {
    const apiKey = process.env.NASA_API_KEY || "DEMO_KEY";
    const apiUrl =
      `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&thumbs=true&count=3`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      return Err(
        `NASA APOD API returned ${response.status}: ${response.statusText}`,
      );
    }

    const data: ApodEntry[] = await response.json();
    const imageEntry = data.find((entry) => entry.media_type === "image");

    return imageEntry
      ? Ok(imageEntry)
      : Err("No image entries found in APOD response");
  },
});

const NasaPage: React.FC = async ({}) => {
  await connection();
  const { result, retryInMs } = await fetchApod();

  return result.ok
    ? <NasaApod entry={result.value} retryInMs={retryInMs} />
    : (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md snapshot_ready">
        <h2 className="text-red-800 font-semibold">
          Error Loading NASA Photo
        </h2>
        <p className="text-red-600 mt-2">{result.value}</p>
      </div>
    );
};

export default NasaPage;
