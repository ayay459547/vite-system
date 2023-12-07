import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import { isEmpty } from '@/lib/lib_utils'

export const useCustomModalStore = defineStore('customModal', () => {
  // 正在使用的 modal 要浮在最上面
  const modalIndexMap = reactive<Record<string, number>>({})
  const count = ref(0)
  const modalMax = ref(0)

  const clearModal = () => {
    for (const scopedId in modalIndexMap) {
      delete modalIndexMap[scopedId]
    }
    modalMax.value = 0
  }

  const modalCount = computed({
    get () {
      if (count.value <= 0) {
        clearModal()
      }
      return count.value
    },
    set (v: number) {
      count.value = Math.max(0, v)
    }
  })

  const setModalIndex = (scopedId: string) => {
    if (isEmpty(modalIndexMap[scopedId])) {
      modalCount.value++
    }
    modalIndexMap[scopedId] = ++modalMax.value
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
