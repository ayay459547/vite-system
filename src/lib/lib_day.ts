import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import isoWeek from 'dayjs/plugin/isoWeek'
import { isEmpty } from '@/lib/lib_utils'
// import uch from 'dayjs/plugin/utc'
dayjs.extend(duration)
dayjs.extend(weekOfYear)
dayjs.extend(isoWeek)

// @ts-ignore
window.dayjs = dayjs

export type DateType = string | Date | dayjs.Dayjs

/**
 * @author Caleb
 * @description https://day.js.org/docs/en/display/format
 * @param {DateType} value 日期
 * @param {String} format 想要的格式
 * @returns {String} 格式化後的時間
 */
export const datetimeFormat = (value: DateType, format: string = 'YYYY-MM-DD'): string => {
  if (isEmpty(value)) return ''
  return dayjs(value).format(format)
}

/**
 * @author Caleb
 * @description https://day.js.org/docs/en/display/as-iso-string
 *              ISO 8601 格式 YYYY-MM-DDTHH:mm:ss.sssZ
 * @param {DateType} value 日期
 * @returns {String} 格式化後的時間
 */
export const formatISO8601 = (value: DateType): string => {
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
export const durationFormat = (
  time: number,
  type: DurationType = 'seconds',
  format: string = 'HH:mm:ss'
): string => {
  return dayjs.duration(time, type).format(format)
}

/**
 * @author Caleb
 * @description 時間換 毫秒時間
 * @param {DateType} date YYYY-MM-DD
 * @param {string} time 00:00:00
 * @returns {Number}
 */
export const getMilliseconds = (date: DateType, time: string): number => {
  return Date.parse(date + 'T' + time)
}

/**
 * 確定某個日期在當年的第幾季
 * @param {DateType} date 要計算的日期
 * @returns {number} 當年的第幾季
 */
export const getQuarter = (date: DateType): number => {
  const month = dayjs(date).month() + 1
  const quarter = Math.ceil(month / 3)
  return quarter
}

/**
 * 確定某個日期在當年的第幾周
 * @param {DateType} date 要計算的日期
 * @returns {number} 當年的第幾周
 */
export const getWeekOfYear = (date: DateType): number => {
  return dayjs(date).week()
}

/**
 * 確定某個日期在當月的第幾周
 * @param {DateType} date 要計算的日期
 * @returns {number} 當月的第幾周
 */
export const getWeekOfMonth = (date: DateType): number => {
  const startOfMonth = dayjs(date).startOf('month')
  const currentWeek = dayjs(date).week()
  const startOfMonthWeek = startOfMonth.week()
  return currentWeek - startOfMonthWeek + 1
}

export default dayjs
