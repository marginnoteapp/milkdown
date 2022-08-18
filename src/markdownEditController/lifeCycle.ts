import { MN } from "~/const"
import { delay, delayBreak, evaluateJavaScript } from "~/utils/common"
import { encode } from "~/utils/third party/base64"

let loaded = false
const viewDidLoad = () => {
  const webFrame = self.view.bounds
  self.webView = new UIWebView(webFrame)
  self.webView.scalesPageToFit = true
  self.webView.autoresizingMask = (1 << 1) | (1 << 4)
  self.webView.delegate = self
  self.webView.scrollView.delegate = self
  self.view.addSubview(self.webView)
  loaded = true
}

const viewWillAppear = (animated: boolean) => {
  self.webView.delegate = self
  loaded = false
  self.view.backgroundColor = MN.app.defaultNotebookColor!
  self.webView.backgroundColor = MN.app.defaultNotebookColor!
  self.webView.loadFileURLAllowingReadAccessToURL(
    NSURL.fileURLWithPath(MN.mainPath + "/milkdown.html"),
    NSURL.fileURLWithPath(MN.mainPath)
  )
}

const webViewDidFinishLoad = async (webView: UIWebView) => {
  loaded = true

  await delayBreak(20, 0.01, async () => {
    const ret = await evaluateJavaScript(
      self.webView,
      `isLoaded("${MN.colors[MN.app.currentTheme!]}")`
    )
    return ret == "true"
  })
  await delay(0.4)

  await evaluateJavaScript(
    self.webView,
    `initMilkdown("${encode(self.text)}", ${JSON.stringify({
      tools: self.globalProfile.addon.toolbar,
      dark: MN.app.currentTheme === "Gray" || MN.app.currentTheme === "Dark",
      color: MN.colors[MN.app.currentTheme!]
    })})`
  )
}

const viewWillDisappear = async (animated: boolean) => {
  if (!loaded) {
    self.retfunc({ html: self.html, text: self.text, dirty: false })
    return
  }
  const html = await evaluateJavaScript(self.webView, "getHTML()")
  const text = (await evaluateJavaScript(self.webView, "getMarkdown()")).trim()
  await evaluateJavaScript(self.webView, `simulateCardRender()`)
  const rect = await evaluateJavaScript(self.webView, "getRect()")
  const { height } = JSON.parse(rect)
  self.retfunc({
    html,
    text,
    // 是否重新渲染
    dirty: self.text !== text || text.startsWith("$$"),
    /**
     * 卡片渲染是 10 10 0 10，上 右 下 左
     * 编辑是 10 30 10 30
     * 宽度: 400 + 20
     * 高度: height - 10
     */
    size: { width: 420, height: height - 10 }
  })
  await evaluateJavaScript(self.webView, `setValue("")`)
  self.webView.delegate = null
}

export default {
  viewDidLoad,
  viewWillAppear,
  viewWillDisappear,
  webViewDidFinishLoad
}
