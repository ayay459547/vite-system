import { ref } from 'vue'

import type { CustomInputProps } from '@/components/input'
import { getProcessList } from '@/api/api_process'

// 製程 用欄位設定
export const useProcessInput = (inputProps?: Partial<CustomInputProps>) => {
  // 動態變化的資料無法使用 v-bind綁定
  const loading = ref(false)
  const options = ref([])

  // 靜態資料
  const remoteMethod = async (query: string) => {
    loading.value = true
    const processList = await getProcessList(query ?? '')
    options.value = processList.map(item => {
      const { id } = item
      return { label: id, value: id }
    })
    loading.value = false
  }
  const modalSelect = {
    searchType: 'process',
    multiple: false,
    multipleLimit: 0
  }
  const selectProps = {
    type: 'select',
    options: [],
    filterable: true,
    remote: true,
    default: null
  }
  return {
    processInputProps: {
      // 可替代
      i18nModule: 'system',
      modalSelect,
      ...selectProps,
      ...inputProps,
      // 不可替代
      remoteMethod
    },
    processLoading: loading,
    processOptions: options
  }
}
