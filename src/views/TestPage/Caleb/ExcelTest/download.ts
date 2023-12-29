import {
  XLSX,
  downloadMatrix,
  createSheet,
  sheetAddAoa,
  setMerges,
  newWorkBook,
  bookAppendSheet,
  downloadExcel
  // ExcelJs
} from '@/lib/lib_files'
import { deepClone } from '@/lib/lib_utils'

export const download1 = () => {
  console.log('download1')

  const ws = XLSX.utils.aoa_to_sheet([[]])

  /* First row */
  XLSX.utils.sheet_add_aoa(ws, ['SheetJS'.split('')], { origin: 'A1' })

  /* Write data starting at A2 */
  XLSX.utils.sheet_add_aoa(
    ws,
    [
      [1, 2],
      [2, 3],
      [3, 4]
    ],
    { origin: 'A2' }
  )

  /* Write data starting at E2 */
  XLSX.utils.sheet_add_aoa(
    ws,
    [
      [5, 6, 7],
      [6, 7, 8],
      [7, 8, 9]
    ],
    { origin: { r: 1, c: 4 } }
  )

  /* Append row */
  XLSX.utils.sheet_add_aoa(ws, [[4, 5, 6, 7, 8, 9, 0]], { origin: -1 })

  /* create workbook and export */
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
  XLSX.writeFile(wb, 'SheetJSAddAOA.xlsx')
}

export const download2 = () => {
  console.log('download2')

  const matrix = [
    ['key1', 'key2', 'key3', 'key4'],
    [11, 22, 33, 44],
    [19, 22, 35, 47]
  ]

  downloadMatrix(matrix, {
    name: '簡易下載',
    merge: []
  })
}

export const excleDownload1 = () => {
  const wordSheet = createSheet([
    ['A1', 'B1', 'C2', 'D1', 'E1'],
    ['A2', 'B2', 'C2', 'D2', 'E2'],
    ['A3', 'B3', 'C3', 'D3', 'E3'],
    ['A4', 'B4', 'C4', 'D4', 'E4'],
    ['A5', 'B5', 'C5', 'D5', 'E5'],
    ['A6', 'B6', 'C6', 'D6', 'E6']
  ])

  wordSheet['!cols'] = [
    { hidden: false, wpx: 120 },
    { hidden: false, wpx: 120 },
    { hidden: true, wpx: 120 },
    { hidden: false, wpx: 120 },
    { hidden: false, wpx: 120 }
  ]

  // style 無法使用 要付費版版
  wordSheet['A1'] = {
    t: 's',
    v: 'A11111',
    s: {
      fill: {
        fgColor: { rgb: '337ECC' }
      },
      font: {
        color: { rgb: 'D9ECFF' },
        blod: true,
        italic: true,
        vertAlign: true
      }
    }
  }
  console.log(wordSheet)

  setMerges(wordSheet, ['A3:C3', 'B5:C6'])
  const workBook = newWorkBook(wordSheet, '分頁1')

  const wordSheet2 = deepClone({}, wordSheet)

  sheetAddAoa(
    wordSheet2,
    [
      ['更新資料1', '更新資料2', '更新資料3'],
      ['更新資料4', '更新資料5', '更新資料6']
    ],
    'D3'
  )
  bookAppendSheet(workBook, wordSheet2, '分頁2')

  downloadExcel(workBook, '下載1.xlsx', {
    cellStyles: true
  })
}

export const excleDownload2 = () => {
  console.log('下載2')
}
