import React from "react";
import logopng from "../assets/logo.png";
import Image from "next/image";

const logoprops = {
  id: "panel_logo",
  alt: "logo",
  className: "w-[24px] ml-1 object-contain",
  src: logopng,
} as const;

export const Header: React.FC<{
  children?: React.ReactNode;
  logo?: (
    props: React.ComponentProps<typeof Image>,
    Component: typeof Image,
  ) => React.ReactNode;
}> = ({ children, logo }) => {
  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <header
      id="panel_header"
      style={{
        boxShadow: "black 0px 5px 15px",
      }}
      className="flex items-center justify-center"
    >
      {logo
        ? logo(logoprops, Image) // eslint-disable-next-line jsx-a11y/alt-text
        : <Image {...logoprops} />}
      {children}
      <div>
        {isClient
          ? `${new Date().toLocaleDateString()} ${
            new Date().toLocaleTimeString()
          }`
          : ""}
      </div>
    </header>
  );
};
