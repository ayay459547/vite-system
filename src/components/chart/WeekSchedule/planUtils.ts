export const FPS = 80
export const oneHourHeight = 40
export const twentyFourHourHeight = 40 * 24
export const oneHourSecond = 1 * 60 * 60
export const twentyFourHourSecond = 24 * 60 * 60

/**
 * 秒 轉換 上邊距
 * 有限制在 0小時 ~ 24小時 的top位置
 * @param {number}second
 * @returns {number} top
 */
export const secondToTop = (second: number): number => {
  const _percentage = second / oneHourSecond
  const top = (_top => {
    if (_top <= 0) return 0
    if (_top >= twentyFourHourHeight) return twentyFourHourHeight
    return _top
  })(_percentage * oneHourHeight)

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
  const second = (_second => {
    if (_second <= 0) return 0
    if (_second >= twentyFourHourSecond) return twentyFourHourSecond
    return _second
  })(_percentage * oneHourSecond)

  return second
}

/**
 * 秒數 換算成 hh:mm
 * 有限制在 0小時 ~ 24小時 的秒數
 * @param {number}second
 * @returns {string} hh:mm
 */
export const secondToTime = (second: number): string => {
  const tempSecond = (_second => {
    if (_second <= 0) return 0
    if (_second >= twentyFourHourSecond) return twentyFourHourSecond
    return _second
  })(second)

  const _hour = Math.floor(tempSecond / oneHourSecond)
  const _minutes = Math.floor((tempSecond - _hour * oneHourSecond) / 60)
  return `${_hour}`.padStart(2, '0') + ':' + `${_minutes}`.padStart(2, '0')
}
