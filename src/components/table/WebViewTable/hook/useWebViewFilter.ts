import { computed } from 'vue'

import { isEmpty, hasOwnProperty } from '@/lib/lib_utils'
import type { FormOptions } from '@/types/types_columnSetting'
import { useFormSetting } from '@/lib/lib_columns'

import {
  getUrlParams,
  getWebViewParams,
  // 進階搜尋可用選項
  webViewUrlOperator,
  getColumnOperator
} from '../api'
import type { Types, Props } from '../WebViewTableInfo'

// 基本搜尋
export const useWebViewFilter = (props: Partial<Props>) => {

  // 記住使用者的搜尋條件用
  const formOptions: FormOptions = computed(() => {
    const { version, settingKey, i18nModule } = props.tableOptions ?? {}
    if (!isEmpty(version) && !isEmpty(settingKey)) {
      return { version, settingKey, i18nModule }
    }
    return {}
  })

  const {
    columns: filterColumn,
    forms: filter,
    activeForms: activeFilter,
    getActiveForms: getFilter,
    reset: resetFilter,
    activeConditions: activeConditions,
    conditions: filterConditions,
    getConditionFilter,
    setConditionFilter,
    updateIDB: updateIDBFilter // 記錄使用者過濾條件
  } = useFormSetting<Types['filterData']>(
    props.columnSetting ?? {},
    props.filterKey,
    formOptions.value
  )

  const setFilter = (_filter: Types['filterData']) => {
    resetFilter({})

    if (typeof _filter !== 'object') return
    for (const _filterKey in _filter) {
      if (hasOwnProperty(filter, _filterKey)) {
        filter[_filterKey] = _filter[_filterKey]
      }
    }
  }

  return {
    filterColumn,
    filter,
    activeFilter,
    getFilter,
    resetFilter,
    activeConditions,
    filterConditions,
    getConditionFilter,
    setConditionFilter,
    updateIDBFilter,
    setFilter
  }
}

// 進階搜尋可用選項
export const useWebViewFilterCondition = (props: Partial<Props>) => {
  const filterConditionMap: Record<string, any> = {}

  /**
   * 初始化 進階搜尋 欄位資料
   * dataType 影響輸入
   * conditionOptions 有後端給
   */
  const initFilterConditionMap = async (filterColumn: Record<string, any>) => {
    // 清空可用選項
    for (const columnKey in filterConditionMap) {
      delete filterConditionMap[columnKey]
    }

    const urlParams = getUrlParams({
      url: props.apiOperator ?? webViewUrlOperator,
      baseURL: props.baseurl
    })
    const isWebView = webViewUrlOperator === urlParams.url

    // 客製化 api
    const webViewParams = getWebViewParams({
      webfuno: props.webfuno,
      funoviewsuffix: props.funoviewsuffix,
      designatedview: props.designatedview
    }, isWebView)

    // 如果是 SQL View, 必需要有參數
    let columnOperatorMap: Record<string, any> = {}
    if (isWebView && !isEmpty(webViewParams)) {
      columnOperatorMap = await getColumnOperator(
        webViewParams,
        props.useFakeData, // 是否使用假資料
        props.isLog, // 是否console.log訊息
        urlParams
      )
    }

    // 設定可用選項
    for (const columnKey in filterColumn) {
      if (!Array.isArray(columnOperatorMap[columnKey])) continue
      filterConditionMap[columnKey] = columnOperatorMap[columnKey]
    }
  }

  // 依據後端資料 決定是否可進階搜尋
  const getIsCondition = (columnKey: string, filterColumn: Record<string, any>) => {
    if (Array.isArray(filterConditionMap[columnKey])) {
      return filterConditionMap[columnKey].length > 0
    }
    // 無後端資料 使用欄位設定
    return filterColumn[columnKey]?.isCondition ?? false
  }

  return {
    filterConditionMap,
    initFilterConditionMap,
    getIsCondition
  }
}
