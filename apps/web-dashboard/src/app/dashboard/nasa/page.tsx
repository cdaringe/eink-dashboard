import React from "react";
import { NasaApod } from "../../../components/NasaApod";
import { connection } from "next/server";
import { Err, Ok, Result } from "../../../lib/types";

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

async function fetchApod(): Promise<Result<ApodEntry>> {
  "use server";

  const apiKey = process.env.NASA_API_KEY || "DEMO_KEY";
  const apiUrl =
    `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&thumbs=true&count=5`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      return Err(
        `NASA APOD API returned ${response.status}: ${response.statusText}. ${errorText}`,
      );
    }

    const data: ApodEntry[] = await response.json();
    const imageEntry = data.find((entry) => entry.media_type === "image");

    return imageEntry
      ? Ok(imageEntry)
      : Err("No image entries found in APOD response");
  } catch (err) {
    return Err(`Failed to fetch NASA APOD: ${String(err)}`);
  }
}

const NasaPage: React.FC = async ({}) => {
  await connection();
  const result = await fetchApod();

  return result.ok
    ? <NasaApod entry={result.value} />
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
