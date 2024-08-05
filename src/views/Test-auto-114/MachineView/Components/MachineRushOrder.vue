<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, onMounted, inject } from 'vue'

import type { UseHook } from '@/declare/hook.ts'
import { FormList, CustomInput, CustomButton } from '@/components'
import { useSimpleTableSetting, useFormListSetting } from '@/lib/lib_columns'
import { scrollToEl, isEmpty } from '@/lib/lib_utils'
import type { TableData } from '../api'
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

const props = defineProps({
  machine: {
    type: Object as PropType<TableData>,
    default: () => {
      return {
        machineId: '',
        areaName: '',
        sum: '',
        machineNote: ''
      }
    }
  }
})

const machine = ref<TableData>({
  machineId: '',
  areaName: '',
  sum: '',
  machineNote: ''
})
const initRushOrderData = () => {
  const rushOrderlist = [
    {
      orderNo: 'PF0462103W056S-ENG',
      sequence: '3',
      processNo: 'CP-0210',
      LAST_UPDATE_TIMESTAMP: '2024-01-23 09:49',
      updateBy: 'aat'
    },
    {
      orderNo: 'PF0462103W056S-ENG',
      sequence: '4',
      processNo: 'CP-0100',
      LAST_UPDATE_TIMESTAMP: '2024-01-24 11:49',
      updateBy: 'aat'
    }
  ]

  rushOrderlist.forEach(rushOrderItem => {
    add(rushOrderItem)
  })
}

onMounted(() => {
  machine.value = props.machine

  initRushOrderData()

  console.log('machine => ', machine.value)
})

const { tableColumns } = useSimpleTableSetting(workReportColumnSetting, 'table')

const {
  // defaultValue,
  columns: formColumn,
  forms: formList,
  validate: validateForm,
  add,
  remove
} = useFormListSetting<FormData>(workReportColumnSetting, 'form', [])

const addItem = () => {
  const userName = authData?.user?.fullName ?? ''

  add({
    orderNo: '',
    sequence: '',
    processNo: '',
    LAST_UPDATE_TIMESTAMP: '',
    updateBy: userName
  })
}

defineExpose({
  submit: async (): Promise<string> => {
    return validateForm()
      .then(successList => {
        console.log('vee success => ', successList)

        return 'success'
      })
      .catch(errorList => {
        console.log('vee error => ', errorList)
        const error = errorList.find(errorItem => {
          return errorItem.el !== null
        })
        if (error) {
          const el = error.getDom()
          scrollToEl(el)
        }
        return 'error'
      })
  }
})
</script>

<template>
  <div class="machine-rush-order">
    <div class="machine-rush-order-form">
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
        <template #column-orderNo="{ rowIndex }">
          <CustomInput
            v-model="formList[rowIndex].orderNo"
            v-bind="formColumn.orderNo"
          ></CustomInput>
        </template>
        <template #column-processNo="{ rowIndex }">
          <CustomInput
            v-model="formList[rowIndex].processNo"
            v-bind="formColumn.processNo"
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
.machine-rush-order {
  width: 100%;
  height: 100%;
  padding: 12px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  &-form {
    flex: 1;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .empty-btn {
    width: 44px;
    height: 32px;
  }
}
</style>
