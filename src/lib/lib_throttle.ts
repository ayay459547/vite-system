export interface ResizeObserverCallback {
  (entries: ResizeObserverEntry[], observer: ResizeObserver): void
}

export type ThrottleOptions = {
  isNoLeading?: boolean
  isNoTrailing?: boolean
}
/**
 * @author Caleb
 * @description 節流函數
 * @param {Function} callback 回調函數
 * @param {Number} delay 延遲
 * @param {Object} options 選用設定
 *                 isNoLeading: 是否不執行第一次回調函數
 *                 isNoTrailing: 是否不執行setTimeout的回調函數
 * @returns {Object} 包含回調函數的Proxy
 */
export const throttle = <T = Function>(
  callback: Function,
  delay: number,
  options: ThrottleOptions = {}
): T => {
  let now: number
  let timeoutId: NodeJS.Timeout | null
  let lastTime: number | null

  const defaultOptions: ThrottleOptions = {
    isNoLeading: false,
    isNoTrailing: false,
    ...options
  }
  let { isNoLeading } = defaultOptions
  const { isNoTrailing } = defaultOptions

  const scopeData = {
    clearLastTime() {
      lastTime = null
    }
  }

  return new Proxy(() => {}, {
    set(obj, key, value) {
      if (Object.prototype.hasOwnProperty.call(scopeData, key)) {
        scopeData[key] = value
      } else {
        obj[key] = value
      }
      return true
    },
    get(obj, key) {
      if (Object.prototype.hasOwnProperty.call(scopeData, key)) {
        return scopeData[key]
      }
      return obj[key]
    },
    apply(obj, thisArg, params) {
      now = +new Date()

      // 如果不是第一次執行 && 現在時間 < 上次執行時先 + 延遲時間
      if (lastTime && now < lastTime + delay) {
        if (isNoTrailing) return

        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          lastTime = now
          callback.call(thisArg, ...params)
        }, delay)
      } else {
        if (isNoLeading) {
          isNoLeading = false
        } else {
          lastTime = now
          callback.call(thisArg, ...params)
        }
      }
    }
  }) as T
}

export default throttle
