import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

/**
 * @author Caleb
 * @description https://day.js.org/docs/en/display/format
 * @param {String} value 日期
 * @param {String} format 想要的格式
 * @returns {String} 格式化後的時間
 */
export const datetimeFormat = (value: string | Date, format: string = 'YYYY-MM-DD'): string => {
  return dayjs(value).format(format)
}

/**
 * @author Caleb
 * @description https://day.js.org/docs/en/display/as-iso-string
 *              ISO 8601 格式 YYYY-MM-DDTHH:mm:ss.sssZ
 * @param {String} value 日期
 * @returns {String} 格式化後的時間
 */
export const formatISO8601 = (value: string) => {
  return dayjs(value).toISOString()
}

export type DurationType = 'seconds'| 'minutes'| 'hours'| 'days'| 'months'| 'years'
/**
 * @author Caleb
 * @description https://day.js.org/docs/en/durations/creating
 * @param {Number} time 時間
 * @param {DurationType} type 類型
 * @param {String} format 想要的格式
 * @returns {String} 格式化後的時間
 */
export const durationFormat = (time: number, type: DurationType = 'seconds', format: string = 'HH:mm:ss'): string => {
  return dayjs.duration(time, type).format(format)
}

/**
 * @author Caleb
 * @description 時間換 毫秒時間
 * @param {String} date YYYY-MM-DD
 * @param {String} time 00:00:00
 * @returns {Number}
 */
export const getMilliseconds = (date: string, time: string): number => {
  return Date.parse(date + 'T' + time)
}

export default dayjs
