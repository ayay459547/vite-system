import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { isEmpty } from '@/lib/lib_utils' // 工具

export const useModalSelectStore = defineStore('ModalSelect', () => {

  // 開啟 ModalSelectManagement 的類型
  const activeType = ref<string>('')
  // 開啟 ModalSelectManagement 的 id, 對應 ModalSelect 的 id
  const activeId = ref<string | number | null>(null)
  // 上一次開啟 ModalSelectManagement 的 id, submit 使用
  const lastActiveId = ref<string | number | null>(null)
  // 關閉 ModalSelectManagement 後設定 value
  const activeValue = ref<any>(null)

  // 是否多選
  const multiple = ref(false)
  // multiple 屬性設定為 true 時，代表多重選擇場景下使用者最多可選擇的項目數， 為 0 則不限制
  const multipleLimit = ref(0)

  // 透過 ModalSelect 設定 id 打開 ModalSelectManagement
  const isModalOpen = computed({
    get: () => {
      return !isEmpty(activeId.value)
    },
    set: (v: boolean) => {
      if (!v) {
        activeType.value = ''
        activeId.value = null
      }
    }
  })

  return {
    activeType, activeId, lastActiveId, activeValue, isModalOpen,
    multiple, multipleLimit
  }
})
