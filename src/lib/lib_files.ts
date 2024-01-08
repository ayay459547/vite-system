// https://docs.sheetjs.com/docs/demos/frontend/bundler/vitejs
// import * as XLSX from 'xlsx/xlsx.mjs'
// import XLSX from 'xlsx'
import type { Range } from 'xlsx'
import { writeFile, read, utils } from 'xlsx'
export {
  default as XLSX,
  read,
  utils
} from 'xlsx'

import type { WorkbookProperties, CalculationProperties, Workbook } from 'exceljs'
import ExcelJs from 'exceljs'
export type { Column as ExcelColumn } from 'exceljs'
export { default as ExcelJs } from 'exceljs'

import { isEmpty, tipLog, round, hasOwnProperty } from '@/lib/lib_utils'

const systemType = (import.meta as any).env.VITE_API_SYSTEM_TYPE

/**
 * @author Caleb
 * @description 將bytes做轉換
 * @param {Number} bytes 檔案大小
 * @returns {String} format後的檔案大小
 */
export const byteConvert = (bytes: number): string => {
  if (isNaN(bytes)) return ''

  const symbols = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const exp = (() => {
    /**
     * 對數運算 (換底公式)
     * log 2 (bytes) = log 2 (bytes) / log 2 2
     */
    const _exp = Math.floor(Math.log(bytes) / Math.log(2))
    return round(_exp, 0)
  })()

  const i = Math.floor(exp / 10)
  const unit = symbols[i]

  const size = ((i) => {
    const _size = bytes / Math.pow(2, 10 * i)
    return round(_size, 2)
  })(i)

  return `${size}${unit}`
}

/**
 * @author Caleb
 * @description 讀取檔案類型
 * @param {File} file
 * @returns {String} 類型
 */
export const getFileType = (file: File): string => {
  const {
    name,
    type
    // size,
    // lastModified,
    // lastModifiedDate,
    // webkitRelativePath
  } = file

  if (type.startsWith('image/')) return 'image'

  const regexp = /\.\w*$/
  const fileType = name.match(regexp)[0] ?? ''

  switch (fileType.toLocaleLowerCase()) {
    case '.xlsx':
      return 'excel'
    case '.docx':
      return 'word'
    case '.pptx':
      return 'powerpoint'
    case '.zip':
    case '.7z':
      return 'zip'
    default:
      return fileType.substring(1)
  }
}

/**
 * @author Caleb
 * @description 讀取圖片檔
 * @param {File} file
 * @returns {String} 圖片網址
 */
export const readImage = async (file: File): Promise<string> => {
  const { name, type } = file

  if (!type.startsWith('image/')) {
    tipLog('上傳並非圖片檔', [type, name])
    return ''
  }

  // 確認圖片是否存在用的
  const img = document.createElement('img') as any
  img.style.display = 'none'
  document.body.appendChild(img)

  const reader = new FileReader()
  return new Promise((resolve) => {
    reader.onload = (event) => {
      const imgSrc = event.target.result as string
      img.setAttribute('src', imgSrc)
      resolve(imgSrc)

      setTimeout(() => {
        img.remove()
      }, 1000)
    }
    reader.readAsDataURL(file)
  })
}

/**
 * @author Caleb
 * @description 將Excel欄位轉數字
 *              A -> 1
 *              Z -> 26
 *              AA -> 27
 * @param {String} column
 * @returns {Number}
 */
export const excelColumnToNumber = (column: string): number => {
  const wordList = column.split('').reverse()

  return wordList.reduce((res, word, wordIndex) => {
    return res + (word.charCodeAt(0) - 64) * (26 ** wordIndex)
  }, 0)
}
/**
 * @author Caleb
 * @description 將數字轉Excel欄位
 *              1 -> A
 *              26 -> Z
 *              27 -> AA
 * @param {String} num
 * @returns {Number}
 */
export const numberToExcelColumn = (num: number): string => {
  const _num = num - 1
  const quotient = Math.floor(_num / 26)
  const remainder = _num % 26

  // 如果 商 <= 0
  if (quotient <= 0) {
    return String.fromCharCode(64 + remainder + 1)
  }
  return numberToExcelColumn(quotient) + String.fromCharCode(64 + remainder + 1)
}

/**
 * 原數據是以 key: value 的形式呈現
 * 轉換成矩陣的形式呈現
 */
const excelDataToMatrix = (excelData: any[]) => {
  const resExcelData = []
  if (!isEmpty(excelData)) {
    const oldKeyList = Object.keys(excelData[0])

    const firstRowData = oldKeyList.reduce((res, oldKey, keyIndex) => {
      const excleColumn = numberToExcelColumn(keyIndex + 1)
      res[keyIndex] = excleColumn
      return res
    }, [])
    resExcelData.push(firstRowData)
    resExcelData.push(oldKeyList)

    const newExcelData = excelData.map(rowData => {
      return Object.values(rowData)
    })
    resExcelData.push(...newExcelData)
  }
  return resExcelData
}
/**
 * 原數據以第一行作為 object 的 key
 * 將原數據 key 轉換成 A B C...
 **/
const excelDataToMap = (excelData: any[]) => {
  const resExcelData = []
  if (!isEmpty(excelData)) {
    const oldKeyList = Object.keys(excelData[0])

    const firstRowData = oldKeyList.reduce((res, oldKey, keyIndex) => {
      const excleColumn = numberToExcelColumn(keyIndex + 1)
      res[excleColumn] = oldKey
      return res
    }, {})
    resExcelData.push(firstRowData)

    const newExcelData = excelData.map(rowData => {
      const valueList = Object.values(rowData)

      return valueList.reduce((res, value, valueIndex) => {
        const excleColumn = numberToExcelColumn(valueIndex + 1)
        res[excleColumn] = value
        return res
      }, {})
    })
    resExcelData.push(...newExcelData)
  }
  return resExcelData
}
export const readExcel = async (file: File): Promise<any> => {
  const reader = new FileReader()
  return new Promise((resolve) => {
    reader.onload = (event) => {
      const result = event.target.result

      const workbook = read(result, { type: 'binary' })

      const excel = []
      for (const sheet in workbook.Sheets) {
        if (hasOwnProperty(workbook.Sheets, sheet)) {
          // 利用 sheet_to_json 方法將 excel 轉成 json 數據
          const excelData = utils.sheet_to_json(workbook.Sheets[sheet])

          excel.push({
            data: excelData,
            map: excelDataToMap(excelData),
            matrix: excelDataToMatrix(excelData)
          })
        }
      }
      resolve(excel[0] ?? [])
    }
    reader.readAsBinaryString(file)
  })
}

export type ExcelOptions = {
  name: string
  merge: Array<Range>
}
/**
 * @author Caleb
 * @description 依據資料下載 Excel
 * @param {Array} matrix 矩陣資料
 * @param {String} options 其他設定
 */
export const downloadMatrix = (matrix: Array<(string | number)[]>, options: ExcelOptions): void => {
  const aoa = matrix

  const { name = '', merge = [] } = options

  const workSheet = utils.aoa_to_sheet(aoa)
  if (!isEmpty(merge)) {
    workSheet['!merges'] = merge
  }

  /* create workbook and export */
  const workBook = utils.book_new()
  utils.book_append_sheet(workBook, workSheet, `${name}`)
  writeFile(workBook, `${name}.xlsx`)
}

export const regexp = /^[A-Z]+[0-9]+$/

export type WorkbookOptions = {
  title?: string
  category?: string
  company?: string
  creator?: string
  description?: string
  keywords?: string
  lastModifiedBy?: string
  manager?: string
  subject?: string

  created?: Date
	modified?: Date
	lastPrinted?: Date

  properties?: WorkbookProperties
  calcProperties?: CalculationProperties
}

// https://github.com/exceljs/exceljs/blob/master/README_zh.md
export const createWorkbook = (options?: WorkbookOptions) => {
  const  {
    title = systemType,
    category = systemType,
    description = systemType,
    keywords = systemType,
    company = '',
    subject = '',
    creator = '',
    lastModifiedBy = '',
    manager = '',

    modified = new Date(),
    created = new Date()
    // lastPrinted = new Date()
  } = options ?? {}

  const workbook = new ExcelJs.Workbook()

  workbook.title = title
  workbook.category = category
  workbook.description = description
  workbook.keywords = keywords
  workbook.company = company
  workbook.subject = subject
  workbook.creator = creator
  workbook.lastModifiedBy = lastModifiedBy
  workbook.manager = manager

  workbook.created = created
  workbook.modified = modified
  // workbook.lastPrinted = lastPrinted

  return workbook
}

export const downloadWorkbook = (workbook: Workbook, filename: string) => {
  // download
  workbook.xlsx.writeBuffer().then((content) => {
    const a = document.createElement('a')
    const blobData = new Blob([content], {
      type: 'application/vnd.ms-excel;charset=utf-8;'
    })
    a.download = `${filename}.xlsx`
    a.href = URL.createObjectURL(blobData)
    a.click()
  })
}

export const base64ToExcel = (fileName: string, base64Str: string) => {
  const raw = window.atob(base64Str)
  const len = raw.length
  const uInt8Array = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    uInt8Array[i] = raw.charCodeAt(i)
  }

  const a = document.createElement('a')
  const blob = new Blob([uInt8Array], {
    type: 'application/vnd.ms-excel'
  })

  a.style.display = 'none'
  a.href = URL.createObjectURL(blob)
  a.setAttribute('download', fileName)

  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
