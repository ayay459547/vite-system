// 最快刷新的速度
export const FPS = 80
// 表格高度
export const tableHeight = 960
// 1小時高度
export const oneHourHeight = 960 / 24
// 24小時高度
export const twentyFourHourHeight = oneHourHeight * 24
// 23:59 秒數的高度(趨近於24:00)
export const maxHeight = twentyFourHourHeight

// 1小時秒數
export const oneHourSecond = 1 * 60 * 60
// 24小時秒數
export const twentyFourHourSecond = oneHourSecond * 24
// 23:59 秒數
export const maxSecond = twentyFourHourSecond - 1

/**
 * 秒數限制 00:00 ~ 23:59 區間
 * @param {number} second 秒數
 * @returns {number} second
 */
export const secondFormat = (second: number): number => {
  if (second <= 0) return 0
  if (second >= maxSecond) return maxSecond
  return second
}

/**
 * 高度限制 00:00 ~ 23:59 區間
 * @param {number} top 到00:00高度(px)
 * @returns {number} second
 */
export const topFormat = (top: number): number => {
  if (top <= 0) return 0
  if (top >= maxHeight) return maxHeight
  return top
}

/**
 * 秒 轉換 上邊距
 * 有限制在 0小時 ~ 24小時 的top位置
 * @param {number}second
 * @returns {number} top
 */
export const secondToTop = (second: number): number => {
  const _percentage = second / oneHourSecond
  const top = topFormat(_percentage * oneHourHeight)
  return top
}

/**
 * 上邊距 轉換 秒
 * 有限制在 0小時 ~ 24小時 的秒數
 * @param {number}top
 * @returns {number} second
 */
export const topToSecond = (top: number): number => {
  const _percentage = top / oneHourHeight
  const second = secondFormat(_percentage * oneHourSecond)
  return second
}

/**
 * 秒數 換算成 hh:mm
 * 有限制在 0小時 ~ 24小時 的秒數
 * @param {number}second
 * @returns {string} hh:mm
 */
export const secondToTime = (second: number): string => {
  const _second = secondFormat(second)

  const _hour = Math.floor(_second / oneHourSecond)
  const _minutes = Math.floor((_second - _hour * oneHourSecond) / 60)
  return `${_hour}`.padStart(2, '0') + ':' + `${_minutes}`.padStart(2, '0')
}

/**
 * 秒數 換算成 hh:mm
 * 有限制在 0小時 ~ 24小時 的秒數
 * @param {string}time
 * @returns {string} hh:mm
 */
export const timeToSecond = (time: string): number => {
  const [_hour, _minutes] = time.split(':')
  const [hour, minutes] = [Number.parseInt(_hour), Number.parseInt(_minutes)]

  const hourSecond = (isNaN(hour) ? 0 : hour) * oneHourSecond
  const minutesSecond = (isNaN(minutes) ? 0 : minutes) * 60
  return hourSecond + minutesSecond
}
