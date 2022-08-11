import { Editor, defaultValueCtx, editorViewOptionsCtx } from "@milkdown/core"
import { nordDark, nordLight } from "./theme-nord"
import { gfm } from "@milkdown/preset-gfm"
import { emoji } from "@milkdown/plugin-emoji"
import { prism } from "@milkdown/plugin-prism"
import "material-icons/iconfont/outlined.css"
import "./style/index.css"
import "./style/template.css"
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
  .create()
