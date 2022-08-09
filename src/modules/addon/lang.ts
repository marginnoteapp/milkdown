import { Addon, MN } from "~/const"
const zh = {
  link: "https://bbs.marginnote.cn/t/topic/34772",
  intro: `当前版本：${Addon.version}`,
  option: {
    panel_position: ["自动", "靠左", "居中", "靠右"],
    panel_height: ["高点", "标准", "矮点"],
    compatibility: "否"
  },
  label: {
    panel_position: "面板显示位置",
    panel_height: "面板显示高度",
    panle_control: "双击打开面板",
    compatible: "兼容其他插件",
    toolbar: "Milkdown 工具栏",
    darkmode: "Milkdown 暗黑模式",
    font_size: "卡片字体大小"
  },
  help: {
    compatible: "修改后请重启 MN。不保证完全兼容。",
    font_size:
      "卡片上的 Markdown 字体显示大小，无法直接改变已有卡片的字体大小。"
  }
}

const en: typeof zh = {
  link: "https://bbs.marginnote.cn/t/topic/34772",
  intro: `Current version: ${Addon.version}`,
  option: {
    panel_position: ["Auto", "Left", "Center", "Right"],
    panel_height: ["Higher", "Standard", "Lower"],
    compatibility: "No"
  },
  label: {
    panel_position: "Panel Position",
    panel_height: "Panel Height",
    panle_control: "Double Click to Open",
    compatible: "Compatible with others",
    toolbar: "Milkdown Toolbar",
    darkmode: "Milkdown Darkmode",
    font_size: "Card Font Size"
  },
  help: {
    compatible:
      "Please restart MN after modifying. Not guaranteed to be fully compatible.",
    font_size:
      "Card font size of markdown. Cannot directly change existing card font size."
  }
}

export const lang = MN.isZH ? zh : en
