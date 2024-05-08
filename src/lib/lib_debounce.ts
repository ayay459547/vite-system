export interface ResizeObserverCallback {
  (entries: ResizeObserverEntry[], observer: ResizeObserver): void
}

/**
 * @author Caleb
 * @description 防抖函數
 * @param {Function} callback 回調函數
 * @param {Number} delay 延遲
 * @returns {Function}
 */
export const debounce = <T = Function>(callback: Function, delay: number): T => {
  let timeoutId: NodeJS.Timeout | null

  const scopeData = {}

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
      if (timeoutId) {
        clearInterval(timeoutId)
      }

      timeoutId = setTimeout(() => {
        callback.call(thisArg, ...params)
      }, delay)
    }
  }) as T
}

export default debounce
