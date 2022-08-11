import { defineConfig } from "vite"
import { resolve } from "path"
import { viteSingleFile } from "vite-plugin-singlefile"

export default defineConfig(({ mode }) => ({
  plugins: [viteSingleFile()],
  build: {
    emptyOutDir: false,
    outDir: "../../assets",
    rollupOptions: {
      input: { [mode]: resolve(__dirname, `${mode}.html`) }
    }
  }
}))
