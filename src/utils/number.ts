import { reverseEscape } from "./input"

// 序号 https://www.qqxiuzi.cn/wz/zixun/1704.htm
export const SerialCode = {
  hollow_circle_number:
    "①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳㉑㉒㉓㉔㉕㉖㉗㉘㉙㉚㉛㉜㉝㉞㉟㊱㊲㊳㊴㊵㊶㊷㊸㊹㊺㊻㊼㊽㊾㊿",
  solid_circle_number: "❶❷❸❹❺❻❼❽❾❿⓫⓬⓭⓮⓯⓰⓱⓲⓳⓴",
  capital_letter: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase_letter: "abcdefghijklmnopqrstuvwxyz",
  chinese_capital_number: "壹贰叁肆伍陆柒捌玖拾",
  chinese_number: "一二三四五六七八九十",
  greek_capital_number: "ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ",
  greek_number: "ⅰⅱⅲⅳⅴⅵⅶⅷⅸⅹ"
}

export const genCharArray = (char: string, len: number, step = 1): string[] => {
  const serialCode = Object.values(SerialCode).filter(k => k.includes(char))[0]
  if (!serialCode) throw ""
  const charArr = []
  const startIndex = serialCode.search(char)
  for (
    let i = startIndex, end = startIndex + len * step - 1;
    i <= end;
    i = i + step
  ) {
    charArr.push(serialCode[i % serialCode.length])
  }
  return charArr
}

export const genNumArr = (num: number, len: number, step = 1, digit = 0) => {
  const numArr = []
  for (let i = num, end = num + len * step - 1; i <= end; i = i + step) {
    numArr.push(String(i).padStart(digit, "0"))
  }
  return numArr
}

export function getSerialInfo(newSubStr: string, length: number, symbol = "%") {
  // string[] len>2 , [string, number], [string] 三种情况
  const serialArr = reverseEscape(
    newSubStr
      .replace(new RegExp(`^.*${symbol}(\\[.+\\]).*$`), "$1")
      .replace(/'/g, '"')
  ) as any[]
  const len = serialArr.length
  if (len == 0 || typeof serialArr[0] !== "string")
    throw "数组内必须有元素，并且第一个元素必须是字符"
  if (len == 1 || (len == 2 && typeof serialArr[1] == "number")) {
    const step = len == 1 ? 1 : (serialArr[1] as number)
    const startValue = serialArr[0]
    // 如果是数字
    if (/^[0-9]+$/.test(startValue))
      return genNumArr(Number(startValue), length, step, startValue.length)
    // 如果是其他字符，一个字节
    else if (startValue.length === 1)
      return genCharArray(startValue, length, step)
    else throw "必须输入数字和单个字符"
  } // 自定义替换字符，数组元素长度大于 1，如果长度为 2，则第二个为字符串
  else if (len > 1 && serialArr.every(k => typeof k == "string"))
    return serialArr as string[]
  else throw "不符合输入格式要求"
}

export function getSerialByIndex(startValue: string, index: number) {
  if (/^[0-9]+$/.test(startValue))
    return String(Number(startValue) + index).padStart(startValue.length, "0")
  const serialCode = Object.values(SerialCode).filter(k =>
    k.includes(startValue)
  )[0]
  if (!serialCode) throw ""
  const len = serialCode.length
  const startIndex = serialCode.search(startValue)
  return serialCode[(startIndex + index) % len]
}
