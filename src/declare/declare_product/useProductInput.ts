import { ref } from 'vue'

import type { CustomInputProps } from '@/components/input'
import { getProductList } from '@/api/api_product'

// 產品 用欄位設定
export const useProductInput = (inputProps?: Partial<CustomInputProps>) => {
  // 動態變化的資料無法使用 v-bind綁定
  const loading = ref(false)
  const options = ref([])

  // 靜態資料
  const remoteMethod = async (query: string) => {
    loading.value = true
    const productList = await getProductList(query ?? '')
    options.value = productList.map(item => {
      const { id } = item
      return { label: id, value: id }
    })
    loading.value = false
  }
  const modalSelect = {
    searchType: 'product',
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
    productInputProps: {
      // 可替代
      i18nModule: 'fund_common',
      modalSelect,
      ...selectProps,
      ...inputProps,
      // 不可替代
      remoteMethod
    },
    productLoading: loading,
    productOptions: options
  }
}
