<script setup lang="ts">
import { type PropType, onMounted, ref, inject } from 'vue'

import type { UseHook } from '@/declare/hook' // 全域功能類型
import { CustomTabs, CustomTable, CustomSearch } from '@/components' // 系統組件
import { useTableSetting, useFormSetting } from '@/lib/lib_columns'
import throttle from '@/lib/lib_throttle'

import { type Filter, getMpgp } from './api'
import { productColumnSetting, engineeringWipColumnSetting, pnColumnSetting } from './columns'

const useHook: UseHook = inject('useHook')
const { i18nTranslate, swal } = useHook({
  i18nModule: 'system'
})

const isLoading = ref(true)

const props = defineProps({
  data: {
    type: Object as PropType<any>,
    required: true
  }
})

const lotData = ref({
  productGroup_Id: '',
  erpNo: '',
  custNo: '',
  process_id: '',
  scheduledMachine_Id: ''
})

const {
  columns: productFilterColumn,
  forms: productFilter,
  activeForms: productActiveFilter,
  getActiveForms: getProductFilter
} = useFormSetting<Filter>(productColumnSetting, 'filter')

const { tableSetting: productTableSetting } = useTableSetting(productColumnSetting, 'table', {
  title: '產品族',
  i18nTitle: 'product-group',
  i18nModule: 'system',
  version: '1.0.5',
  settingKey: 'auto-32-sg-product',
  isSorting: false,
  isHiddenExcel: true,
  showType: 'auto'
})

const {
  columns: engineeringWipFilterColumn,
  forms: engineeringWipFilter,
  activeForms: engineeringWipActiveFilter,
  getActiveForms: getEngineeringWipFilter
} = useFormSetting<Filter>(productColumnSetting, 'filter')

const { tableSetting: engineeringWipTableSetting } = useTableSetting(
  engineeringWipColumnSetting,
  'table',
  {
    i18nTitle: 'engineering-wip',
    title: '指定貨批',
    i18nModule: 'system',
    version: '1.0.2',
    settingKey: 'auto-32-sg-engineeringWip',
    isSorting: false,
    isHiddenExcel: true,
    showType: 'auto'
  }
)

const {
  columns: pnFilterColumn,
  forms: pnFilter,
  activeForms: pnActiveFilter,
  getActiveForms: getPnFilter
} = useFormSetting<Filter>(pnColumnSetting, 'filter')

const { tableSetting: pnTableSetting } = useTableSetting(pnColumnSetting, 'table', {
  title: 'PN',
  i18nModule: 'system',
  version: '1.0.2',
  settingKey: 'auto-32-sg-pn',
  isSorting: false,
  isHiddenExcel: true,
  showType: 'auto'
})

const tab = ref('product')
const tabs = [
  { i18nLabel: 'product-group', value: 'product', label: '產品族' },
  { i18nLabel: 'engineering-wip', value: 'engineeringWip', label: '指定貨批' },
  { value: 'pn', label: 'PN' }
]

const productData = ref([])
const engineeringWipData = ref([])
const pnData = ref([])

const init = async () => {
  isLoading.value = true

  lotData.value = props?.data ?? {}

  const { productGroup_Id = '', erpNo = '' } = lotData.value ?? {}

  const [_resProductData, _resEngineeringWipData, _resPnData] = await Promise.all([
    getMpgp({
      attrNametypeItemIndex: 0,
      scheduleTargetValue: productGroup_Id,
      ...getProductFilter(false)
    }),
    getMpgp({
      attrNametypeItemIndex: 1,
      scheduleTargetValue: erpNo,
      ...getEngineeringWipFilter(false)
    }),
    getMpgp({
      attrNametypeItemIndex: 2,
      scheduleTargetValue: erpNo,
      ...getPnFilter(false)
    })
  ])

  const { status: statusProduct, msg: msgProduct, data: _productData } = _resProductData
  if (statusProduct !== 'success') {
    swal({
      icon: 'error',
      title: i18nTranslate('error-getData', 'system'),
      text: msgProduct ?? i18nTranslate('warning-contactIT', 'system'),
      showCancelButton: false
    })
  }
  productData.value = _productData

  const { status: statusEngineeringWip, msg: msgEngineeringWip, data: _engineeringWipData } = _resEngineeringWipData
  if (statusEngineeringWip !== 'success') {
    swal({
      icon: 'error',
      title: i18nTranslate('error-getData', 'system'),
      text: msgEngineeringWip ?? i18nTranslate('warning-contactIT', 'system'),
      showCancelButton: false
    })
  }
  engineeringWipData.value = _engineeringWipData

  const { status: statusPn, msg: msgPn, data: _pnData } = _resPnData
  if (statusPn !== 'success') {
    swal({
      icon: 'error',
      title: i18nTranslate('error-getData', 'system'),
      text: msgPn ?? i18nTranslate('warning-contactIT', 'system'),
      showCancelButton: false
    })
  }
  pnData.value = _pnData

  setTimeout(() => {
    isLoading.value = false
  }, 300)
}

const throttleInit = throttle<typeof init>(init, 200, { isNoTrailing: true })

onMounted(() => {
  throttleInit()
})
</script>

<template>
  <div v-loading="isLoading" class="modal">
    <div class="flex-label-list">
      <div class="flex-label-item">
        <label> {{ i18nTranslate('order-no') }} </label>
        <span>{{ lotData.erpNo }}</span>
      </div>
      <div class="flex-label-item">
        <label> {{ i18nTranslate('customer-no') }} </label>
        <span>{{ lotData.custNo }}</span>
      </div>
      <div class="flex-label-item">
        <label> {{ i18nTranslate('product-group') }} </label>
        <span>{{ lotData.productGroup_Id }}</span>
      </div>
      <div class="flex-label-item">
        <label> {{ i18nTranslate('process-no') }} </label>
        <span>{{ lotData.process_id }}</span>
      </div>
      <div class="flex-label-item">
        <label> {{ i18nTranslate('machine-no') }} </label>
        <span>{{ lotData.scheduledMachine_Id }}</span>
      </div>
    </div>

    <CustomTabs v-model="tab" :options="tabs">
      <template #default="{ label, value }">
        <span v-if="value === 'product'">
          {{ `${i18nTranslate('product-group')} ( ${productData.length} )` }}
        </span>
        <span v-else-if="value === 'engineeringWip'">
          {{ `${i18nTranslate('engineering-wip')} ( ${engineeringWipData.length} )` }}
        </span>
        <span v-else-if="value === 'pn'">
          {{ `${label} ( ${pnData.length} )` }}
        </span>
      </template>
    </CustomTabs>
    <div class="modal-info">
      <Transition name="fade">
        <KeepAlive>
          <CustomTable
            v-if="tab === 'product'"
            :table-data="productData"
            :table-data-count="productData.length"
            v-bind="productTableSetting"
          >
            <template #header-all="{ column }">
              <span>{{ i18nTranslate(column?.i18nLabel) }}</span>
            </template>

            <template
              v-for="key in ['machineId', 'custId', 'processId']"
              :key="`${key}`"
              #[`header-${key}`]="{ prop }"
            >
              <CustomSearch
                v-model="productFilter[prop]"
                v-model:active="productActiveFilter[prop]"
                v-bind="productFilterColumn[prop]"
                i18n-module="system"
                search
                @change="throttleInit"
              />
            </template>
          </CustomTable>
          <CustomTable
            v-else-if="tab === 'engineeringWip'"
            :table-data="engineeringWipData"
            :table-data-count="engineeringWipData.length"
            v-bind="engineeringWipTableSetting"
          >
            <template #header-all="{ column }">
              <span>{{ i18nTranslate(column?.i18nLabel) }}</span>
            </template>

            <template
              v-for="key in ['machineId', 'custId', 'processId']"
              :key="key"
              #[`header-${key}`]="{ prop }"
            >
              <CustomSearch
                v-model="engineeringWipFilter[prop]"
                v-model:active="engineeringWipActiveFilter[prop]"
                v-bind="engineeringWipFilterColumn[prop]"
                i18n-module="system"
                search
                @change="throttleInit"
              />
            </template>
          </CustomTable>
          <CustomTable
            v-else-if="tab === 'pn'"
            :table-data="pnData"
            :table-data-count="pnData.length"
            v-bind="pnTableSetting"
          >
            <template #header-all="{ column }">
              <span>{{ i18nTranslate(column?.i18nLabel) }}</span>
            </template>

            <template
              v-for="key in ['machineId', 'custId', 'processId']"
              :key="key"
              #[`header-${key}`]="{ prop }"
            >
              <CustomSearch
                v-model="pnFilter[prop]"
                v-model:active="pnActiveFilter[prop]"
                v-bind="pnFilterColumn[prop]"
                i18n-module="system"
                search
                @change="throttleInit"
              />
            </template>
          </CustomTable>
        </KeepAlive>
      </Transition>
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

  &-info {
    flex: 1;
    height: 100%;
    overflow: auto;
  }
}
</style>
