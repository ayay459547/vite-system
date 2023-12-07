import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCustomSearchStore = defineStore('customSearch', () => {
  const activeScopedId = ref('')

  // 搜尋用 輸入框 一次只顯示一個
  const setActiveScopedId = (scopedId: string) => {
    activeScopedId.value = scopedId
  }
  const clearActiveScopedId = () => {
    activeScopedId.value = ''
  }
  return {
    activeScopedId,
    setActiveScopedId,
    clearActiveScopedId
  }
})
