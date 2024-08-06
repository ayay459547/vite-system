<script setup lang="ts">
// Composition API
import { ref, inject, onMounted, nextTick, reactive } from 'vue'
// 全域功能類型
import type { UseHook, SwalResult } from '@/declare/hook'
// 引入組件
import type { TourProps } from '@/components'
import {
  WeekSchedule,
  CustomButton,
  CustomDividerView,
  CustomInput,
  CustomTour,
  CustomLockView
} from '@/components'

// 權限
import { type Permission, getPermission, defaultPermission } from '@/lib/lib_permission'
// 工具
import { isEmpty, scrollToEl } from '@/lib/lib_utils'
// 設定表格資料
import { useFormSetting } from '@/lib/lib_columns'

import {
  getMachineIdWeekSchedule,
  saveMachineIdWeekSchedule,
  getIsNeedSendRTDS,
  sendRTDS,
  getMachineOptions
} from './api'
import { columnSetting } from './columns'

import { timeFormat } from '../planUtils'
import MachineTable from './MachineTable/MachineTable.vue'
import MachineInfo from './Components/MachineInfo.vue'

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
  await nextTick()
  // 暫時以 currentMachineId 為主
  await validateForm().then(async () => {
    isLoading.value = true
    if (weekSchedule.value && !isEmpty(currentMachineId.value)) {
      const { create, update, remove } = await weekSchedule.value.getData()

      const { status, msg } = await saveMachineIdWeekSchedule(create, update, remove, currentMachineId.value)
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
  }).catch(errorList => {
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

// 設定一週分配資訊
const setWeekScheduleData = (planList: any[]) => {
  if (weekSchedule.value) {
    weekSchedule.value.init([...planList])
  }
}

// 選機台
const options = reactive({
  machineId: []
})
const {
  columns: formColumn,
  forms: form,
  validate: validateForm
} = useFormSetting<{ machineId: string[] }>(columnSetting, 'form')

// 初始化
const tableRef = ref()
const currentMachineId = ref('')
const init = async (machindId?: string) => {
  isLoading.value = true

  const formMachineId = machindId ?? currentMachineId.value
  if (!isEmpty(formMachineId)) {
    // reset()
    form.machineId = [currentMachineId.value]
  }

  const [resGeneralWeekSchedule, resIsNeedSendRTDS, resMachine] = await Promise.all([
    getMachineIdWeekSchedule(machindId ?? currentMachineId.value),
    getIsNeedSendRTDS(),
    getMachineOptions()
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

  // 機台區域
  const { status: machineStatus, msg: machineMsg, data: machineOptions } = resMachine
  if (machineStatus !== 'success') {
    swal({
      icon: 'error',
      title: i18nTranslate('error-getData', 'system'),
      text: machineMsg ?? i18nTranslate('warning-contactIT', 'system'),
      showCancelButton: false
    })
  }
  options.machineId = machineOptions

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

// 設定當前機台 初始化
const setMachineWeekSchedule = (machineId: string) => {
  currentMachineId.value = machineId
  init(machineId)
}

const onRTDSClick = async () => {
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

// 引導
const isOpenTour = ref(false)
const steps: TourProps.Steps = [
  {
    target: '.GeneralView .el-table__body-wrapper',
    title: '機台列表',
    description: '查看資料'
  },
  {
    target: '.GeneralView .el-table__row .el-table__cell',
    title: '機台編號',
    description: '確認編號'
  },
  {
    target: '.GeneralView .el-table__row .el-table-fixed-column--right',
    title: '選擇機台',
    description: '點擊箭頭'
  }
]

</script>

<template>
  <div class="GeneralView page-container">
    <!-- 引導 -->
    <CustomTour v-model="isOpenTour" :steps="steps"></CustomTour>

    <!-- 機台工時 -->
    <CustomDividerView :left-width="460">
      <template #left>
        <!-- 選機台 -->
        <div class="page-left">
          <MachineInfo @setMachineWeekSchedule="setMachineWeekSchedule"/>
        </div>
      </template>
      <template #right>
          <!-- 分配 + 表格 -->
          <CustomDividerView position="right">
            <template #left>
              <div class="fill i-pa-md">
                <!-- 鎖定遮罩 -->
                <CustomLockView :is-lock="isEmpty(currentMachineId)">
                  <template #description>
                    <CustomButton
                      label="請先選擇機台"
                      size="large"
                      icon-name="print"
                      type="primary"
                      @click="isOpenTour = true"
                    />
                  </template>
                  <!-- 分配 -->
                  <div v-loading="isLoading" class="page-right">
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

                      <div class="page-machine">
                        <CustomInput v-model="form.machineId" v-bind="formColumn.machineId" :options="options.machineId" />
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
                          @click="init()"
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
                </CustomLockView>
              </div>
            </template>
            <template #right>
              <MachineTable ref="tableRef" />
            </template>
          </CustomDividerView>
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
    }

    &-header {
      width: 100%;
      height: fit-content;
      display: flex;
      gap: 16px;
      justify-content: space-between;
    }
    &-machine {
      flex: 1;
      min-width: 240px;
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
