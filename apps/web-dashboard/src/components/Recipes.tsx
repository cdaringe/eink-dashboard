"use client";
import QRCode from "react-qr-code";
import React from "react";
import Image from "next/image";
import { Header } from "./Header";

export const Recipes: React.FC<{
  recipes: RecipeRoot[];
}> = ({
  recipes,
}) => {
  const [isReady, setIsReady] = React.useState(false);
  React.useEffect(() => {
    setTimeout(() => setIsReady(true), 3000);
  }, []);
  return (
    <div id="panel_grid" className="onion max-w-[100vw]">
      <Header />
      <div className="panel_1 overflow-hidden">
        <header
          className={[
            "flex justify-center items-center w-full p-2 italic",
            isReady ? "snapshot_ready" : "",
          ].join(" ")}
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "2rem",
            fontWeight: "bold",
          }}
        >
          NYT Recipes
        </header>
        <ul>
          {recipes.map((item) => {
            const multimedia = item.multimedia.find((it) => it.url);
            const headline = item.headline.main.length > 50
              ? `${item.headline.main.slice(0, 50)}...`
              : item.headline.main;
            const paragraph = item.lead_paragraph.length > 220
              ? `${item.lead_paragraph.slice(0, 220)}...`
              : item.lead_paragraph;
            return (
              <li key={item._id} className="p-2 flex items-center w-full h-32">
                <div className="overflow-hidden h-full flex-1 pr-1">
                  <span className="text-xs italic block">
                    Published: {new Date(item.pub_date).toLocaleDateString()}
                  </span>
                  <h2 className="text-xl inline-block">{headline}</h2>
                  {/* <span className="ml-2">// {item.headline.kicker}</span> */}
                  <p>{paragraph}</p>
                </div>
                {multimedia
                  ? (
                    <Image
                      className="w-[100px] ml-1"
                      src={`https://www.nytimes.com/${multimedia.url}`}
                      alt="sneak peek"
                      width={100}
                      height={100}
                    />
                  )
                  : null}
                <div>
                  <QRCode
                    className="w-[100px] ml-1"
                    size={100}
                    value={item.web_url}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export interface RecipeRoot {
  abstract: string;
  web_url: string;
  snippet: string;
  lead_paragraph: string;
  source: string;
  multimedia: Multimedum[];
  headline: Headline;
  keywords: Keyword[];
  pub_date: string;
  document_type: string;
  news_desk: string;
  section_name: string;
  subsection_name: string;
  byline: Byline;
  type_of_material: string;
  _id: string;
  word_count: number;
  uri: string;
}

export interface Multimedum {
  rank: number;
  subtype: string;
  type: string;
  url: string;
  height: number;
  width: number;
  subType: string;
  crop_name: string;
}

export interface Headline {
  main: string;
  kicker: string;
  content_kicker: unknown;
  print_headline: string;
  name: unknown;
  seo: unknown;
  sub: unknown;
}

export interface Keyword {
  name: string;
  value: string;
  rank: number;
  major: string;
}

export interface Byline {
  original?: string | null;
  person?: Person[] | null;
  organization?: unknown | null;
}

export interface Person {
  firstname: string;
  middlename: string;
  lastname: string;
  qualifier: unknown;
  title: unknown;
  role: string;
  organization: string;
  rank: number;
}

export default Recipes;
