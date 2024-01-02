import { XLSX, downloadMatrix, ExcelJs } from '@/lib/lib_files'

import type { Workbook } from 'exceljs'

export const download1 = () => {
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

const downloadWorkbook = (workbook: Workbook) => {
  // download
  workbook.xlsx.writeBuffer().then((content) => {
    const a = document.createElement('a')
    const blobData = new Blob([content], {
      type: 'application/vnd.ms-excel;charset=utf-8;'
    })
    a.download = 'test.xlsx'
    a.href = URL.createObjectURL(blobData)
    a.click()
  })
}

export const excleDownload1 = () => {
  const workbook = new ExcelJs.Workbook()

  workbook.category = 'category'
  workbook.company = 'company'
  workbook.creator = 'creator'
  workbook.description = 'description'
  workbook.keywords = 'keywords'
  workbook.lastModifiedBy = 'lastModifiedBy'
  workbook.manager = 'manager'
  workbook.subject = 'subject'
  workbook.title = 'title'

  const worksheet = workbook.addWorksheet('test1-excel')

  worksheet.getRow(1).values = ['column1', 'column2', '', '', 'column5']
  worksheet.getRow(2).values = ['value1', 'value2', '', '', 'value5']
  worksheet.getRow(4).values = ['value6', 'value4', '', '', 'value8']

  worksheet.getCell('A4').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: {
      argb: 'd9ecff'
    }
  }

  worksheet.mergeCells('B3:B4')
  worksheet.mergeCells('A1:A2')

  downloadWorkbook(workbook)
}

export const excleDownload2 = () => {
  const workbook = new ExcelJs.Workbook()

  const worksheet = workbook.addWorksheet('test2-excel')

  worksheet.columns = [
    {
      key: 'column1',
      width: 15,
      style: {
        font: {
          color: { argb: '337ecc' },
          italic: true
        },
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'ecf5ff' }
        },
        border: {
          top: {
            style: 'thin',
            color: { argb: '303133' }
          },
          left: {
            style: 'thin',
            color: { argb: '303133' }
          },
          bottom: {
            style: 'thin',
            color: { argb: '303133' }
          },
          right: {
            style: 'thin',
            color: { argb: '303133' }
          }
        }
      }
    },
    {
      key: 'column2',
      width: 15,
      style: {
        font: {
          color: { argb: '529b2e' }
        },
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'f0f9eb' }
        },
        border: {
          top: {
            style: 'thin',
            color: { argb: '303133' }
          },
          left: {
            style: 'thin',
            color: { argb: '303133' }
          },
          bottom: {
            style: 'thin',
            color: { argb: '303133' }
          },
          right: {
            style: 'thin',
            color: { argb: '303133' }
          }
        }
      }
    },
    {
      key: 'column3',
      width: 15,
      style: {
        font: {
          color: { argb: 'b88230' }
        },
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'fdf6ec' }
        },
        border: {
          top: {
            style: 'thin',
            color: { argb: '303133' }
          },
          left: {
            style: 'thin',
            color: { argb: '303133' }
          },
          bottom: {
            style: 'thin',
            color: { argb: '303133' }
          },
          right: {
            style: 'thin',
            color: { argb: '303133' }
          }
        }
      }
    },
    {
      key: 'column4',
      width: 15,
      style: {
        font: {
          color: { argb: 'c45656' }
        },
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'fef0f0' }
        },
        border: {
          top: {
            style: 'thin',
            color: { argb: '303133' }
          },
          left: {
            style: 'thin',
            color: { argb: '303133' }
          },
          bottom: {
            style: 'thin',
            color: { argb: '303133' }
          },
          right: {
            style: 'thin',
            color: { argb: '303133' }
          }
        }
      }
    },
    {
      key: 'column5',
      width: 15,
      style: {
        font: {
          color: { argb: '73767a' }
        },
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'f4f4f5' }
        },
        border: {
          top: {
            style: 'thin',
            color: { argb: '303133' }
          },
          left: {
            style: 'thin',
            color: { argb: '303133' }
          },
          bottom: {
            style: 'thin',
            color: { argb: '303133' }
          },
          right: {
            style: 'thin',
            color: { argb: '303133' }
          }
        }
      }
    }
  ]

  worksheet.views = [
    { showGridLines: false },
    { state: 'frozen', xSplit: 0, ySplit: 1 }
  ]

  worksheet.addRows([
    {
      column1: 'value1-row1',
      column2: 'value2-row1',
      column3: 'value3-row1',
      column4: 'value4-row1',
      column5: 'value5-row1'
    },
    {
      column1: 'value1-row2',
      column2: 'value2-row2',
      column3: 'value3-row2',
      column4: 'value4-row2',
      column5: 'value5-row2'
    },
    {
      column1: 'value1-row3',
      column2: 'value2-row3',
      column3: 'value3-row3',
      column4: 'value4-row3',
      column5: 'value5-row3'
    }
  ])

  worksheet.mergeCells('A2:B3')

  downloadWorkbook(workbook)
}

export const excleDownload3 = () => {
  const workbook = new ExcelJs.Workbook()

  const sheet = workbook.addWorksheet('工作表範例1')

  sheet.addTable({
    name: 'table名稱',
    ref: 'B2',
    headerRow: true,
    totalsRow: false,
    columns: [
      { name: '名字', filterButton: false },
      { name: '年齡', filterButton: false },
      { name: '電話', filterButton: false },
      { name: '年資', filterButton: false, totalsRowFunction: 'sum' }
    ],
    style: {
      // theme: 'TableStyleDark3',
      showRowStripes: true
    },
    rows: [
      ['小明', 56, '0987654321', 22],
      ['小美', 23, '0912345678', 5],
      ['小智', 32, '0912345678', 10]
    ]
  })

  // sheet.mergeCells('C6:D6')

  downloadWorkbook(workbook)
}
