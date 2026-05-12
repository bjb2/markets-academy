import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";

export default defineConfig({
  base: "/markets-academy/",
  plugins: [
    { enforce: "pre", ...mdx({ providerImportSource: "@mdx-js/react" }) },
    react({ include: /\.(jsx|js|tsx|ts|mdx)$/ }),
  ],
  server: {
    port: 5173,
  },
  build: {
    target: "es2022",
  },
});
