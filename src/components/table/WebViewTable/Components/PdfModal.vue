<script setup lang="ts">
import { ref, computed, inject } from 'vue' //, reactive, computed
import {
  CustomButton,
  CustomModal,
  CustomInput,
  CustomDraggable
} from '@/components'
import type { UseHook } from '@/declare/hook' // 全域功能類型

import PdfPreview from './PdfPreview.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    require: true
  }
})

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook()

const emit = defineEmits(['update:model-value'])

const pdfModal = computed({
  get: () => props.modelValue,
  set: value =>  emit('update:model-value', value)
})

const tableData = ref([])
const pdfTitle = ref('')
const pdfColumns = ref([])

const setPdfSetting = setting => {
  const params = Object.keys(setting)
  params.forEach(key => {
    switch(key) {
      case 'data': tableData.value = setting[key]; break
      case 'columns': pdfColumns.value = setting[key]; break
      case 'title': pdfTitle.value = setting[key]; break
    }
  })

}
const printPdf = () => {
  previewRef.value.print()
}

const pdfSize = ref('A4')
const pdfSizeOptions = [
  { label: '根據表格大小', value: 'response'},
  { label: 'A3', value: 'A3' },
  { label: 'A4', value: 'A4' },
  { label: 'A5', value: 'A5' },
  { label: 'B3', value: 'B3' },
  { label: 'B4', value: 'B4' },
  { label: 'B5', value: 'B5' }

]

const dragContainerStyle = {
  'box-shadow': '0px 0px 1px 1px #dcdfe6',
  'border-radius': '4px',
  border: 'none'
}
const dragItemStyle = {
  height: '32px',
  'padding': '4px 0px 4px 4px',
  'align-items': 'center',
  'border-bottom': '1px solid #dcdfe6'
}

const previewRef = ref(null)
const previewOrientation = ref<'p' | 'l'>('p')
const previewColumns = computed(() => {
  const columns = pdfColumns.value.filter(column => column.active)
  return columns
})

const showOrientation = computed(() => {
  return pdfSize.value !== 'response'
})
const getOrientationText = () => {
  const i18nKey = `orientation-${previewOrientation.value}`
  return i18nTranslate(i18nKey)
}
const changeOrientation = () => {
  if(previewOrientation.value === 'p' ) previewOrientation.value = 'l'
  else previewOrientation.value = 'p'
}

// Expose
defineExpose({
  setPdfSetting
})

</script>

<template>
  <CustomModal
    v-model="pdfModal"
    widthSize="large"
    heightSize="large"
    :hidden-collapse="false"
  >
    <template #header> {{ i18nTranslate('setting-pdf-download') }} </template>
    <div class="pdf-wrapper">
      <div class="pdf-preview">
        <PdfPreview ref="previewRef"
          :title="pdfTitle"
          :columns="previewColumns"
          :table-data="tableData"
          :orientation="previewOrientation"
          :pdf-size="pdfSize"
        ></PdfPreview>
      </div>
      <div class="pdf-setting">
        <div class="pdf-setting-item">
          <div class="item-row title"> {{ i18nTranslate('setting-file') }} </div>
          <!-- File Name -->
          <div class="item-row">
            <div class="text-header"> {{  i18nTranslate('name')  }}</div>
          </div>
          <div class="item-row">
            <CustomInput
              v-model="pdfTitle"
              type="text"
              hiddenLabel
            />
          </div>
          <!-- File Format -->
          <div class="item-row between">
            <div class="text-header"> {{  i18nTranslate('format')  }}</div>
            <CustomButton v-if="showOrientation"
              :label="getOrientationText()"
              icon-name="rotate"
              icon-size="small"
              @click="changeOrientation"
            />

          </div>
          <div class="item-row">
            <CustomInput
              v-model="pdfSize"
              type="select"
              :options="pdfSizeOptions"
              hiddenLabel
            />
          </div>

        </div>
        <div class="pdf-setting-item">
          <div class="item-row title"> {{ i18nTranslate('columnSetting') }} </div>
          <div>
            <CustomDraggable
              v-model="pdfColumns"
              item-key="key"
              :style="dragContainerStyle"
              :row-style="dragItemStyle"
            >
              <template  #item="{ element }">
                <div class="column-active">
                  <CustomInput
                    v-model="element.active"
                    hidden-label
                    type="checkbox"
                  />
                </div>
                <div class="column-name">
                  {{ element.name }}
                </div>
              </template>
            </CustomDraggable>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <CustomButton
        type="primary"
        :label="i18nTranslate('download-pdf')"
        @click="printPdf"
      />
    </template>
  </CustomModal>
</template>

<style lang="scss" scoped>
  .page {
    &-wrapper {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
  }

 .pdf {
    &-wrapper {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 100%;
    }
    &-preview {
      position: relative;
      width: 70%;
      height: 100%;
      background-color: rgb(242, 242, 242);
    }
    &-output {
      width: 400px;
      height: 100%;
      background-color: white;
    }
    &-setting {
      display: flex;
      flex-direction: column;
      width: 30%;
      height: 100%;
      overflow: auto;
      border-left: 1px solid lightgray;

      font-size: 16px;
      padding: 16px;
      gap: 12px;

      &-item {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: fit-content;
        gap: 8px;
      }
    }


  }

  .item {
    &-row {
      display: flex;
      flex-direction: row;
      height: 32px;
      align-items: center;
      padding-left: 8px;
      &.title {
        padding-left: 0px;
        font-size: 18px;
        font-weight: bold;
        border-bottom: 1px dashed lightgray;
      }


    }
  }

  .column {
    &-active {
      width: 24px;
      padding-left: 4px;
      padding-right: 4px;
      justify-content: center;
    }
    &-name {
      padding-left: 4px;
      padding-right: 4px;
    }
  }

  .between {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .text {
    font-size: 16px;
    &-header {
      font-weight: bold;
    }
    &-row {
      display: flex;
      flex-direction: row;
      gap: 14px;
    }
  }
</style>
