import { ISection } from "./typings"
import { CellViewType } from "./typings/enum"
import addon from "./modules/addon"

export const constModules = { addon }

export const more: ISection = {
  header: "More",
  key: "more",
  rows: [
    {
      type: CellViewType.PlainText,
      label: "由 Milkdown 提供支持",
      link: "https://milkdown.dev/zh-hans"
    },
    {
      type: CellViewType.PlainText,
      label: "基于 OhMyMN v4",
      link: "https://ohmymn.vercel.app"
    },
    {
      type: CellViewType.PlainText,
      label: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",
      link: ""
    }
  ]
}
