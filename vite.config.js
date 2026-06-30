import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        experience: resolve(__dirname, "experience.html"),
        ventures: resolve(__dirname, "ventures.html"),
        publications: resolve(__dirname, "publications.html"),
      },
    },
  },
});
