import { MN } from "~/const"
import { delay, evaluateJavaScript } from "~/utils/common"
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
  self.webView.loadFileURLAllowingReadAccessToURL(
    NSURL.fileURLWithPath(MN.mainPath + "/milkdown.html"),
    NSURL.fileURLWithPath(MN.mainPath)
  )
}

const viewWillDisappear = async (animated: boolean) => {
  if (!loaded) {
    self.retfunc({ html: self.html, text: self.text, dirty: false })
    return
  }
  const { fontSize } = self.globalProfile.addon
  const html = await evaluateJavaScript(self.webView, "getHTML()")
  const text = await evaluateJavaScript(self.webView, "getMarkdown()")
  await evaluateJavaScript(self.webView, `zoom(${fontSize})`)
  await evaluateJavaScript(self.webView, `document.body.style.width = "508px"`)
  const rect = await evaluateJavaScript(self.webView, "getRect()")
  const { width, height } = JSON.parse(rect)
  self.retfunc({
    html,
    text:text.replace(/(?:\n)*$/,""),
    // 是否重新渲染
    dirty: self.text !== text,
    size: { width, height }
  })
  await evaluateJavaScript(self.webView, `setValue("")`)
  self.webView.delegate = null
}

const webViewDidFinishLoad = async (webView: UIWebView) => {
  loaded = true
  await delay(0.2)
  // 有点坑爹
  await evaluateJavaScript(
    self.webView,
    `initMilkdown("${encode(self.text)}", ${JSON.stringify({
      tools: self.globalProfile.addon.toolbar,
      dark: self.globalProfile.addon.darkmode
    })})`
  )
}

export default {
  viewDidLoad,
  viewWillAppear,
  viewWillDisappear,
  webViewDidFinishLoad
}