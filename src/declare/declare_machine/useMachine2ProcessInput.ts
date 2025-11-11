import { ref } from 'vue'

import type { CustomInputProps } from '@/components/input'
import { getMachine2ProcessList } from '@/api/api_machine/machine2Process'

// 機台對應製程用欄位設定
export const useMachine2ProcessInput = (inputProps?: Partial<CustomInputProps>) => {
  // 動態變化的資料無法使用 v-bind綁定
  const loading = ref(false)
  const options = ref([])

  const searchType = ref('process') // 'machine' | 'process'
  const searchProcessId = ref('') // 指定製程
  const searchMachineId = ref('') // 指定機台

  // 靜態資料
  const remoteMethod = async (query: string) => {
    loading.value = true
    const machineList = await getMachine2ProcessList({
      type: searchType.value,
      processId: (
        // 搜尋機台 指定製程
        searchType.value === 'machine' ? searchProcessId.value : query
      ),
      machineId: (
        // 搜尋製程 指定機台
        searchType.value === 'process' ? searchMachineId.value : query
      )
    })
    options.value = machineList.map(row => {
      const { machineId, processId } = row
      const value = searchType.value === 'machine' ? machineId : processId
      return { label: value, value, data: row }
    })
    loading.value = false
  }
  const modalSelect = {
    searchType: searchType.value,
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
    searchType,
    searchProcessId,
    searchMachineId,
    machine2ProcessInputProps: {
      // 可替代
      i18nModule: 'fund_common',
      modalSelect,
      ...selectProps,
      ...inputProps,
      // 不可替代
      remoteMethod
    },
    machine2ProcessLoading: loading,
    machine2ProcessOptions: options
  }
}
