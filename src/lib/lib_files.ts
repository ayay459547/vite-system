// https://docs.sheetjs.com/docs/demos/frontend/bundler/vitejs
// import * as XLSX from 'xlsx/xlsx.mjs'
// import XLSX from 'xlsx'
import type {
  WorkSheet,
  WorkBook,
  SheetAOAOpts,
  WritingOptions,
  Range
} from 'xlsx'
import { writeFile, read, utils } from 'xlsx'
export { default as XLSX } from 'xlsx'

export type { Column as ExcelColumn } from 'exceljs'
export { default as ExcelJs } from 'exceljs'

import { isEmpty, tipLog, round, hasOwnProperty } from '@/lib/lib_utils'

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

type ExcelAoa = (string | number)[][]

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

/**
 * @author Caleb
 * @description 新建工作表
 * @param aoa 矩陣資料
 * @param options 設定
 * @returns 工作表
 */
export const createSheet = (aoa: ExcelAoa, options?: SheetAOAOpts) => {
  const workSheet = utils.aoa_to_sheet(aoa, {
    ...options
  })
  return workSheet
}

/**
 * @author Caleb
 * @description 工作表中新增資料
 * @param ws 工作表
 * @param aoa 矩陣資料
 * @param origin 新增資料位置 ex: A2
 * @param options 設定
 */
export const sheetAddAoa = (ws: WorkSheet, aoa: ExcelAoa, origin: string, options?: SheetAOAOpts) => {
  const regexp = /^[A-Z]+[0-9]+$/
  if (!regexp.test(origin)) {
    tipLog('參數格式錯事', [
      `${origin}`,
      'origin 範例 A1',
      '^[A-Z]+[0-9]+$'
    ])

  } else {
    utils.sheet_add_aoa(ws, aoa, {
      origin,
      ...options
    })
  }
}

/**
 * @author Caleb
 * @description 工作表中新增合併欄位資訊
 * @param ws 工作表
 * @param rangeList 合併區間列表
 */
export const setMerges = (ws: WorkSheet, rangeList: string[]) => {
  const regexp = /^[A-Z]+[0-9]+:[A-Z]+[0-9]+$/

  const merges = []
  rangeList.forEach(range => {
    if (!regexp.test(range)) {
      tipLog('參數格式錯事', [
        `${range}`,
        'range 範例 A1:A2',
        '^[A-Z]+[0-9]+:[A-Z]+[0-9]+$'
      ])

    } else {
      const merge = utils.decode_range(range)
      merges.push(merge)
    }
  })
  ws['!merges'] = merges
}

/**
 * @author Caleb
 * @description 新建工作簿
 * @param ws 工作表
 * @param wsname 分頁名稱
 * @returns 工作簿
 */
export const newWorkBook = (ws?: WorkSheet, wsname?: string) => {
  const workBook = utils.book_new(ws, wsname)
  return workBook
}

/**
 * @author Caleb
 * @description 新增工作表 到 工作簿中
 * @param wb 工作簿
 * @param ws 工作表
 * @param name 頁名稱
 */
export const bookAppendSheet = (wb: WorkBook, ws: WorkSheet, name: string) => {
  utils.book_append_sheet(wb, ws, `${name}`)
}

/**
 * @author Caleb
 * @description 下載 Excel
 * @param wb 工作簿
 * @param ws 工作表
 * @param options 設定
 */
export const downloadExcel = (wb: WorkBook, filename: string, options?: WritingOptions) => {
  console.log(options)
  writeFile(wb, filename, {
    ...options
  })
}
