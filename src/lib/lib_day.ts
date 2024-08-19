import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import isoWeek from 'dayjs/plugin/isoWeek'
import { isEmpty } from '@/lib/lib_utils'
// import uch from 'dayjs/plugin/utc'
dayjs.extend(duration)
dayjs.extend(weekOfYear)
dayjs.extend(isoWeek)

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
 * 確定某個日期在當月的第幾周
 * @param {DateType} date - 要計算的日期
 * @returns {number} - 當月的第幾周
 */
export const getWeekOfMonth = (date: DateType) => {
  const currentDate = dayjs(date)

  // 確定當月的第一天
  const startOfMonth = currentDate.startOf('month')

  // 確定當月的第一周
  const startWeekOfMonth = startOfMonth.isoWeek()

  // 確定當前日期的周數
  const currentWeek = currentDate.isoWeek()

  // 計算當月的第幾周
  return currentWeek - startWeekOfMonth + 1
}

export default dayjs
