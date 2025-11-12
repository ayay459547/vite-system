<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, inject, nextTick, reactive, onMounted } from 'vue'

import type { UseHook } from '@/types/types_hook' // 全域功能類型
import { CustomButton } from '@/components/feature'
import { FormList, CustomInput } from '@/components/input'
import { useSimpleTableSetting, useFormListSetting } from '@/lib/lib_columns'
import { isEmpty, scrollToEl } from '@/lib/lib_utils' // 工具

import { workReportColumnSetting } from './columns'
import type { RushOrders } from '../../api'
import type { ResValidate } from './api'
import { getMachineList, getRushOrderList, getProcessList } from '../../api'

const useHook: UseHook = inject('useHook')
const { auth, swal, i18nTranslate } = useHook({
  i18nModule: 'system'
})
const authData = auth()

const props = defineProps({
  uuid: {
    type: String as PropType<string>,
    default: ''
  },
  machineId: {
    type: String as PropType<string>,
    default: ''
  },
  selectedMachineList: {
    type: Array as PropType<string[]>,
    default: () => {
      return []
    }
  },
  status: {
    type: String as PropType<string>,
    default: ''
  },
  // 相同站點 + 相同工單 只能選一次
  disabledList: {
    type: Array as PropType<string[]>,
    default: () => {
      return []
    }
  },
  index: {
    type: Number as PropType<number>,
    default: -1
  },
  // 當前工單資訊
  order: {
    type: Object as PropType<any>,
    default() {
      return {}
    }
  }
})

interface FormData {
  erpNo: string
  sequence: string
  process_Id: string
  LAST_UPDATE_TIMESTAMP: string
  updateBy: string
  status?: string
}

const { tableColumns } = useSimpleTableSetting(workReportColumnSetting, 'table')

const {
  // defaultValue,
  columns: formColumn,
  forms: formList,
  validate: validateForm,
  add,
  remove,
  clear
} = useFormListSetting<FormData>(workReportColumnSetting, 'form', [])

const erpNo = ref('')
// 添加資料
const addItem = () => {
  add({
    process_Id: '',
    erpNo: erpNo.value,
    sequence: '',
    LAST_UPDATE_TIMESTAMP: '',
    updateBy: '',
    status: 'new'
  })
  processRemoteMethod('')
}
const removeItem = async (rowIndex: number) => {
  await Promise.all([
    // 移出防呆
    setDisabled(rowIndex, true),
    // 等畫面
    nextTick()
  ])
  // 移除資料
  remove(rowIndex)
}

const isLoading = ref(false)

const init = async (machineId: string) => {
  isLoading.value = true
  clear()
  await nextTick()

  const { status, msg, data: rushOrderList } = await getRushOrderList(machineId)
  if (status !== 'success') {
    swal({
      icon: 'error',
      title: i18nTranslate('error-getData', 'system'),
      text: msg ?? i18nTranslate('warning-contactIT', 'system'),
      showCancelButton: false
    })
  }

  if (isEmpty(rushOrderList)) {
    addItem()
  }
  rushOrderList.forEach(rushOrderItem => {
    add({
      ...rushOrderItem,
      status: 'old'
    })
  })
  await nextTick()
  // 新增已選擇機台
  emit('add-machine', {
    machineId: machineValue.value,
    index: props.index
  })

  rushOrderList.forEach((_, rushOrderIndex) => {
    setDisabled(rushOrderIndex, false)
  })

  setTimeout(() => {
    const lastElement = document.querySelector(`.MachineRushOrderList-${props.uuid}`)
    if (lastElement) {
      scrollToEl(lastElement, { block: 'center' })
    }

    isLoading.value = false
  }, 300)
}

const emit = defineEmits(['add-machine', 'remove-machine', 'set-disabled', 'remove-disabled'])

const machineValue = ref('')

// 防呆選項
const setDisabled = async (rowIndex: number, isRemove: boolean) => {
  await nextTick()
  const row = formList.value[rowIndex] ?? {
    erpNo: '',
    process_Id: ''
  }
  const { erpNo, process_Id } = row
  if (!isEmpty(erpNo) && !isEmpty(process_Id)) {
    emit('set-disabled', {
      machineId: machineValue.value,
      rowIndex,
      process_Id,
      erpNo,
      isRemove
    })
  }
}

const options = reactive({
  isLoading: false,
  machine: [],
  process: []
})
const machineRemoteMethod = async (machineNo: string) => {
  options.isLoading = true
  await nextTick()
  const {
    status,
    msg,
    data: machineOptions
  } = await getMachineList('', machineNo, props.selectedMachineList)
  if (status !== 'success') {
    swal({
      icon: 'error',
      title: i18nTranslate('error-getData', 'system'),
      text: msg ?? i18nTranslate('warning-contactIT', 'system'),
      showCancelButton: false
    })
  }

  options.machine = machineOptions
  options.isLoading = false
}
const onMachineRemoveClick = async () => {
  // 清除所有防呆
  formList.value.forEach((row, rowIndex) => {
    const { erpNo = '', process_Id = '' } = row

    emit('set-disabled', {
      machineId: machineValue.value,
      rowIndex,
      process_Id,
      erpNo,
      isRemove: true
    })
  })

  // 移除已選擇機台
  await nextTick()
  emit('remove-machine', {
    machineId: machineValue.value,
    index: props.index
  })
}

const processRemoteMethod = async (process: string) => {
  options.isLoading = true
  const {
    status,
    msg,
    data: processOptions
  } = await getProcessList(machineValue.value, process, erpNo.value, props.disabledList)
  if (status !== 'success') {
    swal({
      icon: 'error',
      title: i18nTranslate('error-getData', 'system'),
      text: msg ?? i18nTranslate('warning-contactIT', 'system'),
      showCancelButton: false
    })
  }

  options.process = processOptions
  options.isLoading = false
}

onMounted(async () => {
  isLoading.value = true
  erpNo.value = props?.order?.id ?? ''
  // 已經有以分配的機台
  if (!isEmpty(props.machineId)) {
    machineValue.value = props.machineId
    init(props.machineId)
  }
  await nextTick()
  await machineRemoteMethod(machineValue.value)
  isLoading.value = false
})

const machineRef = ref()

defineExpose({
  validate: async (): Promise<ResValidate> => {
    // 沒有選機台
    if (isEmpty(machineValue.value)) {
      machineRef.value?.validate()

      return {
        machineId: '',
        rushOrders: [],
        updateBy: '',
        status: 'error',
        errorEl: machineRef.value?.getDom()
      }
    }

    // 驗證資料
    return validateForm()
      .then(() => {
        const userName = authData?.user?.fullName ?? ''

        const rushOrders: RushOrders = formList.value.map((formItem, formIndex) => {
          const { process_Id, erpNo } = formItem

          return {
            sequence: formIndex + 1,
            erpNo,
            processId: process_Id,
            memo: '',
            updateBy: userName
          }
        })

        return {
          machineId: machineValue.value,
          rushOrders,
          updateBy: userName,
          status: 'success',
          errorEl: null
        }
      })
      .catch(errorList => {
        console.log('vee error => ', errorList)
        const error = errorList.find(errorItem => {
          return errorItem.el !== null
        })
        const el = error.getDom()
        isLoading.value = false

        return {
          machineId: '',
          rushOrders: [],
          updateBy: '',
          status: 'error',
          errorEl: el
        }
      })
  }
})
</script>

<template>
  <div v-loading="isLoading" class="info-container">
    <div class="info-header">
      <div class="info-header-index">
        <label>{{ `${props.index + 1}.` }}</label>
      </div>
      <CustomInput
        ref="machineRef"
        v-model="machineValue"
        label="機台"
        type="select"
        direction="row"
        is-validate
        hidden-error-message
        required
        remote
        remote-show-suffix
        filterable
        :options="options.machine"
        :remote-method="machineRemoteMethod"
        :loading="options.isLoading"
        :disabled="props.status === 'old'"
        @change="init"
      />
      <CustomButton
        v-if="props.status === 'new'"
        type="danger"
        icon-name="trash-can"
        text
        @click="onMachineRemoveClick"
      />
      <div v-else class="empty-btn"></div>
    </div>
    <div v-show="!isEmpty(machineValue)" class="info-body">
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
        <template #column-process_Id="{ rowIndex, row, data }">
          <CustomInput
            v-if="row.status === 'new'"
            v-model="formList[rowIndex].process_Id"
            v-bind="formColumn.process_Id"
            :options="options.process"
            :remote-method="processRemoteMethod"
            :loading="options.isLoading"
            @change="setDisabled(rowIndex, false)"
          ></CustomInput>
          <div v-else>{{ data }}</div>
        </template>
        <template #column-erpNo="{ data }">
          <div>{{ !isEmpty(data) ? data : '-' }}</div>
        </template>
        <template #column-LAST_UPDATE_TIMESTAMP="{ data }">
          <div>{{ !isEmpty(data) ? data : '-' }}</div>
        </template>
        <template #column-updateBy="{ data }">
          <div>{{ !isEmpty(data) ? data : '-' }}</div>
        </template>

        <template #column-remove="{ row, rowIndex }">
          <CustomButton
            v-if="row.erpNo === erpNo"
            type="danger"
            icon-name="trash-can"
            text
            @click="removeItem(rowIndex)"
          />
          <div v-else class="empty-btn"></div>
        </template>
      </FormList>
    </div>

    <div :class="`MachineRushOrderList-${props.uuid}`"></div>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';

.info {
  &-container {
    width: 100%;
    height: fit-content;
    border-radius: 6px;
    overflow: auto;
    border: 1px solid #e9e9eb;
    box-shadow: 2px 2px 8px 1px color.adjust(#bcbcbc, $lightness: 20%);
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
.empty-btn {
  width: 44px;
  height: 32px;
}
</style>
