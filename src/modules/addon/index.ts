import { Addon } from "~/const"
import { CellViewType } from "~/typings/enum"
import { defineConfig } from "~/profile"
import { lang } from "./lang"

const { label, help, option } = lang
export default defineConfig({
  name: Addon.title,
  key: "addon",
  intro: `当前版本: ${Addon.version}`,
  link: "https://github.com/marginnoteapp/milkdown",
  settings: [
    {
      key: "panelPosition",
      type: CellViewType.Select,
      option: option.panel_position,
      label: label.panel_position
    },
    {
      key: "panelHeight",
      type: CellViewType.Select,
      option: option.panel_height,
      label: label.panel_height
    },
    {
      key: "panelControl",
      type: CellViewType.Switch,
      label: label.panle_control
    },
    {
      key: "compatibility",
      type: CellViewType.Select,
      label: "兼容其他插件",
      option: ["否", "MarkDown", "MyMarkDown"]
    },
    {
      key: "toolbar",
      type: CellViewType.MuiltSelect,
      label: "Milkdown 工具栏",
      option: ["Slash", "Tooltip", "Menu"]
    },
    {
      key: "darkmode",
      type: CellViewType.Switch,
      label: "Milkdown 暗黑模式"
    },
    {
      key: "fontSize",
      type: CellViewType.InlineInput,
      label: "字体显示大小"
    }
  ]
})
