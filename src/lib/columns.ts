import type { ComponentPublicInstance } from 'vue'
import type { Expose } from '@/declare/formInput'
import type { ValidateType } from './validate'
import { reactive } from 'vue'

import ExcelJs from 'exceljs'
import { getColumnSetting } from '@/lib/idb'
import type { ColumnItem, SettingData } from '@/components/feature/table/ColumnSetting.vue'

export interface FormColumns {
  columns: Record<string, any>
  forms: Record<string, any>
  reset: () => void
  validate: () => Promise<Array<any>>
}

export interface RefItem extends Element, ComponentPublicInstance, Expose {}
export interface FormColumnsItem {
  ref: (el: RefItem) => void
  key: string
  validateKey: string
  clearable: boolean
  default: any
  validate: ValidateType[] | ValidateType
  required: boolean
  resizable: boolean
  showOverflowTooltip: boolean
  label: string
}
/**
 * @author Caleb
 * @description 使用 Columns 設定
 *              輸入框資料 預設是 key
 * @param {Ojbect} columns
 * @param {String} type 取得 columnSetting 中的類型
 * @returns {Ojbect}
 */
export const getFormColumns = (columns: Record<string, any>, type: string): FormColumns => {
  const resColumns = {}
  const formMap = reactive<Record<string, any>>({})
  const refMap = reactive<Record<string, any>>({})

  const hasOwnProperty = Object.prototype.hasOwnProperty

  const getColumnData = (column: Record<string, any>, type: string, key: string): Record<string, any> => {
    return {
      ref: (el: RefItem) => {
        if (el) {
          refMap[key] = el
        }
      },
      key,
      validateKey: key,
      clearable: true,
      default: '',
      validate: [],
      required: false,
      resizable: true,
      showOverflowTooltip: false,
      label: column?.label ?? '',
      ...column[type]
    }
  }

  columns.$forEach((column: Record<string, any>, key: string) => {
    if(hasOwnProperty.call(column, type)) {
      const temp = getColumnData(column, type, key)
      resColumns[key] = temp

      formMap[key] = temp.default
    }
  })

  return {
    columns: resColumns,
    forms: formMap,
    reset: () => {
      formMap.$forEach((value: any, key: string) => {
        formMap[key] = resColumns[key].default
        refMap[key].handleReset()
      })
    },
    validate: async () => {
      const validateList = []
      const validateInput = []

      const successList = []
      const errorList = []

      refMap.$forEach((input: RefItem) => {
        const { key, value, validate } = input
        validateList.push(validate())
        validateInput.push({ key, value })
      })

      await Promise.all(validateList).then(resList => {
        resList.forEach((resItme, resIndex) => {
          const { errors, valid } = resItme
          const validateRes = {
            ...validateInput[resIndex],
              errors,
              valid
          }

          if (valid) {
            successList.push(validateRes)
          } else {
            errorList.push(validateRes)
          }
        })
      }).catch(errors => {
        throw new Error(errors)
      })

      return new Promise((resolve, reject) => {
        if (errorList.length > 0) {
          reject(errorList)
        } else {
          resolve(successList)
        }
      })
    }
  }

}

export interface TableColumns {
  columns: Record<string, any>,
  downloadExcel: (
    columnCallback: (column: ColumnItem) => string,
    rowCallback: (rowData: any, settingColumns: ColumnItem[]) => string[],
    options: {
      label: string,
      settingKey: string,
      tableData: Array<any>
    }
  ) => void
}
export interface TableColumnsItem {
  key: string
  prop: string
  slot: boolean
  sortable: boolean
  label: string
}
/**
 * @author Caleb
 * @description 取的 Columns 設定 Table用的資料
 *              slot prop 預設是 key
 * @param {Ojbect} columns
 * @param {String} type 取得 columnSetting 中的類型
 * @returns {Ojbect}
 */
export const getTableColumns = (columns: Record<string, any>, type: string): TableColumns => {
  const hasOwnProperty = Object.prototype.hasOwnProperty

  const getColumnData = (column: Record<string, any>, type: string, key: string): Record<string, any> => {
    return {
      key,
      prop: key,
      slot: key,
      sortable: false,
      label: column?.label ?? '',
      ...column[type]
    }
  }

  const resColumns = []

  columns.$forEach((column: Record<string, any>, key: string) => {
    if(hasOwnProperty.call(column, type)) {
      const temp = getColumnData(column, type, key)
      resColumns.push(temp)
    }
  })

  return {
    columns: resColumns,
    downloadExcel: async (columnCallback, rowCallback, options = {
      label: 'excel',
      settingKey: '',
      tableData: []
    }) => {
      const { tableData, label, settingKey } = options
      const workbook = new ExcelJs.Workbook() // 創建試算表檔案
      const sheet = workbook.addWorksheet(label) //在檔案中新增工作表 參數放自訂名稱

      const getRes: SettingData = await getColumnSetting(settingKey)
      const settingColumns = getRes.columns

      const excelColumns: { name: string }[] = []
      settingColumns.forEach((tempColumn: ColumnItem) => {
        const _excelColumn = columnCallback(tempColumn)
        excelColumns.push({ name: _excelColumn })
      })

      const excelRows: Array<string[]> = []
      tableData.forEach((data: any) => {
        const _excelRow = rowCallback(data, settingColumns)
        excelRows.push(_excelRow)
      })

      sheet.addTable({
        // 表格內看不到的，讓你之後想要針對這個table去做額外設定的時候，可以指定到這個table
        name: settingKey,
        ref: 'A1',
        columns: excelColumns,
        rows: excelRows
      })

      // 表格裡面的資料都填寫完成之後，訂出下載的callback function
      // 異步的等待他處理完之後，創建url與連結，觸發下載
      workbook.xlsx.writeBuffer().then((content) => {
        const link = document.createElement('a')
        const blobData = new Blob([content], {
          type: 'application/vnd.ms-excel;charset=utf-8;'
        })
        link.download = '測試的試算表.xlsx'
        link.href = URL.createObjectURL(blobData)
        link.click()
      })
    }
  }
}

/**
 * @author Caleb
 * @description 取的 Columns 所有key
 * @param {Ojbect} columns
 * @returns {Array}
 */
export const getColumnsKey = (columns: Record<string, any>): Array<string> => {
  return columns.$reduce((prev: Array<string>, curr: any, currKey: string) => {
      return [...prev, currKey]
  }, [])
}
