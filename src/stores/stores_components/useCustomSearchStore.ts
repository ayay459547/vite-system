import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCustomSearchStore = defineStore('CustomSearch', () => {
  const activeScopedIdSet = ref(new Set())

  // 搜尋用 輸入框 一次只顯示一個
  const setActiveScopedId = (scopedId: string) => {
    activeScopedIdSet.value.clear()
    activeScopedIdSet.value.add(scopedId)
  }
  const removeActiveScopedId = (scopedId: string) => {
    return activeScopedIdSet.value.delete(scopedId)
  }

  setTimeout(() => {
    activeScopedIdSet.value.clear()
  }, 0)
  return {
    activeScopedIdSet,
    setActiveScopedId,
    removeActiveScopedId
  }
})
