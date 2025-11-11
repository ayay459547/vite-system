import type { Ref } from 'vue'
import { customRef } from 'vue'

/**
 * @see https://vuejs.org/api/reactivity-advanced.html#customref
 * @description ref debounce
 * @param {*} value 資料
 * @returns {*}
 */
export function useDebouncedRef(value: any): Ref<any> {
  let timeout: any
  return customRef((track, trigger) => {
    return {
      get: () => {
        track()
        return value
      },
      set: (newValue: any) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          trigger()
        }, 200)
      }
    }
  })
}
