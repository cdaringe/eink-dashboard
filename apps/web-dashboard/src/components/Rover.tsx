/* eslint-disable @next/next/no-img-element */
"use client";
import { RoverPhoto } from "@/app/dashboard/rover/page";
import React from "react";
import { Header } from "./Header";

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const Rover: React.FC<{
  photos: RoverPhoto[];
}> = ({
  photos,
}) => {
  const [isReady, setIsReady] = React.useState(false);
  const shuffled = React.useMemo(() => shuffle(photos), [photos]);
  const latestPhotos = shuffled.slice(0, 2);

  return (
    <div id="panel_grid" className="rover max-w-[100vw]">
      <div id="panel_1">
        <header className="flex justify-center items-center w-full p-2">
          <h1 className="text-2xl font-bold">Mars Rover Photos</h1>
        </header>

        <div className="grid grid-cols-1 gap-1 pt-0 p-2">
          {latestPhotos.map((photo, index) => (
            <div key={photo.id} className="rover-photo-container">
              <div className="relative w-full h-[30rem] mb-2">
                <img
                  alt={`Mars photo from ${photo.rover.name} rover - ${photo.camera.full_name}`}
                  className={[
                    "object-cover w-full h-full rounded",
                    isReady && index === 0 ? "snapshot_ready" : "",
                  ].join(" ")}
                  src={photo.img_src}
                  onLoad={() => {
                    if (index === 0) {
                      setIsReady(true);
                    }
                  }}
                />
              </div>
              <div className="text-md">
                <p className="font-semibold">{photo.rover.name}</p>
                <p className="text-sm">{photo.camera.full_name}</p>
                <p className="text-sm">Sol {photo.sol} ({photo.earth_date})</p>
              </div>
            </div>
          ))}
        </div>

        {photos.length === 0 && (
          <div className="text-center p-8">
            <p>No recent photos available</p>
          </div>
        )}
      </div>
      <Header />
    </div>
  );
};

export default Rover;
