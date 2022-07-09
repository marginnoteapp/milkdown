import { defineConfig } from "vite"
import { resolve } from "path"
import { viteSingleFile } from "vite-plugin-singlefile"

export default defineConfig({
  plugins: [viteSingleFile()],
  build: {
    emptyOutDir: false,
    outDir: "../../assets",
    rollupOptions: {
      input: {
        milkdown: resolve(__dirname, "milkdown.html")
      }
    }
  }
})
