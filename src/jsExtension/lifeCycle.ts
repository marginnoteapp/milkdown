import { MN } from "~/const"
import { dataSourcePreset } from "~/dataSource"
import lang from "~/lang"
import {
  docProfilePreset,
  globalProfilePreset,
  notebookProfilePreset,
  tempProfilePreset
} from "~/profile"
import { inst as settingViewControllerInst } from "~/settingViewController"
import { inst as markdownEditControllerInst } from "~/markdownEditController"
import { UIWindow } from "~/typings"
import { deepCopy } from "~/utils"
import { getObjCClassDeclar, openUrl, showHUD } from "~/utils/common"
import { readProfile, removeProfile, writeProfile } from "~/utils/profile"
import { Range } from "~/utils/profile/typings"
import { eventHandlers } from "./handleReceivedEvent"
import { closePanel, layoutViewController } from "./switchPanel"
import Base64 from "~/utils/third party/base64"
import popup from "~/utils/popup"

const SettingViewController = JSB.defineClass(
  getObjCClassDeclar("SettingViewController", "UITableViewController"),
  settingViewControllerInst
)

const MarkdownEditController = JSB.defineClass(
  getObjCClassDeclar("MarkdownEditController", "UIViewController"),
  markdownEditControllerInst
)

export const initMarkdownEditController = () => {
  const editorFunc = (
    html: string,
    text: string,
    respath: string,
    retfunc: (r: {
      html: string
      text: string
      dirty: boolean
      size?: number
    }) => void
  ) => {
    self.markdownEditController.html = html
    self.markdownEditController.text = text
    self.markdownEditController.respath = respath
    self.markdownEditController.retfunc = retfunc
    return { viewController: self.markdownEditController }
  }

  const renderFunc = (html: string, text: string, respath: string) => {
    return self.renderTemplate[text.includes("$") ? 0 : 1].replace(
      "@@params@@",
      Base64.encode(
        JSON.stringify(
          // MN.isMac ?
          {
            content: text,
            dark: false,
            color: "#fff"
          }
          // : {
          //     content: text,
          //     dark:
          //       MN.app.currentTheme === "Gray" ||
          //       MN.app.currentTheme === "Dark",
          //     color: MN.colors[MN.app.currentTheme!]
          //   }
        )
      )
    )
  }

  const image = UIImage.imageWithDataScale(
    NSData.dataWithContentsOfFile(MN.mainPath + "/logo.png"),
    2
  )

  const { compatibility } = self.globalProfile.addon
  Application.sharedInstance().regsiterHtmlCommentEditor(
    { title: "Milkdown", image },
    editorFunc,
    renderFunc,
    ["MilkdownEditor", "MarkDownEditor", "MarkdownEditor"][compatibility[0]]
  )
}

/**
 * Addon life cycle
 * If you close the window directly, it will not trigger the closing of notebooks and documents
 * 1. Addon connected
 * 2. Open a new window
 * 3. Open a notebook
 * 4. Open a document
 * 5. Close a notebook
 * 6. Close a document
 * 7. Close a window
 */

/** Cache window */
let _window: UIWindow

const addonDidConnect = () => {
  console.log("Addon connected", "lifeCycle")
}

const sceneWillConnect = () => {
  console.log("Open a new window", "lifeCycle")
  _window = self.window
  // Multiple windows will share global variables, so they need to be saved to self.
  self.panelStatus = false
  self.globalProfile = deepCopy(globalProfilePreset)
  self.docProfile = deepCopy(docProfilePreset)
  self.notebookProfile = deepCopy(notebookProfilePreset)
  self.tempProfile = deepCopy(tempProfilePreset)
  self.dataSource = deepCopy(dataSourcePreset)
  self.OCROnline = { times: 0, status: "free" }
  self.customSelectedNodes = []
  self.settingViewController = SettingViewController.new()
  self.settingViewController.dataSource = self.dataSource
  self.settingViewController.window = self.window
  self.settingViewController.globalProfile = self.globalProfile
  self.settingViewController.docProfile = self.docProfile
  self.settingViewController.notebookProfile = self.notebookProfile
  self.markdownEditController = MarkdownEditController.new()
  self.renderTemplate = [
    NSString.stringWithContentsOfFile(MN.mainPath + "/template.html"),
    NSString.stringWithContentsOfFile(MN.mainPath + "/template-nomath.html")
  ]
  self.markdownEditController.window = self.window
  self.markdownEditController.globalProfile = self.globalProfile
  self.markdownEditController.docProfile = self.docProfile
  self.markdownEditController.notebookProfile = self.notebookProfile
}

const notebookWillOpen = (notebookid: string) => {
  console.log("Open a notebook", "lifeCycle")
  self.notebookid = notebookid
  if (self.docmd5)
    readProfile({
      range: Range.Notebook,
      notebookid
    })
  // Add hooks, aka observers
  eventHandlers.add()
}
const documentDidOpen = (docmd5: string) => {
  // Switch document, read doc profile
  if (self.docmd5)
    readProfile({
      range: Range.Doc,
      docmd5
    })
  else {
    // First open a document, init all profile
    readProfile({
      range: Range.All,
      docmd5,
      notebookid: self.notebookid
    })
    initMarkdownEditController()
  }
  self.docmd5 = docmd5
  console.log("Open a document", "lifeCycle")
}

const notebookWillClose = (notebookid: string) => {
  console.log("Close a notebook", "lifeCycle")
  closePanel()
  writeProfile({ range: Range.Notebook, notebookid })
  // Remove hooks, aka observers
  eventHandlers.remove()
}

const documentWillClose = (docmd5: string) => {
  console.log("Close a document", "lifeCycle")
  writeProfile({ range: Range.Doc, docmd5 })
}

// Not triggered on ipad
const sceneDidDisconnect = () => {
  console.log("Close a window", "lifeCycle")
  if (self.docmd5)
    writeProfile({
      range: Range.All,
      docmd5: self.docmd5,
      notebookid: self.notebookid
    })
}

const addonWillDisconnect = async () => {
  console.log("Addon disconected", "lifeCycle")
  // could not get the value of self.window
  const { option } = await popup(
    {
      message: lang.bug,
      buttons: [lang.sure, lang.update]
    },
    ({ buttonIndex }) => ({
      option: buttonIndex
    })
  )
  switch (option) {
    case 0: {
      removeProfile()
      // could not get the value of self.window
      showHUD(lang.disconnect_addon, 2, _window)
      break
    }
    case 1: {
      openUrl("https://bbs.marginnote.cn/t/topic/34772")
    }
  }
}

const sceneWillResignActive = () => {
  // or go to the background
  console.log("Window is inactivation", "lifeCycle")
  // !MN.isMac && closePanel()
  if (self.docmd5)
    writeProfile({
      range: Range.All,
      docmd5: self.docmd5,
      notebookid: self.notebookid
    })
}
const sceneDidBecomeActive = () => {
  layoutViewController()
  // or go to the foreground
  console.log("Window is activated", "lifeCycle")
}

export const clsMethons = {
  addonWillDisconnect
}

export default {
  sceneWillConnect,
  notebookWillOpen,
  documentDidOpen,
  notebookWillClose,
  documentWillClose,
  sceneDidDisconnect,
  sceneWillResignActive,
  sceneDidBecomeActive
}
