import type { Ref, DeepReadonly } from 'vue'
import {
  customRef,
  readonly,
  reactive,
  onMounted,
  onUnmounted,
  isRef,
  effectScope,
  watch
} from 'vue'
import type { Composer } from 'vue-i18n'
import { useI18n } from 'vue-i18n'

import { isEmpty, getUuid } from '@/lib/lib_utils'
import type { ResizeObserverCallback } from '@/lib/lib_throttle'
import throttle from '@/lib/lib_throttle'

import type { ScopeKey } from '@/i18n/i18n_setting'
import { defaultModuleType } from '@/i18n/i18n_setting'

export type I18nTranslate = (key: string, i18nModule?: ScopeKey) => string
export type I18nTest = (key: string, i18nModule?: ScopeKey) => boolean

export type LocalI18n = Partial<Composer & {
  i18nTranslate: I18nTranslate,
  i18nTest: I18nTest
}>
/**
 * @author Caleb
 * @description 使用翻譯工具
 * @param {Object} i18nModule Excel 設定的欄位模組
 * @returns {Object} 翻譯工具
 */
export const useLocalI18n = (i18nModule?: ScopeKey): LocalI18n => {
  const localI18n = useI18n({
    useScope: 'local',
    messages: {}
  }) as Partial<Composer>

  const globalI18nModule = i18nModule ?? defaultModuleType
  const i18nTranslate: I18nTranslate = (key: string, i18nModule?: string) => {
    const _i18nModule = !isEmpty(i18nModule) ? i18nModule : globalI18nModule

    if (typeof localI18n?.te !== 'function') return key

    const i18nKey = `__${_i18nModule}__:${key}`
    if (localI18n?.te(i18nKey) ?? false) {
      return localI18n?.t(i18nKey)
    }
    return localI18n?.t(key)
  }

  const i18nTest: I18nTest = (key: string, i18nModule?: string) => {
    const _i18nModule = !isEmpty(i18nModule) ? i18nModule : globalI18nModule

    if (typeof localI18n?.te !== 'function') return false

    const i18nKey = `__${_i18nModule}__:${key}`
    return localI18n?.te(i18nKey) ?? false
  }

  return {
    ...localI18n,
    i18nTranslate,
    i18nTest
  }
}

export type BoundingClientRect = {
  target: Element | null
  width: number
  height: number
  bottom: number
  top: number
  left: number
  right: number
  x: number
  y: number
}
export type updateContentRect = () => BoundingClientRect
/**
 * @author Caleb
 * @description 給 Dom元素 自動監聽大小變化
 *              需在 setup 中執行
 * @param {*} dom Dom元素
 * @param {*} callback Dom元素變化時執行
 * @returns {Object} 大小
 */
export function useBoundingClientRect (
  dom: Ref<Element |  null> | Element,
  callback?: (contentRect: BoundingClientRect) => void
): {
  contentRect: BoundingClientRect
  updateContentRect: updateContentRect
} {
  const defaultContentRect = {
    target: null,
    width: 0,
    height: 0,
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    x: 0,
    y: 0
  }
  const contentRect = reactive({
    ...defaultContentRect
  })

  const updateContentRect = () => {
    const target = isRef(dom) ? dom.value : dom
    if (isEmpty(target)) return defaultContentRect

    const boundingClientRect = target.getBoundingClientRect()

    const {
      width = 0,
      height = 0,
      bottom = 0,
      top = 0,
      left = 0,
      right = 0,
      x = 0,
      y = 0
    } = boundingClientRect ?? {}

    contentRect.target = target ?? null
    contentRect.width = width
    contentRect.height = height
    contentRect.bottom = bottom
    contentRect.top = top
    contentRect.left = left
    contentRect.right = right
    contentRect.x = x
    contentRect.y = y

    if (typeof callback === 'function') {
      callback(contentRect)
    }
    return contentRect
  }

  const ROcallback = throttle((entries: ResizeObserverEntry[]) => {
    entries.forEach(() => {
      updateContentRect()
    })
  }, 100) as ResizeObserverCallback

  const RO = new ResizeObserver(ROcallback)

  onMounted(() => {
    if (isRef(dom) && !isEmpty(dom.value)) {
      RO.observe(dom.value)
    } else if (!isRef(dom) && !isEmpty(dom)) {
      RO.observe(dom)
    }
  })

  onUnmounted(() => {
    if (RO) {
      RO.disconnect()
    }
  })

  return {
    contentRect: contentRect,
    updateContentRect
  }
}

/**
 * @author Caleb
 * @description ref debounce
 * @param {*} value 資料
 * @returns {*}
 */
export function useDebouncedRef (value: any): Ref<any> {
  let timeout: any

  return customRef((track, trigger) => {
    return {
      get () {
        track()
        return value
      },
      set (newValue) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          trigger()
        }, 200)
      }
    }
  })
}

// https://react.dev/reference/react/hooks

/**
 * @author Caleb
 * @description 類似 react useId
 * @returns {String} 隨機Id
 */
export function useId (): string {
  return getUuid()
}

/**
 * @author Caleb
 * @description 類似 react useState
 *              與react差異
 *              1. 在template中 使用方式: 資料 (相同)
 *              2. 在script中 使用方式: 資料.value (不相同)
 * @param defaultValue 預設值
 * @returns {Array} [資料, 設定資料函數]
 */
export function useState<T> (defaultValue: T): [Readonly<Ref<DeepReadonly<T>>>, (newValue: T) => void] {
  let value = defaultValue

  const data = customRef<T>((track, trigger) => {
    return {
      get () {
        track()
        return value
      },
      set (newValue) {
        value = newValue
        trigger()
      }
    }
  })

  const setData = (newValue: T) => {
    data.value = newValue
  }

  const readData = readonly<Ref<T>>(data)

  return [readData, setData]
}

export type OnUnmountedCallback = () => void
export type OnMountedCallback<T> = (newValue?: T, oldValue?: T) => OnUnmountedCallback | void
/**
 * @author Caleb
 * @description 類似 react useEffect
 * @param callback 回調函數
 *                 (變更後, 變更前) => onUnmounted
 * @param watchValue 監聽資料
 */
export function useEffect<T> (callback: OnMountedCallback<T>, watchValue: any): void {
  const scope = effectScope()
  let isWatch = false
  let onUnmountedCallback = null

  onMounted(() => {
    isWatch = !isEmpty(watchValue)

    if (isWatch) {
      scope.run(() => {
        watch(watchValue, (newValue, oldValue) => {
          onUnmountedCallback = callback(newValue, oldValue)
        }, {
          deep: true,
          immediate: true
        })
      })
    } else {
      onUnmountedCallback = callback()
    }
  })

  onUnmounted(() => {
    if (typeof onUnmountedCallback === 'function') {
      onUnmountedCallback()
    }

    if (isWatch) {
      scope.stop()
    }
  })
}
