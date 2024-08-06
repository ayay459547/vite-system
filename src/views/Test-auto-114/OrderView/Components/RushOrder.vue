<script setup lang="ts">
import type { PropType } from 'vue'
import { reactive, onMounted, inject, nextTick, ref, computed } from 'vue'

import type { UseHook } from '@/declare/hook'
import { CustomButton, CustomEmpty } from '@/components'
import { getUuid, scrollToEl, isEmpty } from '@/lib/lib_utils'
import { defaultModuleType } from '@/i18n/i18n_setting'

import type { ResValidate } from './MachineRushOrderList.vue'
import MachineRushOrderList from './MachineRushOrderList.vue'

import type { RushOrderData } from '../../api'
import { rushOrderFromWeb, getRushOrderList } from '../../api'

const useHook: UseHook = inject('useHook')
const { swal, i18nTranslate } = useHook({
  i18nModule: 'system'
})

const props = defineProps({
  order: {
    type: Object as PropType<any>,
    default() {
      return {}
    }
  }
})

type MachineList = Array<{
  uuid: string
  machineId: string
  status: string
}>
const machineList = reactive<MachineList>([])

const addMachine = async (machineId: string) => {
  const dataId = getUuid()
  machineList.push({
    uuid: dataId,
    machineId,
    status: isEmpty(machineId) ? 'new' : 'old'
  })

  await nextTick()
  setTimeout(() => {
    const el = document.querySelector(`.machine-${dataId}`)
    scrollToEl(el)
  }, 100)
}
// const onResetClick = () => {
//   initDisabled()
//   init()
// }

// 以選擇的機台
const selectedMachineIdMap = reactive(new Map<number, string>())
const selectedMachineList = computed(() => {
  return [...selectedMachineIdMap.values()]
})

const isLoading = ref(true)
const init = async () => {
  isLoading.value = true

  machineList.splice(0)
  const lotNo = props?.order?.id ?? ''
  const { status, msg, data: planMachineList } = await getRushOrderList('', lotNo)
  if (status !== 'success') {
    swal({
      icon: 'error',
      title: i18nTranslate('error-getData', 'system'),
      text: msg ?? i18nTranslate('warning-contactIT', 'system'),
      showCancelButton: false
    })
  }

  // 已經有插單的機台
  const oldMachineIdSet = new Set()

  if (isEmpty(planMachineList)) {
    addMachine('')
  } else {
    planMachineList.forEach((planMachineItem, index) => {
      const { machine_Id } = planMachineItem
      if (!oldMachineIdSet.has(machine_Id)) {
        addMachine(machine_Id)
        selectedMachineIdMap.set(index, machine_Id)

        oldMachineIdSet.add(machine_Id)
      }
    })
  }

  await nextTick()
  setTimeout(() => {
    isLoading.value = false
  }, 100)
}

// 防呆選項
const disabledMap = new Map()
const disabledList = ref([])

export type SetDisabled = {
  machineId: string
  rowIndex: number
  process_Id: string
  erpNo: string
  isRemove: boolean
}
const setDisabled = async (options: SetDisabled) => {
  await nextTick()
  const { machineId, rowIndex, process_Id, erpNo, isRemove } = options

  // 相同站點 + 相同工單 只能選一次
  const mapKey = `${machineId}_${rowIndex}`
  if (!isEmpty(erpNo) && !isEmpty(process_Id)) {
    disabledMap.set(mapKey, `${process_Id}_${erpNo}`)
  } else {
    disabledMap.delete(mapKey)
  }

  if (isRemove && disabledMap.has(mapKey)) {
    disabledMap.delete(mapKey)
  }

  disabledList.value = [...disabledMap.values()]
}
const initDisabled = () => {
  disabledMap.clear()
  disabledList.value = []
}

type MachineOptions = {
  machineId: string
  index: number
}
const onAdd = (machineOptions: MachineOptions) => {
  const { index, machineId } = machineOptions
  // 新增已選擇機台
  selectedMachineIdMap.set(index, machineId)
}
const onRemove = (machineOptions: MachineOptions) => {
  const { index } = machineOptions
  // 移除已選擇機台
  if (selectedMachineIdMap.has(index)) {
    selectedMachineIdMap.delete(index)
  }

  machineList.splice(index, 1)
}

onMounted(() => {
  initDisabled()
  init()
})

const machineRushOrderListRef = ref()
defineExpose({
  submit: async (): Promise<string> => {
    isLoading.value = true

    await nextTick()
    const validateList = machineRushOrderListRef.value.map(rushOrderRef => {
      console.log(rushOrderRef)
      return rushOrderRef?.validate()
    })
    const resList: Array<ResValidate> = await Promise.all(validateList)
    console.log('resListresList => ', resList)

    const errorItem = resList.find(resItem => {
      return resItem.status === 'error'
    })
    if (!isEmpty(errorItem)) {
      scrollToEl(errorItem.errorEl)
      isLoading.value = false
      return 'error'
    } else {
      const rushOrderData: RushOrderData = resList.map(resItem => {
        const { machineId, rushOrders, updateBy } = resItem
        return {
          machineId,
          rushOrders,
          updateBy
        }
      })
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
    }
  }
})
</script>

<template>
  <div v-loading="isLoading" class="rush-order">
    <div class="rush-order-list">
      <div
        v-for="(machine, dataIndex) in machineList"
        :key="machine.uuid"
        class="rush-order-item"
        :class="`machine-${machine.uuid}`"
      >
        <MachineRushOrderList
          ref="machineRushOrderListRef"
          :uuid="machine.uuid"
          :machine-id="machine.machineId"
          :selected-machine-list="selectedMachineList"
          :status="machine.status"
          :index="dataIndex"
          :order="props.order"
          :disabled-list="disabledList"
          @set-disabled="setDisabled"
          @add-machine="onAdd"
          @remove-machine="onRemove"
        />
      </div>
      <CustomEmpty v-if="isEmpty(machineList)" />
    </div>

    <div class="rush-order-btn">
      <!-- <CustomButton
        :label="i18nTranslate('reset', defaultModuleType)"
        icon-name="arrow-rotate-left"
        @click="onResetClick"
      /> -->
      <CustomButton
        :label="`${i18nTranslate('create', defaultModuleType)}${i18nTranslate('machine')}`"
        type="primary"
        icon-name="plus"
        @click="addMachine('')"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.rush-order {
  width: 100%;
  height: 100%;
  // padding: 12px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  &-list {
    flex: 1;
    width: 100%;
    height: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 8px 12px;
  }
  &-item {
    width: 100%;
    height: fit-content;
  }

  &-btn {
    width: 100%;
    height: fit-content;
    display: flex;
    justify-content: center;
    gap: 12px;
  }
}
</style>
