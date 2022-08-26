import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import { fileURLToPath } from "url"
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), NodeGlobalsPolyfillPlugin({
    buffer: true
  })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@layout": path.resolve(__dirname, "./src/components/layout"),
    },
  },
})
