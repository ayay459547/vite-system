import { ref, computed } from 'vue'

import { isEmpty } from '@/lib/lib_utils'

// 勾選資訊
export const useWebViewSelection = () => {
  // const isSelectionAll = ref(false) // 跨頁選取介面
  const selectionRow = ref<any>(null)
  const selectionList = ref([])

  // 編號顯示 包含 checkbox 勾選資訊
  const __isShowSelectionInfo__ = ref(false)
  const isShowSelectionInfo = computed({
    get: () => {
      return !isEmpty(selectionList.value) || __isShowSelectionInfo__
    },
    set: (v: boolean) => {
      __isShowSelectionInfo__.value = v
    }
  })
  return {
    selectionRow,
    selectionList,
    isShowSelectionInfo
  }
}
