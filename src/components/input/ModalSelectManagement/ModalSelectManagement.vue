<script setup lang="ts">
import { ref, computed, nextTick, inject } from 'vue'
import { storeToRefs } from 'pinia'

import type { UseHook } from '@/types/types_hook' // 全域功能類型
import { useModalSelectStore } from '@/stores/stores_components/useModalSelectStore'

import CustomModal from '@/components/feature/CustomModal/CustomModal.vue'
import CustomEmpty from '@/components/feature/CustomEmpty/CustomEmpty.vue'
import { getUuid } from '@/lib/lib_utils'
import { defaultModuleType } from '@/declare/declare_i18n'

import SelectArea from './SelectArea/SelectArea.vue'
import SelectMachine from './SelectMachine/SelectMachine.vue'
import SelectOrder from './SelectOrder/SelectOrder.vue'
import SelectProcess from './SelectProcess/SelectProcess.vue'

import SelectProduct from './SelectProduct/SelectProduct.vue'
import SelectProductCategory from './SelectProduct/SelectProductCategory.vue'
import SelectProductCustomer from './SelectProduct/SelectProductCustomer.vue'


import SelectRouting from './SelectRouting/SelectRouting.vue'

import SelectSpecType from './SelectSpecType/SelectSpecType.vue'
import SelectSpecCommon from './SelectSpecCommon/SelectSpecCommon.vue'

const scopedId = getUuid('ModalSelectManagement')

const useHook = inject('useHook') as UseHook
const { i18nTranslate, i18nTest } = useHook({
  i18nModule: defaultModuleType
})

// ModalSelect 設定資訊
const modalSelectStore = useModalSelectStore()
const {
  activeType, activeValue, isModalOpen,
  multiple, multipleLimit
} = storeToRefs(modalSelectStore)

const SelectComponentsRef = ref()

const renderInfo = computed(() => {
  switch (activeType.value) {
    case 'area':
      return {
        label: '區域',
        i18nLabel: 'area',
        props: {
          multiple: multiple.value,
          multipleLimit: multipleLimit.value
        },
        event: {},
        components: SelectArea
      }
    case 'machine':
      return {
        label: '機台',
        i18nLabel: 'machine',
        props: {
          multiple: multiple.value,
          multipleLimit: multipleLimit.value
        },
        event: {},
        components: SelectMachine
      }
    case 'order':
      return {
        label: '訂單',
        i18nLabel: 'order',
        props: {
          multiple: multiple.value,
          multipleLimit: multipleLimit.value
        },
        event: {},
        components: SelectOrder
      }
    case 'process':
      return {
        label: '製程',
        i18nLabel: 'process',
        props: {
          multiple: multiple.value,
          multipleLimit: multipleLimit.value
        },
        event: {},
        components: SelectProcess
      }
    case 'product':
      return {
        label: '產品',
        i18nLabel: 'product',
        props: {
          multiple: multiple.value,
          multipleLimit: multipleLimit.value
        },
        event: {},
        components: SelectProduct
      }
    case 'productCategory':
      return {
        label: '產品類別',
        i18nLabel: 'product-category',
        props: {
          multiple: multiple.value,
          multipleLimit: multipleLimit.value
        },
        event: {},
        components: SelectProductCategory
      }
    case 'productCustomer':
      return {
        label: '客戶',
        i18nLabel: 'customer',
        props: {
          multiple: multiple.value,
          multipleLimit: multipleLimit.value
        },
        event: {},
        components: SelectProductCustomer
      }
    case 'routing':
      return {
        label: '途程',
        i18nLabel: 'routing',
        props: {
          multiple: multiple.value,
          multipleLimit: multipleLimit.value
        },
        event: {},
        components: SelectRouting
      }
    case 'specType':
      return {
        label: '規格類型',
        i18nLabel: 'specification-type',
        props: {
          multiple: multiple.value,
          multipleLimit: multipleLimit.value
        },
        event: {},
        components: SelectSpecType
      }
    case 'specCommon':
      return {
        label: '共同規格',
        i18nLabel: 'specification-common',
        props: {
          multiple: multiple.value,
          multipleLimit: multipleLimit.value
        },
        event: {},
        components: SelectSpecCommon
      }
    default:
      return {
        label: '無',
        i18nLabel: 'none-var',
        props: {},
        event: {},
        components: CustomEmpty
      }
  }
})

const getTranslateLabel = (i18nLabel: string, label: string) => {
  return i18nTest(i18nLabel) ? i18nTranslate(i18nLabel) : `[${label}]`
}

const onModalSubmit = async () => {
  const selectedValue = SelectComponentsRef.value?.getSelectionRows()
  activeValue.value = selectedValue
  await nextTick()
  isModalOpen.value = false
}

</script>

<template>
  <div class="modal-select-management" :class="scopedId">
    <CustomModal
      v-model="isModalOpen"
      :title="getTranslateLabel(renderInfo.i18nLabel, renderInfo.label)"
      height-size="large"
      @submit="onModalSubmit"
    >
      <component
        ref="SelectComponentsRef"
        :is="renderInfo.components"
        v-bind="renderInfo.props"
        v-on="renderInfo.event"
      />
    </CustomModal>
  </div>
</template>

<style lang="scss" scoped>
.modal-select-management {
  display: contents;
}
</style>
