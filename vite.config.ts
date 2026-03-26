import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  base: "./",
  plugins: [react(), glsl()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@engine": resolve(__dirname, "src/engine"),
      "@three": resolve(__dirname, "src/three"),
      "@components": resolve(__dirname, "src/components"),
      "@hooks": resolve(__dirname, "src/hooks"),
      "@state": resolve(__dirname, "src/state"),
      "@types": resolve(__dirname, "src/types"),
    },
  },
});