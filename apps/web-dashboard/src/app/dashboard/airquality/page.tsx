import AirQuality from "@/components/AirQuality";
import React from "react";

/**
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/page}
 */
export default async function Page({
  searchParams: searchParamsPromise,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const searchParams = await searchParamsPromise;
  const from = searchParams.from || "now-12h";
  const to = searchParams.to || "now";
  const theme = searchParams.theme || "light";
  return <AirQuality {...{ from, to, theme }} />;
}
