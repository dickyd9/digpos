import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { VitePWA } from "vite-plugin-pwa"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: Number(process.env.VITE_PORT) || 3005,
  },
  build: {
    commonjsOptions: {
      include: ["tailwind.config.js", "node_modules/**"],
    },
  },
  optimizeDeps: {
    include: ["tailwind-config"],
  },
  plugins: [
    vue(),
    VitePWA({
      injectRegister: "auto",
    }),
  ],
  resolve: {
    alias: {
      "tailwind-config": path.resolve(__dirname, "./tailwind.config.js"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
