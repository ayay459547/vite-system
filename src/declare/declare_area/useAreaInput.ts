import { ref } from 'vue'

import type { CustomInputProps } from '@/components/input'
import { getAreaList } from '@/api/api_area'

// 製程 用欄位設定
export const useAreaInput = (inputProps?: Partial<CustomInputProps>) => {
  // 動態變化的資料無法使用 v-bind綁定
  const loading = ref(false)
  const options = ref([])

  // 靜態資料
  const remoteMethod = async (query: string) => {
    loading.value = true
    const areaList = await getAreaList(query ?? '')
    options.value = areaList.map(item => {
      const { no } = item
      return { label: no, value: no }
    })
    loading.value = false
  }
  const modalSelect = {
    searchType: 'area',
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
    areaInputProps: {
      // 可替代
      i18nModule: 'system',
      modalSelect,
      ...selectProps,
      ...inputProps,
      // 不可替代
      remoteMethod
    },
    areaLoading: loading,
    areaOptions: options
  }
}
