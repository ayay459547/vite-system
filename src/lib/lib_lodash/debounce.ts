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
export const debounce = <T = Function>(callback: ((...args: any[]) => any), delay: number): T => {
  let timeoutId: number | undefined

  return new Proxy(() => {}, {
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
