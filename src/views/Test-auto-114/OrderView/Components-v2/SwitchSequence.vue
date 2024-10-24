<script setup lang="ts">
import type { PropType } from 'vue'
import { onMounted } from 'vue'

import { FormList } from '@/components' // 系統組件
import { useSimpleTableSetting, useFormListSetting } from '@/lib/lib_columns'
import { isEmpty } from '@/lib/lib_utils' // 工具

import { switchSequenceColumnSetting } from './columns'

export interface SwitchSequenceFormData {
  erpNo: string
  sequence: string
  process_Id: string
  LAST_UPDATE_TIMESTAMP: string
  updateBy: string
}

const props = defineProps({
  erpNo: {
    type: String as PropType<string>,
    default: ''
  },
  processId: {
    type: String as PropType<string>,
    default: ''
  },
  rushOrderList: {
    type: Array as PropType<SwitchSequenceFormData[]>,
    default: () => {
      return []
    }
  }
})

const { tableColumns } = useSimpleTableSetting(switchSequenceColumnSetting, 'table')

const {
  // defaultValue,
  // columns: formColumn,
  forms: formList,
  add,
  clear
} = useFormListSetting<SwitchSequenceFormData>(switchSequenceColumnSetting, 'form', [])

const init = () => {
  props.rushOrderList.forEach(rushOrderItem => {
    add(rushOrderItem)
  })
}

const isCurrentRow = (row: SwitchSequenceFormData) => {
  const { erpNo, process_Id } = row
  return props.erpNo === erpNo && props.processId === process_Id
}

onMounted(() => {
  clear()
  init()
})

defineExpose({
  submit: (): SwitchSequenceFormData[] => {
    return formList.value
  }
})
</script>

<template>
  <div class="switch-sequence">
    <FormList
      v-model="formList"
      :table-data="formList"
      :table-columns="tableColumns"
      :column-setting="switchSequenceColumnSetting"
      item-key="key"
      is-draggable
    >
      <template #column-sequence="{ row, rowIndex }">
        <div :class="isCurrentRow(row) ? 'text-danger' : ''">{{ rowIndex + 1 }}</div>
      </template>
      <template #column-process_Id="{ row, data }">
        <div :class="isCurrentRow(row) ? 'text-danger' : ''">{{ !isEmpty(data) ? data : '-' }}</div>
      </template>
      <template #column-erpNo="{ row, data }">
        <div :class="isCurrentRow(row) ? 'text-danger' : ''">{{ !isEmpty(data) ? data : '-' }}</div>
      </template>
      <template #column-LAST_UPDATE_TIMESTAMP="{ data }">
        <div>{{ !isEmpty(data) ? data : '-' }}</div>
      </template>
      <template #column-updateBy="{ data }">
        <div>{{ !isEmpty(data) ? data : '-' }}</div>
      </template>
    </FormList>
  </div>
</template>

<style lang="scss" scoped>
.switch-sequence {
  width: 100%;
  height: 100%;
}
</style>
