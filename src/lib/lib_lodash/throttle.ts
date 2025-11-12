export interface ResizeObserverCallback {
  (entries: ResizeObserverEntry[], observer: ResizeObserver): void
}

export type ThrottleOptions = {
  leading?: boolean
  trailing?: boolean
}
/**
 * @author Caleb
 * @description 節流函數
 * @param {Function} callback 回調函數
 * @param {Number} delay 延遲
 * @param {Object} options 選用設定
 *                 leading: 是否執行第一次回調函數
 *                 trailing: 是否執行setTimeout的回調函數
 * @returns {Object} 包含回調函數的Proxy
 */
export const throttle = <T = ((...args: any[]) => any)>(
  callback: ((...args: any[]) => any),
  delay: number,
  options: ThrottleOptions = {}
): T => {
  let now: number
  let timeoutId: number | undefined
  let lastTime: number | undefined

  const defaultOptions: ThrottleOptions = {
    leading: true,
    trailing: true,
    ...options
  }
  let { leading } = defaultOptions
  const { trailing } = defaultOptions

  return new Proxy(() => {}, {
    apply(obj, thisArg, params) {
      now = +new Date()

      // 如果不是第一次執行 && 現在時間 < 上次執行時先 + 延遲時間
      if (lastTime && now < lastTime + delay) {
        if (!trailing) return

        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          lastTime = now
          callback.call(thisArg, ...params)
        }, delay)
      } else {
        if (leading) {
          lastTime = now
          callback.call(thisArg, ...params)
        } else {
          leading = false
        }
      }
    }
  }) as T
}

export default throttle
