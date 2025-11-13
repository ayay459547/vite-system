import { ref } from 'vue'

import type { CustomInputProps } from '@/components/input'
import { getSpecTypeList } from '@/api/api_spec/specType'

// 機台用欄位設定
export const useSpecTypeInput = (inputProps?: Partial<CustomInputProps>) => {
  // 動態變化的資料無法使用 v-bind綁定
  const loading = ref(false)
  const options = ref([])

  // 靜態資料
  const remoteMethod = async (query: string) => {
    loading.value = true
    const regexp = new RegExp(query)
    const specIdOptions = await getSpecTypeList()
    options.value = specIdOptions.reduce((res, item) => {
      const { id } = item
      if (regexp.test(id)) {
        res.push({ label: id, value: id })
      }
      return res
    }, [])
    loading.value = false
  }
  const modalSelect = {
    searchType: 'specType',
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
    specTypeInputProps: {
      // 可替代
      i18nModule: 'system',
      modalSelect,
      ...selectProps,
      ...inputProps,
      // 不可替代
      remoteMethod
    },
    specTypeLoading: loading,
    specTypeOptions: options
  }
}
