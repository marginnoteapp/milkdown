import { dataSourceIndex } from "~/dataSource"
import { layoutViewController } from "~/jsExtension/switchPanel"
import { IGlobalProfile, IDocProfile, INotebookProfile } from "~/profile"
import { IRowSwitch, IRowInlineInput, IRowInput, IRowSelect } from "~/typings"
import { deepCopy } from ".."
import { string2RegArray, ReplaceParam, string2ReplaceParam } from "../input"
import { getMNLinkValue } from "./utils"

export const updateProfileTemp = (key: string, val: string) => {
  const newValue = getMNLinkValue(val)
  if (key in self.tempProfile.regArray) {
    let tmp: RegExp[][] | undefined
    // Avoid the error after modification is not corrected
    try {
      tmp = newValue ? string2RegArray(newValue) : undefined
    } catch {
      tmp = undefined
    }
    self.tempProfile.regArray[key] = tmp
  } else if (key in self.tempProfile.replaceParam) {
    let tmp: ReplaceParam[] | undefined
    try {
      tmp = newValue ? string2ReplaceParam(newValue) : undefined
    } catch {
      tmp = undefined
    }
    self.tempProfile.replaceParam[key] = tmp
  }
}

export const updateProfileDataSource = (
  profile: IGlobalProfile | IDocProfile | INotebookProfile,
  profileSaved: any
) => {
  // Update DateSouce and profile
  for (const [name, _] of Object.entries(profile)) {
    if (name === "additional") {
      for (const [key, val] of Object.entries(_)) {
        _[key] = deepCopy(profileSaved?.[name]?.[key] ?? val)
      }
    } else {
      for (const [key, val] of Object.entries(_)) {
        if (!dataSourceIndex?.[name]?.[key]) continue
        const [section, row] = dataSourceIndex[name][key]
        const newValue = profileSaved?.[name]?.[key] ?? val
        switch (typeof newValue) {
          case "boolean":
            ;(self.dataSource[section].rows[row] as IRowSwitch).status =
              newValue
            _[key] = newValue
            break
          case "string":
            ;(
              self.dataSource[section].rows[row] as IRowInlineInput | IRowInput
            ).content = newValue
            _[key] = newValue
            updateProfileTemp(key, newValue)
            break
          default:
            if (Array.isArray(newValue)) {
              // number[]
              ;(self.dataSource[section].rows[row] as IRowSelect).selections = [
                ...newValue
              ]
              _[key] = [...newValue]
            }
        }
      }
    }
  }
}

export const refreshPanel = () => {
  self.settingViewController.tableView?.reloadData()
  layoutViewController()
  console.log("Refresh Panel", "profile")
}
