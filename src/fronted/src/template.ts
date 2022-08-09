import { Editor, defaultValueCtx, editorViewOptionsCtx } from "@milkdown/core"
import { nordDark, nordLight } from "./theme-nord"
import { gfm } from "@milkdown/preset-gfm"
import { emoji } from "@milkdown/plugin-emoji"
import { prism } from "@milkdown/plugin-prism"
import { math } from "@milkdown/plugin-math"
import "material-icons/iconfont/material-icons.css"
import "./style/index.css"
import "./style/template.css"
import "katex/dist/katex.min.css"
import "prism-themes/themes/prism-nord.min.css"
import { decode } from "../../utils/third party/base64"
import { diagram } from "@milkdown/plugin-diagram"

const { content, dark } = JSON.parse(decode("@@params@@"))

// const { size, content, dark } = {
//   size: 18,
//   content: "hello world",
//   dark: false
// }

Editor.make()
  .config(ctx => {
    ctx.set(defaultValueCtx, content)
    ctx.set(editorViewOptionsCtx, { editable: () => false })
  })
  .use(dark ? nordDark : nordLight)
  .use(prism)
  .use(gfm)
  .use(emoji)
  .use(diagram)
  .use(math)
  .create()
