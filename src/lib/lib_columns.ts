import type { ComponentPublicInstance, Ref } from 'vue'
import { reactive, shallowReactive, ref } from 'vue'

import type { ExcelColumn, WorkbookOptions } from '@/lib/lib_files'
import { createWorkbook } from '@/lib/lib_files'
import type { FormInputExpose, CustomTableExpose, TableParams, Sort, TableSize } from '@/components'
import type { ColumnItem, SettingData } from '@/declare/columnSetting'
import { getColumnSetting } from '@/lib/lib_idb'
import { systemLog, tipLog, getUuid, isEmpty, hasOwnProperty } from '@/lib/lib_utils'

import type { ValidateType } from './lib_validate'

export interface ColumnTypeSetting<T, K extends string> {
  [key: string]: {
    [keyType in K | 'label']: T | string
  }
}

export interface FormSetting<T> {
  refMap: Record<string, any>
  defaultValue: T
  columns: Record<string, any>
  forms: T
  activeForms: Record<string, boolean>
  reset: (defaultValue?: Partial<T> | any) => void
  getActiveForms: (isShowEmpty: boolean) => Partial<T>
  validate: () => Promise<Array<any>>
  handleReset: () => void
}

export interface InputRefItem extends Element, ComponentPublicInstance, FormInputExpose {}

export interface FormColumnsItem {
  ref?: (el: InputRefItem) => void
  key?: string
  validateKey?: string
  clearable?: boolean
  default?: any
  validate?: ValidateType[] | ValidateType
  required?: boolean
  resizable?: boolean
  showOverflowTooltip?: boolean
  label?: string
}
/**
 * @author Caleb
 * @description 取得多欄輸入框用的參數
 *              使用 Columns 設定
 *              輸入框資料 預設是 key
 * @param {Ojbect} columns
 * @param {String} type 取得 columnSetting 中的類型
 * @returns {Ojbect}
 */
export const getFormSetting = <T>(columns: Record<string, any>, type: string): FormSetting<T> => {
  const resColumns = {}
  const resForms = reactive<Record<string, any>>({})
  const resActiveForms = reactive<Record<string, boolean>>({})

  const refMap = shallowReactive<Record<string, any>>({})

  const getColumnData = (column: Record<string, any>, type: string, key: string): Record<string, any> => {
    return {
      ref: (el: InputRefItem) => {
        if (el) {
          refMap[key] = el
        }
      },
      key,
      slotKey: key,
      type: 'text',
      isValidate: true,
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
    if(hasOwnProperty(column, type)) {
      const temp = getColumnData(column, type, key)
      resColumns[key] = temp

      resForms[key] = temp.default
      resActiveForms[key] = true

      defaultValue[key] = temp.default
    }
  })

  if (isEmpty(resColumns)) {
    systemLog(columns, 'table')
    tipLog('無欄位資料', [
      '檢查 columns.ts 中的 欄位的 key',
      `傳入 type 值 => ${type}`
    ])
  }

  return {
    refMap,
    defaultValue: defaultValue as T,
    columns: resColumns,
    forms: resForms as T,
    activeForms: resActiveForms,
    reset: (defaultValue?: Partial<T> | any) => {
      resForms.$forEach((value: any, key: string) => {
        resForms[key] = resColumns[key]?.default ?? null
        if (
          !isEmpty(defaultValue) &&
          hasOwnProperty(defaultValue, key) &&
          !isEmpty(defaultValue[key])
        ) {
          resForms[key] = defaultValue[key]
        }

        resActiveForms[key] = true

        if (typeof refMap[key]?.handleReset === 'function') {
          refMap[key].handleReset()
        }
      })
    },
    getActiveForms: (isShowEmpty: boolean = false) => {
      return resForms.$filter((value: any, key: string) => {
        if (isShowEmpty) {
          return resActiveForms[key]
        }
        return resActiveForms[key] && !isEmpty(value)
      })
    },
    validate: async (): Promise<any[]> => {
      const validateList = []
      const validateInput = []

      const successList = []
      const errorList = []

      refMap.$forEach((input: InputRefItem) => {
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
    },
    handleReset: () => {
      resForms.$forEach((value: any, key: string) => {
        if (typeof refMap[key]?.handleReset === 'function') {
          refMap[key].handleReset()
        }
      })
    }
  }
}

export interface FormListSetting<T> {
  refMap: Record<string, any>
  defaultValue: T
  columns: Record<string, any>
  forms: Ref<Array<T>>
  reset: () => void
  validate: () => Promise<Array<any>>
  add: (value?: any) => void
  remove: (rowIndex: number) => void
  clear: () => void
}
/**
 * @author Caleb
 * @description 取得多欄多列輸入框用的參數
 *              使用 Columns 設定
 *              輸入框資料 預設是 key
 * @param {Ojbect} columns
 * @param {String} type 取得 columnSetting 中的類型
 * @param {Array} initData 初始化資料
 * @returns {Ojbect}
 */
export const getFormListSetting = <T>(columns: Record<string, any>, type: string, initData: Array<any> = []): FormListSetting<T> => {
  const resColumns = {}
  const refMap = shallowReactive<Record<string, any>>({})
  const formList = ref<Array<T>>([])
  const _initData = initData.map(item => {
    return {
      ...item,
      key: getUuid()
    }
  })

  const getColumnData = (column: Record<string, any>, type: string, key: string): Record<string, any> => {
    return {
      ref: (el: InputRefItem) => {
        if (el) {
          const validateKey = getUuid()
          refMap[validateKey] = el
          if (el.setvalidateKey) {
            el.setvalidateKey(validateKey)
          }
        }
      },
      key,
      type: 'text',
      isValidate: true,
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
    if(hasOwnProperty(column, type)) {
      const temp = getColumnData(column, type, key)
      resColumns[key] = temp

      defaultValue[key] = temp.default
    }
  })

  formList.value.push(..._initData)

  return {
    refMap,
    defaultValue: defaultValue as T,
    columns: resColumns as Record<string, any>,
    forms: formList as Ref<Array<T>>,
    reset: () => {
      formList.value.splice(0)
      formList.value.push(..._initData)
    },
    validate: async (): Promise<any[]> => {
      const validateList = []
      const validateInput = []

      const successList = []
      const errorList = []

      const checkRepeatSet = new Set()
      refMap.$forEach((input: InputRefItem, mapKey: string) => {
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

      return new Promise<any[]>((resolve, reject) => {
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
      formList.value.push(newData)
    },
    remove: (rowIndex: number) => {
      formList.value.splice(rowIndex, 1)
    },
    clear: () => {
      formList.value.splice(0)
    }
  }
}

export interface TableRef extends Element, ComponentPublicInstance, CustomTableExpose {}

export interface TableOptoins {
  title: string
  version: string
  settingKey: string
  page?: number
  size?: number
  sort?: {
    key: null | string,
    order: null | 'ascending' | 'descending'
  }
  isSorting?: boolean
  isHiddenExcel?: boolean
  tableSize?: TableSize
  showType?: string | 'custom' | 'auto'
}

export interface TableSetting {
  tableRef: TableRef,
  tableSetting: {
    ref: (el: TableRef) => void
    title: string
    version: string
    settingKey: string
    params: TableParams
    page?: number
    pageSize?: number
    // 單一欄位的 sortable (原版)
    // 暫時不用 先保留功能
    sort?: Sort
    // 多欄位用的 isSorting (爆改版)
    isSorting?: boolean
    tableColumns: any[]
    tableSize?: TableSize
    isHiddenExcel: boolean
    // 其他 table 的 props
  } & Record<string, any>,
  downloadExcel: (tableData: Record<string, any>[]) => void
  resetScroll: (tableRef?: TableRef) => void
  toggleSelection: (rows: any[], tableRef?: TableRef) => void
  getParams: (tableRef?: TableRef) => TableParams | null
  setParams: (params: TableParams, tableRef?: TableRef) => void
  changePage: (page?: number, pageSize?: number, tableRef?: TableRef) => void
}

export interface TableColumnsItem {
  key?: string
  prop?: string
  slotKey?: string
  label?: string
  width?: number
  minWidth?: number
  align?: 'left' | 'center' | 'right'
  fixed?: 'left' | 'right'
  isSorting?: boolean
  sortable?: boolean | 'custom'
  isOperations?: boolean
  title?: string
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
  options: TableOptoins
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
    },
    isSorting = false,
    isHiddenExcel = false,
    tableSize = ''
  } = options

  // 設定 table 用的 column
  const getChildrenData = (columns: Record<string, any>): Array<any> => {
    const resChildren = []

    columns.$forEach((child: Record<string, any>, childkey: string) => {
      const _isOperations = child?.isOperations ?? false
      resChildren.push({
        key: childkey,
        prop: childkey,
        slotKey: childkey,
        label: child?.label ?? '',
        title: child?.label ?? '',
        minWidth: 150,
        // element ui 單排用
        sortable: !_isOperations,
        // 專案用 多排
        isSorting: !_isOperations ? (child?.isSorting ?? true) : false, // 是否顯示排序
        order: child?.isSorting ?? 'none', // ascending | descending | none
        ...child
      })
    })
    return resChildren
  }
  const getColumnData = (column: Record<string, any>, type: string, key: string): Record<string, any> => {
    const _isOperations = column?.isOperations ?? false
    return {
      key,
      prop: key,
      slotKey: key,
      isOperations: _isOperations,
      label: column?.label ?? '',
      title: column?.label ?? '',
      minWidth: 150,
      // element ui 單排用
      sortable: !_isOperations ? (column?.sortable ?? false) : false,
      // 專案用 多排
      isSorting: !_isOperations ? (column?.isSorting ?? true) : false, // 是否顯示排序
      // 專案用 多排 預設值
      order: column?.order ?? 'none',   // ascending | descending | none
      columns: getChildrenData(column[type]?.children ?? {}),
      ...column[type]
    }
  }
  const resColumns = []
  columns.$forEach((column: Record<string, any>, key: string) => {
    if(hasOwnProperty(column, type)) {
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
  const downloadExcel = async (tableData: Record<string, any>[], options?: WorkbookOptions) => {
    const workbook = createWorkbook({ ...options })

    const worksheet = workbook.addWorksheet(
      title,
      {
        properties: {
          tabColor: { argb: 'FFFFFF' },
          defaultRowHeight: 20,
          showGridLines: true,
          outlineLevelCol: 0,
          outlineLevelRow: 0,
          dyDescent: 55
        },
        views: [
          { state: 'frozen', xSplit: 0, ySplit: 1 }
        ]
      }
    ) //在檔案中新增工作表 參數放自訂名稱

    const getRes: SettingData = await getColumnSetting(settingKey)
    const settingColumns = getRes.columns

    const excelColumns: Partial<ExcelColumn>[] = []

    settingColumns.forEach((tempColumn: ColumnItem) => {
      let _columnWidth = 100
      const {
        key: columnKey = '',
        label: columnLabel = '',
        isShow = false,
        isOperations = false
      } = tempColumn

      // 設定欄位
      if (hasOwnProperty(columns, columnKey) && !isOperations) {
        const _currentColumn = columns[columnKey][type] ?? null

        if (_currentColumn) {
          const width = _currentColumn?.width ?? 0
          const minWidth = _currentColumn?.minWidth ?? 0
          _columnWidth = Math.max(_columnWidth, width, minWidth)

          const align = _currentColumn?.align ?? 'left'
          excelColumns.push({
            header: columnLabel,
            key: columnKey,
            hidden: !isShow,
            style: {
              alignment: {
                horizontal: align,
                vertical: 'middle'
              }
            },
            width: Math.round(_columnWidth / 8)
          })
        }
      }
    })
    worksheet.columns = excelColumns

    // tableData.forEach((rowData: any) => {
    //   worksheet.addRow(rowData)
    // })
    worksheet.addRows(tableData)

    // 表格裡面的資料都填寫完成之後，訂出下載的callback function
    // 異步的等待他處理完之後，創建url與連結，觸發下載
    workbook.xlsx.writeBuffer().then((content) => {
      const a = document.createElement('a')
      const blobData = new Blob([content], {
        type: 'application/vnd.ms-excel;charset=utf-8;'
      })
      a.download = `${title ?? ''}.xlsx`
      a.href = URL.createObjectURL(blobData)
      a.click()
    })
  }

  const tableParams = shallowReactive<TableParams>({
    page,
    size,
    sort
  })

  const _tableRef = ref(null)

  return {
    tableRef: _tableRef,
    tableSetting: {
      ...options,
      ref: (el: TableRef) => {
        if (el) {
          _tableRef.value = el
        }
      },
      title,
      version,
      settingKey,
      params: tableParams,
      page: tableParams.page,
      pageSize: tableParams.size,
      sort: tableParams.sort,
      isSorting,
      tableColumns: resColumns,
      tableSize,
      isHiddenExcel
    },
    downloadExcel,
    resetScroll: (tableRef?: TableRef) => {
      if (tableRef) {
        return tableRef.resetScroll()
      } else if (_tableRef.value !== null) {
        return _tableRef.value.resetScroll()
      }
    },
    toggleSelection: (rows: Array<any>, tableRef?: TableRef) => {
      if (tableRef) {
        return tableRef.toggleSelection(rows)
      } else if (_tableRef.value !== null) {
        return _tableRef.value.toggleSelection(rows)
      }
    },
    getParams: (tableRef?: TableRef): TableParams => {
      if (tableRef) {
        return tableRef.getTableParams()
      } else if (_tableRef.value !== null) {
        return _tableRef.value.getTableParams()
      } else {
        return {
          ...tableParams
        }
      }
    },
    setParams: (params: {
      page?: number
      size?: number
      sort?: Sort
    }, tableRef?: TableRef) => {
      if (tableRef) {
        tableRef.setTableParams(params)
      } else if (_tableRef.value !== null) {
        _tableRef.value.setTableParams(params)
      } else {
        tipLog('無法設定 Table 參數', [
          '給 table 的 ref',
          '從 CustomTable 上找 ref 屬性',
          '如果沒有 自己給 ref="table"',
          'const talbe = ref(null)',
          '<CustomTable ref="table"></CustomTable>'
        ])
      }
    },
    changePage: (page?: number, pageSize?: number, tableRef?: TableRef): void => {
      const { page: defaultPage, size: defaultSize } = tableParams

      if (tableRef) {
        tableRef.pageChange(page ?? defaultPage, pageSize ?? defaultSize)
      } else if (_tableRef.value !== null) {
        _tableRef.value.pageChange(page ?? defaultPage, pageSize ?? defaultSize)
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
  tableColumns: any[],
  downloadExcel: (tableData: Record<string, any>[]) => void
}
export interface SimpleTableColumnsItem {
  key: string
  prop: string
  slotKey: string
  width?: number
  minWidth?: number
  label: string
  title: string
}
/**
 * @author Caleb
 * @description 取的 Columns 設定 SimpleTable + TableV2 用的資料
 *              slot prop 預設是 key
 * @param {Ojbect} columns
 * @param {String} type 取得 columnSetting 中的類型
 * @param {String} title 設定用的參數
 * @returns {Ojbect}
 */
export const getSimpleTableSetting = (
  columns: Record<string, any>,
  type: string,
  title?: ''
): SimpleTableSetting => {

  // 設定 table 用的 column
  const getColumnData = (column: Record<string, any>, type: string, key: string): Record<string, any> => {
    return {
      key,
      prop: key,
      slotKey: key,
      minWidth: 150,
      label: column?.label ?? '',
      title: column?.label ?? '',
      ...column[type]
    }
  }
  const resColumns = []
  columns.$forEach((column: Record<string, any>, key: string) => {
    if(hasOwnProperty(column, type)) {
      const temp = getColumnData(column, type, key)
      resColumns.push(temp)
    }
  })

  // 依據表單 及傳入資料 下載 excel
  const downloadExcel = async (tableData: Record<string, any>[], options?: WorkbookOptions) => {
    const workbook = createWorkbook({ ...options })

    const worksheet = workbook.addWorksheet(
      title,
      {
        properties: {
          tabColor: { argb: 'FFFFFF' },
          defaultRowHeight: 20,
          showGridLines: true,
          outlineLevelCol: 0,
          outlineLevelRow: 0,
          dyDescent: 55
        }
      }
    ) //在檔案中新增工作表 參數放自訂名稱

    const excelColumns: Partial<ExcelColumn>[] = []

    resColumns.forEach((tempColumn: ColumnItem) => {
      let _columnWidth = 100
      // 設定欄位
      if (hasOwnProperty(columns, tempColumn.key)) {
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
      const a = document.createElement('a')
      const blobData = new Blob([content], {
        type: 'application/vnd.ms-excel;charset=utf-8;'
      })
      a.download = `${title ?? ''}.xlsx`
      a.href = URL.createObjectURL(blobData)
      a.click()
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
