import { Editor, defaultValueCtx, editorViewOptionsCtx } from "@milkdown/core"
import { nord } from "./library/theme-nord"
import { gfm } from "./library/preset-gfm"
import { emoji } from "@milkdown/plugin-emoji"
import { prism } from "@milkdown/plugin-prism"
import { math } from "./library/plugin-math"
import "material-icons/iconfont/outlined.css"
import "./style/index.css"
import "./style/template.css"
import "katex/dist/katex.min.css"
import "prism-themes/themes/prism-nord.min.css"
import { decode } from "../../utils/third party/base64"
import { diagram } from "@milkdown/plugin-diagram"
import { appendStyle, prismDark, prismLight } from "./prismCSS"

const { content, dark, color } = JSON.parse(decode("@@params@@"))

appendStyle(dark ? prismDark : prismLight)
Editor.make()
  .config(ctx => {
    ctx.set(defaultValueCtx, content)
    ctx.set(editorViewOptionsCtx, { editable: () => false })
  })
  .use(nord(dark, color))
  .use(prism)
  .use(gfm)
  .use(emoji)
  .use(diagram)
  .use(math)
  .create()
