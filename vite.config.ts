import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/jama-udhar/",
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  optimizeDeps: {
    include: ["@react-pdf/renderer", "base64-js"],
    esbuildOptions: {
      target: "esnext",
    },
  },
  define: {
    global: "globalThis",
  },
  build: {
    rollupOptions: {
      external: [],
      output: {
        format: "es",
      },
    },
    commonjsOptions: {
      include: [/base64-js/, /node_modules/],
      transformMixedEsModules: true,
    },
  },
});
