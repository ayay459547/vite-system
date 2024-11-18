<script setup lang="ts">
import { type PropType, ref, onMounted, reactive, nextTick, inject } from 'vue'

import type { UseHook } from '@/declare/hook' // 全域功能類型
import { type CustomTimeLineProps, CustomTimeLine, SimpleTable } from '@/components' // 系統組件
import { scrollToEl, isEmpty } from '@/lib/lib_utils' // 工具
import { useSimpleTableSetting } from '@/lib/lib_columns'

import { getData } from './api'
import { columnSetting } from './columns'

const useHook: UseHook = inject('useHook')
const { i18nTranslate, swal } = useHook({
  i18nModule: 'auto_common'
})

const props = defineProps({
  data: {
    type: Object as PropType<any>,
    required: true
  },
  radioValue: {
    type: String as PropType<string>,
    default: 'error'
  }
})

const { tableColumns } = useSimpleTableSetting(columnSetting, 'table')

const isLoading = ref(false)

const timeLine = ref([])

const currentSequence = ref(0)

const lotData = reactive({
  no: '',
  custNo: '',
  bom_Id: '',
  bom_ver: '',
  erpNo: ''
})

const init = async () => {
  isLoading.value = true

  const { no, custNo, bom_Id, bom_ver, sequence, erpNo } = props?.data ?? {}

  lotData.no = no
  lotData.custNo = custNo
  lotData.bom_Id = bom_Id
  lotData.bom_ver = bom_ver
  lotData.erpNo = erpNo

  currentSequence.value = sequence

  const { status, msg, data: resData } = await getData({
    no: props?.data?.no
  })

  if (status !== 'success') {
    swal({
      icon: 'error',
      title: i18nTranslate('error-getData', 'iPASP_common'),
      text: msg ?? i18nTranslate('warning-contactIT', 'iPASP_common'),
      showCancelButton: false
    })
  }

  timeLine.value = resData.sort((a, b) => a.sequence - b.sequence).map(item => {
    const {
      process_id = '',
      process_name = '',
      scheduledMachine_Id,
      CREATE_DATE = '',
      sequence,
      reasons
    } = item

    const _type = ((scheduledMachine_Id, reasons) => {
      if (scheduledMachine_Id) return 'success'
      if (reasons.length > 0) return 'danger'
      return ''
    })(scheduledMachine_Id, reasons)

    return {
      label: `${sequence}. ${process_id} : ${process_name}`,
      type: _type,
      timestamp: CREATE_DATE,
      size: 'large',
      placement: 'top',

      scheduledMachine_Id: scheduledMachine_Id ? scheduledMachine_Id : i18nTranslate('none-var'),
      sequence,
      reasons
    }
  }) as CustomTimeLineProps.Options

  await nextTick()
  setTimeout(() => {
    // 有排程錯誤原因 移動到原因
    const errorEl = document.querySelector('.reasons-error')
    if (!isEmpty(errorEl)) {
      scrollToEl(errorEl, { block: 'center' })

    // 移動到點擊的站點
    } else {
      const el = document.querySelector(`.sequence-${currentSequence.value}`)
      scrollToEl(el, { block: 'center' })
    }
    isLoading.value = false
  }, 300)
}

onMounted(() => {
  init()
})
</script>

<template>
  <div v-loading="isLoading" class="modal">
    <div class="flex-label-list">
      <div class="flex-label-item">
        <label>{{ i18nTranslate('manufacturing-order-no') }}</label>
        <span>{{ lotData.erpNo }}</span>
      </div>
      <div class="flex-label-item">
        <label>{{ i18nTranslate('customer-no') }}</label>
        <span>{{ lotData.custNo }}</span>
      </div>
      <div class="flex-label-item">
        <label>{{ i18nTranslate('customer-product-id') }}</label>
        <span>{{ lotData.bom_Id }}</span>
      </div>
      <div class="flex-label-item">
        <label>{{ i18nTranslate('routing-no') }}</label>
        <span>{{ lotData.bom_ver }}</span>
      </div>
      <div class="flex-label-item">
        <label>{{ i18nTranslate('order-lot-no') }}</label>
        <span>{{ lotData.no }}</span>
      </div>
    </div>

    <div class="modal-time-line card-primary">
      <CustomTimeLine :options="timeLine">
        <template #default="{ label, scheduledMachine_Id, sequence, reasons }">
          <div
            style="font-size: 1.2em"
            class="i-pa-xs flex-column i-ga-xs"
            :class="`sequence-${sequence}`"
          >
            <h3 :class="{'text-primary': sequence === currentSequence}">{{ label }}</h3>
            <div :class="{'text-primary': sequence === currentSequence}" class="flex-row align-center i-ga-xs">
              <!-- <CustomIcon x-type="material" name="PrecisionManufacturingSharp"/>
              <span>{{ `${scheduledMachine_Id}` }}</span> -->
              <span>{{ `${i18nTranslate('machine')} : ${scheduledMachine_Id}` }}</span>
            </div>

            <div
              v-show="radioValue === 'show' || (radioValue === 'error' && reasons.length > 0)"
              :class="reasons.length > 0 ? 'reasons-error' : 'opacity-3'"
              class="i-pt-xs"
            >
              <SimpleTable :table-data="reasons" :table-columns="tableColumns">
                <template #header-all="{ column }">
                  <span>{{ i18nTranslate(column?.i18nLabel) }}</span>
                </template>
              </SimpleTable>
            </div>
          </div>
        </template>
      </CustomTimeLine>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal {
  width: 100%;
  height: 100%;
  padding: 12px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  &-time-line {
    flex: 1;
    height: 100%;
    overflow: auto;
    padding: 8px 16px;
  }
}
</style>
