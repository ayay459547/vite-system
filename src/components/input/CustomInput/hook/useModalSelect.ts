import type { WatchHandle } from 'vue'
import { ref, watch, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'

import { useModalSelectStore } from '@/stores/stores_components/useModalSelectStore'

// ModalSelect
export const useModalSelect = (isUseModalSelect: boolean, onOpenCallback: () => void) => {
  const valueModalSelect = ref()

  const modalSelectStore = useModalSelectStore()
  const { isModalOpen } = storeToRefs(modalSelectStore)

  // 監聽
  let unwatch: WatchHandle | null = null

  const openWatchModalSelect = () => {
    if (!isUseModalSelect) return
    unwatch = watch(isModalOpen, (newValue: boolean, oldValue: boolean) => {
      /**
       * 當打開 ModalSelectManagement
       * 需要輸入框 blur (關閉選擇框的選項)
       */
      if (!oldValue && newValue) {
        onOpenCallback()
      } else {
        stopWatchModalSelect()
      }
    }, { deep: false, immediate: false })
  }

  const stopWatchModalSelect = () => {
    if (!isUseModalSelect) return
    if (unwatch && typeof unwatch === 'function') {
      unwatch() // 取消監聽
      unwatch = null
    }
  }

  onUnmounted(() => {
    stopWatchModalSelect()
  })

  return {
    valueModalSelect,
    openWatchModalSelect,
    stopWatchModalSelect
  }
}
