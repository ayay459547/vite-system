import { ref } from 'vue'

import type { CustomInputProps } from '@/components/input'
import { getOrderList } from '@/api/api_order'

// 訂單 用欄位設定
export const useOrderInput = (inputProps?: Partial<CustomInputProps>) => {
  // 動態變化的資料無法使用 v-bind綁定
  const loading = ref(false)
  const options = ref([])

  // 靜態資料
  const remoteMethod = async (query: string) => {
    loading.value = true
    const orderList = await getOrderList(query ?? '')
    options.value = orderList.map(item => {
      const { id } = item
      return { label: id, value: id }
    })
    loading.value = false
  }
  const modalSelect = {
    searchType: 'order',
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
    orderInputProps: {
      // 可替代
      i18nModule: 'auto_common',
      modalSelect,
      ...selectProps,
      ...inputProps,
      // 不可替代
      remoteMethod
    },
    orderLoading: loading,
    orderOptions: options
  }
}
