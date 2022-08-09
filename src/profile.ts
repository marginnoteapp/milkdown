import { IConfig } from "./typings"
import { ReplaceParam } from "./utils/input"

const globalProfilePreset = {
  addon: {
    panelControl: false,
    panelPosition: [0],
    panelHeight: [1],
    darkmode: false,
    toolbar: [],
    compatibility: [0]
  }
}

// Each document has a independent profile
const docProfilePreset = {}

const notebookProfilePreset = {}

// Cache Regex like [//,//];[//,//] 和 (//,"",0);(//,"",0);
const tempProfilePreset = {
  replaceParam: {
    customTag: [],
    customComment: [],
    customList: [],
    customReplace: [],
    customExtractTitle: [],
    customFormat: []
  },
  regArray: {
    customTitleSplit: [],
    customBeTitle: [],
    customDefLink: []
  }
}

type UtilTemp<T> = {
  [K in keyof T]: K extends "replaceParam"
    ? {
        [M in keyof T[K]]: ReplaceParam[] | undefined
      }
    : {
        [M in keyof T[K]]: RegExp[][] | undefined
      }
}

type UtilProfile<T> = {
  [K in keyof T]: K extends "additional"
    ? T[K]
    : {
        [M in keyof T[K]]: T[K][M] extends any[] ? number[] : T[K][M]
      }
}

type ITempProfile = UtilTemp<typeof tempProfilePreset>
type IGlobalProfile = UtilProfile<typeof globalProfilePreset>
type IDocProfile = UtilProfile<typeof docProfilePreset>
type INotebookProfile = UtilProfile<typeof notebookProfilePreset>
type IAllProfile = IGlobalProfile & IDocProfile & INotebookProfile

export {
  globalProfilePreset,
  docProfilePreset,
  tempProfilePreset,
  notebookProfilePreset,
  IGlobalProfile,
  IDocProfile,
  INotebookProfile,
  ITempProfile,
  IAllProfile
}

export const defineConfig = <T extends keyof IAllProfile>(
  options: IConfig<T>
) => options
