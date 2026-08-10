// Vite: минимальный пример examples/basic
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "examples/basic",
  publicDir: false,
  build: {
    outDir: "../../dist-basic",
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, "examples/basic/index.html"),
    },
  },
  server: {
    port: 5175,
    open: true,
  },
  resolve: {
    alias: {
      "mine3d-embedded": resolve(__dirname, "src"),
    },
  },
});
