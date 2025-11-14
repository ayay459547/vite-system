import { reactive, shallowReactive, ref, inject } from 'vue'

import type { UseHook } from '@/types/types_hook' // 全域功能類型
import type { ExcelColumn, WorkbookOptions } from '@/lib/lib_files'
import { defaultModuleType } from '@/declare/declare_i18n'
import { createWorkbook } from '@/lib/lib_files'

import type { CustomTableTypes } from '@/components/table' // 系統組件: 表格
import type {
  ColumnItem, // 欄位屬性
  // InputRefItem, // 輸入框
  TableRef,
  TableOptions,
  TableSetting,
  TableIDBSetting
} from '@/types/types_columnSetting'

import {
  getColumnSetting // 表格欄位
  // getFilterSetting,
  // setFilterSetting,
  // delFilterSetting
} from '@/lib/lib_idb'
import { hasOwnProperty } from '@/lib/lib_utils' // 工具
import { object_forEach } from '@/lib/lib_object'
import { getColumnData, checkColumns } from './columnsHookUtils'

/**
 * @author Caleb
 * @description 取的 Columns 設定 Table用的資料
 *              slot prop 預設是 key
 * @param {Ojbect} columns
 * @param {String} type 取得 columnSetting 中的類型
 * @param {Object} options 設定用的參數
 * @param {Object} i18n 翻譯 { i18nTranslate, i18nTest }
 * @returns {Ojbect}
 */
export const useTableSetting = (
  columns: Record<string, any>,
  type: string,
  options: TableOptions,
  i18n?: Record<string, Function>
): TableSetting => {
  const {
    title,
    i18nTitle,
    version,
    settingKey,
    page = 1,
    size = 100,
    sort = { key: null, order: null },
    isShowNo = false,
    isSorting = false,
    isHiddenExcel = false,
    isHiddenColumnSetting = false,
    tableSize = '',
    selection = false,
    i18nModule = defaultModuleType
  } = options

  const resColumns:Array<any> = []

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

    const useHook = inject('useHook') as UseHook
    const { i18nTranslate, i18nTest } = useHook({ i18nModule })
    return { i18nTranslate, i18nTest }
  }

  const { i18nTranslate, i18nTest } = i18n ?? getI18nTranslate()

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
    }) // 在檔案中新增工作表 參數放自訂名稱

    const getRes: TableIDBSetting = await getColumnSetting(settingKey ?? '')
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
            header: i18nTest(columnI18nLabel ?? '') ? i18nTranslate(columnI18nLabel ?? '') : columnLabel,
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
      a.download = `${i18nTranslate(i18nTitle ?? title ?? '')}.xlsx`
      a.href = URL.createObjectURL(blobData)
      a.click()
    })
  }

  const tableParams = shallowReactive<CustomTableTypes['tableParams']>({
    page,
    size,
    sort,
    sortingList: [],
    sortingMap: {}
  })

  const _tableRef = ref<TableRef>()

  const topPropMap = new Map()
  const topPropSubTableInfoMap = new Map()
  const basePropSubTableInfoMap = new Map()
  const spanMethodMap = new Map()

  const leftProps:Array<string> = []
  const setSpanColumns = (column: any, topKey: any, levelKeys: any, depth: any) => {
    const { columns, key, width = 200 } = column
    const newLevelKeys = levelKeys.concat([key])
    const columnKey = newLevelKeys.join('-')
    topPropMap.set(key, topKey)

    if(columns.length === 0) {
      if(!topPropSubTableInfoMap.has(topKey)) {
        topPropSubTableInfoMap.set(topKey, {
          columns: [],
          displayDataMap: new Map,
          depth: 1,
          columnsWidth: reactive({})
        })
      }

      const subTableInfo = topPropSubTableInfoMap.get(topKey)
      subTableInfo.columns.push(key)
      subTableInfo.columnsWidth[key] = width
      basePropSubTableInfoMap.set(key, subTableInfo)
      if(hasOwnProperty(column, 'displayData')) {
        subTableInfo.displayDataMap.set(key, column.displayData)
      }
      if(depth > subTableInfo.depth)  subTableInfo.depth = depth

      return [{
        prop: key,
        columnKey
      }]
    }
    return columns.flatMap((column: any) => setSpanColumns(column, topKey, newLevelKeys, depth + 1))

  }
  resColumns.forEach(topColumn => {
    const { key } = topColumn
    const baseColumns = setSpanColumns(topColumn, key, ['column'], 1)
    const size = baseColumns.length

    if(size === 1) return // BaseColumn = TopColumn 無須合併

    const leftProp = baseColumns[0].columnKey
    leftProps.push(leftProp)
    baseColumns.forEach((baseKey: any, index: number) => {
      const spanArray = (index === 0) ? [1, size] : [0, 0]
      spanMethodMap.set(baseKey.prop, spanArray)
    })
  })

  const setSubTableNode = (column: any) => {
    const { columns = [], key, i18nLabel } = column
    const children = columns.map(setSubTableNode)

    return { key, children, get name () { return i18nTranslate(i18nLabel)} }
  }

  const subTableTree = resColumns.map(setSubTableNode)
  const getSubTableData = (rowData: any, prop: any) => {
    const topProp = topPropMap.get(prop)
    return rowData[topProp]
  }
  const getSubColumns = (baseKey: any) => {
    const topProp = topPropMap.get(baseKey)
    return topPropSubTableInfoMap.get(topProp).columns
  }
  const getSubDisplayData = (rowData: any, subRowData: any, prop: any) => {
    const topProp = topPropMap.get(prop)
    const displayDataMap = topPropSubTableInfoMap.get(topProp).displayDataMap
    const displayData = displayDataMap.get(prop)
    const data = subRowData[prop]

    if(!displayData) return data
    return displayData({data, rowData, subRowData, prop, i18nTranslate})
  }

  const spanMethod = ({ column }: any) => {
    return spanMethodMap.get(column.rawColumnKey)
  }

  const spanInfo = {
    leftProps,
    getSubTableData,
    getSubColumns,
    getSubDisplayData,
    spanMethod,
    topPropSubTableInfoMap,
    basePropSubTableInfoMap,
    subTableTree
  }

  // const displayEntries = []
  const displayDataMap = new Map()
  object_forEach(columns, (column: Record<string, any>, key: string) => {
    const { displayData = null } = column
    if(displayData) displayDataMap.set(key, displayData)
  })
  // const displayObject = Object.fromEntries(displayEntries)

  const getDisplayData = (rowData: any, prop: any) => {
    const data = rowData[prop]
    const displayData = displayDataMap.get(prop)
    if(!displayData) return data
    return displayData({
      data, rowData, i18nTranslate
    })
  }

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
      title: title ?? '',
      i18nTitle,
      version: version ?? '',
      settingKey: settingKey ?? '',
      params: tableParams,
      page: tableParams.page,
      pageSize: tableParams.size,
      sort: tableParams.sort,
      isShowNo,
      isSorting,
      tableColumns: resColumns,
      tableSize,
      isHiddenExcel,
      isHiddenColumnSetting,
      selection,
      i18nModule
    },
    downloadExcel,
    resetScroll: (tableRef?: TableRef | any) => {
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
    getSelectionRows: (tableRef?: TableRef | any) => {
      const __tableRef__ = tableRef ?? _tableRef.value
      if (typeof __tableRef__?.getSelectionRows === 'function') {
        return __tableRef__.getSelectionRows()
      }
    },
    getParams: (tableRef?: TableRef | any): CustomTableTypes['tableParams'] => {
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
        sort?: CustomTableTypes['sort']
        sortingList?: CustomTableTypes['sortingList']
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
    },
    spanInfo,
    getDisplayData
  }
}
