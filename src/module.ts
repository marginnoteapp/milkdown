import { ISection } from "./typings"
import { CellViewType } from "./typings/enum"
import addon from "./modules/addon"
import { MN } from "./const"

export const constModules = { addon }

export const more: ISection = {
  header: "More",
  key: "more",
  rows: [
    {
      type: CellViewType.PlainText,
      label: MN.isZH ? "由 Milkdown 提供支持。" : "Powered by Milkdown.",
      link: "https://milkdown.dev/zh-hans"
    },
    {
      type: CellViewType.PlainText,
      label: MN.isZH ? "基于 OhMyMN v4 进行开发。" : "Based on OhMyMN v4.",
      link: "https://github.com/marginnoteapp/ohmymn"
    },
    {
      type: CellViewType.PlainText,
      label: MN.isZH
        ? "本插件开源，点击查看源码，欢迎参与开发。"
        : "This addon is open source, click to view the source code, welcome to join the development.   ",
      link: "https://github.com/marginnoteapp/milkdown"
    },
    {
      type: CellViewType.PlainText,
      label: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",
      link: ""
    }
  ]
}
