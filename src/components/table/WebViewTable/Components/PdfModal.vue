<script setup lang="ts">
import { ref, computed, inject } from 'vue'
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

const useHook = inject('useHook') as UseHook
const { i18nTranslate } = useHook()

const emit = defineEmits(['update:model-value'])

const pdfModal = computed({
  get: () => props.modelValue,
  set: value =>  emit('update:model-value', value)
})

const tableData = ref([])
const pdfTitle = ref('')
const pdfColumns = ref<any[]>([])
const downloadExcel = ref()


const setPdfSetting = (setting: any) => {
  const params = Object.keys(setting)
  params.forEach(key => {
    switch(key) {
      case 'data': tableData.value = setting[key]; break
      case 'columns': pdfColumns.value = setting[key]; break
      case 'title': pdfTitle.value = setting[key]; break
      case 'downloadExcel': downloadExcel.value = setting[key]; break
    }
  })

}
const printPdf = () => {
  switch (fileType.value) {
    case 'pdf': PdfPreviewRef.value?.print(); break
    case 'xlsx': downloadExcel.value(tableData.value)
  }
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
const onDrag = () => {
  PdfPreviewRef.value?.initPage()
}

const PdfPreviewRef = ref<typeof PdfPreview>()
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

  PdfPreviewRef.value?.initPage()
}

const sizeChange = () => {
  PdfPreviewRef.value?.initPage()
}

const curPageIndex = ref(1)
const pageCutRowIndexs = ref([])

const activeChange = () => {
  PdfPreviewRef.value?.initPage()
}

// FileType
const fileType = ref('pdf')
const fileTypeButtonStyle = (button: string) => {
  return button === fileType.value ? 'primary' : 'info'
}
const fileTypeButtonClick = (button: string) => {
  fileType.value = button
  switch (button) {
    case 'xlsx': {
      pdfSize.value = 'response'
      PdfPreviewRef.value?.initPage()
      break
    }
    case 'pdf': {
      pdfSize.value = 'A4'
      PdfPreviewRef.value?.initPage()
      break
    }
  }
}

// FilePage
const showPageController = computed(() => {
  return fileType.value === 'pdf'
})

const addCurPage = (value: number) => {
  const nextPage = curPageIndex.value + value
  if(nextPage > pageCutRowIndexs.value.length) return
  if(nextPage < 1) return
  setCurPage(nextPage)
}
const setCurPage = (nextPage: number) => {
  curPageIndex.value = nextPage
  PdfPreviewRef.value?.scrollToPage(nextPage)
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
    <template #header>{{ '下載設定' /* i18nTranslate('setting-pdf-download') */ }}</template>
    <div class="pdf-wrapper">
      <div class="pdf-preview">
        <div class="pdf-preview-body">
          <PdfPreview
            ref="PdfPreviewRef"
            :title="pdfTitle"
            :columns="previewColumns"
            :table-data="tableData"
            :orientation="previewOrientation"
            :pdf-size="pdfSize"
            v-model:curPageIndex="curPageIndex"
            v-model:pageCutRowIndexs="pageCutRowIndexs"
          ></PdfPreview>
        </div>
      </div>
      <div class="pdf-side">
        <div class="pdf-setting">
          <div class="pdf-setting-item">
            <div class="item-row title">{{ i18nTranslate('setting-file') }}</div>
            <!-- File Type -->
              <div class="item-row between">
                <div class="text-header">{{ '類型' /* i18nTranslate('name') */ }}</div>
                <div class="button-group">
                  <CustomButton
                    icon-name="file-excel"
                    label="Excel"
                    :type="fileTypeButtonStyle('xlsx')"
                    @click="fileTypeButtonClick('xlsx')"
                  ></CustomButton>
                  <CustomButton
                    label="Pdf"
                    icon-name="file-pdf"
                    :type="fileTypeButtonStyle('pdf')"
                    @click="fileTypeButtonClick('pdf')"
                  ></CustomButton>
                </div>
              </div>
            <!-- File Name -->
            <div class="item-row">
              <div class="text-header">{{  i18nTranslate('name')  }}</div>
            </div>
            <div class="item-row">
              <CustomInput
                v-model="pdfTitle"
                type="text"
                hiddenLabel
              >
                <template #append>{{ `.${fileType}`}}</template>
              </CustomInput>
            </div>
            <!-- File Format -->
             <template v-if="fileType === 'pdf'">
                <div class="item-row between">
                <div class="text-header">{{  i18nTranslate('format')  }}</div>
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
                    @change="sizeChange"
                  />
                </div>
             </template>

          </div>
          <div class="pdf-setting-item">
            <div class="item-row title">{{ i18nTranslate('columnSetting') }}</div>
            <div>
              <CustomDraggable
                v-model="pdfColumns"
                item-key="key"
                :style="dragContainerStyle"
                :row-style="dragItemStyle"
                @change="onDrag"
              >
                <template  #item="{ element }">
                  <div class="column-active">
                    <CustomInput
                      v-model="element.active"
                      hidden-label
                      type="checkbox"
                      @change="activeChange"
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
    </div>
    <template #footer>
      <div class="modal-footer">
        <CustomButton
          type="primary"
          :label="i18nTranslate('download')"
          @click="printPdf"
        />
        <div class="page-controller" v-if="showPageController">
            <div class="page-controller-icon">
              <CustomButton
                text
                icon-name="angle-left"
                :disabled="curPageIndex === 1"
                @click="addCurPage(-1)"
              />
            </div>
            <div class="page-controller-input">
              <CustomInput
                v-model="curPageIndex"
                type="number"
                :min="1"
                :max="pageCutRowIndexs.length"
                :floor="0"
                hiddenLabel
                @change="setCurPage"
              >
                <template #append>{{ `/ ${pageCutRowIndexs.length}`}}</template>
              </CustomInput>
            </div>

            <div class="page-controller-icon">
              <CustomButton
                text
                icon-name="angle-right"
                :disabled="curPageIndex === pageCutRowIndexs.length"
                @click="addCurPage(1)"
              />
            </div>
        </div>
      </div>

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

  &-controller {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 160px;
    height: 32px;
    gap: 4px;

    &-icon {
      width: 32px;
      display: flex;
      justify-content: center;
      cursor: pointer;
    }

    &-input {
      width: 100px;
    }
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
    display: flex;
    flex-direction: column;
    position: relative;
    width: 70%;
    height: 100%;
    background-color: rgb(242, 242, 242);

    overflow: none;

    &-body {
      width: 100%;
      height: 100%;
      // height: calc(100% - 36px);
    }
  }

  &-output {
    width: 400px;
    height: 100%;
    background-color: white;
  }
  &-side {
    display: flex;
    flex-direction: column;
    width: 30%;
    height: 100%;
    overflow: auto;
    border-left: 1px solid lightgray;
  }
  &-setting {
    display: flex;
    flex-direction: column;

    width: 100%;
    height: 100%;
    font-size: 16px;
    padding: 16px;
    gap: 16px;

    &-item {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: fit-content;
      gap: 8px;
    }
  }
  &-page {
    display: flex;
    flex:row;

    width: 200px;
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
.button {
  &-group {
    display: flex;
    flex-direction: row;
    gap: 8px;
  }
}

.modal {
  &-footer {
    width: 100%;
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
  }
}
</style>
