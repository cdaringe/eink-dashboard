import React from "react";
import { Rover } from "../../../components/Rover";
import { connection } from "next/server";

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

const RoverPage: React.FC = async ({}) => {
  await connection();

  const apiKey = process.env.NASA_API_KEY || "DEMO_KEY";
  /**
   * @see https://api.nasa.gov/
   */
  const apiUrl =
    `https://api.nasa.gov/mars-photos/api/v1/rovers/perseverance/latest_photos?api_key=${apiKey}`;

  const roverData = await fetch(apiUrl)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: RoverApiResponse = await response.json();
      return { ok: true, value: data } as const;
    })
    .catch((err) => {
      return { ok: false, value: String(err) } as const;
    });

  return roverData.ok
    ? <Rover photos={roverData.value.latest_photos} />
    : <p>Error getting Mars rover photos! {String(roverData.value)}</p>;
};

export default RoverPage;
