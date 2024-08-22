import { createEffect, createSignal } from "solid-js";

const catNames = [
  "Clawdia",
  "Fur-guson",
  "Meowly Cyrus",
  "Purrnando",
  "Catrick Swayze",
  "Whisker-tine",
  "Kitty Purry",
  "Leonardo DiCatprio",
  "Furcules",
  "Cat Damon",
];

const getRandomElement = (arr: string[]) =>
  arr[Math.floor(Math.random() * arr.length)];

const download = (catName: string) => {
  const el = document.getElementById("catCanvas") as HTMLCanvasElement;
  const dataUrl = el.toDataURL("image/png");
  // Create a temporary anchor element
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `cat_${catName}.png`;

  // Append the link to the body (required for Firefox)
  document.body.appendChild(link);

  // Programmatically click the link to trigger the download
  link.click();

  // Remove the link from the document
  document.body.removeChild(link);
};

const CatImage = () => {
  const [imageSrc, setImageSrc] = createSignal<string | null>(null);
  const [catName, _setCatName] = createSignal<string>(
    getRandomElement(catNames),
  );

  createEffect(async () => {
    try {
      const response = await (await fetch("/api/cat")).json();
      const catImgUrlPathname = new URL(response[0].url).pathname;
      setImageSrc(catImgUrlPathname);
    } catch (error) {
      console.error("Error fetching cat image:", error);
    }
  });

  const drawCatWithLabel = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
  ) => {
    ctx.drawImage(img, 0, 0, 500, 500);
    const imageData = ctx.getImageData(0, 0, 500, 500);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const red = data[i];
      const green = data[i + 1];
      const blue = data[i + 2];

      const gray = red * 0.3 + green * 0.59 + blue * 0.11;

      data[i] = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;
    }

    ctx.putImageData(imageData, 0, 0);

    ctx.font = "30px Comic Sans MS";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.textAlign = "center";

    const x = 250;
    const y = 450;
    ctx.strokeText(catName(), x, y);
    ctx.fillText(catName(), x, y);
  };

  createEffect(() => {
    if (imageSrc()) {
      const canvas = document.getElementById("catCanvas") as HTMLCanvasElement;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.crossOrigin = "anonymous"; // This can bypass CORS if allowed by the server

      img.onload = () => {
        if (ctx) {
          drawCatWithLabel(ctx, img);
        }
      };

      img.src = imageSrc()!;
    }
  });

  return (
    <div>
      <canvas id="catCanvas" width="600" height="800"></canvas>
      <button onClick={() => download(catName())}>Download</button>
    </div>
  );
};

export default CatImage;
