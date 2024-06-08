import { defineConfig } from "vite";
import autoprefixer from "autoprefixer";

// https://vitejs.dev/config/
export default defineConfig({
  root: "src",
  base: "/",
  publicDir: "../public",
  build: {
    outDir: "../dist",
    minify: false,
    assetsDir: "-/Media/Ricoh/Sites/co_jp/garment/special/ri100-loyalty/assets",
  },
  css: {
    postcss: {
      plugins: [autoprefixer],
    },
  },
});
