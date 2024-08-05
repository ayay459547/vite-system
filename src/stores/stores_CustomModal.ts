import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'

import { isEmpty } from '@/lib/lib_utils'

export const useCustomModalStore = defineStore('customModal', () => {
  // 正在使用的 modal 要浮在最上面
  const modalIndexMap = reactive<Record<string, number>>({})
  const count = ref(0)
  const modalMax = ref(0)

  const modalCount = computed({
    get() {
      if (count.value <= 0) {
        clearModal()
      }
      return count.value
    },
    set(v: number) {
      count.value = Math.max(0, v)
    }
  })

  const clearModal = () => {
    for (const scopedId in modalIndexMap) {
      delete modalIndexMap[scopedId]
    }
    modalMax.value = 0
    modalCount.value = 0
  }

  const setModalIndex = (scopedId: string) => {
    if (isEmpty(modalIndexMap[scopedId])) {
      modalCount.value++
    }
    // 最上面 不用加 index
    if (modalIndexMap[scopedId] >= modalMax.value) return
    // 只有一個 modal 不用往上疊
    if (modalCount.value === 1) {
      modalMax.value = 1
      modalIndexMap[scopedId] = modalMax.value
    } else {
      modalIndexMap[scopedId] = ++modalMax.value
    }
  }

  const removeModalIndex = (scopedId: string) => {
    if (typeof modalIndexMap[scopedId] === 'number') {
      delete modalIndexMap[scopedId]
      modalCount.value--
    }
  }

  return {
    modalIndexMap,
    modalCount,
    modalMax,
    setModalIndex,
    removeModalIndex,
    clearModal
  }
})
