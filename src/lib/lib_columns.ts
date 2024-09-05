import type { Ref } from 'vue'
import { reactive, shallowReactive, ref, inject } from 'vue'

import type { UseHook } from '@/declare/hook'
import type { ExcelColumn, WorkbookOptions } from '@/lib/lib_files'
import { defaultModuleType } from '@/i18n/i18n_setting'
import { createWorkbook } from '@/lib/lib_files'

import type { TableCustom } from '@/components'
import type {
  InputRefItem,
  // FormColumnsItem,
  FormSetting,
  FormListSetting,
  Conditions,
  ColumnItem,
  SettingData,
  TableRef,
  TableOptions,
  TableSetting,
  // TableColumnsItem,
  SimpleTableSetting
  // SimpleTableColumnsItem
} from '@/declare/columnSetting'
import { getColumnSetting } from '@/lib/lib_idb'
import { systemLog, tipLog, getUuid, isEmpty, hasOwnProperty, message } from '@/lib/lib_utils'
import { object_forEach, object_filter, object_reduce } from '@/lib/lib_object'

/**
 * @author Caleb
 * @description 取得多欄輸入框用的參數
 *              使用 Columns 設定
 *              輸入框資料 預設是 key
 * @param {Ojbect} columns
 * @param {String} type 取得 columnSetting 中的類型
 * @returns {Ojbect}
 */
export const useFormSetting = <T>(columns: Record<string, any>, type: string): FormSetting<T> => {
  const resColumns = {}
  // 輸入框資料
  const resForms = reactive<Record<string, any>>({})
  // 搜尋: 是否啟用
  const resActiveForms = reactive<Record<string, boolean>>({})

  // 搜尋: 是否啟用 多條件
  const resActiveConditions = reactive<Record<string, boolean>>({})

  // 搜尋: 多條件
  const resConditions = reactive<Record<string, Conditions>>({})

  // ref
  const refMap = shallowReactive<Record<string, any>>({})

  const getColumnData = (
    column: Record<string, any>,
    type: string,
    key: string
  ): Record<string, any> => {
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
      i18nLabel: column?.i18nLabel ?? column?.label ?? key,
      // 條件搜尋
      isCondition: column?.isCondition ?? false,
      ...column[type]
    }
  }

  const defaultValue = {}
  object_forEach(columns, (column: Record<string, any>, key: string) => {
    if (hasOwnProperty(column, type)) {
      const temp = getColumnData(column, type, key)
      resColumns[key] = temp

      resForms[key] = temp.default

      resActiveForms[key] = true

      resActiveConditions[key] = false

      resConditions[key] = []

      defaultValue[key] = temp.default
    }
  })

  if (isEmpty(resColumns)) {
    systemLog(columns, 'table')
    tipLog('無欄位資料', ['檢查 columns.ts 中的 欄位的 key', `傳入 type 值 => ${type}`])
  }

  return {
    refMap,
    defaultValue: defaultValue as T,
    columns: resColumns,
    forms: resForms as T,
    activeForms: resActiveForms,
    activeConditions: resActiveConditions,
    conditions: resConditions,
    // 驗證不會 reset
    resetForms: (defaultValue?: Partial<T> | any) => {
      object_forEach(resForms, (value: any, key: string) => {
        resForms[key] = resColumns[key]?.default ?? null
        if (
          !isEmpty(defaultValue) &&
          hasOwnProperty(defaultValue, key) &&
          !isEmpty(defaultValue[key])
        ) {
          resForms[key] = defaultValue[key]
        }
      })
    },
    // 驗證也會 reset
    reset: (defaultValue?: Partial<T> | any) => {
      object_forEach(resForms, (value: any, key: string) => {
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
      return object_filter(resForms, (value: any, key: string) => {
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

      object_forEach(refMap, (input: InputRefItem) => {
        const { key, value, validate, getDom } = input
        // 只用有顯示的 input 才會被驗證
        const el = getDom()
        if (!isEmpty(el)) {
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

      await Promise.all(validateList)
        .then(resList => {
          resList.forEach((resItem, resIndex) => {
            const { errors, valid } = resItem
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
        })
        .catch(errors => {
          message({
            type: 'error',
            message: errors,
            duration: 10000
          })
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
      object_forEach(resForms, (value: any, key: string) => {
        if (typeof refMap[key]?.handleReset === 'function') {
          refMap[key].handleReset()
        }
      })
    },
    // 取得多條件搜尋的資訊
    getConditionFilter: () => {
      return object_reduce(resConditions, (res: Conditions, value: any, key: string) => {
        if (
          resActiveForms[key] && // 啟用搜尋
          resActiveConditions[key] && // 啟用多條件搜尋
          !isEmpty(value)
        ) {
          res.push(...value)
        }
        return res
      }, [])
    }
  }
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
export const useFormListSetting = <T>(
  columns: Record<string, any>,
  type: string,
  initData: Array<any> = []
): FormListSetting<T> => {
  const resColumns = {}
  const refMap = shallowReactive<Record<string, any>>({})
  const formList = ref<Array<T>>([])
  const _initData = initData.map(item => {
    return {
      ...item,
      key: getUuid()
    }
  })

  const getColumnData = (
    column: Record<string, any>,
    type: string,
    key: string
  ): Record<string, any> => {
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
      i18nLabel: column?.i18nLabel ?? column?.label ?? key,
      ...column[type]
    }
  }

  const defaultValue = {}
  object_forEach(columns, (column: Record<string, any>, key: string) => {
    if (hasOwnProperty(column, type)) {
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
      object_forEach(refMap, (input: InputRefItem, mapKey: string) => {
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

      await Promise.all(validateList)
        .then(resList => {
          resList.forEach((resItem, resIndex) => {
            const { errors, valid } = resItem
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
        })
        .catch(errors => {
          message({
            type: 'error',
            message: errors,
            duration: 10000
          })
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

/**
 * @author Caleb
 * @description 取的 Columns 設定 Table用的資料
 *              slot prop 預設是 key
 * @param {Ojbect} columns
 * @param {String} type 取得 columnSetting 中的類型
 * @param {Object} options 設定用的參數
 * @returns {Ojbect}
 */
export const useTableSetting = (
  columns: Record<string, any>,
  type: string,
  options: TableOptions
): TableSetting => {
  const {
    title,
    i18nTitle,
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
    isHiddenColumnSetting = false,
    tableSize = '',
    selection = false,
    i18nModule = defaultModuleType
  } = options

  // 設定 table 用的 column
  const getChildrenData = (columns: Record<string, any>, parentKey: string): Array<any> => {
    const resChildren = []

    object_forEach(columns, (child: Record<string, any>, childkey: string) => {
      const _isOperations = child?.isOperations ?? false
      resChildren.push({
        key: childkey,
        prop: childkey,
        slotKey: childkey,
        label: child?.label ?? '',
        i18nLabel: child?.i18nLabel ?? (child?.label ?? childkey),
        title: child?.label ?? '',
        minWidth: 150,
        // element ui 單排用
        sortable: !_isOperations,
        // 專案用 多排
        isSorting: !_isOperations ? (child?.isSorting ?? true) : false, // 是否顯示排序
        order: child?.isSorting ?? 'none', // ascending | descending | none
        //
        parentKey,
        ...child
      })
    })
    return resChildren
  }
  const getColumnData = (
    column: Record<string, any>,
    type: string,
    key: string
  ): Record<string, any> => {
    const _isOperations = column[type]?.isOperations ?? false

    return {
      key,
      prop: key,
      slotKey: key,
      isOperations: _isOperations,
      label: column?.label ?? '',
      i18nLabel: column?.i18nLabel ?? (column?.label ?? key),
      title: column?.label ?? '',
      isShow: column?.isShow ?? true,
      minWidth: 150,
      // element ui 單排用
      sortable: !_isOperations ? (column[type]?.sortable ?? false) : false,
      // 專案用 多排
      isSorting: !_isOperations ? (column[type]?.isSorting ?? true) : false, // 是否顯示排序
      // 專案用 多排 預設值
      order: column[type]?.order ?? 'none', // ascending | descending | none
      orderIndex: column[type]?.orderIndex ?? -1,
      columns: getChildrenData(column[type]?.children ?? {}, key),
      ...column[type]
    }
  }
  const resColumns = []
  object_forEach(columns, (column: Record<string, any>, key: string) => {
    if (hasOwnProperty(column, type)) {
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

  // excel header 翻譯
  const getI18nTranslate = () => {
    if (isHiddenExcel)
      return {
        i18nTranslate: (o: string) => {
          return o
        },
        i18nTest: (o: string) => {
          return o.length > 0
        }
      }

    const useHook: UseHook = inject('useHook')
    const { i18nTranslate, i18nTest } = useHook({ i18nModule })

    return {
      i18nTranslate,
      i18nTest
    }
  }

  const { i18nTranslate, i18nTest } = getI18nTranslate()

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
      },
      views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
    }) //在檔案中新增工作表 參數放自訂名稱

    const getRes: SettingData = await getColumnSetting(settingKey)
    const settingColumns = getRes.columns

    const excelColumns: Partial<ExcelColumn>[] = []

    settingColumns.forEach((tempColumn: ColumnItem) => {
      let _columnWidth = 100
      const {
        key: columnKey = '',
        label: columnLabel = '',
        i18nLabel: columnI18nLabel,
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
            header: i18nTest(columnI18nLabel ?? '') ? i18nTranslate(columnI18nLabel) : columnLabel,
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
    workbook.xlsx.writeBuffer().then(content => {
      const a = document.createElement('a')
      const blobData = new Blob([content], {
        type: 'application/vnd.ms-excel;charset=utf-8;'
      })

      // a.download = `${title}.xlsx`
      a.download = `${i18nTranslate(i18nTitle ?? title) ?? ''}.xlsx`
      a.href = URL.createObjectURL(blobData)
      a.click()
    })
  }

  const tableParams = shallowReactive<TableCustom.TableParams>({
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
      i18nTitle,
      version,
      settingKey,
      params: tableParams,
      page: tableParams.page,
      pageSize: tableParams.size,
      sort: tableParams.sort,
      isSorting,
      tableColumns: resColumns,
      tableSize,
      isHiddenExcel,
      isHiddenColumnSetting,
      selection,
      i18nModule
    },
    downloadExcel,
    resetScroll: (tableRef?: TableRef) => {
      if (tableRef) {
        return tableRef?.resetScroll()
      } else if (_tableRef.value !== null) {
        return _tableRef.value?.resetScroll()
      }
    },
    toggleSelection: (rows: Array<any>, tableRef?: TableRef) => {
      if (tableRef) {
        return tableRef?.toggleSelection(rows)
      } else if (_tableRef.value !== null) {
        return _tableRef.value?.toggleSelection(rows)
      }
    },
    getSelectionRows: (tableRef?: TableRef) => {
      if (tableRef) {
        return tableRef?.getSelectionRows()
      } else if (_tableRef.value !== null) {
        return _tableRef.value?.getSelectionRows()
      }
    },
    getParams: (tableRef?: TableRef): TableCustom.TableParams => {
      if (tableRef) {
        return tableRef?.getTableParams()
      } else if (_tableRef.value !== null) {
        return _tableRef.value?.getTableParams()
      } else {
        return {
          ...tableParams
        }
      }
    },
    setParams: (
      params: {
        page?: number
        size?: number
        sort?: TableCustom.Sort
      },
      tableRef?: TableRef
    ) => {
      if (tableRef) {
        tableRef?.setTableParams(params)
      } else if (_tableRef.value !== null) {
        _tableRef.value?.setTableParams(params)
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
        tableRef?.pageChange(page ?? defaultPage, pageSize ?? defaultSize)
      } else if (_tableRef.value !== null) {
        _tableRef.value?.pageChange(page ?? defaultPage, pageSize ?? defaultSize)
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
  // 設定 table 用的 column
  const getColumnData = (
    column: Record<string, any>,
    type: string,
    key: string
  ): Record<string, any> => {
    return {
      key,
      prop: key,
      slotKey: key,
      minWidth: 150,
      label: column?.label ?? '',
      i18nLabel: column?.i18nLabel ?? column?.label ?? key,
      title: column?.label ?? '',
      required: false,
      ...column[type]
    }
  }
  const resColumns = []
  object_forEach(columns, (column: Record<string, any>, key: string) => {
    if (hasOwnProperty(column, type)) {
      const temp = getColumnData(column, type, key)
      resColumns.push(temp)
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
    }) //在檔案中新增工作表 參數放自訂名稱

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
  return object_reduce(columns, (prev: Array<string>, curr: any, currKey: string) => {
    return [...prev, currKey]
  }, [])
}

/**
 * @author Caleb
 * @description 格式化 columns 設定
 * @param {Ojbect} columns
 * @param {String} type 取得 columnSetting 中的類型
 * @param {Function} callback 返回格式
 * @returns {Ojbect} 新的格式 columns
 */
export const formatColumns = (
  columns: Record<string, any>,
  type: string,
  callback: (column: Record<string, any>, key: string) => Record<string, any>
): Record<string, any> => {
  return object_reduce(columns, (res: Record<string, any>, column: Record<string, any>, key: string) => {
    res[key] = { ...column }
    const _column = res[key]

    if (hasOwnProperty(column, type)) {
      const newColumn = callback(column[type], key)

      _column[type] = newColumn ?? column[type]
    }

    return res
  }, {})
}
