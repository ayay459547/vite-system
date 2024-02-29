<script setup lang="ts">
import type { PropType  } from 'vue'
import { ref, inject, nextTick } from 'vue'

import type { UseHook } from '@/declare/hook'
import { FormList, CustomInput, CustomButton } from '@/components'
import { getSimpleTableSetting, getFormListSetting } from '@/lib/lib_columns'
import { isEmpty } from '@/lib/lib_utils'

import { workReportColumnSetting } from './columns'

const useHook: UseHook = inject('useHook')
const { auth } = useHook({
  i18nModule: 'system'
})
const authData = auth()

const props = defineProps({
  uuid: {
    type: String as PropType<string>,
    default: ''
  },
  index: {
    type: Number as PropType<number>,
    default: -1
  }
})

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
  // validate: validateForm,
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

const onMachineChange = async () => {
  await nextTick()
  if (formList.value.length === 0) {
    addItem()
  }
}

const emit = defineEmits(['remove'])

const onMachineRemoveClick = () => {
  emit('remove', props.index)
}

</script>

<template>
  <div class="info-container">
    <div class="info-header">
      <div class="info-header-index">
        <label>{{ `${props.index + 1}.` }}</label>
      </div>
      <CustomInput
        v-model="machineRef"
        label="機台"
        type="select"
        direction="row"
        :options="machineOptions"
        @change="onMachineChange"
      />
      <CustomButton
        type="danger"
        icon-name="trash-can"
        text
        @click="onMachineRemoveClick"
      />
    </div>
    <div class="info-body">
      <FormList
        v-show="!isEmpty(machineRef)"
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
    height: fit-content;
    border-radius: 6px;
    overflow: auto;
    border: 1px solid #e9e9eb;
    box-shadow: 2px 2px 8px 1px lighten(#bcbcbc, 20%);
  }
  &-header {
    background-color: #c6e2ff;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 12px;

    &-index {
      width: fit-content;
      min-width: 24px;
    }
  }
  &-body {
    width: 100%;
    height: fit-content;
  }
}
</style>
