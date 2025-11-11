/**
 * @description vueuse 相關 hook
 * @see https://vueuse.org/
 */

export {
  useRefHistory,
  refThrottled,
  useThrottledRefHistory,
  useDebouncedRefHistory,
  useDraggable,
  useElementSize,
  useResizeObserver,
  useMouse,
  useMouseInElement,
  useMutationObserver,
  useEventBus,
  useWindowFocus,
  useNetwork,
  useEventSource,
  useWebSocket,
  useWebWorker,
  useFocus,
  useFocusWithin,
  useDebounceFn,
  onKeyStroke
} from '@vueuse/core'

/**
 * @description 自訂 hook
 * @see https://vuejs.org/api/reactivity-advanced.html#customref
 */

export { useDebouncedRef } from './useDebouncedRef'

export type { Variant } from './useAsyncComponent'
export { useAsyncComponent } from './useAsyncComponent'

export type { UseInteractReturn } from './useInteract'
export { useInteract } from './useInteract'

export type {
  MessageData,
  OnGetMessage,
  MessageController
} from './usePostMessage'
export { usePostMessage } from './usePostMessage'
