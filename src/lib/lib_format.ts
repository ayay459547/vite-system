import dayjs from '@/lib/lib_day'
import { isEmpty } from '@/lib/lib_utils'

export type FormatOperatorOptions = {
  operatorPrefix?: string
  selectPrefix?: string
  returnType?: 'object' | 'array' | 'string'
}
/**
 * @author Caleb
 * @description 運算 (配合 WebViewTable 通用api格式)
 *  {
 *    operator_{key}: value[0],
 *    select_{key}: value[1]
 *  }
 * @param {String} key 關鍵字
 * @param {Any} value 值(陣列才有效)
 * @returns {Object} 格式化後的資料
 */
export const formatOperator = <T>(key: string, value: any, options?: FormatOperatorOptions): T | any => {
  const {
    operatorPrefix = 'operator_',
    selectPrefix = 'select_',
    returnType = 'object'
  } = options ?? {}

  const [
    _operator = '',
    _select = ''
  ] = Array.isArray(value) ? value : []

  const entries = [
    [`${operatorPrefix}${key}`, _operator],
    [`${selectPrefix}${key}`, _select]
  ]

  switch (returnType) {
    case 'array':
      return [_operator, _select]
    case 'string':
      return `${_operator},${_select}`
    case 'object':
    default:
      return Object.fromEntries(entries)
  }
}

type FormatDateTimeRangeOptions = {
  startPrefix?: string
  endPrefix?: string
  returnType?: 'object' | 'array' | 'string'
}
/**
 * @author Caleb
 * @description 日期 (配合 WebViewTable 通用api格式)
 *  {
 *    isStartDate_{key}: value[0],
 *    isEndDate_{key}: value[1]
 *  }
 * @param {String} key 關鍵字
 * @param {Any} value 值(陣列才有效)
 * @returns {Object} 格式化後的資料
 */
export const formatDateTimeRange = <T>(key: string, value: any, options?: FormatDateTimeRangeOptions): T | any => {
  const {
    startPrefix = 'isStartDate_',
    endPrefix = 'isEndDate_',
    returnType = 'object'
  } = options ?? {}

  const [
    _startDate = '',
    _endDate = ''
  ] = Array.isArray(value) ? value : []

  const entries = [
    [`${startPrefix}${key}`, _startDate],
    [`${endPrefix}${key}`, _endDate]
  ]

  switch (returnType) {
    case 'array':
      return [_startDate, _endDate]
    case 'string':
      return `${_startDate},${_endDate}`
    case 'object':
    default:
      return Object.fromEntries(entries)
  }
}

/**
 * @author Caleb
 * @description https://day.js.org/docs/en/display/format
 * @param {String} value 日期
 * @param {String} format 想要的格式
 * @returns {String} 格式化後的時間
 */
export const formatDatetime = (value: string | number | Date, format: string = 'YYYY-MM-DD'): string => {
  if (isEmpty(value)) return ''
  return dayjs(value).format(format)
}

/**
 * @author Caleb
 * @description https://day.js.org/docs/en/display/as-iso-string
 *              ISO 8601 格式 YYYY-MM-DDTHH:mm:ss.sssZ
 * @param {String} value 日期
 * @returns {String} 格式化後的時間
 */
export const formatISO8601 = (value: string | number | Date): string => {
  if (isEmpty(value)) return ''
  return dayjs(value).toISOString()
}

export type DurationType = 'seconds' | 'minutes' | 'hours' | 'days' | 'months' | 'years'
/**
 * @author Caleb
 * @description https://day.js.org/docs/en/durations/creating
 * @param {Number} time 時間
 * @param {DurationType} type 類型
 * @param {String} format 想要的格式
 * @returns {String} 格式化後的時間
 */
export const formatDuration = ( time: number, type: DurationType = 'seconds', format: string = 'HH:mm:ss'): string => {
  return dayjs.duration(time, type).format(format)
}

/**
 * @author Caleb
 * @description 數字每三位點一個逗點
 * @param {Number} num 數字
 * @returns {String}
 */
const toLocaleString = (num: number): string => {
  if (Number.isNaN(num) || typeof num !== 'number') return `${num}`
  return num.toLocaleString()
}
export type NumberFormatType = 'round' | 'floor' | 'ceil' | 'none' | ''
/**
 * @author Caleb
 * @description 數字格式化
 * @param {Number} num 輸入數字
 * @param {Object} options 設定
 *    type: round(四捨五入), floor(無條件捨去), ceil(無條件進位)
 *    toFixed 取小數點到第n位
 *    isString 是否轉文字
 *    isToLocaleString 是否要有三位一個逗點
 * @returns {Number} 格式化的數字
 */
export const numberFormat = <T extends number | string>(
  num: number,
  options?: {
    type?: NumberFormatType
    toFixed?: number
    isString?: boolean
    isToLocaleString?: boolean
  }
): T => {
  const { type = 'round', toFixed = 2, isString = false, isToLocaleString = false } = options ?? {}
  if (isEmpty(num)) return '' as T

  const _num = +(num + `e+${toFixed}`)

  let res = 0
  switch (type) {
    case 'round':
      res = +(Math.round(_num) + `e-${toFixed}`)
      break
    case 'floor':
      res = +(Math.floor(_num) + `e-${toFixed}`)
      break
    case 'ceil':
      res = +(Math.ceil(_num) + `e-${toFixed}`)
      break
    case 'none':
    default:
      res = num
      break
  }

  if (isToLocaleString) return toLocaleString(res) as T
  return (isString ? `${res}` : res) as T
}
