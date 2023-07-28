import type { ComponentPublicInstance } from 'vue'
import type { FormInputExpose, CustomTableExpose, TableParams } from '@/components'
import type { ValidateType } from './lib_validate'
import { reactive } from 'vue'

import type { Column as ExcelColumn} from 'exceljs'
import type { ColumnItem, SettingData } from '@/declare/columnSetting'
import ExcelJs from 'exceljs'
import { getColumnSetting } from '@/lib/lib_idb'
import { tipLog, getUuid } from '@/lib/lib_utils'

export interface FormSetting<T> {
  defaultValue: T
  columns: Record<string, any>
  forms: T
  reset: () => void
  validate: () => Promise<Array<any>>
}

export interface IinputRefItem extends Element, ComponentPublicInstance, FormInputExpose {}
export interface FormColumnsItem {
  ref: (el: IinputRefItem) => void
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
export const getFormSetting = <T>(columns: Record<string, any>, type: string): FormSetting<T> => {
  const resColumns = {}
  const formMap = reactive<Record<string, any>>({})
  const refMap = reactive<Record<string, any>>({})

  const hasOwnProperty = Object.prototype.hasOwnProperty

  const getColumnData = (column: Record<string, any>, type: string, key: string): Record<string, any> => {
    return {
      ref: (el: IinputRefItem) => {
        if (el) {
          refMap[key] = el
        }
      },
      key,
      validateKey: key,
      clearable: true,
      default: null,
      validate: [],
      required: false,
      resizable: true,
      showOverflowTooltip: false,
      label: column?.label ?? '',
      ...column[type]
    }
  }

  const defaultValue = {}
  columns.$forEach((column: Record<string, any>, key: string) => {
    if(hasOwnProperty.call(column, type)) {
      const temp = getColumnData(column, type, key)
      resColumns[key] = temp

      formMap[key] = temp.default
      defaultValue[key] = temp.default
    }
  })

  return {
    defaultValue: defaultValue as T,
    columns: resColumns,
    forms: formMap as T,
    reset: () => {
      formMap.$forEach((value: any, key: string) => {
        formMap[key] = resColumns[key]?.default ?? null

        if (typeof refMap[key]?.handleReset === 'function') {
          refMap[key].handleReset()
        }
      })
    },
    validate: async () => {
      const validateList = []
      const validateInput = []

      const successList = []
      const errorList = []

      refMap.$forEach((input: IinputRefItem) => {
        const { key, value, validate, getDom } = input

        validateList.push(validate())
        validateInput.push({
          key,
          value,
          input,
          el: getDom(),
          getDom
        })
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

export interface FormListSetting<T> {
  defaultValue: T
  columns: Record<string, any>
  forms: Array<T>
  reset: () => void
  validate: () => Promise<Array<any>>
  add: () => void
  remove: () => void
}
export const getFormListSetting = <T>(columns: Record<string, any>, type: string, initData: Array<any> = []) => {
  const resColumns = {}
  const refMap = reactive<Record<string, any>>({})
  const formList = reactive<Array<T>>([])

  const hasOwnProperty = Object.prototype.hasOwnProperty

  const getColumnData = (column: Record<string, any>, type: string, key: string): Record<string, any> => {
    return {
      ref: (el: IinputRefItem) => {
        if (el) {
          const validateKey = getUuid()
          refMap[validateKey] = el
          if (el.setvalidateKey) {
            el.setvalidateKey(validateKey)
          }
        }
      },
      key,
      validateKey: key,
      clearable: true,
      default: null,
      validate: [],
      required: false,
      resizable: true,
      showOverflowTooltip: false,
      label: column?.label ?? '',
      ...column[type]
    }
  }

  const defaultValue = {}
  columns.$forEach((column: Record<string, any>, key: string) => {
    if(hasOwnProperty.call(column, type)) {
      const temp = getColumnData(column, type, key)
      resColumns[key] = temp

      defaultValue[key] = temp.default
    }
  })

  formList.push(...initData)

  return {
    defaultValue: defaultValue as T,
    columns: resColumns as Record<string, any>,
    forms: formList as Array<T>,
    reset: () => {
      formList.splice(0)
      formList.push(...initData)
    },
    validate: async () => {
      const validateList = []
      const validateInput = []

      const successList = []
      const errorList = []

      const checkRepeatSet = new Set()
      refMap.$forEach((input: IinputRefItem, mapKey: string) => {
        const { key, value, validate, getDom } = input
        const el = getDom()
        if (checkRepeatSet.has(el) || el === null) {
          delete refMap[mapKey]
        } else {
          checkRepeatSet.add(el)

          validateList.push(validate())
          validateInput.push({
            key,
            value,
            input,
            el,
            getDom
          })
        }
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
    },
    add: (value?: any) => {
      const newData = {
        ...defaultValue,
        ...value,
        key: getUuid()
      } as any
      formList.push(newData)
    },
    remove: (rowIndex: number) => {
      formList.splice(rowIndex, 1)
    }
  }
}

export interface TableRef extends Element, ComponentPublicInstance, CustomTableExpose {}

export interface TableSetting {
  tableSetting: {
    title: string
    version: string
    settingKey: string
    params: TableParams
    tableColumns: Record<string, any>
  },
  downloadExcel: (tableData: Record<string, any>[]) => void
  getParams: (tableRef: TableRef) => TableParams
  changePage: (tableRef: TableRef) => void
}
export interface TableColumnsItem {
  key: string
  prop: string
  slotKey: string
  sortable: boolean | 'custom'
  isOperations: boolean
  label: string
}
/**
 * @author Caleb
 * @description 取的 Columns 設定 Table用的資料
 *              slot prop 預設是 key
 * @param {Ojbect} columns
 * @param {String} type 取得 columnSetting 中的類型
 * @param {Object} options 設定用的參數
 * @returns {Ojbect}
 */
export const getTableSetting = (
  columns: Record<string, any>,
  type: string,
  options: {
    title: string
    version: string
    settingKey: string
    page?: number
    size?: number
    sort?: {
      key: null | string,
      order: null | 'ascending' | 'descending'
    }
  }
): TableSetting => {
  const {
    title,
    version,
    settingKey,
    page = 1,
    size = 100,
    sort = {
      key: null,
      order: null
    }
  } = options

  // 設定 table 用的 column
  const hasOwnProperty = Object.prototype.hasOwnProperty
  const getChildrenData = (columns: Record<string, any>): Array<any> => {
    const resChildren = []

    columns.$forEach((child: Record<string, any>, childkey: string) => {
      resChildren.push({
        key: childkey,
        prop: childkey,
        slotKey: childkey,
        label: child?.label ?? '',
        sortable: child?.isOperations ? false : 'custom',
        ...child
      })
    })
    return resChildren
  }
  const getColumnData = (column: Record<string, any>, type: string, key: string): Record<string, any> => {
    return {
      key,
      prop: key,
      slotKey: key,
      sortable: column[type]?.isOperations ? false : 'custom',
      isOperations: false,
      label: column?.label ?? '',
      columns: getChildrenData(column[type]?.children ?? {}),
      ...column[type]
    }
  }
  const resColumns = []
  columns.$forEach((column: Record<string, any>, key: string) => {
    if(hasOwnProperty.call(column, type)) {
      const temp = getColumnData(column, type, key)
      if (temp.children ?? false) {
        delete temp.children
      }
      if (temp.columns.length > 0) {
        delete temp.prop
      }
      resColumns.push(temp)
    }
  })

  // 依據表單 及傳入資料 下載 excel
  const downloadExcel = async (tableData: Record<string, any>[]) => {
    const workbook = new ExcelJs.Workbook() // 創建試算表檔案
    const worksheet = workbook.addWorksheet(
      title,
      {
        properties: {
          tabColor: { argb: '3D8BFF' },
          defaultRowHeight: 20
        }
      }
    ) //在檔案中新增工作表 參數放自訂名稱

    const getRes: SettingData = await getColumnSetting(settingKey)
    const settingColumns = getRes.columns

    const excelColumns: Partial<ExcelColumn>[] = []

    settingColumns.forEach((tempColumn: ColumnItem) => {
      let _columnWidth = 100
      // 設定欄位
      if (hasOwnProperty.call(columns, tempColumn.key)) {
        const _currentColumn = columns[tempColumn.key][type] ?? null

        if (_currentColumn) {
          const width = _currentColumn?.width ?? 0
          const minWidth = _currentColumn?.minWidth ?? 0
          _columnWidth = Math.max(_columnWidth, width, minWidth)

          const align = _currentColumn?.align ?? 'left'
          excelColumns.push({
            header: tempColumn.label,
            key: tempColumn.key,
            hidden: !tempColumn.isShow || tempColumn.isOperations,
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

  const tableParams = reactive<TableParams>({
    page,
    size,
    sort
  })
  return {
    tableSetting: {
      title,
      version,
      settingKey,
      params: tableParams,
      tableColumns: resColumns
    },
    downloadExcel,
    getParams: (tableRef: TableRef): TableParams => {
      if (tableRef) {
        return tableRef.getTableParams()
      } else {
        return {
          ...tableParams
        }
      }
    },
    changePage: (tableRef: TableRef): void => {
      const { page, size } = tableParams
      if (tableRef) {
        tableRef.pageChange(page, size)
      } else {
        tipLog('無法換頁', [
          '給 table 的 ref',
          '從 CustomTable 上找 ref 屬性',
          '如果沒有 自己給 ref="table"',
          'const talbe = ref(null)',
          '<CustomTable ref="table"></CustomTable>'
        ])
      }
    }
  }
}

export interface SimpleTableSetting {
  title: string
  tableColumns: Record<string, any>,
  downloadExcel: (tableData: Record<string, any>[]) => void
}
export interface SimpleTableColumnsItem {
  key: string
  prop: string
  slotKey: string
  sortable: boolean | 'custom'
  label: string
}
/**
 * @author Caleb
 * @description 取的 Columns 設定 SimpleTable用的資料
 *              slot prop 預設是 key
 * @param {Ojbect} columns
 * @param {String} type 取得 columnSetting 中的類型
 * @param {Object} options 設定用的參數
 * @returns {Ojbect}
 */
export const getSimpleTableSetting = (
  columns: Record<string, any>,
  type: string,
  title?: ''
): SimpleTableSetting => {

  // 設定 table 用的 column
  const hasOwnProperty = Object.prototype.hasOwnProperty
  const getColumnData = (column: Record<string, any>, type: string, key: string): Record<string, any> => {
    return {
      key,
      prop: key,
      slotKey: key,
      sortable: 'custom',
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

  // 依據表單 及傳入資料 下載 excel
  const downloadExcel = async (tableData: Record<string, any>[]) => {
    const workbook = new ExcelJs.Workbook() // 創建試算表檔案
    const worksheet = workbook.addWorksheet(
      title,
      {
        properties: {
          tabColor: { argb: '3D8BFF' },
          defaultRowHeight: 20
        }
      }
    ) //在檔案中新增工作表 參數放自訂名稱

    const excelColumns: Partial<ExcelColumn>[] = []

    resColumns.forEach((tempColumn: ColumnItem) => {
      let _columnWidth = 100
      // 設定欄位
      if (hasOwnProperty.call(columns, tempColumn.key)) {
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
  return {
    title,
    tableColumns: resColumns,
    downloadExcel
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
