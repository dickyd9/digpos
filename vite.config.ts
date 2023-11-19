import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { VitePWA } from "vite-plugin-pwa"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: Number(process.env.VITE_PORT) || 3003,
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
      manifest: {
        name: "Digpos", // Ganti dengan nama aplikasi Anda
        short_name: "POS", // Ganti dengan nama singkat aplikasi Anda
        theme_color: "#ffffff", // Ganti dengan warna tema yang diinginkan
        icons: [
          {
            src: "/path/ke/icon.png", // Ganti dengan path ke ikon Anda
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/path/ke/icon512.png", // Ganti dengan path ke ikon 512x512 Anda
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "tailwind-config": path.resolve(__dirname, "./tailwind.config.js"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
