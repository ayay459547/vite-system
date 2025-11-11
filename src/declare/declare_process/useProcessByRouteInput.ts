import { ref } from 'vue'

import type { CustomInputProps } from '@/components/input'
import { getRouteIndexOptions } from '@/api/api_process/processByRouting'

// 製程 用欄位設定
export const useProcessByRouteInput = (inputProps?: Partial<CustomInputProps>) => {
  // 動態變化的資料無法使用 v-bind綁定
  const loading = ref(false)
  const options = ref([])

  // 使用途程找製程
  const routeId = ref('')

  // 靜態資料
  const remoteMethod = async (query: string) => {
    loading.value = true
    const routeIndexOptions = await getRouteIndexOptions(routeId.value ?? '')
    options.value = routeIndexOptions.filter(option => {
      return new RegExp(query).test(option.label)
    })
    loading.value = false
  }
  // const modalSelect = {
  //   searchType: 'process',
  //   multiple: false,
  //   multipleLimit: 0
  // }
  const selectProps = {
    type: 'select',
    options: [],
    filterable: true,
    remote: true,
    default: null
  }
  return {
    routeId,
    processInputProps: {
      // 可替代
      i18nModule: 'fund_common',
      // modalSelect,
      ...selectProps,
      ...inputProps,
      // 不可替代
      remoteMethod
    },
    processLoading: loading,
    processOptions: options
  }
}
