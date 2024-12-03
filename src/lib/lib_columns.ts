import type { Ref } from 'vue'
import { reactive, shallowReactive, ref, inject } from 'vue'

import type { UseHook } from '@/declare/hook' // 全域功能類型
import type { ExcelColumn, WorkbookOptions } from '@/lib/lib_files'
import { defaultModuleType } from '@/i18n/i18n_setting'
import { createWorkbook } from '@/lib/lib_files'

import type { CustomTableTypes } from '@/components' // 系統組件
import type {
  ColumnItem, // 欄位屬性
  InputRefItem, // 輸入框
  // useFormSetting
  FormOptions, // 可用選項
  FormSetting,
  Conditions, // 進階搜尋
  FormIDBSetting,
  // useFormListSetting
  FormListSetting,
  // useTableSetting
  TableRef,
  TableOptions,
  TableSetting,
  TableIDBSetting,
  // useSimpleTableSetting
  SimpleTableSetting
} from '@/declare/columnSetting'

import {
  getColumnSetting, // 表格欄位
  getFilterSetting,
  setFilterSetting,
  delFilterSetting
} from '@/lib/lib_idb'
import { systemLog, tipLog, getUuid, isEmpty, hasOwnProperty, message, getProxyData } from '@/lib/lib_utils' // 工具
import { object_forEach, object_filter, object_reduce } from '@/lib/lib_object'

/**
 * @author Caleb
 * @description 取得單一欄位所需資料
 * @param {Object} column 欄位資料
 * @param {Object} options 選項
 *                 type: 類型 ex: table, form, filter
 *                 key
 * @param {Object} refMap 設定輸入框的ref (call by reference)
 * @returns {Object}
 */
const getColumnData = (
  column: Record<string, any>,
  options: { type: string, key: string },
  refMap: Record<string, any>
): Record<string, any> => {
  const { type, key } = options

  let _column: any = {}
  for (const attrKey in column) {
    // 取得所有非物件類型的屬性
    const attrValue = column[attrKey]
    if (typeof attrValue !== 'object') {
      _column[attrKey] = column[attrKey]
    }
  }
  // 設定 指定類型下的所有屬性
  _column = {
    ..._column,
    ...(column[type] ?? {})
  }

  // 子欄位
  const _columns: any[] = []
  if (!isEmpty(_column?.children)) {
    object_forEach(_column?.children, (subClumn: Record<string, any>, subKey: string) => {
      _columns.push(getColumnData(
        { ...subClumn, __parentKey__: key },
        { type, key: subKey },
        refMap
      ))
    })
  }

  // 是否為操作用欄位 ex: 編輯/刪除
  const _isOperations = _column?.isOperations ?? false

  // 確保不要重複
  const _checkDomSet = new Set()
  return {
    __key__: key,

    // 通用
    ref: (el: InputRefItem) => {
      if (
        el &&
        !_checkDomSet.has(el) &&
        typeof el?.getDom === 'function' // CustomInput
      ) {
        const validateKey = getUuid()
        refMap[validateKey] = el
        _checkDomSet.add(el)
      }
      return el
    },
    key: key,
    label: _column?.label,
    i18nLabel: _column?.i18nLabel,
    i18nModule: _column?.i18nModule,

    // CustomTable
    prop: _column?.prop ?? key,
    slotKey: _column?.slotKey ?? key,
    resizable: _column?.resizable ?? true,
    isOperations: _isOperations,
    isShow: _column?.isShow ?? true,
    columns: _columns,

    // element ui 單排用
    sortable: !_isOperations ? (_column?.sortable ?? false) : false,
    // 專案用 多排
    isSorting: !_isOperations ? (_column?.isSorting ?? true) : false, // 是否顯示排序
    order: _column?.order ?? 'none', // ascending | descending | none
    orderIndex: _column?.orderIndex ?? -1,

    // VxeTable > VxeColumn
    title: _column?.label ?? '',

    // CustomInput
    type: _column?.type ?? 'text', // 輸入框類型
    default: _column?.default ?? null, // 預設值
    isValidate: _column?.isValidate ?? true, // 是否需要驗證
    required: _column?.required ?? false, // 是否必填
    clearable: _column?.clearable ?? true, // 是否可清除
    validate: _column?.validate ?? [], // 驗證類型 lib_validate

    // CustomSearch
    isCondition: _column?.isCondition ?? false, // 進階搜尋

    // 其他
    ..._column
  }
}

// 確認是否有資料
const checkColumns = (resColumns: any, columns: any, type: string) => {
  if (isEmpty(resColumns)) {
    systemLog(columns, 'table')
    tipLog('無欄位資料', ['檢查 columns.ts 中的 欄位的 key', `傳入 type 值 => ${type}`])
  }
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
export const useFormSetting = <T>(
  columns: Record<string, any>,
  type: string,
  options?: FormOptions
): FormSetting<T> => {
  const {
    version = '',
    settingKey = '',
    i18nModule = defaultModuleType
  } = options ?? {}

  // 欄位屬性
  const resColumns = {}
  // 預設欄位資料
  const __defaultValue__ = {}

  // 一般搜尋
  const resForms = reactive<Record<string, any>>({}) // 輸入框資料
  const resActiveForms = reactive<Record<string, boolean>>({}) // 是否啟用
  // 進階搜尋
  const resActiveConditions = reactive<Record<string, boolean>>({}) // 是否啟用
  const resConditions = reactive<Record<string, Conditions>>({}) // 多條件

  // ref
  const refMap = shallowReactive<Record<string, any>>({})

  object_forEach(columns, (column: Record<string, any>, key: string) => {
    if (hasOwnProperty(column, type)) {
      const columnInfo = getColumnData({ i18nModule, ...column }, { type, key }, refMap)
      __defaultValue__[key] = columnInfo?.default ?? null
      resColumns[key] = columnInfo

      resForms[key] = __defaultValue__[key]
      resActiveForms[key] = true
      resActiveConditions[key] = false
      resConditions[key] = [] // 沒有雙向綁定 不會即時更新在畫面上
    }
  })

  // 資料 reset
  const resetForms = (defaultValue?: any) => {
    object_forEach(resForms, (value: any, key: string) => {
      if (typeof defaultValue === 'object' && hasOwnProperty(defaultValue, key)) {
        resForms[key] = defaultValue[key] ?? __defaultValue__[key]
      } else {
        resForms[key] = __defaultValue__[key]
      }
      resActiveForms[key] = true
      resActiveConditions[key] = false
      resConditions[key] = []
    })
  }

  // 驗證 reset
  const resetValidate = () => {
    object_forEach(refMap, (input: InputRefItem) => {
      if (typeof input?.resetValidate !== 'function') return
      input.resetValidate()
    })
  }

  checkColumns(resColumns, columns, type)

  const updateIDB = async () => {
    if (isEmpty(settingKey) || isEmpty(version)) return
    const filterInfo: FormIDBSetting<T> = getProxyData({
      version,
      settingKey,
      forms: resForms,
      activeForms: resActiveForms,
      activeConditions: resActiveConditions,
      conditions: resConditions
    })
    const res = await setFilterSetting(settingKey, filterInfo)
    return res
  }
  // indexedDB
  const useIDBForms = async () => {
    if (isEmpty(settingKey) || isEmpty(version)) return

    const filterInfo = await getFilterSetting(settingKey) as FormIDBSetting<T>
    if (isEmpty(filterInfo)) {
      updateIDB()
    } else {
      const {
        version: idb_version,
        // settingKey,
        forms: idb_forms,
        activeForms: idb_activeForms,
        activeConditions: idb_activeConditions,
        conditions: idb_conditions
      } = filterInfo

      if (idb_version !== version) {
        await delFilterSetting(settingKey)
        updateIDB()
      }

      object_forEach(resForms, (value: any, key: string) => {
        if (hasOwnProperty(idb_forms, key)) {
          resForms[key] = idb_forms[key] ?? null
        }
        if (hasOwnProperty(idb_activeForms, key)) {
          resActiveForms[key] = idb_activeForms[key] ?? true
        }
        if (hasOwnProperty(idb_activeConditions, key)) {
          resActiveConditions[key] = idb_activeConditions[key] ?? false
        }
        if (hasOwnProperty(idb_conditions, key)) {
          resConditions[key] = idb_conditions[key] ?? []
        }
      })
    }
  }

  setTimeout(() => {
    useIDBForms()
  }, 0)

  return {
    refMap,
    defaultValue: __defaultValue__ as T,
    columns: resColumns,
    forms: resForms as T,
    activeForms: resActiveForms,
    activeConditions: resActiveConditions,
    conditions: resConditions,
    resetForms, // 重置所有過濾條件
    resetValidate,
    // 資料, 驗證 reset
    reset: (defaultValue?: any) => {
      resetForms(defaultValue)
      resetValidate()
    },
    getActiveForms: (isShowEmpty: boolean = false) => {
      return object_filter(resForms, (value: any, key: string) => {
        if (isShowEmpty) return resActiveForms[key]
        return resActiveForms[key] && !isEmpty(value)
      })
    },
    // 驗證
    validate: async (): Promise<any[]> => {
      const validateList = []
      const validateInput = []

      const successList = []
      const errorList = []

      object_forEach(refMap, (input: InputRefItem) => {
        if (typeof input?.getDom !== 'function') return
        // 只用有顯示的 input 才會被驗證
        const el = input.getDom()
        const { key, value, getDom } = input
        if (!isEmpty(el)) {
          validateList.push(input.validate())
          validateInput.push({ key, value, input, el, getDom })
        }
      })

      await Promise.all(validateList).then(resList => {
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
      }).catch(errors => {
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
    },
    updateIDB
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
  // 欄位屬性
  const resColumns = {}
  // 預設欄位資料
  const __defaultValue__ = {}

  // ref
  const refMap = shallowReactive<Record<string, any>>({})

  object_forEach(columns, (column: Record<string, any>, key: string) => {
    if (hasOwnProperty(column, type)) {
      const columnInfo = getColumnData(column, { type, key }, refMap)
      resColumns[key] = columnInfo
      __defaultValue__[key] = columnInfo?.default ?? null
    }
  })

  // 列表資料
  const formList = ref<Array<T>>([])
  const __initData__ = initData.map(item => {
    const rowKey = getUuid()
    return {
      id: rowKey,
      key: rowKey,
      ...item,
      __key__: rowKey
    }
  })
  formList.value.push(...__initData__)

  // 移除不存在的 input ref
  const delRemoveInput = () => {
    // event loop 確保最後執行
    setTimeout(() => {
      object_forEach(refMap, (input: InputRefItem, mapKey: string) => {
        if (typeof input?.getDom !== 'function') return
        const el = input.getDom()
        if (isEmpty(el)) { delete refMap[mapKey] }
      })
    }, 0)
  }

  checkColumns(resColumns, columns, type)
  return {
    refMap,
    defaultValue: __defaultValue__ as T,
    columns: resColumns as Record<string, any>,
    forms: formList as Ref<Array<T>>,
    reset: () => {
      formList.value.splice(0)
      formList.value.push(...__initData__)
    },
    validate: async (): Promise<any[]> => {
      const validateList = []
      const validateInput = []

      const successList = []
      const errorList = []

      object_forEach(refMap, (input: InputRefItem) => {
        if (typeof input?.getDom !== 'function') return
        // 只用有顯示的 input 才會被驗證
        const el = input.getDom()
        const { key, value, getDom } = input
        if (!isEmpty(el)) {
          validateList.push(input.validate())
          validateInput.push({ key, value, input, el, getDom })
        }
      })

      await Promise.all(validateList).then(resList => {
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
      }).catch(errors => {
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
    add: (value?: any): any => {
      const rowKey = getUuid()
      const newData = {
        id: rowKey,
        key: rowKey,
        ...__defaultValue__,
        ...value,
        __key__: rowKey
      } as any

      formList.value.push(newData)
      return newData
    },
    remove: (rowIndex: number): any | undefined => {
      const removeData = formList.value.splice(rowIndex, 1)
      delRemoveInput()
      return Array.isArray(removeData) ? removeData[0] : null
    },
    clear: () => {
      formList.value.splice(0)
      delRemoveInput()
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
    sort = { key: null, order: null },
    isSorting = false,
    isHiddenExcel = false,
    isHiddenColumnSetting = false,
    tableSize = '',
    selection = false,
    i18nModule = defaultModuleType
  } = options

  const resColumns = []

  object_forEach(columns, (column: Record<string, any>, key: string) => {
    if (hasOwnProperty(column, type)) {
      const columnInfo = getColumnData(column, { type, key }, {})
      if (columnInfo.children ?? false) {
        delete columnInfo.children
      }
      if (columnInfo.columns.length > 0) {
        delete columnInfo.prop
      }
      resColumns.push(columnInfo)
    }
  })

  // excel header 翻譯
  const getI18nTranslate = () => {
    if (isHiddenExcel) return {
      i18nTranslate: (text: string) => text,
      i18nTest: (text: string) => text.length > 0
    }

    const useHook: UseHook = inject('useHook')
    const { i18nTranslate, i18nTest } = useHook({ i18nModule })
    return { i18nTranslate, i18nTest }
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

    const getRes: TableIDBSetting = await getColumnSetting(settingKey)
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
          _columnWidth = Math.max(
            _columnWidth,
            (_currentColumn?.width ?? 0),
            (_currentColumn?.minWidth ?? 0)
          )

          const align = _currentColumn?.align ?? 'left'
          excelColumns.push({
            header: i18nTest(columnI18nLabel ?? '') ? i18nTranslate(columnI18nLabel) : columnLabel,
            key: columnKey,
            hidden: !isShow,
            style: {
              alignment: { horizontal: align, vertical: 'middle' }
            },
            width: Math.round(_columnWidth / 8)
          })
        }
      }
    })
    worksheet.columns = excelColumns
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

  const tableParams = shallowReactive<CustomTableTypes.TableParams>({
    page,
    size,
    sort,
    sortingList: [],
    sortingMap: {}
  })

  const _tableRef = ref(null)

  checkColumns(resColumns, columns, type)
  return {
    tableRef: _tableRef,
    tableSetting: {
      ...options,
      ref: (el: TableRef) => {
        if (el) {
          _tableRef.value = el
        }
        return el
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
      const __tableRef__ = tableRef ?? _tableRef.value
      if (typeof __tableRef__?.resetScroll === 'function') {
        return __tableRef__.resetScroll()
      }
    },
    toggleSelection: (rows: Array<any>, tableRef?: TableRef) => {
      const __tableRef__ = tableRef ?? _tableRef.value
      if (typeof __tableRef__?.toggleSelection === 'function') {
        return __tableRef__.toggleSelection(rows)
      }
    },
    getSelectionRows: (tableRef?: TableRef) => {
      const __tableRef__ = tableRef ?? _tableRef.value
      if (typeof __tableRef__?.getSelectionRows === 'function') {
        return __tableRef__.getSelectionRows()
      }
    },
    getParams: (tableRef?: TableRef): CustomTableTypes.TableParams => {
      const __tableRef__ = tableRef ?? _tableRef.value
      if (typeof __tableRef__?.getTableParams === 'function') {
        return __tableRef__.getTableParams()
      } else {
        return {...tableParams}
      }
    },
    setParams: (
      params: {
        page?: number
        size?: number
        sort?: CustomTableTypes.Sort
        sortingList?: CustomTableTypes.SortingList
      },
      tableRef?: TableRef
    ) => {
      const __tableRef__ = tableRef ?? _tableRef.value
      if (typeof __tableRef__?.setTableParams === 'function') {
        return __tableRef__.setTableParams(params)
      }
    },
    changePage: (page?: number, pageSize?: number, tableRef?: TableRef): void => {
      const __tableRef__ = tableRef ?? _tableRef.value
      const { page: defaultPage, size: defaultSize } = tableParams

      if (typeof __tableRef__?.pageChange === 'function') {
        return __tableRef__.pageChange(page ?? defaultPage, pageSize ?? defaultSize)
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
  const resColumns = []

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

  checkColumns(resColumns, columns, type)
  return {
    title,
    tableColumns: resColumns,
    downloadExcel
  }
}
