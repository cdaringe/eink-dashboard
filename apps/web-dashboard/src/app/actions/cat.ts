"use server";

import { ok } from "assert";
import { Err, Ok, Result } from "../../lib/types";

export type CatImage = {
  id: string;
  url: string;
  width: number;
  height: number;
  breeds: [{
    id: string;
    name: string;
    temperament: string;
    origin: string;
    description: string;
    life_span: string;
    weight: {
      imperial: string;
      metric: string;
    };
    image: {
      id: string;
      url: string;
    };
  }];
};

export async function fetchCatImage(): Promise<Result<CatImage>> {
  "use server";
  const { CAT_API_KEY } = process.env;
  ok(CAT_API_KEY, "CAT_API_KEY is not set!");
  try {
    const url = new URL("https://api.thecatapi.com/v1/images/search");
    url.searchParams.set("size", "full");
    url.searchParams.set("has_breeds", "1");
    url.searchParams.set("api_key", CAT_API_KEY);
    const response = await fetch(url.toString());
    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      return Err(
        `Cat API returned ${response.status}: ${response.statusText}. ${errorText}`,
      );
    }

    const data: CatImage[] = await response.json();
    if (!data || data.length === 0) {
      return Err("No cat images returned from API");
    }

    return Ok(data[0]);
  } catch (error) {
    return Err(`Failed to fetch cat image: ${String(error)}`);
  }
}
