/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";

type CatImageProps = {
  initialImageUrl?: string;
};

const CatImage = ({ initialImageUrl }: CatImageProps) => {
  const [isReady, setIsReady] = React.useState(false);

  if (!initialImageUrl) {
    return (
      <div className="p-4">
        <p>No cat image available</p>
      </div>
    );
  }
  return (
    <img
      src={initialImageUrl}
      alt="Random cat"
      className={[
        "max-w-full w-full h-full object-cover border border-gray-300 rounded",
        isReady ? "snapshot_ready" : "",
      ].join(" ")}
      onLoad={() => setIsReady(true)}
    />
  );
};

export default CatImage;
