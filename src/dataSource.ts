import lang from "./lang"
import { more } from "./module"
import { constModules } from "./module"
import { ModuleKeyType } from "./synthesizer"
import { ISection, IConfig, IRow, IRowButton } from "./typings"
import { CellViewType } from "./typings/enum"

const { addon } = constModules

const genSection = (config: IConfig<"addon">): ISection => {
  const rows: IRow[] = [
    {
      type: CellViewType.PlainText,
      label: config.intro,
      link: config.link
    }
  ]
  for (const setting of config.settings) {
    //@ts-ignore magic hack
    rows.push(setting)
    if (setting.help) {
      switch (setting.type) {
        case CellViewType.MuiltSelect:
        case CellViewType.Select:
        case CellViewType.Switch:
          rows.push({
            type: CellViewType.PlainText,
            label: "↑ " + setting.help,
            link: setting.link,
            bind: setting.bind
          })
          break
        case CellViewType.InlineInput:
        case CellViewType.Input:
          rows.push({
            type: CellViewType.PlainText,
            label: "↑ " + setting.help,
            link: setting.link,
            bind: setting.bind
          })
      }
    }
  }
  return {
    header: config.name,
    key: config.key as ModuleKeyType,
    rows
  }
}

const genDataSource = (config: IConfig<"addon">): ISection[] => {
  const dataSource: ISection[] = []
  const moduleNameList: string[] = []
  dataSource.push(genSection(config))
  dataSource.forEach((sec, index) => {
    index && moduleNameList.push(sec.header)
  })
  dataSource.push(more)
  return dataSource
}

function genDataSourceIndex(dataSource: ISection[]) {
  return dataSource.reduce((acc, sec, secIndex) => {
    acc[sec.key] = sec.rows.reduce((acc, row, rowIndex) => {
      if (row.type != CellViewType.PlainText) {
        acc[row.key] = [secIndex, rowIndex]
      }
      return acc
    }, {} as Record<string, [number, number]>)
    return acc
  }, {} as Record<ModuleKeyType, Record<string, [number, number]>>)
}

const getActionKeyGetureOption = (section: ISection) => {
  const gestureOption = [lang.open_panel]
  const actionKeys = []
  for (const _row of section.rows) {
    if (
      _row.type !== CellViewType.Button &&
      _row.type !== CellViewType.ButtonWithInput
    )
      continue
    const row = _row as IRowButton
    gestureOption.push(row.label)
    if (!row.option?.length)
      actionKeys.push({
        key: row.key,
        module: row.module,
        moduleName: row.moduleName,
        option: 0
      })
    else {
      actionKeys.push({
        key: row.key,
        module: row.module,
        moduleName: row.moduleName
      })
      if (row.type == CellViewType.Button) {
        row.option.forEach((option, index) => {
          gestureOption.push("——" + option)
          actionKeys.push({
            key: row.key,
            option: index,
            module: row.module,
            moduleName: row.moduleName
          })
        })
      } else if (row.option[0].includes("Auto")) {
        gestureOption.push("——" + row.option[0])
        actionKeys.push({
          key: row.key,
          option: 0,
          module: row.module,
          moduleName: row.moduleName
        })
      }
    }
  }
  return { actionKeys, gestureOption }
}

export const dataSourcePreset = genDataSource(addon)
export const dataSourceIndex = genDataSourceIndex(dataSourcePreset)
