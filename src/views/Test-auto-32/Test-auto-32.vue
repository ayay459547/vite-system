<script setup lang="ts">
import { ref, reactive, inject } from 'vue'

// 全域功能類型
import type { UseHook } from '@/declare/hook'
// 組件
import {
  WebViewTable, // 泛用表格
  CustomModal,
  CustomIcon,
  CustomButton,
  FormRadio,
  CustomLink // 跳轉
 } from '@/components' // 系統組件
 import { useAsyncComponent } from '@/lib/lib_hook' // 自訂Composition API

 // 工具
import { isEmpty } from '@/lib/lib_utils' // 工具
import { formatDatetime } from '@/lib/lib_format'

// 表格設定類型
import type { TableOptions } from '@/declare/columnSetting'
// 資料格式化
import type { ResponseData, ExcelData, TableData } from './api'
import { formatParams } from './api'
// 欄位設定, 連結設定
import { columnSetting, linkSetting } from './columns'
// 假資料
import fakeTableData from './fakeData.json'

const DetailModal = useAsyncComponent(() => import('./Components/DetailModal.vue'), 'rect')
const PlanInfo = useAsyncComponent(() => import('./Components/PlanInfo.vue'), 'rect')

const useHook: UseHook = inject('useHook')
const { i18nTranslate, redirectInfo } = useHook({
  i18nModule: 'system'
})

const webViewTableRef = ref()
const tableOptions: TableOptions = {
  title: '工單細部排程預覽',
  i18nTitle: 'auto-32-SG',
  i18nModule: 'system',
  version: '1.2.9',
  settingKey: 'auto-32-SG',
  isSorting: true
}

// modal
const detailRef = ref(null)
const modal = reactive({
  detail: false,
  planInfo: false
})
const radioValue = ref('error')

const detailData = ref()
const detailTitle = ref('')

const onNoClick = (row: TableData) => {
  detailData.value = row
  detailTitle.value = `${row.erpNo} ${i18nTranslate('detail')}`
  modal.detail = true
}
const onPlanInfoClick = (row: TableData) => {
  detailData.value = row
  modal.planInfo = true
}

// 跳轉來源, 附帶資料
const { fromPage, queryData } = redirectInfo()

const onWebViewTableMounted = () => {
  // 跳轉處理
  if (!isEmpty(queryData)) {
    switch (fromPage) {
      case 'auto-31-SG': {
        webViewTableRef?.value?.setFilter({
          no: queryData
        })
        break
      }
      case 'apspub-11': {
        webViewTableRef?.value?.setFilter({
          status: queryData
        })
        break
      }
    }
  }
  webViewTableRef?.value?.init()
}

// 顯示資料格式化
const formatData = (row: ResponseData): ExcelData | TableData => {
  const {
    no,
    sequence,

    predeinedAmount,
    quantityOfQualification,
    status,

    CREATE_DATE,
    LAST_UPDATE_TIMESTAMP,
    predefinedstartdatetime,
    predefinedCompleteDate,

    numPriority,
    moveInTime
  } = row

  return {
    ...row,
    id: `${no}-${sequence}`,
    predeinedAmount: columnSetting.predeinedAmount.getValue(predeinedAmount),
    quantityOfQualification: columnSetting.quantityOfQualification.getValue(quantityOfQualification),
    status: columnSetting.status.getValue(status),

    CREATE_DATE: formatDatetime(CREATE_DATE, 'YYYY-MM-DD HH:mm:ss'),
    LAST_UPDATE_TIMESTAMP: formatDatetime(LAST_UPDATE_TIMESTAMP, 'YYYY-MM-DD HH:mm:ss'),
    predefinedstartdatetime: formatDatetime(predefinedstartdatetime, 'YYYY-MM-DD HH:mm:ss'),
    predefinedCompleteDate: formatDatetime(predefinedCompleteDate, 'YYYY-MM-DD HH:mm:ss'),

    numPriority: columnSetting.numPriority.getValue(numPriority),
    moveInTime: formatDatetime(moveInTime, 'YYYY-MM-DD HH:mm:ss')
  }
}
const formatExcel = (row: ResponseData): ExcelData => {
  const { severity } = row

  return {
    ...formatData(row),
    severity: i18nTranslate(severity === 'LEVEL_1' ? 'select-true' : 'select-false')
  }
}
const formatTable = (row: ResponseData): TableData => {
  return {
    ...formatData(row)
  }
}

</script>

<template>
  <div class="i-page">
    <CustomModal
      v-model="modal.detail"
      :title="detailTitle"
      height-size="large"
      click-outside
      hidden-footer
    >
      <template #header>
        <div class="fill-x flex-row-center content-between i-ga-md">
          <h3>{{ detailTitle }}</h3>

          <div>
            <FormRadio
              v-model="radioValue"
              :options="[
                { label: `${i18nTranslate('display-hidden', 'system')}${i18nTranslate('all')}`, value: 'hidden' },
                { label: `${i18nTranslate('display-show', 'system')}${i18nTranslate('error')}`, value: 'error' },
                { label: `${i18nTranslate('display-show', 'system')}${i18nTranslate('all')}`, value: 'show' }
              ]"
            />
          </div>
        </div>

      </template>
      <DetailModal ref="detailRef" :data="detailData" :radio-value="radioValue" />
    </CustomModal>

    <CustomModal
      v-model="modal.planInfo"
      :title="i18nTranslate('allocate-information')"
      height-size="large"
      click-outside
      hidden-footer
    >
      <PlanInfo ref="planInfoRef" :data="detailData" />
    </CustomModal>

    <WebViewTable
      ref="webViewTableRef"
      webfuno="auto_32_SG"
      designatedview="MSTR_V_Schedule_Preview_P"
      :table-options="tableOptions"
      :column-setting="columnSetting"
      :format-params="formatParams"
      :format-excel="formatExcel"
      :format-table="formatTable"
      :fake-data="fakeTableData"
      :is-mounted-init="false"
      @mounted="onWebViewTableMounted"
    >
      <template #header-planInfo="{ column }">
        <label class="fill-y flex-row align-center">{{ i18nTranslate(column.i18nLabel) }}</label>
      </template>
      <template #column-planInfo="{ row }">
        <CustomButton icon-name="table" @click="onPlanInfoClick(row)" />
      </template>

      <template #column-isSchedule="{ prop, data }">
        <span> {{ i18nTranslate(columnSetting[prop].getI18nValue(data)) }}</span>
      </template>

      <template #column-status="{ prop, data }">
        <span> {{ i18nTranslate(columnSetting[prop].getI18nValue(data)) }}</span>
      </template>

      <template #column-no="{ row, data }">
        <div class="text-primary flex-row i-ga-xs cursor-pointer" @click="onNoClick(row)">
          <CustomIcon name="circle-info" />
          <span>{{ data }}</span>
        </div>
      </template>

      <!-- 工單緊急度 -->
      <template #column-severity="{ data }">
        <div class="flex-row-center i-ga-md">
          <CustomIcon
            :name="data === 'LEVEL_1' ? 'check' : 'xmark'"
            :class="data === 'LEVEL_1' ? 'text-success' : 'text-info'"
          />
          <!-- <span>{{ i18nTranslate(data === 'LEVEL_1' ? 'select-true' : 'select-false') }}</span> -->
        </div>
      </template>

      <!-- Redirect Link -->
      <template
        v-for="(item, columnKey) in linkSetting"
        :key="`link-${columnKey}`"
        #[`column-${columnKey}`]="{data}"
      >
        <CustomLink
          v-if="!isEmpty(data)"
          :label="data"
          :data="data"
          v-bind="item"
        />
      </template>
    </WebViewTable>
  </div>
</template>

<style lang="scss" scoped></style>
