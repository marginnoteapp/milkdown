/* Copyright 2021, Milkdown by Mirone. */

import { missingRootElement } from "@milkdown/exception"
import { calculateNodePosition } from "@milkdown/prose"
import { EditorView } from "@milkdown/prose/view"

import { CellSelection } from "../plugin"

export const calculatePosition = (view: EditorView, dom: HTMLElement) => {
  const { selection } = view.state as unknown as { selection: CellSelection }
  const isCol = selection.isColSelection()
  const isRow = selection.isRowSelection()

  calculateNodePosition(view, dom, (selected, target, parent) => {
    const $editor = dom.parentElement
    if (!$editor) {
      throw missingRootElement()
    }
    let left = isCol
      ? // 列
        selected.left - parent.left + (selected.width - target.width) / 2
      : // 行
        selected.left - parent.left - target.width / 2 - 8
    console.log(left, selected.left, parent.width, selected.width, target.width)
    if (left + target.width > parent.width) {
      left = selected.left - parent.left - (target.width - selected.width) + 30
    }
    // 180 252.328125 327.15625 0 140.34375 290
    // 20 120.6640625 221.828125 0 87.671875 290
    let top =
      selected.top -
      parent.top -
      target.height -
      (isCol ? 16 : 0) -
      16 +
      $editor.scrollTop
    if (left < 0) {
      left = 16
    }
    if (top < 0) {
      top = 29
    }
    return [top, left]
  })
}
