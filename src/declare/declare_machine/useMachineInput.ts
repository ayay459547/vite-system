import { ref } from 'vue'

import type { CustomInputProps } from '@/components/input'
import { getMachineList } from '@/api/api_machine'

// 機台 用欄位設定
export const useMachineInput = (inputProps?: Partial<CustomInputProps>) => {
  // 動態變化的資料無法使用 v-bind綁定
  const loading = ref(false)
  const options = ref([])

  // 靜態資料
  const remoteMethod = async (query: string) => {
    loading.value = true
    const machineList = await getMachineList(query ?? '')
    options.value = machineList.map(item => {
      const { id } = item
      return { label: id, value: id }
    })
    loading.value = false
  }
  const modalSelect = {
    searchType: 'machine',
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
    machineInputProps: {
      // 可替代
      i18nModule: 'system',
      modalSelect,
      ...selectProps,
      ...inputProps,
      // 不可替代
      remoteMethod
    },
    machineLoading: loading,
    machineOptions: options
  }
}
