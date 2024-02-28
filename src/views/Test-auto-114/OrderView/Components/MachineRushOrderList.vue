<script setup lang="ts">
import { ref, inject } from 'vue'

import type { UseHook } from '@/declare/hook'
import { FormList, CustomInput, CustomButton } from '@/components'
import { getSimpleTableSetting, getFormListSetting } from '@/lib/lib_columns'
import { scrollToEl, isEmpty } from '@/lib/lib_utils'

import { workReportColumnSetting } from './columns'

const useHook: UseHook = inject('useHook')
const { auth } = useHook()
const authData = auth()

interface FormData {
  orderNo: string
  sequence: string
  processNo: string
  LAST_UPDATE_TIMESTAMP: string
  updateBy: string
}

const machineRef = ref('')
const machineOptions = [
  { label: 'machine-1', value: 'machine-1' },
  { label: 'machine-2', value: 'machine-2' },
  { label: 'machine-3', value: 'machine-3' }
]

const {
  tableColumns
} = getSimpleTableSetting(workReportColumnSetting, 'table')

const {
  // defaultValue,
  columns: formColumn,
  forms: formList,
  validate: validateForm,
  add,
  remove
} = getFormListSetting<FormData>(workReportColumnSetting, 'form', [])

const addItem = () => {
  const userName = authData?.user?.fullName ?? ''

  add({
    orderNo: '',
    processNo: '',
    sequence: '',
    LAST_UPDATE_TIMESTAMP: '',
    updateBy: userName
  })
}


</script>

<template>
  <div class="info-container">
    <div class="info-header">
      <CustomInput
        v-model="machineRef"
        label="機台"
        type="select"
        :options="machineOptions"
      />
    </div>
    <div class="info-body">
      <FormList
        v-model="formList"
        :table-data="formList"
        :table-columns="tableColumns"
        :column-setting="workReportColumnSetting"
        item-key="key"
        is-create
        is-remove
        is-draggable
        @add="addItem"
      >
        <template #column-sequence="{ rowIndex }">
          <div>{{ rowIndex + 1 }}</div>
        </template>
        <template #column-processNo="{ rowIndex }">
          <CustomInput
            v-model="formList[rowIndex].processNo"
            v-bind="formColumn.processNo"
          ></CustomInput>
        </template>
        <template #column-orderNo="{ rowIndex }">
          <CustomInput
            v-model="formList[rowIndex].orderNo"
            v-bind="formColumn.orderNo"
          ></CustomInput>
        </template>
        <template #column-LAST_UPDATE_TIMESTAMP="{ data }">
          <div>{{ !isEmpty(data) ? data : '-' }}</div>
        </template>
        <template #column-updateBy="{ data }">
          <div>{{ !isEmpty(data) ? data : '-' }}</div>
        </template>

        <template #column-remove="{ row, rowIndex }">
          <CustomButton
            v-if="isEmpty(row.sequence)"
            type="danger"
            icon-name="trash-can"
            text
            @click="remove(rowIndex)"
          />
          <div v-else class="empty-btn"></div>
        </template>
      </FormList>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.info {
  &-container {
    width: 100%;
    height: 100%;
    border-radius: 6px;
    overflow: auto;
    border: 1px solid #e9e9eb;
    box-shadow: 2px 2px 8px 1px lighten(#bcbcbc, 20%);
  }
  &-header {
    background-color: #409EFF;
    padding: 16px;
  }
  &-body {
    width: 100%;
    height: fit-content;
  }
}
</style>
