import { ICheckMethod } from "./typings"
import lang from "./lang"
import { showHUD } from "./utils/common"
import { constModules } from "./module"
import { IAllProfile } from "./profile"
export type ModuleKeyType = Exclude<keyof IAllProfile, "additional"> | "more"
type AutoModuleKeyType = Include<ModuleKeyType, "auto">

export const { checkers } = Object.values(constModules).reduce(
  (acc, module) => {
    module.settings.length &&
      module.settings.forEach(k => {
        if ("check" in k) {
          acc.checkers[k.key] = k["check"]!
        }
      })
    return acc
  },
  {
    checkers: {} as Record<string, ICheckMethod>
  }
)

export async function checkInputCorrect(
  input: string,
  key: string
): Promise<boolean> {
  try {
    if (checkers[key]) {
      await checkers[key]({ input })
    }
  } catch (err) {
    showHUD(err ? String(err) : lang.input_error, 3)
    return false
  }
  return true
}
