import { reactive } from 'vue'
import { defineStore } from 'pinia'

import type { Options } from '@/components'
import { getQTimeRetrieveColumnOptions, getQTimeResetRetrieveColumnOptions } from './api'

export const useQTimeStore = defineStore('QTime', () => {
  /**
   * /demo-rest/api/qtime/retrieveColumnOptions
   * form 字串作為 value
   * filter 數字做為 value
   */
  const qtimeOptionsMap = reactive({
    formUnit: [],
    filterUnit: [],

    formBoundType: [],
    filterBoundType: [],

    formCalculatedPoint: [],
    filterCalculatedPoint: []
  })

  /**
   * /demo-rest/api/qtimereset/retrieveColumnOptions
   * form 字串作為 value
   * filter 數字做為 value
   */
  const qtimeresetOptionsMap = reactive({
    formUnit: [],
    filterUnit: []
  })

  const unitFormat = (unit: string, index: number, type: 'form' | 'filter') => {
    const value = type === 'form' ? unit : index
    const data = { unit, value, type, index }

    switch (unit) {
      case 'DAYS':
        return { label: '日', i18nLabel: 'datetime-day', value, data }
      case 'HOURS':
        return { label: '時', i18nLabel: 'datetime-hour', value, data }
      case 'MILLISECONDS':
        return { label: '毫秒', i18nLabel: 'datetime-millisecond', value, data }
      case 'MINUTES':
        return { label: '分', i18nLabel: 'datetime-minute', value, data }
      case 'MONTHS':
        return { label: '月', i18nLabel: 'datetime-month', value, data }
      case 'SECONDS':
        return { label: '秒', i18nLabel: 'datetime-second', value, data }
      case 'YEARS':
        return { label: '年', i18nLabel: 'datetime-year', value, data }
      default:
        return { label: unit, i18nLabel: unit, value, data }
    }
  }

  const boundTypeFormat = (boundType: string, index: number, type: 'form' | 'filter') => {
    const value = type === 'form' ? boundType : index
    const data = { boundType, value, type, index }

    switch (boundType) {
      case 'Inner':
        return { label: '內部', i18nLabel: 'boundType-Inner', value, data }
      case 'Outer':
        return { label: '外部', i18nLabel: 'boundType-Outer', value, data }
      default:
        return { label: boundType, i18nLabel: boundType, value, data }
    }
  }

  const calculatedPointFormat = (calculatedPoint: string, index: number, type: 'form' | 'filter') => {
    const value = type === 'form' ? calculatedPoint : index
    const data = { calculatedPoint, value, type, index }

    switch (calculatedPoint) {
      case 'START_PRODUCE':
        return { label: '開始生產點', i18nLabel: 'start-produce-point', value, data }
      case 'END_PRODUCE':
        return { label: '結束生產點', i18nLabel: 'end-produce-point', value, data }
      default:
        return { label: calculatedPoint, i18nLabel: calculatedPoint, value, data }
    }
  }

  // 初始化選項
  const initOptions = async () => {
    const [QTimeRetrieveColumnOptions, QTimeResetRetrieveColumnOptions] = await Promise.all([
      getQTimeRetrieveColumnOptions(),
      getQTimeResetRetrieveColumnOptions()
    ])

    // Q-TIME 產品生產製程緩衝時間
    const { formUnit, filterUnit } = QTimeRetrieveColumnOptions.unit.reduce((res, unit, index) => {
      res.formUnit.push(unitFormat(unit, index, 'form'))
      res.filterUnit.push(unitFormat(unit, index, 'filter'))
      return res
    }, {
      formUnit: [],
      filterUnit: []
    })
    qtimeOptionsMap.formUnit = formUnit
    qtimeOptionsMap.filterUnit = filterUnit

    // BoundType
    const { formBoundType, filterBoundType } = QTimeRetrieveColumnOptions.boundType.reduce((res, boundType, index) => {
      res.formBoundType.push(boundTypeFormat(boundType, index, 'form'))
      res.filterBoundType.push(boundTypeFormat(boundType, index, 'filter'))
      return res
    }, {
      formBoundType: [],
      filterBoundType: []
    })
    qtimeOptionsMap.formBoundType = formBoundType
    qtimeOptionsMap.filterBoundType = filterBoundType

    // CalculatedDesignatedPoint
    const { formCalculatedPoint, filterCalculatedPoint } = QTimeRetrieveColumnOptions.calculatedDesignatedPoint.reduce((res, calculatedPoint, index) => {
      res.formCalculatedPoint.push(calculatedPointFormat(calculatedPoint, index, 'form'))
      res.filterCalculatedPoint.push(calculatedPointFormat(calculatedPoint, index, 'filter'))
      return res
    }, {
      formCalculatedPoint: [],
      filterCalculatedPoint: []
    })
    qtimeOptionsMap.formCalculatedPoint = formCalculatedPoint
    qtimeOptionsMap.filterCalculatedPoint = filterCalculatedPoint



    // Q-TIME 重置時間
    const { formUnit: reset_formUnit, filterUnit: reset_filterUnit } = QTimeResetRetrieveColumnOptions.unit.reduce((res, unit, index) => {
      res.formUnit.push(unitFormat(unit, index, 'form'))
      res.filterUnit.push(unitFormat(unit, index, 'filter'))
      return res
    }, {
      formUnit: [],
      filterUnit: []
    })
    qtimeresetOptionsMap.formUnit = reset_formUnit
    qtimeresetOptionsMap.filterUnit = reset_filterUnit
  }
  // initOptions()

  // 取顯示用資料
  const getTimeUnitTableValue = <T = number | string>(data: number | string, options: Options<T>): T => {
    // 後端給的資料是數字
    const currentOptions = options.find(option => {
      return `${option.data.index}` === `${data}`
    })
    return currentOptions?.value ?? data as T
  }
  const getTimeUnitTableI18nLabel = (data: number | string, options: Options) => {
    const currentOptions = options.find(option => {
      return `${option.value}` === `${data}`
    })
    return currentOptions?.i18nLabel ?? `${data}`
  }

  return {
    initOptions,
    qtimeOptionsMap,
    qtimeresetOptionsMap,

    // Table 用
    getTimeUnitTableValue,
    getTimeUnitTableI18nLabel
  }
})
