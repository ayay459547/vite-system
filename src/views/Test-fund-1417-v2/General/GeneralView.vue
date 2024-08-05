<script setup lang="ts">
import { ref, inject, onMounted, nextTick } from 'vue'

import type { UseHook, SwalResult } from '@/declare/hook.ts'
import { WeekSchedule, CustomButton, CustomDividerView } from '@/components'
import { type Permission, getPermission, defaultPermission } from '@/lib/lib_permission'

import {
  getGeneralWeekSchedule,
  saveGeneralWeekSchedule,
  getIsNeedSendRTDS,
  sendRTDS
} from './api'

import { timeFormat } from '../planUtils'
import GeneralTable from './GeneralTable/GeneralTable.vue'

const useHook: UseHook = inject('useHook')
const { i18nTranslate, swal, permission } = useHook({
  i18nModule: 'system'
})

const isLoading = ref(true)

const isNeedSendRTDS = ref(false)

const weekSchedule = ref()
const planList = ref([])

// 儲存
const saveWeekScheduleData = async () => {
  isLoading.value = true

  await nextTick()
  if (weekSchedule.value) {
    const { create, update, remove } = await weekSchedule.value.getData()

    const { status, msg } = await saveGeneralWeekSchedule(create, update, remove)
    if (status === 'success') {
      swal({
        icon: 'success',
        title: i18nTranslate('update-success'),
        showCancelButton: false
      })

      init()

    } else {
      swal({
        icon: 'error',
        title: i18nTranslate('update-fail'),
        text: msg,
        showCancelButton: false
      })
    }
  }

  isLoading.value = false
}

// 設定一週分配資訊
const setWeekScheduleData = (planList: any[]) => {
  if (weekSchedule.value) {
    weekSchedule.value.init([...planList])
  }
}

// 初始化
const tableRef = ref()
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
      title: i18nTranslate('error-getData', 'system'),
      text: generalWeekScheduleMsg ?? i18nTranslate('warning-contactIT', 'system'),
      showCancelButton: false
    })
  }
  planList.value = generalWeekScheduleData.map(row => {
    const { id, dayOfWeek, startTime, endTime } = row
    return {
      id,
      dayId: dayOfWeek,
      status: 'old',
      start: timeFormat(startTime),
      end: timeFormat(endTime)
    }
  })
  console.log(planList.value)
  setWeekScheduleData(planList.value)

  const { status: isNeedSendRTDSStatus, msg: isNeedSendRTDSMsg, data: isNeedSendRTDSData } = resIsNeedSendRTDS
  if (isNeedSendRTDSStatus !== 'success') {
    swal({
      icon: 'error',
      title: i18nTranslate('error-getData', 'system'),
      text: isNeedSendRTDSMsg ?? i18nTranslate('warning-contactIT', 'system'),
      showCancelButton: false
    })
  }
  isNeedSendRTDS.value = isNeedSendRTDSData

  await nextTick()
  tableRef.value?.init()

  setTimeout(() => {
    isLoading.value = false
  }, 300)
}

// 頁面權限
const userPermission = ref<Permission>(getPermission(defaultPermission))
onMounted(() => {
  userPermission.value = permission('fund-1417')
  init()
})

const onRTDSClick = () => {
  swal({
    icon: 'warning',
    title: i18nTranslate('sendRTDS-confirm'),
    confirmButtonText: i18nTranslate('confirm-yes'),
    cancelButtonText: i18nTranslate('confirm-no')
  }).then(async (result: SwalResult) => {
    if (result.isConfirmed) {
      isLoading.value = true
      const { status, msg } = await sendRTDS()

      if (status === 'success') {
        swal({
          icon: 'success',
          title: i18nTranslate('sendRTDS-success'),
          showCancelButton: false,
          confirmButtonText: i18nTranslate('confirm')
        })
        init()
      } else {
        swal({
          icon: 'error',
          title: i18nTranslate('sendRTDS-error'),
          text: msg,
          showCancelButton: false
        })
      }

      isLoading.value = false
    }
  })
}

</script>

<template>
  <div v-loading="isLoading" class="GeneralView page-container">
    <CustomDividerView position="right">
      <template #left>
        <div class="page-left">
          <div class="page-header">
            <div class="flex-row i-ga-md">
              <CustomButton
                :label="i18nTranslate('save')"
                type="primary"
                icon-type="far"
                icon-name="floppy-disk"
                @click="saveWeekScheduleData"
              />
              <CustomButton
                :type="isNeedSendRTDS ? 'danger' : 'info'"
                :label="i18nTranslate('sendRTDS')"
                icon-name="paper-plane"
                icon-move="translate"
                :disabled="!userPermission.execute"
                @click="onRTDSClick"
              />
            </div>

            <div class="flex-row i-ga-md">
              <CustomButton
                :label="i18nTranslate('clear')"
                type="danger"
                icon-type="far"
                icon-name="circle-xmark"
                @click="setWeekScheduleData([])"
              />
              <CustomButton
                :label="i18nTranslate('refrush')"
                icon-name="rotate"
                icon-move="rotate"
                @click="init"
              />
            </div>
          </div>
          <div class="page-body">
            <WeekSchedule
              ref="weekSchedule"
              :plan-list="planList"
            ></WeekSchedule>
          </div>
        </div>
      </template>
      <template #right>
        <div class="page-right">
          <GeneralTable ref="tableRef" />
        </div>
      </template>
    </CustomDividerView>
  </div>
</template>

<style lang="scss" scoped>
.GeneralView {
  &.page {
    &-container {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  }
  .page {
    &-left,
    &-right {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 12px;
    }

    &-header {
      width: 100%;
      height: fit-content;
      display: flex;
      gap: 16px;
      justify-content: space-between;
      flex-wrap: wrap;
    }
    &-body {
      width: 100%;
      height: 100%;
      min-height: fit-content;
      flex: 1;
    }
  }
}
</style>
