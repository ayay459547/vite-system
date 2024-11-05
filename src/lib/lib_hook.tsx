import type { Ref, DeepReadonly } from 'vue'
import { defineAsyncComponent } from 'vue'

import type {
  EventBusIdentifier,
  UseEventBusReturn
} from '@vueuse/core'

import {
  useRefHistory as _useRefHistory,
  refThrottled as _refThrottled,
  useThrottledRefHistory as _useThrottledRefHistory,
  useDebouncedRefHistory as _useDebouncedRefHistory,
  useDraggable as _useDraggable,
  useElementSize as _useElementSize,
  useResizeObserver as _useResizeObserver,
  useMouse as _useMouse,
  useMouseInElement as _useMouseInElement,
  useEventBus as _useEventBus,
  useWindowFocus as _useWindowFocus,
  useNetwork as _useNetwork,
  useEventSource as _useEventSource,
  useWebSocket as _useWebSocket,
  useWebWorker as _useWebWorker
} from '@vueuse/core'

import {
  customRef,
  readonly,
  onMounted,
  onUnmounted,
  effectScope,
  watch
} from 'vue'

import Async_Skeleton from '@/views/Common/Async_Skeleton.vue'
import Async_Error from '@/views/Common/Async_Error.vue'

import { isEmpty, getUuid } from '@/lib/lib_utils' // 工具

export type Variant = 'p' | 'text'
  | 'h1' | 'h3' | 'caption'
  |'button' | 'empty' | 'image'
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
    delay: 300, // 延遲顯示加載組件
    timeout: 60000, // 超過時間顯示錯誤組件
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
 * Shorthand for [useRefHistory](https://vueuse.org/useRefHistory) with throttled filter.
 *
 * @see https://vueuse.org/useThrottledRefHistory
 * @param source
 * @param options
 */
export const useRefHistory = _useRefHistory

/**
 * Throttle execution of a function. Especially useful for rate limiting
 * execution of handlers on events like resize and scroll.
 *
 * @see https://vueuse.org/refThrottled
 * @param value Ref value to be watched with throttle effect
 * @param delay  A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 * @param [trailing] if true, update the value again after the delay time is up
 * @param [leading] if true, update the value on the leading edge of the ms timeout
 */
export const refThrottled = _refThrottled

/**
 * Shorthand for [useRefHistory](https://vueuse.org/useRefHistory) with throttled filter.
 *
 * @see https://vueuse.org/useThrottledRefHistory
 * @param source
 * @param options
 */
export const useThrottledRefHistory = _useThrottledRefHistory

/**
 * Shorthand for [useRefHistory](https://vueuse.org/useRefHistory) with debounce filter.
 *
 * @see https://vueuse.org/useDebouncedRefHistory
 * @param source
 * @param options
 */
export const useDebouncedRefHistory = _useDebouncedRefHistory

/**
 * Make elements draggable.
 *
 * @see https://vueuse.org/useDraggable
 * @param target
 * @param options
 */
export const useDraggable = _useDraggable

/**
 * Reactive size of an HTML element.
 *
 * @see https://vueuse.org/useElementSize
 */
export const useElementSize = _useElementSize

/**
 * Reports changes to the dimensions of an Element's content or the border-box
 *
 * @see https://vueuse.org/useResizeObserver
 * @param target
 * @param callback
 * @param options
 */
export const useResizeObserver = _useResizeObserver

/**
 * Reactive mouse position.
 *
 * @see https://vueuse.org/useMouse
 * @param options
 */
export const useMouse = _useMouse

/**
 * Reactive mouse position related to an element.
 *
 * @see https://vueuse.org/useMouseInElement
 * @param target
 * @param options
 */
export const useMouseInElement = _useMouseInElement

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
 * Reactively track window focus with `window.onfocus` and `window.onblur`.
 *
 * @see https://vueuse.org/useWindowFocus
 */
export const useWindowFocus = _useWindowFocus

/**
 * Reactive Network status.
 *
 * @see https://vueuse.org/useNetwork
 * @param options
 */
export const useNetwork = _useNetwork

/**
 * Reactive wrapper for EventSource.
 *
 * @see https://vueuse.org/useEventSource
 * @see https://developer.mozilla.org/en-US/docs/Web/API/EventSource/EventSource EventSource
 * @param url
 * @param events
 * @param options
 */
export const useEventSource = _useEventSource

/**
 * Reactive WebSocket client.
 *
 * @see https://vueuse.org/useWebSocket
 * @param url
 */
export const useWebSocket = _useWebSocket

/**
 * Simple Web Workers registration and communication.
 *
 * @see https://vueuse.org/useWebWorker
 * @param url
 * @param workerOptions
 * @param options
 */
/**
 * Simple Web Workers registration and communication.
 *
 * @see https://vueuse.org/useWebWorker
 * @param worker
 */
export const useWebWorker = _useWebWorker

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
