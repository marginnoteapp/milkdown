import { Addon, MN } from "~/const"

const viewDidLoad = () => {
  self.tableView.allowsSelection = true
  self.view.layer.cornerRadius = 10
  self.view.layer.borderWidth = 2
}

//Execute when each time it is opened
const viewWillAppear = () => {
  self.tableView.reloadData()
  if (MN.isMac) {
    self.tableView.backgroundColor = UIColor.colorWithHexString(
      MN.colors[MN.app.currentTheme!]
    )
    Addon.textColor =
      MN.app.currentTheme == "Gray" || MN.app.currentTheme == "Dark"
        ? UIColor.whiteColor()
        : UIColor.blackColor()
  }
  self.view.layer.borderColor = Addon.buttonColor
}

export default {
  viewDidLoad,
  viewWillAppear
}
