
import { ref, computed } from 'vue'

import { WebViewTable } from '@/components/table' // 系統組件: 表格
import { getProxyData } from '@/lib/lib_utils' // 工具

export const useModalSelectData = (props: Record<string, any>) => {
  const WebViewTableRef = ref<InstanceType<typeof WebViewTable>>()

  const onWebViewTableMounted = () => {
    WebViewTableRef.value?.init()
  }

  // 切換選取
  const toggleSelection = (rows: any[]) => {
    WebViewTableRef.value?.toggleSelection(rows)
  }
  // 取得選取的資料
  const getSelectionRows = () => {
    const selectionRows = WebViewTableRef.value?.getSelectionRows() ?? []
    return getProxyData(selectionRows)
  }

  // 以選資料
  const selectedValue = ref([])

  const selectedSet = computed(() => {
    const __selectedSet__ = new Set()
    selectedValue.value.forEach(row => {
      __selectedSet__.add(row.rowId)
    })
    return __selectedSet__
  })

  // 勾選單筆
  const onSelect = (selection: any[], row: any) => {
    if (!props.multiple) {
      toggleSelection([])
      toggleSelection([row])
      selectedValue.value = [row]
    } else {
      selectedValue.value = selection
    }
  }
  // 勾選全部
  const onSelectAll = (selection: any[]) => {
    if (!props.multiple) {
      toggleSelection([])
      selectedValue.value = []
    } else {
      selectedValue.value = selection
    }
  }

  return {
    WebViewTableRef,
    onWebViewTableMounted,
    toggleSelection,
    getSelectionRows,
    selectedValue,
    selectedSet,
    onSelect,
    onSelectAll
  }
}
