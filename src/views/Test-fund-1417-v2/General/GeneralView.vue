<script setup lang="ts">
import { ref, inject, onMounted, nextTick } from 'vue'

import type { UseHook } from '@/declare/hook'
// import { WeekSchedule } from '@/components'
import { WeekSchedule } from './WeekSchedule/WeekSchedule.vue'

import {
  getGeneralWeekSchedule,
  getIsNeedSendRTDS
} from './api'

import { timeFormat } from '../planUtils.ts'

const useHook: UseHook = inject('useHook')
const { i18nTranslate, swal } = useHook()

const isLoading = ref(true)

const isNeedSendRTDS = ref(false)

const weekSchedule = ref()
const planList = ref([])

const init = async () => {
  isLoading.value = true

  const [resGeneralWeekSchedule, resIsNeedSendRTDS] = await Promise.all([
    getGeneralWeekSchedule(),
    getIsNeedSendRTDS()
  ])

  const { status: generalWeekScheduleStatus, msg: generalWeekScheduleMsg, data: generalWeekScheduleData } = resGeneralWeekSchedule
  if (generalWeekScheduleStatus !== 'success') {
    swal({
      icon: 'error',
      title: i18nTranslate('error-getData', 'iPASP_common'),
      text: generalWeekScheduleMsg ?? i18nTranslate('warning-contactIT', 'iPASP_common'),
      showCancelButton: false
    })
  }
  planList.value = generalWeekScheduleData.map(row => {
    const { id, dayOfWeek, startTime, endTime } = row
    return {
      id,
      day: dayOfWeek === 7 ? 0 : dayOfWeek,
      status: 'old',
      start: timeFormat(startTime),
      end: timeFormat(endTime)
    }
  })
  console.log(planList.value)
  if (weekSchedule.value) {
    weekSchedule.value.init([...planList.value])
  }

  const { status: isNeedSendRTDSStatus, msg: isNeedSendRTDSMsg, data: isNeedSendRTDSData } = resIsNeedSendRTDS
  if (isNeedSendRTDSStatus !== 'success') {
    swal({
      icon: 'error',
      title: i18nTranslate('error-getData', 'iPASP_common'),
      text: isNeedSendRTDSMsg ?? i18nTranslate('warning-contactIT', 'iPASP_common'),
      showCancelButton: false
    })
  }
  isNeedSendRTDS.value = isNeedSendRTDSData

  await nextTick()
  setTimeout(() => {
    isLoading.value = false
  }, 300)
}

onMounted(() => {
  init()
})

</script>

<template>
  <div v-loading="isLoading" class="page-container">
    <WeekSchedule ref="weekSchedule" :plan-list="planList"></WeekSchedule>
  </div>
</template>

<style lang="scss" scoped>
.page {
  &-container {
    padding: 16px;
  }
}
</style>
