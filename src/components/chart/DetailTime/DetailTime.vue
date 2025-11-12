<script setup lang="ts">
import type { PropType } from 'vue'

import type { UseHook } from '@/types/types_hook' // 全域功能類型
import { nextTick, ref, inject } from 'vue'

import { CustomIcon, CustomModal } from '@/components/feature' // 系統組件

import DetailView from './DetailView.vue'
import type { MachineStateTimeInfo, TimePointInfo, DetailTimeInfo } from './api'
import { getMODetailTime, getMahineStateTime } from './api'

const useHook = inject('useHook') as UseHook
const { i18nTranslate } = useHook({
  i18nModule: 'auto_common'
})

interface MOData {
  orderId: string,
  processId: string,
  machineId: string
}
const props = defineProps({
  moData: {
    type: Object as PropType<MOData>,
    required: true,
    description: `
      orderId, processId, machineId
    `
  }
})

const timePointInfo = ref<TimePointInfo>()
const detailTimeInfo = ref<DetailTimeInfo>()
const stateTimeInfo = ref<MachineStateTimeInfo>()

const onClick = async () => {
  const { orderId, processId, machineId } = props.moData
  const mODetailTime = await getMODetailTime(orderId, processId)

  if(mODetailTime) {
    const {
      moveInTime,
      moveOutTime,
      startTime,
      endTime,
      checkInTime,
      checkOutTime,
      preProcessStartTime,
      // preProcessTimestamp,
      postProcessFinishTime,
      // postProcessTimestamp,
      transferStartTime,
      // transferFinishTime,
      detailTime = {}
    } = mODetailTime
    const machineStateTimes = await getMahineStateTime(machineId, [ moveInTime, moveOutTime ])

    if(machineStateTimes.length > 0) stateTimeInfo.value = machineStateTimes[0]
    else stateTimeInfo.value = { machineId }

    if(!mODetailTime.hasOwnProperty('detailTime')) mODetailTime.detailTime = {}

    timePointInfo.value = {
      moveInTime,
      checkInTime,
      startTime,
      endTime,
      checkOutTime,
      moveOutTime,
      preProcessTimestamp: preProcessStartTime,
      postProcessTimestamp: postProcessFinishTime,
      transferStartTime
      // transferFinishTime
    }
    detailTimeInfo.value = detailTime
    await nextTick()
    modalValue.value = true
  }
}

const modalValue = ref(false)

</script>

<template>
  <CustomModal v-if="modalValue"
    v-model="modalValue"
    heightSize="large"
    hiddenFooter
  >
    <template #header>
      <div class="detail-title">
        <div class="detail-title-text"> {{ `${i18nTranslate('manufacturing-order')} : ${props.moData.orderId}` }} </div>
        <div class="detail-title-text"> {{ '/' }} </div>
        <div class="detail-title-text"> {{ `${i18nTranslate('process')} : ${props.moData.processId}` }} </div>
        <div class="detail-title-text"> {{ '/' }} </div>
        <div class="detail-title-text"> {{ `${i18nTranslate('machine')} : ${props.moData.machineId}` }} </div>
      </div>
    </template>
    <DetailView
      :timePointInfo="timePointInfo"
      :detailTimeInfo="detailTimeInfo"
      :stateTimeInfo="stateTimeInfo"
    />
  </CustomModal>

  <div>
    <CustomIcon
      class="detail-btn"
      x-type="carbon"
      name="Time"
      text
      @click="onClick"
    />
  </div>

</template>

<style lang="scss" scoped>
  .detail {
    &-title{
      font-weight: bold;
      display: flex;
      flex-direction: row;
      gap: 16px;
    }
    &-btn {
      cursor: pointer;
      display: flex;
      justify-self: center;
      // padding: 6px;
      :hover {
        color: gray;
      }
    }
  }
</style>
