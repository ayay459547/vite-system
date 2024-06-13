<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, onMounted, inject, nextTick, reactive, computed } from 'vue'

import type { UseHook } from '@/declare/hook'
import { FormList, CustomInput, CustomButton, CustomModal } from '@/components'
import { useSimpleTableSetting, useFormListSetting } from '@/lib/lib_columns'
import { scrollToEl, isEmpty, hasOwnProperty, getProxyData } from '@/lib/lib_utils'
// import type { TableData } from '../api'
import { workReportColumnSetting } from './columns'

// 變動插單順序
import type { SwitchSequenceFormData } from './SwitchSequence.vue'
import SwitchSequence from './SwitchSequence.vue'

import type { RushOrderData, RushOrders } from '../../api'
import {
  getProcessList,
  getMachineList,
  // getErpNoList,
  getRushOrderList,
  rushOrderFromWeb
} from '../../api'

const useHook: UseHook = inject('useHook')
const { auth, swal, i18nTranslate } = useHook({
  i18nModule: 'system'
})
const authData = auth()

interface FormData {
  processId: string
  machineId: string
  sequence?: string
  LAST_UPDATE_TIMESTAMP: string
  updateBy: string

  status: string
}

const props = defineProps({
  order: {
    type: Object as PropType<any>,
    default() {
      return {}
    }
  }
})

const lotNo = computed(() => {
  return props?.order?.id ?? ''
})

/**
 * 機台對應的插單資料
 * 變更順序用
 */
const switchSequenceRef = ref()
const machineRushOrderMap: Record<string, SwitchSequenceFormData[]> = reactive({})
// 新增機台插單資料
const setMachineRushOrderMap = (
  machine_Id: string,
  appendData: SwitchSequenceFormData
): boolean => {
  if (!hasOwnProperty(machineRushOrderMap, machine_Id)) {
    machineRushOrderMap[machine_Id] = []
  }
  const rowIndex = machineRushOrderMap[machine_Id].findIndex(rushOrderItem => {
    const { erpNo, process_Id } = rushOrderItem
    return erpNo === lotNo.value && appendData.process_Id === process_Id
  })
  // 資料不存在才可以新增
  if (rowIndex === -1) {
    machineRushOrderMap[machine_Id].push(appendData)
    return true
  }
  return false
}
// 移除機台插單資料
const removeMachineRushOrderMap = async (rowIndex: number): Promise<boolean> => {
  await nextTick()
  const [machineId, processId] = [
    formList.value[rowIndex]?.machineId ?? '',
    formList.value[rowIndex]?.processId ?? ''
  ]

  const rushOrderList = machineRushOrderMap[machineId]
  if (!Array.isArray(rushOrderList)) return

  const removeIndex = rushOrderList.findIndex(rushOrderItem => {
    const { erpNo, process_Id } = rushOrderItem
    return erpNo === lotNo.value && process_Id === processId
  })
  if (!isEmpty(removeIndex)) {
    rushOrderList.splice(removeIndex, 1)
    return true
  }
  return false
}
const modal = reactive({
  switchSequence: false,
  machineId: '',

  eroNo: '',
  processId: '',
  rushOrderList: []
})
// 打開編輯生產順序
const openSwitchSequence = (row: FormData) => {
  console.log(machineRushOrderMap)

  const { machineId, processId } = row
  modal.machineId = machineId

  const rushOrderList = getProxyData(machineRushOrderMap[machineId])

  modal.eroNo = lotNo.value
  modal.processId = processId
  modal.rushOrderList = rushOrderList

  modal.switchSequence = true
}
// 變更生產順序
const onSwitchSequenceSubmit = () => {
  // 建立 map 製程:資料index
  const formIndexMap = {}
  formList.value.forEach((formItem, formIndex) => {
    const { processId } = formItem
    formIndexMap[processId] = formIndex
  })

  // 機台下的插單資料
  const newRushOrderList: SwitchSequenceFormData[] = switchSequenceRef.value.submit()
  newRushOrderList.forEach((rushOrderItem, rushOrderIndex) => {
    const { erpNo, process_Id } = rushOrderItem
    const sequence = rushOrderIndex + 1

    // 當前的單 依照機台下的生產順序 重新給生產順序
    if (erpNo === lotNo.value) {
      const formIndex = formIndexMap[process_Id]
      formList.value[formIndex].sequence = `${sequence}`
    }
  })

  machineRushOrderMap[modal.machineId] = newRushOrderList
  modal.switchSequence = false
}

// 已經有插單的機台
const oldMachineIdSet = new Set()
// 初始化插單資料
const initRushOrderData = async () => {
  oldMachineIdSet.clear()
  for (let machineId in machineRushOrderMap) {
    delete machineRushOrderMap[machineId]
  }
  // 依據訂單取得分配機台
  const { status, msg, data: planMachineList } = await getRushOrderList('', lotNo.value)

  if (status !== 'success') {
    swal({
      icon: 'error',
      title: i18nTranslate('error-getData', 'system'),
      text: msg ?? i18nTranslate('warning-contactIT', 'system'),
      showCancelButton: false
    })
  }

  // 機台取得所有插單
  const machineRushOrderList = await Promise.all(
    planMachineList.reduce<any>((res, planMachineItem) => {
      const { machine_Id } = planMachineItem
      if (!oldMachineIdSet.has(machine_Id)) {
        res.push(getRushOrderList(machine_Id))
        oldMachineIdSet.add(machine_Id)
      }
      return res
    }, [])
  )

  machineRushOrderList.forEach(rushOrderList => {
    const { status: rushOrderStatus, msg: rushOrderMsg, data: rushOrderData } = rushOrderList
    if (rushOrderStatus !== 'success') {
      swal({
        icon: 'error',
        title: i18nTranslate('error-getData', 'system'),
        text: rushOrderMsg ?? i18nTranslate('warning-contactIT', 'system'),
        showCancelButton: false
      })
    }
    // 插單資料
    rushOrderData.forEach(rushOrderItem => {
      const {
        erpNo,

        process_Id,
        machine_Id,
        sequence,
        LAST_UPDATE_TIMESTAMP,
        updateBy
      } = rushOrderItem

      setMachineRushOrderMap(machine_Id, {
        sequence,
        process_Id,
        erpNo,
        LAST_UPDATE_TIMESTAMP,
        updateBy
      })

      // 新增訂單插單
      if (erpNo === lotNo.value) {
        add({
          processId: process_Id,
          machineId: machine_Id,
          sequence,
          LAST_UPDATE_TIMESTAMP,
          updateBy,
          status: 'old'
        })
      }
    })
  })

  // console.log(machineRushOrderMap)
  await nextTick()

  if (isEmpty(formList.value)) {
    addItem()
    // 防呆 一個製程對應一張單
  } else {
    formList.value.forEach((_, formIndex) => {
      setDisabled(formIndex, false)
    })
  }
}

// 輸入框
const options = reactive({
  isLoading: false,
  focusIndex: 0,
  process: [],
  machine: []
})
const onRowFocus = (rowIndex: number) => {
  options.focusIndex = rowIndex
}

// 防呆選項
const disabledMap = new Map()
const disabledList = ref([])
const setDisabled = async (rowIndex: number, isRemove: boolean) => {
  await nextTick()
  const row = formList.value[rowIndex] ?? {
    processId: '',
    machineId: ''
  }
  const { processId } = row

  // 相同站點 + 相同工單 只能選一次
  if (!isEmpty(processId)) {
    disabledMap.set(`${rowIndex}`, `${processId}_${lotNo.value}`)
  } else {
    disabledMap.delete(`${rowIndex}`)
  }

  if (isRemove && disabledMap.has(`${rowIndex}`)) {
    disabledMap.delete(`${rowIndex}`)
  }

  disabledList.value = [...disabledMap.values()]
  // disabledList.value = []
}

// 輸入框製程
const processRemoteMethod = async (processId?: string) => {
  options.isLoading = true
  await nextTick()
  // const machineId = formList.value[options.focusIndex]?.machineId ?? ''
  const {
    status,
    msg,
    data: processOptions
  } = await getProcessList('', processId ?? '', lotNo.value, disabledList.value)
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
// 選擇製程時
const onProcessChange = async (processId: string, rowIndex: number) => {
  removeMachineRushOrderMap(rowIndex)
  setDisabled(rowIndex, false)

  await nextTick()
  formList.value[rowIndex].machineId = ''
  formList.value[rowIndex].sequence = ''
}
// 輸入框機台
const machineRemoteMethod = async (machineId?: string) => {
  options.isLoading = true
  await nextTick()
  const processId = formList.value[options.focusIndex]?.processId ?? ''
  const { status, msg, data: machineOptions } = await getMachineList(processId ?? '', machineId, [])
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

// 選擇機台時
const onMachineChange = async (machineId: string, rowIndex: number) => {
  const processId = formList.value[rowIndex]?.processId ?? ''

  // 如果沒有機台對應的資料
  if (!hasOwnProperty(machineRushOrderMap, machineId)) {
    machineRushOrderMap[machineId] = []
    const { status, msg, data: rushOrderList } = await getRushOrderList(machineId)

    if (status !== 'success') {
      swal({
        icon: 'error',
        title: i18nTranslate('error-getData', 'system'),
        text: msg ?? i18nTranslate('warning-contactIT', 'system'),
        showCancelButton: false
      })
    }

    rushOrderList.forEach(rushOrderItem => {
      const {
        erpNo,

        process_Id,
        machine_Id,
        sequence,
        LAST_UPDATE_TIMESTAMP,
        updateBy
      } = rushOrderItem

      setMachineRushOrderMap(machine_Id, {
        sequence,
        process_Id,
        erpNo,
        LAST_UPDATE_TIMESTAMP,
        updateBy
      })
    })
  }

  await nextTick()
  let sequence = machineRushOrderMap[machineId].length + 1
  const isSuccessAdd = setMachineRushOrderMap(machineId, {
    sequence: `${sequence}`,
    process_Id: processId,
    erpNo: lotNo.value,
    LAST_UPDATE_TIMESTAMP: '',
    updateBy: ''
  })
  // 沒有新增 sequence-1
  if (!isSuccessAdd) sequence--
  formList.value[rowIndex].sequence = `${sequence}`
}

const isLoading = ref(true)
onMounted(async () => {
  isLoading.value = true
  await nextTick()

  await Promise.all([initRushOrderData(), processRemoteMethod(''), machineRemoteMethod('')])

  isLoading.value = false
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

// 只能刪除插單 不能直接修改 製程編號/機台編號
const isOnlyDelete = (rowIndex: number) => {
  const [machineId, processId] = [
    formList.value[rowIndex]?.machineId ?? '',
    formList.value[rowIndex]?.processId ?? ''
  ]

  return !isEmpty(machineId) && !isEmpty(processId)
}

// 新增插單
const addItem = () => {
  add({
    sequence: '',
    processId: '',
    machineId: '',
    LAST_UPDATE_TIMESTAMP: '',
    updateBy: '',
    status: 'new'
  })
}
// 移除插單
const removeItem = async (rowIndex: number) => {
  removeMachineRushOrderMap(rowIndex)
  setDisabled(rowIndex, true)
  await nextTick()
  // 重新設定顯示的順序
  // 建立 map 製程:資料index
  const formIndexMap = {}
  formList.value.forEach((formItem, formIndex) => {
    const { processId } = formItem
    formIndexMap[processId] = formIndex
  })

  const machineId = formList.value[rowIndex]?.machineId ?? ''

  const newRushOrderList = getProxyData(machineRushOrderMap[machineId])
  newRushOrderList.forEach((rushOrderItem, rushOrderIndex) => {
    const { erpNo, process_Id } = rushOrderItem
    const sequence = rushOrderIndex + 1

    // 當前的單 依照機台下的生產順序 重新給生產順序
    if (erpNo === lotNo.value) {
      const formIndex = formIndexMap[process_Id]
      formList.value[formIndex].sequence = `${sequence}`
    }
  })

  remove(rowIndex)
}

defineExpose({
  submit: async (): Promise<string> => {
    isLoading.value = true
    // 驗證表單
    return validateForm()
      .then(async () => {
        const rushOrderData: RushOrderData = []

        const userName = authData?.user?.fullName ?? ''

        const machineIdSet = new Set()
        formList.value.forEach(formItem => {
          machineIdSet.add(formItem.machineId)
        })

        for (let machineId in machineRushOrderMap) {
          // 有在列表中的機台 || 有在已插單機台列表中
          if (machineIdSet.has(machineId) || oldMachineIdSet.has(machineId)) {
            const rushOrderList = machineRushOrderMap[machineId]

            const rushOrders: RushOrders = rushOrderList.map((rushOrderItem, rushOrderIndex) => {
              const { process_Id, erpNo, updateBy, LAST_UPDATE_TIMESTAMP } = rushOrderItem

              return {
                sequence: rushOrderIndex + 1,
                processId: process_Id,
                erpNo,
                memo: '',
                updateBy: isEmpty(LAST_UPDATE_TIMESTAMP) ? userName : updateBy
              }
            })

            rushOrderData.push({
              machineId,
              rushOrders,
              updateBy: userName
            })
          }
        }

        console.log('rushOrderData => ', rushOrderData)
        const { status, msg } = await rushOrderFromWeb(rushOrderData)
        if (status === 'success') {
          swal({
            icon: 'success',
            title: i18nTranslate('update-success'),
            showCancelButton: false
          })
        } else {
          swal({
            icon: 'error',
            title: i18nTranslate('update-fail'),
            text: msg,
            showCancelButton: false
          })
        }

        isLoading.value = false
        return status
      })
      .catch(errorList => {
        const error = errorList.find(errorItem => {
          return errorItem.el !== null
        })
        if (error) {
          const el = error.getDom()
          scrollToEl(el)
        }
        isLoading.value = false
        return 'error'
      })
  }
})
</script>

<template>
  <div v-loading="isLoading" class="machine-rush-order">
    <CustomModal
      v-model="modal.switchSequence"
      :title="`生產順序：${modal.machineId}`"
      @submit="onSwitchSequenceSubmit"
    >
      <SwitchSequence
        ref="switchSequenceRef"
        :erp-no="modal.eroNo"
        :process-id="modal.processId"
        :rush-order-list="modal.rushOrderList"
      />
    </CustomModal>

    <div class="machine-rush-order-form">
      <FormList
        v-model="formList"
        :table-data="formList"
        :table-columns="tableColumns"
        :column-setting="workReportColumnSetting"
        item-key="key"
        is-create
        is-remove
        @add="addItem"
        @remove="removeItem"
      >
        <template #column-processId="{ rowIndex, row, data }">
          <CustomInput
            v-if="row.status === 'new'"
            v-model="formList[rowIndex].processId"
            v-bind="formColumn.processId"
            :disabled="isOnlyDelete(rowIndex)"
            :options="options.process"
            :loading="options.isLoading"
            :remote-method="processRemoteMethod"
            @focus="onRowFocus(rowIndex)"
            @change="onProcessChange($event, rowIndex)"
          ></CustomInput>
          <div v-else>{{ data }}</div>
        </template>
        <template #column-machineId="{ rowIndex, row, data }">
          <CustomInput
            v-if="row.status === 'new'"
            v-model="formList[rowIndex].machineId"
            v-bind="formColumn.machineId"
            :disabled="isEmpty(formList[rowIndex].processId) || isOnlyDelete(rowIndex)"
            :options="options.machine"
            :loading="options.isLoading"
            :remote-method="machineRemoteMethod"
            @focus="onRowFocus(rowIndex)"
            @change="onMachineChange($event, rowIndex)"
          ></CustomInput>
          <div v-else>{{ data }}</div>
        </template>
        <template #column-sequence="{ row, data }">
          <div class="flex-row-center i-ga-md">
            <span>{{ !isEmpty(data) ? data : '-' }}</span>
            <CustomButton
              v-if="!isEmpty(data)"
              type="warning"
              icon-name="edit"
              circle
              text
              @click="openSwitchSequence(row)"
            />
          </div>
        </template>
        <template #column-LAST_UPDATE_TIMESTAMP="{ data }">
          <div>{{ !isEmpty(data) ? data : '-' }}</div>
        </template>
        <template #column-updateBy="{ data }">
          <div>{{ !isEmpty(data) ? data : '-' }}</div>
        </template>
      </FormList>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.machine-rush-order {
  width: 100%;
  height: 100%;
  // padding: 12px 16px 16px;
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
