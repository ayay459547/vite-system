import { ref, onMounted } from 'vue'
import { defineStore } from 'pinia'

export const useCustomSearchStore = defineStore('customSearch', () => {
  const activeScopedIdSet = ref(new Set())

  // 搜尋用 輸入框 一次只顯示一個
  const setActiveScopedId = (scopedId: string) => {
    if (!activeScopedIdSet.value.has(scopedId)) {
      activeScopedIdSet.value.add(scopedId)
    }
  }
  const removeActiveScopedId = (scopedId: string) => {
    return activeScopedIdSet.value.delete(scopedId)
  }

  onMounted(() => {
    activeScopedIdSet.value.clear()
  })
  return {
    activeScopedIdSet,
    setActiveScopedId,
    removeActiveScopedId
  }
})
