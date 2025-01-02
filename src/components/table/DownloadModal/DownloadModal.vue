<script setup lang="ts">
import { ref, computed, inject, nextTick } from 'vue'
import {
  CustomButton,
  CustomModal,
  CustomInput,
  CustomDraggable
} from '@/components'
import type { UseHook } from '@/declare/hook' // 全域功能類型
import { createWorkbook } from '@/lib/lib_files'

import { isEmpty } from '@/lib/lib_utils'

import PdfPreview from './DownloadPreview.vue'

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
const pdfColumns = ref([])
const downloadExcel = ref()
const spanInfo = ref()

const allSpanTableData = []
const spanTableData = ref([])
const setActiveColumns = () => {
  const topColumns = previewColumns.value
  const topPropsSubTableInfoMap = spanInfo.value.topPropSubTableInfoMap
  const columnsInfo = topColumns.map(column => {
    const { key } = column
    const subTableInfo = topPropsSubTableInfoMap.get(key)
    const baseColumns = subTableInfo.columns
    const hasChildren = baseColumns.length > 1 ? true : false
    const depth = subTableInfo.depth

    return {
      key,
      hasChildren,
      baseProps: baseColumns,
      depth
    }
  })

  let maxDepth = 1
  columnsInfo.forEach(column => {
    const depth = column.depth
    if(depth > maxDepth) maxDepth = depth
})

  headerRow.value = []
  for(let i = 0; i < maxDepth; i++) {
    headerRow.value.push([])
  }

  const headerRows = headerRow.value
  const setHeaderRows = (columns: any[], rowIndex: number) => {
    const headerRow = headerRows[rowIndex]
    const columnsSize = columns.map(column => {
      const { key, children, name } = column

      if(children.length === 0) {
        const colSpan = 1
        const rowSpan = maxDepth - rowIndex
        const columnData = { name, key, colSpan, rowSpan }
        headerRow.push(columnData)
        return colSpan
      }
      else {
        const colSpan = setHeaderRows(children, rowIndex + 1)
        const rowSpan = 1
        const columnData = { name, key, colSpan, rowSpan }
        headerRow.push(columnData)
        return colSpan
      }
    })

    return columnsSize.reduce((totalSize, curSize) => totalSize + curSize, 0)

  }


  // 根據ActiveColumns篩出要預覽的TopColumns
  const subTableTree =  previewColumns.value.map(activeColumn => {
    return spanInfo.value.subTableTree.find(column => activeColumn.key === column.key)
  }).filter(result => result !== null)

  // const subTableTree = spanInfo.value.subTableTree.filter(column => {
  //   return previewColumns.value.some(activeColumn => activeColumn.key === column.key)
  // })

  setHeaderRows(subTableTree, 0 )

  spanTableData.value.splice(0)
  tableData.value.forEach(rowData => {
    let maxSubRowSize = 1
    columnsInfo.forEach(columnInfo => {
      if(columnInfo.hasChildren) {
        const subTableData = rowData[columnInfo.key] ?? []
        const subRowSize = subTableData.length
        if(subRowSize > maxSubRowSize) maxSubRowSize = subRowSize
      }
    })

    const subRows = []
    for(let i = 0; i < maxSubRowSize; i++) {
      subRows.push([])
    }
    subRows.forEach((subRow, index) => {
      columnsInfo.forEach(columnInfo => {
        const {
          key,
          hasChildren,
          baseProps
        } = columnInfo

        if(hasChildren) {
          baseProps.forEach(prop => {
            const subTableData = rowData[key]
            if(index >= subTableData.length) {
              const context = ''
              const colSpan = 1
              const rowSpan = 1

              subRow.push({
                key,
                context,
                colSpan,
                rowSpan
              })
            }
            else {
              const subRowData = rowData[key][index]
              const context = spanInfo.value.getSubDisplayData(rowData, subRowData, prop) ?? ''
              const colSpan = 1
              const rowSpan = 1

              subRow.push({
                key,
                context,
                colSpan,
                rowSpan
              })
            }

          })

        }
        else {
          if(index === 0) {
            const context = rowData[key] ?? ''
            const colSpan = 1
            const rowSpan = maxSubRowSize

            subRow.push({
              key,
              context,
              colSpan,
              rowSpan
            })
          }
          else {
            const context = ''
            const colSpan = 0
            const rowSpan = 0

            subRow.push({
              key,
              context,
              colSpan,
              rowSpan
            })
          }
        }

      })
    })


    subRows.forEach(subRow => spanTableData.value.push(subRow))
  })
}


const setPdfSetting = setting => {
  const params = Object.keys(setting)
  // 儲存參數'
  params.forEach(key => {
    switch(key) {
      case 'data': tableData.value = setting[key]; break
      case 'columns': pdfColumns.value = setting[key]; break
      case 'title': pdfTitle.value = setting[key]; break
      case 'downloadExcel': downloadExcel.value = setting[key]; break
      case 'spanInfo': spanInfo.value = setting[key]; break
    }
  })


  setActiveColumns()
  // columns, spanMethod => headerRows
  // console.log(spanTableData.value)
}



const printPdf = () => {
  switch (fileType.value) {
    case 'pdf': previewRef.value.print(); break
    case 'xlsx': printExcel(); break // downloadExcel.value(tableData.value)
  }
}
const printExcel = () => {
  const _tableData = spanTableData.value.map(rowData => {
    return rowData.map(columnData => columnData.context ?? '')
  }) // tableData.value
  const title = pdfTitle.value

  const workbook = createWorkbook()
  const worksheet = workbook.addWorksheet(title, {
    properties: {
      tabColor: { argb: 'FFFFFF' },
      defaultRowHeight: 20,
      showGridLines: true,
      outlineLevelCol: 0,
      outlineLevelRow: 0,
      dyDescent: 55
    },
    views: [{ state: 'frozen', xSplit: 0, ySplit: 2 }]
  }) // 在檔案中新增工作表 參數放自訂名稱

  const subTableTree = spanInfo.value.subTableTree.filter(column => {
    return previewColumns.value.some(activeColumn => activeColumn.key === column.key)
  })



  const headerRowsSize = 2 // Header有幾行

  const excelColumns = []

  let colIndex = 1

  const mergeExcelHeader = (column, rowIndex, slotKey) => {
    const {
      key,
      name = '',
      children = []
    } = column

    worksheet.getCell(rowIndex, colIndex).value = name
    worksheet.getCell(rowIndex, colIndex).alignment = { horizontal: 'left', vertical: 'top' }
    if(isEmpty(children)) {
      worksheet.mergeCells(rowIndex, colIndex, headerRowsSize, colIndex)
      colIndex = colIndex + 1

      const align = 'left'
      const baseKey = slotKey.join('-') + key

      excelColumns.push({
        header: name,
        key: baseKey,
        hidden: false,
        style: {
          alignment: { horizontal: align, vertical: 'top' }
        }
      })


    }
    else {
      const recordColIndex = colIndex
      const nextSlotKey = slotKey.concat([key])

      children.forEach(childColumn => {
        mergeExcelHeader(childColumn, rowIndex + 1, nextSlotKey)
      })

      worksheet.mergeCells(rowIndex, recordColIndex, rowIndex, colIndex - 1)
    }
  }

  const adjustColumnWidth = worksheet => {
    worksheet.columns.forEach(column => {
    const lengths = column.values.map(v => {
      const str = v.toString()
      const chineseStr = str.match(/[\u4E00-\u9FA5]/g) ?? ''

      // 中文字元每字2.5單位 非中文字元每字1.2單位
      const size = Math.ceil(chineseStr.length * 1.3 + str.length * 1.2) + 2
      return size
    })

    const maxLength = Math.max(...lengths.filter(v => typeof v === 'number'))
    console.log(column.values, lengths, maxLength )
    column.width = maxLength
  })
}
    subTableTree.forEach(topColumn => {
      mergeExcelHeader(topColumn, 1, [])
    })
    worksheet.columns = excelColumns
    worksheet.addRows(_tableData)

    adjustColumnWidth(worksheet)
    // 表格裡面的資料都填寫完成之後，訂出下載的callback function
    // 異步的等待他處理完之後，創建url與連結，觸發下載
    workbook.xlsx.writeBuffer().then(content => {
      const a = document.createElement('a')
      const blobData = new Blob([content], {
        type: 'application/vnd.ms-excel;charset=utf-8;'
      })

      // a.download = `${title}.xlsx`
      a.download = `${pdfTitle.value}.xlsx`
      a.href = URL.createObjectURL(blobData)
      a.click()
    })

    //
    workbook.removeWorksheet(worksheet.id)



}


const allHeaderRow = []
const headerRow = ref([])
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
const onDrag = async () => {
  setActiveColumns()
  await nextTick()
  previewRef.value.initPage()
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

  previewRef.value.initPage()
}

const sizeChange = () => {
  previewRef.value.initPage()
}

const curPageIndex = ref(1)
const pageCutRowIndexs = ref([])

const activeChange = async () => {
  setActiveColumns()
  await nextTick()
  previewRef.value.initPage()
}

// FileType
const fileType = ref('pdf')
const fileTypeButtonStyle = button => {
  return button === fileType.value ? 'primary' : 'info'
}
const fileTypeButtonClick = button => {
  fileType.value = button
  switch (button) {
    case 'xlsx': {
      pdfSize.value = 'response'
      previewRef.value.initPage()
      break
    }
    case 'pdf': {
      pdfSize.value = 'A4'
      previewRef.value.initPage()
      break
    }
  }
}

// FilePage
const showPageController = computed(() => {
  return fileType.value === 'pdf'
})

// 下一頁
const addCurPage = value => {
  const nextPage = curPageIndex.value + value
  if(nextPage > pageCutRowIndexs.value.length) return
  if(nextPage < 1) return
  setCurPage(nextPage)
}
// 跳至指定頁數
const setCurPage = nextPage => {
  curPageIndex.value = nextPage
  previewRef.value.scrollToPage(nextPage)
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
          <PdfPreview ref="previewRef"
            :title="pdfTitle"
            :columns="previewColumns"
            :table-data="tableData"
            :orientation="previewOrientation"
            :pdf-size="pdfSize"
            :headerRow="headerRow"
            :spanTableData="spanTableData"
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
              <div class="text-header">{{ i18nTranslate('name') }}</div>
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
                <div class="text-header">{{ i18nTranslate('format') }}</div>
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
    <!-- Page Info -->
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
  .page {
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
</style>
