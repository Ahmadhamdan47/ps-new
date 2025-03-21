import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { VitePWA } from "vite-plugin-pwa"

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"],
      manifest: "/manifest.json",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
    }),
  ],
  server: {
    proxy: {
      "/api": {
        target: "https://apiv2.medleb.org",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => {
          // Log the path for debugging
          console.log(`Original path: ${path}`)

          // Remove the /api prefix
          const newPath = path.replace(/^\/api/, "")

          // Log the rewritten path
          console.log(`Rewritten path: ${newPath}`)

          return newPath
        },
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("proxy error", err)
          })
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            console.log("Sending Request to the Target:", req.method, req.url)
          })
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log("Received Response from the Target:", proxyRes.statusCode, req.url)
          })
        },
      },
    },
  },
})

