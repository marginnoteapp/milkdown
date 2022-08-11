import {
  Editor,
  defaultValueCtx,
  editorViewOptionsCtx,
  editorViewCtx,
  serializerCtx,
  Ctx
} from "@milkdown/core"
import { decode, encode } from "../../utils/third party/base64"
import { getHTML, replaceAll } from "@milkdown/utils"
import { cursor } from "@milkdown/plugin-cursor"
import { nord } from "./theme-nord"
import { diagram } from "@milkdown/plugin-diagram"
import { clipboard } from "@milkdown/plugin-clipboard"
import { gfm } from "@milkdown/preset-gfm"
import { emoji } from "@milkdown/plugin-emoji"
import { prism } from "@milkdown/plugin-prism"
import { slash } from "@milkdown/plugin-slash"
import { menu } from "@milkdown/plugin-menu"
import { history } from "@milkdown/plugin-history"
import { indent } from "@milkdown/plugin-indent"
import { upload } from "@milkdown/plugin-upload"
import { tooltip } from "@milkdown/plugin-tooltip"
import { math } from "@milkdown/plugin-math"
import "material-icons/iconfont/outlined.css"
import "./style/index.css"
import "./style/editor.css"
import "katex/dist/katex.min.css"
import { TextSelection } from "@milkdown/prose/state"
import { appendStyle, prismDark, prismLight } from "./theme-nord/prismCSS"

let editable = true
let editor: Editor

async function initMilkdown(
  defaultValue = "",
  option = { color: "#fff", dark: false, tools: [0, 1, 2] }
) {
  const { color, dark, tools } = option
  appendStyle(dark ? prismDark : prismLight)
  editor = Editor.make().config(ctx => {
    ctx.set(defaultValueCtx, decode(defaultValue))
    ctx.set(editorViewOptionsCtx, { editable: () => editable })
  })
  if (tools.includes(0)) {
    editor = editor.use(slash)
  }
  if (tools.includes(1)) {
    editor = editor.use(tooltip)
  }
  if (tools.includes(2)) {
    editor = editor.use(menu)
  }
  editor = await editor
    .use(nord(dark, color))
    .use(clipboard)
    .use(history)
    .use(indent)
    .use(prism)
    .use(gfm)
    .use(cursor)
    .use(emoji)
    .use(upload)
    .use(diagram)
    .use(math)
    .create()
}

function getMarkdown() {
  return editor.action(ctx => {
    const editorView = ctx.get(editorViewCtx)
    const serializer = ctx.get(serializerCtx)
    return serializer(editorView.state.doc)
  })
}

function getMDHTML() {
  return editor.action(getHTML())
}

function getRect() {
  const editor = document.querySelector(".milkdown .editor")!
  editor.setAttribute("style", "width:400px !important;")
  return JSON.stringify(editor.getBoundingClientRect())
}

function simulateCardRender() {
  editor.action(toggleEditable)
  document.querySelectorAll(".milkdown .tableWrapper table").forEach(k => {
    k.setAttribute("style", "width: 100% !important;margin: 0 !important;")
  })
}

function toggleEditable(ctx: Ctx) {
  editable = !editable
  const view = ctx.get(editorViewCtx)
  const { tr } = view.state

  const nextTr = Object.assign(Object.create(tr), tr).setTime(Date.now())
  view.dispatch(
    nextTr.setSelection(new TextSelection(view.state.doc.resolve(0)))
  )
}

const setValue = (value: string) => {
  editor.action(replaceAll(encode(value)))
}

// @ts-ignore
window.getRect = getRect
// @ts-ignore
window.initMilkdown = initMilkdown
// @ts-ignore
window.getMarkdown = getMarkdown
// @ts-ignore
window.getHTML = getMDHTML
// @ts-ignore
window.simulateCardRender = simulateCardRender
// @ts-ignore
window.setValue = setValue

// @ts-ignore
window.isLoaded = (color: string) => {
  document.body.style.backgroundColor = color
  return "true"
}
