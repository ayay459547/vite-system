<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, reactive, inject } from 'vue'

// 全域功能類型
import type { UseHook } from '@/declare/hook' // 全域功能類型
import type { TableOptions } from '@/declare/columnSetting' // 表格設定類型
import {
  WebViewTable, // 泛用表格
  CustomModal,
  CustomIcon,
  CustomButton,
  FormRadio,
  CustomLink // 跳轉
} from '@/components' // 系統組件

import { useAsyncComponent } from '@/lib/lib_hook' // 自訂Composition API
import { isEmpty } from '@/lib/lib_utils' // 工具
import { formatDatetime } from '@/lib/lib_format' // 格式化

// API
import type { ResponseData, ExcelData, TableData } from './api'
import { formatParams } from './api'

import { columnSetting, linkSetting } from './columns' // 欄位,連結 設定
import fakeTableData from './fakeData.json' // 假資料

const DetailModal = useAsyncComponent(() => import('./Components/DetailModal.vue'), 'rect')
const PlanInfo = useAsyncComponent(() => import('./Components/PlanInfo.vue'), 'rect')

const useHook: UseHook = inject('useHook')
const { i18nTranslate, redirectInfo } = useHook({
  i18nModule: 'auto_common'
})

const props = defineProps({
  tableOptions: {
    type: Object as PropType<TableOptions>,
    required: true,
    description: '表格設定'
  },
  isShowTimeLineTable: {
    type: Boolean as PropType<boolean>,
    required: false,
    description: '是否顯示時間線表格'
  },
  isVisible: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
    description: '是否顯示 WebViewTable'
  }
})

const webViewTableRef = ref()

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
  const { severity, status } = row
  console.log(row)
  return {
    ...formatData(row),
    status: i18nTranslate(columnSetting.status.getI18nValue(status)),
    severity: i18nTranslate(severity === 'LEVEL_1' ? 'select-true' : 'select-false')
  }
}
const formatTable = (row: ResponseData): TableData => {
  const { severity, status } = row

  return {
    ...formatData(row),
    status: columnSetting.status.getI18nValue(status),
    severity: i18nTranslate(severity === 'LEVEL_1' ? 'select-true' : 'select-false'),
    _severity: severity
  }
}

const emit = defineEmits([
  // 'load',
  'init-start', //初始化開始
  'init-end', //初始化完成

  'mounted' // WebViewTable mounted
])

const initStart = () => {
  emit('init-start')
}
const initEnd = (event: [any[], number]) => {
  emit('init-end', event)
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
          status: [queryData]
        })
        break
      }

    }
  }
  // webViewTableRef?.value?.init()
  emit('mounted')
}

// 建議在 emit('mounted') 後使用
defineExpose({
  setFilter: (filterValue: any) => {
    webViewTableRef?.value?.setFilter(filterValue)
  },
  init: () => {
    webViewTableRef?.value?.init()
  }
})

</script>

<template>
  <div class="fill">
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
                { label: `${i18nTranslate('display-hidden', 'iPASP_common')}${i18nTranslate('all')}`, value: 'hidden' },
                { label: `${i18nTranslate('display-show', 'iPASP_common')}${i18nTranslate('error')}`, value: 'error' },
                { label: `${i18nTranslate('display-show', 'iPASP_common')}${i18nTranslate('all')}`, value: 'show' }
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
      v-show="props.isVisible"
      ref="webViewTableRef"
      webfuno="auto_32_SG"
      designatedview="MSTR_V_Schedule_Preview_P"
      :table-options="props.tableOptions"
      :column-setting="columnSetting"
      :format-params="formatParams"
      :format-excel="formatExcel"
      :format-table="formatTable"
      :fake-data="fakeTableData"
      :is-mounted-init="false"
      :is-show-time-line-table="props.isShowTimeLineTable"
      @init-start="initStart"
      @init-end="initEnd"
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

      <template #column-status="{ data }">
        <span> {{ i18nTranslate(data) }}</span>
      </template>

      <template #column-no="{ row, data }">
        <div class="text-primary flex-row i-ga-xs cursor-pointer" @click="onNoClick(row)">
          <CustomIcon name="circle-info" />
          <span>{{ data }}</span>
        </div>
      </template>

      <!-- 工單緊急度 -->
      <template #column-severity="{ row }">
        <div class="flex-row-center i-ga-md">
          <CustomIcon
            :name="row['_severity'] === 'LEVEL_1' ? 'check' : 'xmark'"
            :class="row['_severity'] === 'LEVEL_1' ? 'text-success' : 'text-info'"
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
