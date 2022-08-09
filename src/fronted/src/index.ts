import {
  Editor,
  defaultValueCtx,
  editorViewOptionsCtx,
  editorViewCtx,
  serializerCtx
} from "@milkdown/core"
import { decode, encode } from "../../utils/third party/base64"
import { forceUpdate, replaceAll, getHTML } from "@milkdown/utils"
import { cursor } from "@milkdown/plugin-cursor"
import { nordDark, nordLight } from "./theme-nord"
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
import "material-icons/iconfont/material-icons.css"
import "./style/index.css"
import "./style/editor.css"
import "katex/dist/katex.min.css"
import "prism-themes/themes/prism-nord.min.css"

let editableStatus = true
let editor: Editor

const initMilkdown = async (
  defaultValue = "",
  option = {
    dark: false,
    tools: [0, 1, 2]
  }
) => {
  const { dark, tools } = option
  editor = Editor.make().config(ctx => {
    ctx.set(defaultValueCtx, decode(defaultValue))
    ctx.set(editorViewOptionsCtx, { editable: () => editableStatus })
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
    .use(dark ? nordDark : nordLight)
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

const setEditable = (status: boolean) => {
  editableStatus = status
  editor.action(forceUpdate())
}

const setValue = (value: string) => {
  editor.action(replaceAll(encode(value)))
}

const getMarkdown = () => {
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
  return JSON.stringify(
    document.querySelector(".milkdown .editor")!.getBoundingClientRect()
  )
}

function simulateCardRender() {
  const table = document.querySelector(".milkdown .tableWrapper table")
  if (table)
    table.setAttribute("style", "width: 100% !important;margin: 0 !important;")
}

// @ts-ignore
window.getRect = getRect
// @ts-ignore
window.setEditable = setEditable
// @ts-ignore
window.initMilkdown = initMilkdown
// @ts-ignore
window.setValue = setValue
// @ts-ignore
window.getMarkdown = getMarkdown
// @ts-ignore
window.getHTML = getMDHTML
// @ts-ignore
window.simulateCardRender = simulateCardRender
