import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl">
          Web Dashboard
        </h1>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        {[{
          url: "/dashboard/recipes",
          label: "Recipes",
          icon: "/window.svg",
        }, {
          url: "/dashboard/onion",
          label: "Onion",
          icon: "/window.svg",
        }, {
          url: "/dashboard/airquality",
          label: "AirQuality",
          icon: "/globe.svg",
        }].map(({ url, label, icon }) => (
          <Link
            key={url}
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href={url}
          >
            <Image
              aria-hidden
              src={icon}
              alt="icon"
              width={16}
              height={16}
            />
            {label}
          </Link>
        ))}
      </footer>
    </div>
  );
}
