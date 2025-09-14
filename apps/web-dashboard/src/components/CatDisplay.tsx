"use client";
import React from "react";
import { Header } from "./Header";
import CatImage from "./CatImage";
import { Result } from "../lib/types";
import { CatImage as CatImageType } from "../app/actions/cat";

type CatDisplayProps = {
  result: Result<CatImageType>;
};

export const CatDisplay: React.FC<CatDisplayProps> = ({ result }) => {
  if (!result.ok) {
    return (
      <div id="panel_grid" className="cat max-w-[100vw]">
        <Header
          logo={(props, Component) => (
            <Component
              {...props}
              src="/cat.svg"
              alt="Cat logo"
              width={24}
              height={24}
            />
          )}
        />
        <div className="panel_1 overflow-hidden">
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <h2 className="text-red-800 font-semibold">
              Error Loading Cat Image
            </h2>
            <p className="text-red-600 mt-2">{result.value}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="panel_grid" className="cat max-w-[100vw]">
      <header
        id="panel_1"
        className="flex justify-center items-center w-full p-2"
      >
        <h1 className="text-2xl font-bold">{result.value.breeds[0].name}</h1>
      </header>
      <div className="panel_2 overflow-hidden">
        <CatImage initialImageUrl={result.value.url} />
      </div>
      <Header
        logo={(props, Component) => (
          <Component
            {...props}
            src="/cat.svg"
            alt="Cat logo"
            width={24}
            height={24}
          />
        )}
      />
    </div>
  );
};
