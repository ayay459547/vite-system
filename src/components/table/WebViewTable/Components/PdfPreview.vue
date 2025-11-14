
<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, onMounted, computed, nextTick, onBeforeMount, onBeforeUnmount } from 'vue'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import { isEmpty } from '@/lib/lib_utils'
import { setPdfLangFont } from '@/lib/lib_pdf'

type Orientation = 'p' | 'l'
const props = defineProps({
  columns: {
    type: Array as PropType<Array<any>>,
    default: () => []
  },
  title: {
    type: String as PropType<string>,
    required: true
  },
  tableData: {
    type: Array as PropType<Array<any>>,
    default: () => []
  },
  pdfSize: {
    type: String as PropType<string>
  },
  orientation: {
    type: String as PropType<Orientation>
  },
  curPageIndex: {
    type: Number as PropType<number>
  },
  pageCutRowIndexs: {
    type: Array as PropType<Array<number>>,
    default: () => []
  }
})

const emit = defineEmits([
  'update:pageCutRowIndexs',
  'update:curPageIndex'
])

const isLoading = ref(false)
const pdfColumns = computed(() => props.columns ?? [])

const containerSize = computed(() => {
  if(props.pdfSize === 'response') return {
    width: 'fit-content',
    height: 'fit-content',
    'white-space': 'nowrap'
  }

  const paperSize = (() => {
    switch (props.pdfSize) {
      case 'A3': return [ 297, 420 ]
      case 'A4': return [ 210, 297 ]
      case 'A5': return [ 148, 210 ]
      case 'B3': return [ 353, 500 ]
      case 'B4': return [ 250, 353 ]
      case 'B5': return [ 176, 250 ]
      default: throw new Error('Undefine PDF Size.')
    }
  })()
  if(!paperSize) return {}
  const windowSize = paperSize.map(mm => Math.ceil(sizeUnitConvert(mm, 'mm', 'px')) + 'px')

  const style = props.orientation === 'p' ? {
    width: windowSize[0],
    height: windowSize[1]
  } : {
    width: windowSize[1],
    height: windowSize[0]
  }
  return style
})

const tableStyle = computed(() => {
  if(props.pdfSize === 'response') return [
    'height: fit-content',
    'width: fit-content'
  ]
  return [
    'word-break: break-all',
    'overflow: hidden',
    'width: 100%',
    'height: fit-content',
    'max-height: 100%'
  ]
})

const setTableData = async () => {
  pdfTableData.value = props.tableData.map((rowData, index) => {
    return { ...rowData, key: index }
  })
  webTableData.value = props.tableData.map((rowData, index) => {
    return { ...rowData, key: index }
  })
}


onBeforeMount(() => {
  setTableData()
})

onMounted(async () => {
  setTimeout(async () => {
    await initPage()
  }, 300)
})

const paperRef = ref<any>()
const pdfTableData = ref<any[]>([])
const webTableData = ref<any[]>([])

/**
 * @description 單位轉換(dpi:72)
 *              更新日期: 2024-12-31, author: Caleb, content: 添加類型
 * @param {Number} value 轉換前值
 * @param {String} unit1 轉換前單位
 * @param {String} unit2 轉換後單位
 * @returns {Number} 轉換後值
 */
const sizeUnitConvert = (value: number, unit1: string, unit2: string): number => {
  const getScale = (unit: string): number => {
    switch (unit) {
       case 'px': return 96
       case 'pt': return 72
       case 'mm': return 25.4
       case 'inch': return 1
       default: return 0
    }
  }

  const scale1 = getScale(unit1)
  const scale2 = getScale(unit2)
  return value / scale1 * scale2
}

const tableRef = ref()
const tableHeaderRef = ref()
const tableBodyRef = ref()
// const tableFirstRowRef = ref()

// const firstRowColumns = ref([])
// const setFirstRowColumnsRef = (el, rowIndex, columnIndex) => {
//   if(rowIndex === 0) {
//     if(columnIndex < firstRowColumns.value.length) firstRowColumns.value[columnIndex] = el
//     else firstRowColumns.value.push(el)
//   }
// }

// const setFirstRowRef = (row, index) => {
//   console.log('SET', index)
//   if(index === 0) tableFirstRowRef.value = row
// }

// const previewPageTableRef = ([])
const tableColumnsWidth = ref<any[]>([])
const getTableColumnsWidthStyle = (columnIndex: number) => {
  if(tableColumnsWidth.value.length === 0 ) return {}
  const width = tableColumnsWidth.value[columnIndex]
  const style = { width: `${width}px`}
  return style
}

const initPage = async () => {
  // console.log('INIT')

  isLoading.value = true
  await nextTick()
  const pageCutRowIndexs = [0]
  const rowElement = tableBodyRef.value.children
  const headerHeight = tableHeaderRef.value.offsetHeight
  // const headerElement = tableHeaderRef.value.children
  const tableHeight = tableRef.value.offsetHeight

  // Set tableColumnsWidth


  let pageCutHeight = tableHeight
  const tempPageTables: any[] = [{
    tableData: []
  }]

  // headerElement.forEach((element, index) => {
  //   const { offsetWidth } = element
  //   const columnName = props.columns[index]
  //   previewColumnWidth.value[columnName] = offsetWidth
  // })

  rowElement.forEach((element: any, index: number) => {
    const { offsetHeight, offsetTop } = element
    const offsetBottom = offsetTop + offsetHeight
    const rowTableData = props.tableData[index]

    if(offsetBottom > pageCutHeight) {
      pageCutRowIndexs.push(index)
      pageCutHeight = offsetBottom + (tableHeight - headerHeight)
      tempPageTables.push({
        tableData: []
      })
    }

    tempPageTables.at(-1).tableData.push(rowTableData)
  })

  allPageTables.value = tempPageTables

  setTimeout(async () => {
    emit('update:pageCutRowIndexs', pageCutRowIndexs)
    emit('update:curPageIndex', 1)
    // Set First ColumnWidth
    const firstRowColumns: any[] = tableHeaderRef.value.children
    const tempColumns: any[] = []
    firstRowColumns.forEach(column => tempColumns.push(column.offsetWidth))
    tableColumnsWidth.value = tempColumns
    // tableColumnsWidth.value = firstRowColumns.mapData(column => column.offsetWidth)

    isLoading.value = false
  }, 500)
}

const printPdf = async () => {
  isLoading.value = true
  await nextTick()
  setTimeout(async() => {
    const { offsetWidth, offsetHeight } = paperRef.value // { pt, px }

    const paperWidth = sizeUnitConvert(offsetWidth, 'px', 'pt')
    const paperHeight = sizeUnitConvert(offsetHeight, 'px', 'pt') + 48

    const getFormat = () => {
      if(props.pdfSize !== 'response') return props.pdfSize
      return [paperWidth, paperHeight]
    }
    const getOrientation = () => {
      if(props.pdfSize !== 'response') return props.orientation
      return (paperWidth >= paperHeight) ? 'l' : 'p'
    }
    //
    const format = getFormat()
    const orientation = getOrientation()
    const doc = new jsPDF({
      format,
      orientation,
      unit: 'pt'
    })

    //  AutoTable Setting (Size Unit: pt)
    const font = await setPdfLangFont(doc, 'zhTw')
    const headData = pdfColumns.value.map(column => column.name)
    const columnsKey = pdfColumns.value.map(column => column.key)
    const bodyData = props.tableData.map(rowData => {
      return columnsKey.map(key => rowData[key])
    })
    const padding = Math.floor(sizeUnitConvert(4, 'px', 'pt'))
    const fontSize = Math.floor(sizeUnitConvert(10, 'px', 'pt'))
    const lineWidth = sizeUnitConvert(1, 'px', 'pt')

    autoTable(doc, {
      margin: 24,
      head: [headData],
      styles: {
        lineWidth: lineWidth,
        lineColor: 'rgb(215,215,215)',
        font: font ?? '',
        textColor: 'rgb(0,0,0)',
        cellPadding: padding,
        fontSize: fontSize
      },
      headStyles: {
        fillColor: 'rgb(182, 209, 224)'
      },
      body: bodyData,
      tableLineWidth: lineWidth,
      tableLineColor: [20, 0, 0]
    })

    const fileName = `${props.title}.pdf`
    doc.save(fileName)

    isLoading.value = false
  }, 300)
}

const allPageTables = ref<any[]>([])
const previewPageContainer = ref()
const previewPageWrapper = ref()
const previewPageScroll = () => {
  const { scrollHeight, scrollTop } = previewPageWrapper.value
  const pages = (!Array.isArray(props.pageCutRowIndexs) || props.pageCutRowIndexs.length === 0) ? 1 : props.pageCutRowIndexs.length
  const pageHeight = scrollHeight / pages
  const curPage = Math.floor(scrollTop / pageHeight) + 1
  if(curPage !== props.curPageIndex) {
    emit('update:curPageIndex', curPage)
  }
}

const scrollToPage = (toPage: number) => {
  const { scrollHeight } = previewPageWrapper.value
  const pages = (!Array.isArray(props.pageCutRowIndexs) || props.pageCutRowIndexs.length === 0) ? 1 : props.pageCutRowIndexs.length
  const pageHeight = scrollHeight / pages

  previewPageWrapper.value.scrollTop = pageHeight * (toPage - 1 )
}

onMounted(() => {
  previewPageWrapper.value.addEventListener('scroll', previewPageScroll, false)
})
onBeforeUnmount(() => {
  previewPageWrapper.value.removeEventListener('scroll', previewPageScroll)
})


defineExpose({
  print: printPdf,
  initPage,
  scrollToPage
})
</script>

<template>
  <div class="preview-wrapper"  v-loading="isLoading" ref="previewPageWrapper">
    <!-- 預覽用的表格 -->
    <div class="preview-container" ref="previewPageContainer">
      <template v-for="pageTable, index in allPageTables" :key="pageTable">
        <div class="preview-page" :style="containerSize"  :id="`page-${index}`">
          <div class="preview-table"  :style="tableStyle">
            <table class="table-main">
              <thead>
                <tr>
                  <th class="table-cell header"
                    v-for="column, index in pdfColumns" :key="column.key"
                    :style="getTableColumnsWidthStyle(index)"
                  >
                    <div class="table-column-header">{{ column.name }}</div>
                  </th>
                </tr>
              </thead>
              <tbody v-if="!isEmpty(pageTable.tableData)">
                <tr v-for="row in pageTable.tableData" :key="row.key">
                  <td class="table-cell" v-for="column in pdfColumns" :key="column.key">
                    <div class="table-column-data">{{  row[column.key] }}</div>
                  </td>
                </tr>
              </tbody>
            </table>

          </div>
        </div>
      </template>
    </div>
  </div>

  <!-- VirtualTABLE 計算頁數寬度用的非顯示表示 -->
  <div class="paper-container hidden" :style="containerSize" ref="paperRef">
    <div class="paper-table" :style="tableStyle" ref="tableRef">
      <table class="table-main">
        <thead>
          <tr ref="tableHeaderRef">
            <th class="table-cell header" v-for="column in pdfColumns" :key="column.key">
              <div class="table-column-header">{{ column.name }}</div>
            </th>
          </tr>
        </thead>
        <tbody ref="tableBodyRef">
          <tr v-for="row in props.tableData" :key="row.key">
            <td class="table-cell" v-for="column in pdfColumns" :key="column.key">
              <div class="table-column-data">{{ row[column.key] }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .preview {
    &-wrapper {
      position: relative;
      padding: 24px;
      width: 100%;
      height: 100%;
      overflow: auto;
    }

    &-container {
      display: flex;
      flex-direction: column;
      gap: 64px;
    }
    &-page {
      background-color: white;
      padding: 24pt;
    }
    &-table {
      width: 100%;
      height: fit-content;
      border: 1px solid rgb(0, 0, 0);
      box-sizing: border-box;
    }
  }

  .paper {
    &-container {
      background-color: white;
      padding: 24pt;
    }
    &-table {
      display: flex;
      flex-direction: column;
      border: 1px solid rgb(0, 0, 0);
    }
  }

  .table {
    &-main {
      border-spacing: 0pt;
      width: 100%;
      height: fit-content;
    }
    &-row {
      padding: 0;
    }
    &-cell {
      border:  0.5px solid rgb(215, 215, 215);
      box-sizing: border-box;
      // box-shadow:  1px 1px rgb(215, 215, 215);
      padding: calc(3pt - 1px); // 4px;
      font-size: 7pt; // 10px;
      &.header {
        text-align: left;
        background-color:rgb(182, 209, 224);
      }
    }
    &-column {
      &-header {
        padding: 0px;
      }
      &-data {
        padding: 0px;
      }
    }


  }


  .hidden {
    position: fixed;
    visibility: hidden;
  }



</style>
