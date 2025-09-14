import React from "react";
import { Rover } from "../../../components/Rover";
import { connection } from "next/server";
import { Err, Ok, Result } from "../../../lib/types";

export type RoverPhoto = {
  id: number;
  sol: number;
  camera: {
    id: number;
    name: string;
    rover_id: number;
    full_name: string;
  };
  img_src: string;
  earth_date: string;
  rover: {
    id: number;
    name: string;
    landing_date: string;
    launch_date: string;
    status: string;
  };
};

export type RoverApiResponse = {
  latest_photos: RoverPhoto[];
};

async function fetchRoverPhotos(): Promise<Result<RoverPhoto[]>> {
  "use server";

  const apiKey = process.env.NASA_API_KEY || "DEMO_KEY";
  const apiUrl =
    `https://api.nasa.gov/mars-photos/api/v1/rovers/perseverance/latest_photos?api_key=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      return Err(
        `NASA API returned ${response.status}: ${response.statusText}. ${errorText}`,
      );
    }

    const data: RoverApiResponse = await response.json();
    const shuffled = shuffle(data.latest_photos);
    const latestPhotos = shuffled.slice(0, 2);

    return Ok(latestPhotos);
  } catch (err) {
    return Err(`Failed to fetch rover photos: ${String(err)}`);
  }
}

const RoverPage: React.FC = async ({}) => {
  await connection();
  const result = await fetchRoverPhotos();

  if (!result.ok) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <h2 className="text-red-800 font-semibold">
          Error Loading Mars Rover Photos
        </h2>
        <p className="text-red-600 mt-2">{result.value}</p>
      </div>
    );
  }

  return <Rover photos={result.value} />;
};

export default RoverPage;

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
