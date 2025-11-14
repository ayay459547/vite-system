import type { ExcelColumn, WorkbookOptions } from '@/lib/lib_files'
import { createWorkbook } from '@/lib/lib_files'

import type {
  ColumnItem, // 欄位屬性
  // InputRefItem, // 輸入框
  SimpleTableSetting
} from '@/types/types_columnSetting'

import { hasOwnProperty } from '@/lib/lib_utils' // 工具
import { object_forEach } from '@/lib/lib_object'
import { getColumnData, checkColumns } from './columnsHookUtils'

/**
 * @author Caleb
 * @description 取的 Columns 設定 SimpleTable + TableV2 用的資料
 *              slot prop 預設是 key
 * @param {Ojbect} columns
 * @param {String} type 取得 columnSetting 中的類型
 * @param {String} title 設定用的參數
 * @returns {Ojbect}
 */
export const useSimpleTableSetting = (
  columns: Record<string, any>,
  type: string,
  title?: ''
): SimpleTableSetting => {
  const resColumns: any[] = []

  object_forEach(columns, (column: Record<string, any>, key: string) => {
    if (hasOwnProperty(column, type)) {
      const columnInfo = getColumnData(column, { type, key }, {})
      resColumns.push(columnInfo)
    }
  })

  // 依據表單 及傳入資料 下載 excel
  const downloadExcel = async (tableData: Record<string, any>[], options?: WorkbookOptions) => {
    const workbook = createWorkbook({ ...options })

    const worksheet = workbook.addWorksheet(title, {
      properties: {
        tabColor: { argb: 'FFFFFF' },
        defaultRowHeight: 20,
        showGridLines: true,
        outlineLevelCol: 0,
        outlineLevelRow: 0,
        dyDescent: 55
      }
    }) // 在檔案中新增工作表 參數放自訂名稱

    const excelColumns: Partial<ExcelColumn>[] = []

    resColumns.forEach((tempColumn: ColumnItem) => {
      let _columnWidth = 100
      // 設定欄位
      if (tempColumn.key && hasOwnProperty(columns, tempColumn.key)) {
        const _currentColumn = columns[tempColumn.key][type] ?? null

        if (_currentColumn) {
          const width = _currentColumn?.width ?? 0
          const minWidth = _currentColumn?.minWidth ?? 0
          _columnWidth = Math.max(_columnWidth, width, minWidth)

          const align = _currentColumn?.align ?? 'left'
          excelColumns.push({
            header: tempColumn.label,
            key: tempColumn.key,
            hidden: false,
            style: {
              alignment: {
                horizontal: align,
                vertical: 'middle'
              }
            },
            width: Math.round(_columnWidth / 10)
          })
        }
      }
    })
    worksheet.columns = excelColumns

    tableData.forEach((rowData: any) => {
      worksheet.addRow(rowData)
    })

    // 表格裡面的資料都填寫完成之後，訂出下載的callback function
    // 異步的等待他處理完之後，創建url與連結，觸發下載
    workbook.xlsx.writeBuffer().then(content => {
      const a = document.createElement('a')
      const blobData = new Blob([content], {
        type: 'application/vnd.ms-excel;charset=utf-8;'
      })
      a.download = `${title ?? ''}.xlsx`
      a.href = URL.createObjectURL(blobData)
      a.click()
    })
  }

  checkColumns(resColumns, columns, type)
  return {
    title: title ?? '',
    tableColumns: resColumns,
    downloadExcel
  }
}
