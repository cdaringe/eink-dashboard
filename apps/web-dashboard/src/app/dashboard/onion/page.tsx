import React from "react";
import { Onion } from "../../../components/Onion";
import { extract } from "@extractus/feed-extractor";
import { connection } from "next/server";

export type Entry = {
  /**
   * http url as well...
   */
  "id": string;
  "title": string;
  /**
   * http url
   */
  "link": string;
  /**
   * iso8601
   */
  "published": string;
  "description": string;
};

const OnionPage: React.FC = async ({}) => {
  await connection();
  const rss = await extract("https://theonion.com/feed/", {})
    .then((result) => {
      return { ok: true, value: result as { entries: Entry[] } } as const;
    }, (err) => {
      return { ok: false, value: String(err) } as const;
    });
  return rss.ok
    ? <Onion rss={rss.value.entries} />
    : <p>Error getting theonion.com! ${String(rss.value)}</p>;
};

export default OnionPage;
