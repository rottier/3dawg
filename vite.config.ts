import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import wasm from "vite-plugin-wasm";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({ tsDecorators: true }), wasm()],
  base: "./",
  resolve: {
    alias: {
      "@wasm": path.resolve(__dirname, "./dist/wasm"),
    }
  }
})
