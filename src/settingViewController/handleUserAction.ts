import { Addon, MN } from "~/const"
import { checkInputCorrect } from "~/synthesizer"
import { UITableView, IRowInput, IRowSwitch, IRowSelect } from "~/typings"
import { CellViewType } from "~/typings/enum"
import { openUrl, postNotification } from "~/utils/common"
import { byteLength } from "~/utils/text"

const _tag2indexPath = (tag: number): NSIndexPath =>
  NSIndexPath.indexPathForRowInSection(
    (tag - 999) % 100,
    (tag - 999 - ((tag - 999) % 100)) / 100
  )

const tableViewDidSelectRowAtIndexPath = async (
  tableView: UITableView,
  indexPath: NSIndexPath
) => {
  tableView.cellForRowAtIndexPath(indexPath).selected = false
  const sec = self.dataSource[indexPath.section]
  const row = sec.rows[indexPath.row]
  switch (row.type) {
    case CellViewType.PlainText:
      if (row.link) openUrl(row.link)
      break
  }
}

const textFieldShouldReturn = async (sender: UITextField) => {
  const indexPath: NSIndexPath = _tag2indexPath(sender.tag)
  const section = self.dataSource[indexPath.section]
  const row = section.rows[indexPath.row] as IRowInput
  const text = sender.text.trim()
  // Allowed be empty
  if (/^marginnote3app:/.test(text)) openUrl(text)
  if (!text || (await checkInputCorrect(text, row.key))) {
    // Cancel the cursor if the input is correct
    sender.resignFirstResponder()
    row.content = text
    postNotification(Addon.key + "InputOver", {
      name: section.key,
      key: row.key,
      content: text
    })
  }
  return true
}

const switchChange = (sender: UISwitch) => {
  const indexPath: NSIndexPath = _tag2indexPath(sender.tag)
  const section = self.dataSource[indexPath.section]
  const row = <IRowSwitch>section.rows[indexPath.row]
  row.status = sender.on ? true : false
  self.tableView.reloadData()
  postNotification(Addon.key + "SwitchChange", {
    name: section.key,
    key: row.key,
    status: sender.on ? true : false
  })
}

let lastSelectInfo:
  | {
      name: string
      key: string
      selections: number[]
    }
  | undefined
const selectAction = async (param: {
  indexPath: NSIndexPath
  selection: number
  menuController: MenuController
}) => {
  const { indexPath, selection, menuController } = param
  const section = self.dataSource[indexPath.section]
  const row = <IRowSelect>section.rows[indexPath.row]
  //  Distinguish between single and multiple selection
  if (
    (<IRowSelect>self.dataSource[indexPath.section].rows[indexPath.row]).type ==
    CellViewType.Select
  ) {
    ;(<IRowSelect>(
      self.dataSource[indexPath.section].rows[indexPath.row]
    )).selections = [selection]
    postNotification(Addon.key + "SelectChange", {
      name: section.key,
      key: row.key,
      selections: [selection]
    })
    if (self.popoverController)
      self.popoverController.dismissPopoverAnimated(true)
  } else {
    const selections = row.selections

    const nowSelect = row.selections.includes(selection)
      ? selections.filter(item => item != selection)
      : [selection, ...selections]

    ;(<IRowSelect>(
      self.dataSource[indexPath.section].rows[indexPath.row]
    )).selections = nowSelect

    lastSelectInfo = {
      name: section.key,
      key: row.key,
      selections: nowSelect.sort()
    }
    menuController.commandTable = menuController.commandTable?.map(
      (item, index) => {
        item.checked = row.selections.includes(index)
        return item
      }
    )
    menuController.menuTableView!.reloadData()
  }
  self.tableView.reloadData()
}

const clickSelectButton = (sender: UIButton) => {
  const indexPath: NSIndexPath = _tag2indexPath(sender.tag)
  const section = self.dataSource[indexPath.section]
  const row = section.rows[indexPath.row] as IRowSelect
  const menuController = MenuController.new()
  const height = 44
  const zero = 0.00001
  menuController.commandTable = row.option.map((item, index) => ({
    title: item,
    object: self,
    selector: "selectAction:",
    height,
    param: {
      indexPath,
      menuController,
      selection: index
    },
    checked: row.selections.includes(index)
  }))
  const width = Math.max(...row.option.map(k => byteLength(k))) * 10 + 80
  menuController.preferredContentSize = {
    width: width > 300 ? 300 : width,
    height:
      height * menuController.commandTable.filter(k => k.height !== zero).length
  }

  const studyControllerView = MN.studyController().view
  self.popoverController = new UIPopoverController(menuController)
  self.popoverController.presentPopoverFromRect(
    sender.convertRectToView(sender.bounds, studyControllerView),
    studyControllerView,
    1 << 3,
    true
  )
  self.popoverController.delegate = self
}

/** Send data when the popup disappears */
const popoverControllerDidDismissPopover = () => {
  if (lastSelectInfo) {
    postNotification(Addon.key + "SelectChange", lastSelectInfo)
    lastSelectInfo = undefined
  }
}

export default {
  popoverControllerDidDismissPopover,
  tableViewDidSelectRowAtIndexPath,
  textFieldShouldReturn,
  clickSelectButton,
  switchChange,
  selectAction
}
