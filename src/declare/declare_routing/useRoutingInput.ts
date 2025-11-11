import { ref } from 'vue'

import type { CustomInputProps } from '@/components/input'
import { getRoutingList } from '@/api/api_routing'

// 途程 用欄位設定
export const useRoutingInput = (inputProps?: Partial<CustomInputProps>) => {
  // 動態變化的資料無法使用 v-bind綁定
  const loading = ref(false)
  const options = ref([])

  // 靜態資料
  const remoteMethod = async (query: string) => {
    loading.value = true
    const routingList = await getRoutingList(query ?? '')
    options.value = routingList.map(item => {
      const { id } = item
      return { label: id, value: id }
    })
    loading.value = false
  }
  const modalSelect = {
    searchType: 'routing',
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
    routingInputProps: {
      // 可替代
      i18nModule: 'fund_common',
      modalSelect,
      ...selectProps,
      ...inputProps,
      // 不可替代
      remoteMethod
    },
    routingLoading: loading,
    routingOptions: options
  }
}
