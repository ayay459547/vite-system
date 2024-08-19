import type { Ref, DeepReadonly } from 'vue'
import { defineAsyncComponent } from 'vue'
import type{
  MaybeElementRef,
  UseRefHistoryOptions, UseRefHistoryReturn,
  UseThrottledRefHistoryOptions, UseThrottledRefHistoryReturn,
  MaybeRefOrGetter,
  UseDraggableOptions, UseDraggableReturn,
  UseMouseOptions, UseMouseReturn,
  MouseInElementOptions, UseMouseInElementReturn,
  EventBusIdentifier, UseEventBusReturn
} from '@vueuse/core'
import {
  useRefHistory as _useRefHistory,
  useThrottledRefHistory as _useThrottledRefHistory,
  useDebouncedRefHistory as _useDebouncedRefHistory,
  useDraggable as _useDraggable,
  useMouse as _useMouse,
  useMouseInElement as _useMouseInElement,
  useEventBus as _useEventBus
} from '@vueuse/core'

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

import Async_Skeleton from '@/views/Common/Async_Skeleton.vue'
import Async_Error from '@/views/Common/Async_Error.vue'

import { isEmpty, getUuid } from '@/lib/lib_utils'
import type { ResizeObserverCallback } from '@/lib/lib_throttle'
import throttle from '@/lib/lib_throttle'

import type { ScopeKey } from '@/i18n/i18n_setting'
import { defaultModuleType } from '@/i18n/i18n_setting'

export type I18nTranslate = (key: string, i18nModule?: ScopeKey) => string
export type I18nTest = (key: string, i18nModule?: ScopeKey) => boolean

export type LocalI18n = Partial<
  Composer & {
    i18nTranslate: I18nTranslate
    i18nTest: I18nTest
  }
>
/**
 * @author Caleb
 * @description 使用翻譯工具
 * @param {Object} i18nModule Excel 設定的欄位模組
 * @returns {Object} 翻譯工具
 */
export const useLocalI18n = (i18nModule?: ScopeKey): LocalI18n => {
  const localI18n = useI18n({
    useScope: 'global',
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
export function useBoundingClientRect(
  dom: Ref<Element | null> | Element,
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

export type Variant = 'p' | 'text'
  | 'h1' | 'h3' | 'caption'
  |'button' | 'image'
  | 'circle' | 'rect'
/**
 * @author Caleb
 * @description 懶加載組件
 * @param {Function} loader () => import('@/components/MyAsyncComponent.vue')
 * @param {Variant} variant 類型
 */
export const useAsyncComponent = (loader: () => Promise<any>, variant: string = 'rect') => {
  return defineAsyncComponent({
    loader,
    loadingComponent: <Async_Skeleton variant={variant} />, // 自定義加載組件
    errorComponent: <Async_Error variant={variant} />, // 自定義錯誤組件
    delay: 200, // 延遲顯示加載組件
    timeout: 5000, // 超過時間顯示錯誤組件
    suspensible: false // Suspense
  })
}

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
      get() {
        track()
        return value
      },
      set(newValue) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          trigger()
        }, 200)
      }
    }
  })
}

// vue use

/**
 * @see https://vueuse.org/useRefHistory
 * @description 工能說明
 * 1.記錄歷史：跟踪 ref 的歷史記錄，保存所有變更的歷史值。
 * 2.方便查詢：提供簡單的接口來查詢和操作歷史記錄。
 * 3.支持回溯：可以用來實現撤銷/重做功能，或在應用中追溯數據變化歷史。
 *
 * @param {Ref<Raw>} source ref的值
 * @param {UseRefHistoryOptions<Raw, Serialized>} options 其他設定
 * @returns {UseRefHistoryReturn<Raw, Serialized>} 變動歷史資訊
 * history: 一個響應式的數組，包含 ref 的歷史記錄。每次 ref 的值發生變化時，這個數組會更新，記錄所有變化過的值。
 */
export const useRefHistory = <Raw, Serialized = Raw>(source: Ref<Raw>, options?: UseRefHistoryOptions<Raw, Serialized> ): UseRefHistoryReturn<Raw, Serialized> => {
  return _useRefHistory(source, options)
}

/**
 * @see https://vueuse.org/useThrottledRefHistory
 * @description 工能說明
 * 1.記錄歷史：跟踪 ref 的歷史記錄，允許你查詢或操作過去的值。
 * 2.節流更新：節流（throttling）變更記錄，避免因頻繁的更新而影響性能。
 * 3.簡化管理：提供一個簡單的接口來管理和查詢 ref 的歷史記錄。

 * @param {Ref<Raw>} source ref的值
 * @param {UseThrottledRefHistoryOptions<Raw, Serialized>} options 其他設定
 * @returns {UseThrottledRefHistoryReturn<Raw, Serialized>} 變動歷史資訊
 * history: 一個響應式的數組，包含 ref 的歷史記錄。每次 ref 的值變化時，這個數組會更新。
 */
export const useThrottledRefHistory = <Raw, Serialized = Raw>(source: Ref<Raw>, options?: UseThrottledRefHistoryOptions<Raw, Serialized>): UseThrottledRefHistoryReturn<Raw, Serialized> => {
  return _useThrottledRefHistory(source, options)
}

/**
 * @see https://vueuse.org/useDebouncedRefHistory
 * @description 工能說明
 * 1.記錄歷史：跟踪 ref 的歷史記錄，保存所有變更的歷史值。
 * 2.防抖更新：使用防抖機制來延遲歷史記錄的更新，減少因頻繁變化造成的性能開銷。
 * 3.方便查詢：提供一個簡單的接口來查詢和操作歷史記錄。
 *
 * @param {Ref<Raw>} source ref的值
 * @param {UseThrottledRefHistoryOptions<Raw, Serialized>} options 其他設定
 * @returns {UseThrottledRefHistoryReturn<Raw, Serialized>} 變動歷史資訊
 * history: 一個響應式的數組，包含 ref 的歷史記錄。每次 ref 的值變化時，這個數組會在防抖間隔後更新。
 */
export const useDebouncedRefHistory = <Raw, Serialized = Raw>(source: Ref<Raw>, options?: Omit<UseRefHistoryOptions<Raw, Serialized>, 'eventFilter'> & {
  debounce?: MaybeRefOrGetter<number>;
}): UseRefHistoryReturn<Raw, Serialized> => {
  return _useDebouncedRefHistory(source, options)
}

/**
 * @see https://vueuse.org/useMouse
 * @description 功能說明
 * 1.實現拖拽：使元素可以被拖拽，並在拖拽過程中更新元素的位置。
 * 2.支持事件回調：提供回調函數來處理拖拽開始、拖拽過程和拖拽結束等事件。
 * 3.簡化配置：支持多種配置選項，讓你可以根據需求定制拖拽行為。
 *
 * @param {MaybeElementRef} target ref的值 | Element
 * @param {UseDraggableOptions} options 其他設定
 * onStart: 拖拽開始時觸發的回調函數。
 * onMove: 拖拽過程中觸發的回調函數，會接收拖拽事件對象。
 * onEnd: 拖拽結束時觸發的回調函數。
 * @returns {UseDraggableReturn}
 */
export const useDraggable = (target: Ref, options?: UseDraggableOptions): UseDraggableReturn => {
  return _useDraggable(target, options)
}

/**
 * @see https://vueuse.org/useMouse
 * @description 功能說明
 * 1.獲取鼠標位置：提供鼠標的 X 和 Y 坐標，使得可以在應用中追蹤鼠標的位置。
 * 2.鼠標按鈕狀態：檢查鼠標的按鈕狀態，例如左鍵、右鍵是否被按下。
 * 3.簡化事件處理：自動處理鼠標事件的綁定和解除，使得你可以專注於業務邏輯。
 *
 * @param {UseMouseOptions} options 其他設定
 * @returns {UseMouseReturn}
 * x: 鼠標的 X 坐標。
 * y: 鼠標的 Y 坐標。
 * left: 一個布林值，表示左鍵是否被按下。
 * right: 一個布林值，表示右鍵是否被按下。
 * middle: 一個布林值，表示中鍵（滾輪）是否被按下。
 */
export const useMouse = (options?: UseMouseOptions): UseMouseReturn => {
  return _useMouse(options)
}

/**
 * @see https://vueuse.org/useMouseInElement
 * @description 功能說明
 * 1.檢測鼠標位置：能夠檢測鼠標是否在指定的元素內部。
 * 2.提供狀態：提供一個響應式的布林值，表示鼠標是否在元素內部。
 * 3.簡化處理：自動處理事件監聽的綁定和解除，使得你能專注於業務邏輯。0
 *
 * @param {MaybeElementRef} target ref的值 | Element
 * @param {MouseInElementOptions} options 其他設定
 * @returns {UseMouseInElementReturn}
 * isMouseInside: 一個響應式的布林值，表示鼠標是否在指定的元素內部。
 */
export const useMouseInElement = (target?: MaybeElementRef, options?: MouseInElementOptions): UseMouseInElementReturn => {
  return _useMouseInElement(target, options)
}

/**
 * @see https://vueuse.org/core/useEventBus
 * @description 功能說明
 * 1.事件發送與接收：useEventBus 提供了簡單的方法來發送和接收事件，實現組件之間的消息傳遞。
 * 2.組件解耦：通過事件總線，你可以在不直接引用或傳遞 props 的情況下，使不同組件之間進行交互。
 * 3.事件管理：支持事件的訂閱、觸發和取消訂閱，幫助你更好地管理應用中的事件流。
 *
 * @param {EventBusIdentifier<string>} key 是事件總線的唯一標識符，用於區分不同的事件總線。
 * @returns {UseEventBusReturn}
 * eventBus.emit(event: string, payload: any): 發送事件。event 是事件名稱，payload 是要傳遞的數據。
 * eventBus.on(event: string, listener: Function): 註冊事件監聽器。event 是事件名稱，listener 是事件處理函數。
 * eventBus.off(event: string, listener: Function): 取消註冊事件監聽器。event 是事件名稱，listener 是要取消的事件處理函數。
 */
export const useEventBus: <T = any, P = any>(key: EventBusIdentifier<T>) => UseEventBusReturn<T, P> = (key: EventBusIdentifier<any>) => {
  return _useEventBus(key)
}

/**
 * https://react.dev/reference/react/hooks
 */


/**
 * @author Caleb
 * @description 類似 react useId
 * @returns {String} 隨機Id
 */
export function useId(): string {
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
export function useState<T>(
  defaultValue: T
): [Readonly<Ref<DeepReadonly<T>>>, (newValue: T) => void] {
  let value = defaultValue

  const data = customRef<T>((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
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
export function useEffect<T>(callback: OnMountedCallback<T>, watchValue: any): void {
  const scope = effectScope()
  let isWatch = false
  let onUnmountedCallback = null

  onMounted(() => {
    isWatch = !isEmpty(watchValue)

    if (isWatch) {
      scope.run(() => {
        watch(
          watchValue,
          (newValue, oldValue) => {
            onUnmountedCallback = callback(newValue, oldValue)
          },
          {
            deep: true,
            immediate: true
          }
        )
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
