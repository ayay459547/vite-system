import { ref } from 'vue'

import type { CustomInputProps } from '@/components/input'
import { getSpecList } from '@/api/api_spec/specCommon'

// 機台用欄位設定
export const useSpecCommonInput = (inputProps?: Partial<CustomInputProps>) => {
  // 動態變化的資料無法使用 v-bind綁定
  const loading = ref(false)
  const options = ref([])

  // 靜態資料
  const remoteMethod = async (query: string) => {
    loading.value = true
    const specIdOptions = await getSpecList(query)
    options.value = specIdOptions.map(item => {
      const { id } = item
      return { label: id, value: id }
    })
    loading.value = false
  }
  const modalSelect = {
    searchType: 'specCommon',
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
    specCommonInputProps: {
      // 可替代
      i18nModule: 'fund_common',
      modalSelect,
      ...selectProps,
      ...inputProps,
      // 不可替代
      remoteMethod
    },
    specCommonLoading: loading,
    specCommonOptions: options
  }
}
