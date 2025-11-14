import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'

import type { Options } from '@/components'
import type { MatchingTypeValue } from '@/types/types_logicRestriction/restrictionsMatchingType'
import { getMaintainMatchingType } from '@/api/api_logicRestriction/restrictions'

import type { RestrictionType } from '@/types/types_logicRestriction/restrictions'
import { getDynamicColumns } from '@/declare/declare_logicRestriction/restrictions'
import { isEmpty } from '@/lib/lib_utils'

import { valueInArrayInputArrtMap } from './restrictionsSetting'

export const useRestrictionsStore = defineStore('Restrictions', () => {
  const dynamicColumns = ref([])
  // 動態欄位 設定資訊(送API)
  const dynamicColumnsMap = ref<Map<string, any>>(new Map())

  // 動態欄位 選項(Select)
  const restrictionTypeOptions = ref([])
  // 動態欄位 value => matchingType
  const restrictionTypeMatchingTypeMap: Map<string, any> = new Map()

  // 初始化動態欄位
  const initDynamicColumns = async (maintainRestrictionType: string) => {
    dynamicColumns.value = await getDynamicColumns(maintainRestrictionType)
    restrictionTypeOptions.value = dynamicColumns.value.map(column => {
      const { label, i18nLabel, value, matchingType } = column
      // value 對應的 設定
      dynamicColumnsMap.value.set(value, column)
      // value 對應的 matchingType
      restrictionTypeMatchingTypeMap.set(value, matchingType)
      return { label, i18nLabel, value }
    })
  }

  // 比對方式 StrMatchingType NumMatchingType DateMatchingType => 可用選項
  const matchingTypeOptionsMap: Map<string, Options> = new Map()

  // 是否初始化 | 防止同時多個請求
  let isInitMatchingTypeOptions: (boolean | Promise<any>) = false

  const initMatchingTypeOptionsMap = async () => {
    if (
      // 已經拿過資料
      typeof isInitMatchingTypeOptions === 'boolean' && isInitMatchingTypeOptions ||
      // 正在拿資料
      isInitMatchingTypeOptions
    ) return
    isInitMatchingTypeOptions = Promise.resolve('getMaintainMatchingType')

    const maintainMatchingType = await getMaintainMatchingType()
    for (const matchingType in maintainMatchingType) {
      const matchingTypeValueList: MatchingTypeValue[] = maintainMatchingType[matchingType]
      const options = matchingTypeValueList.map(value => {
        return { label: value, i18nLabel: value, value: value }
      })
      matchingTypeOptionsMap.set(matchingType, options)
    }
    isInitMatchingTypeOptions.finally(() => {
      isInitMatchingTypeOptions = matchingTypeOptionsMap.size > 0
    })
  }

  // 取得動態欄位可用 比對選項
  const getMatchingTypeOptions = (columnValue: string) => {
    // 取得 column 對應的 matchingType
    const matchingType = restrictionTypeMatchingTypeMap.get(columnValue) ?? ''
    // 取 matchingType 對應的 options
    return matchingTypeOptionsMap.get(matchingType) ?? []
  }

  const basicInputAttr = {
    clearable: true,
    triggerOnFocus: true
  }
  const getValueInArrayInputAttr = (columnValue: RestrictionType) => {
    const { modalSelect, type, fetchSuggestions } = (() => {
      switch (columnValue) {
        case 'CUSTOMER_NO':
        case 'PRODUCT_NO':
        case 'PRODUCT_NANE':
        case 'PRODUCT_CATEGORY':
        case 'MO_NO':
        case 'MO_ROUTE': return valueInArrayInputArrtMap[columnValue]
        default: return valueInArrayInputArrtMap['default']
      }
    })()
    return { modalSelect, type, fetchSuggestions }
  }
  const getSelectedValueKey = (columnValue: RestrictionType) => {
    const { modalSelectKey } = (() => {
      switch (columnValue) {
        case 'CUSTOMER_NO':
        case 'PRODUCT_NO':
        case 'PRODUCT_NANE':
        case 'PRODUCT_CATEGORY':
        case 'MO_NO':
        case 'MO_ROUTE': return valueInArrayInputArrtMap[columnValue]
        default: return valueInArrayInputArrtMap['default']
      }
    })()
    return modalSelectKey
  }

  // 是否初始化 | 防止同時多個請求
  const isInit = reactive<Record<string, (boolean | Promise<any>)>>({
    MachineMergeConstraint: false,
    MachineCategoryMergeConstraint: false,
    MachineProcessChangeLine: false,
    MachineProcessProductionConstraint: false,

    RouteClassifySettingConstraint: false,
    OneStopProducingConstraint: false,
    OrderRelaySetting: false
  })
  // 初始化
  const initDynamic = (maintainRestrictionType: string) => {
    if (
      // 已經拿過資料
      typeof isInit[maintainRestrictionType] === 'boolean' && isInit[maintainRestrictionType] ||
      // 正在拿資料
      isInit[maintainRestrictionType]
    ) return isInit[maintainRestrictionType]

    isInit[maintainRestrictionType] = Promise.all([
      initDynamicColumns(maintainRestrictionType),
      initMatchingTypeOptionsMap()
    ])

    isInit[maintainRestrictionType].finally(() => {
      /**
       * 如果 maintainRestrictionType 類型
       * 取得的資料不為空 才判定已經拿過資料
       */
      isInit[maintainRestrictionType] = !isEmpty(dynamicColumns.value)
    })
  }

  return {
    initDynamic,
    dynamicColumnsMap,
    restrictionTypeOptions,
    getMatchingTypeOptions,
    basicInputAttr,
    getValueInArrayInputAttr,
    getSelectedValueKey
  }
})
