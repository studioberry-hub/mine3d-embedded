// Vite: playground-демо и статическая сборка примеров
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "examples/playground",
  publicDir: false,
  build: {
    outDir: "../../dist-demo",
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, "examples/playground/index.html"),
    },
  },
  server: {
    port: 5174,
    open: true,
  },
  resolve: {
    alias: {
      "mine3d-embedded": resolve(__dirname, "src"),
    },
  },
});
