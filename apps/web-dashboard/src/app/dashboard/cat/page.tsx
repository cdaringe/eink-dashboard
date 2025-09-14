import React from "react";
import { fetchCatImage } from "../../actions/cat";
import { connection } from "next/server";
import { CatDisplay } from "../../../components/CatDisplay";

const CatPage: React.FC = async () => {
  await connection();

  const result = await fetchCatImage();

  return <CatDisplay result={result} />;
};

export default CatPage;
