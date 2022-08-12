import { Addon } from "~/const"
import { CellViewType } from "~/typings/enum"
import { defineConfig } from "~/profile"
import { lang } from "./lang"

const { label, help, option, intro } = lang
export default defineConfig({
  name: Addon.title,
  key: "addon",
  intro,
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
      label: label.compatible,
      help: help.compatible,
      option: [option.compatibility, "MarkDown", "myMarkDown"]
    },
    {
      key: "toolbar",
      type: CellViewType.MuiltSelect,
      label: label.toolbar,
      option: ["Slash", "Tooltip", "Menu", "Block"]
    }
  ]
})
