import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
  server: {
    proxy: {
      "/api/cat": {
        target: "https://api.thecatapi.com/v1/images/search",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/cat/, ""),
      },
      "/images/": {
        target: "https://cdn2.thecatapi.com/",
        changeOrigin: true,
      },
    },
  },
});
