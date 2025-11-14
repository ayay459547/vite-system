
<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, onMounted, computed, nextTick, onBeforeMount, onBeforeUnmount } from 'vue'

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import dayjs from 'dayjs'

import { defaultLang } from '@/declare/declare_i18n'
import { isEmpty } from '@/lib/lib_utils'
import { setPdfLangFont } from '@/lib/lib_pdf'

const _env = (import.meta as any).env
const customerString = _env.VITE_API_CUSTOMER
const curTimeString = ref(dayjs().format('YYYY-MM-DD HH:mm'))

type Orientation = 'p' | 'l'
const props = defineProps({
  columns: {
    type: Array as PropType<Array<any>>,
    default: () => []
  },
  title: {
    type: String as PropType<string>
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
  headerRow: {
    type: Array as PropType<Array<any>>,
    default: () => []
  },
  spanTableData: {
    type: Array as PropType<Array<any>>,
    default: () => []
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
// const pdfColumns = computed(() => props.columns)

const containerSize = computed(() => {
  if(props.pdfSize === 'response') return {
    width: 'fit-content',
    height: 'fit-content',
    'white-space': 'nowrap'
  }

  // const paperSize = (() => {
  //   switch (props.pdfSize) {
  //     case 'A3': return [ 11.7, 16.5 ]
  //     // case 'A4': return [ 210, 297 ]
  //     case 'A4': return [ 8.3, 11.7 ]
  //     case 'A5': return [ 5.8, 8.3 ]
  //     case 'B3': return [ 353, 500 ]
  //     case 'B4': return [ 250, 353 ]
  //     case 'B5': return [ 176, 250 ]
  //     default: throw new Error('Undefine PDF Size.')
  //   }
  // })()
  const paperSize = (() => {
    switch (props.pdfSize) {
      case 'A3': return [ 297, 420 ]
      case 'A4': return [ 210, 297 ]
      // case 'A4': return [ 8.3, 11.7 ]
      case 'A5': return [ 148, 210 ]
      case 'B3': return [ 353, 500 ]
      case 'B4': return [ 250, 353 ]
      case 'B5': return [ 176, 250 ]
      default: throw new Error('Undefine PDF Size.')
    }
  })()
  if(!paperSize) return {}

  const windowSize = paperSize.map(mm => {
    const ptSize = round100(sizeUnitConvert(mm, 'mm', 'pt'))
    const pxSize = sizeUnitConvert(ptSize, 'pt', 'px')
    return pxSize + 'px'
  })
  // const sizeConver = (mm) => {
  //   const value = Math.round(sizeUnitConvert(mm, 'mm', 'px') * 100) /100
  //   return value + 'px'
  // }
  // const windowSize = paperSize.map(sizeConver)

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
    // 'word-break: normal',
    'word-break: break-all',
    'word-wrap: break-word',
    // 'overflow: hidden',
    'width: 100%',
    // 'max-width: 100%',
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

const paperRef = ref<HTMLDivElement>()
const pdfTableData = ref<any[]>([])
const webTableData = ref<any[]>([])

/**
 * @description 單位轉換(dpi:72)
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
      //  case 'inch': return 1
       default: return 0
    }
  }

  const scale1 = getScale(unit1)
  const scale2 = getScale(unit2)
  return value / scale1 * scale2
}
const round100 = (value : number) => {
  return Math.round(value * 100) / 100
}

const tableRef = ref<HTMLDivElement>()
const tableHeaderRef = ref<HTMLTableSectionElement>()
const tableBodyRef = ref<HTMLTableSectionElement>()

const tableColumnsWidth = ref<any[]>([])

const columnRef = ref<HTMLTableRowElement>()


const getTableColumnsWidthStyle = (columnIndex: number) => {
  if(tableColumnsWidth.value.length === 0 ) return {}
  const width = tableColumnsWidth.value[columnIndex]
  const style = { width: `${width - 8  }px`}
  // console.log(style)

  return style
}

const initPage = async () => {
  console.log('INIT')

  isLoading.value = true
  await nextTick()
  const pageCutRowIndexs = [0]
  const __rowElement__ = tableBodyRef.value.children
  const rowElement = Array.from(__rowElement__)
  const headerHeight = tableHeaderRef.value.offsetHeight
  // const headerElement = tableHeaderRef.value.children
  // const baseHeaderElement = headerElement[headerElement.length - 1
  const tableHeight = tableRef.value.offsetHeight


  // console.log()
  // Set tableColumnsWidth
  //
  // console.log(headerElement, baseHeaderElement)
  //

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
    // const { offsetHeight, offsetTop } = element
    // const offsetBottom = offsetTop + offsetHeight
    const { offsetHeight, offsetTop } = element
    const offsetBottom = offsetTop + offsetHeight
    const rowTableData = props.spanTableData[index]

    if(offsetBottom > pageCutHeight) {
      pageCutRowIndexs.push(index)
      pageCutHeight = offsetTop + (tableHeight - headerHeight)
      tempPageTables.push({
        tableData: []
      })
    }

    tempPageTables.at(-1).tableData.push(rowTableData)
  })

  allPageTables.value = tempPageTables
  // console.log(tempPageTables)
  // console.log(props.spanTableData)

  setTimeout(async () => {
    emit('update:pageCutRowIndexs', pageCutRowIndexs)
    emit('update:curPageIndex', 1)
    // Set First ColumnWidth
    // const firstRowColumns = tableHeaderRef.value.children
    // const tempColumns = []
    // firstRowColumns.forEach(column => tempColumns.push(column.offsetWidth))
    // tableColumnsWidth.value = tempColumns

    if(columnRef.value) {
      const __tableColumns__ = columnRef.value.children
      const tableColumns = Array.from(__tableColumns__)
      const columnsWidth: number[] = []
      tableColumns.forEach(column => {
        columnsWidth.push((column as HTMLElement).offsetWidth)
      })
      tableColumnsWidth.value = columnsWidth
      // console.log(columnsWidth)
      // console.log(props.headerRow)
    }

    // tableColumnsWidth.value = firstRowColumns.mapData(column => column.offsetWidth)
    isLoading.value = false
  }, 500)
}

const printPdf = async () => {
  isLoading.value = true
  await nextTick()
  setTimeout(async() => {
    const { offsetWidth, offsetHeight } = paperRef.value // {pt, px}

    const paperWidth = sizeUnitConvert(offsetWidth, 'px', 'pt')
    const paperHeight = sizeUnitConvert(offsetHeight, 'px', 'pt')

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
    const font = await setPdfLangFont(doc, defaultLang)

    const head = props.headerRow.map((row: any[]) => {
      return row.map(column => {
        const { name, colSpan, rowSpan } = column
        return {
          content: name,
          colSpan,
          rowSpan
        }
      })
    })
    const body = props.spanTableData.map((row: any[]) => {
      return row.map(column => {
        const { context, colSpan, rowSpan } = column
        return {
          content: context,
          colSpan,
          rowSpan
        }
      }).filter(column => column.rowSpan > 0)
    })
    // console.log(props.headerRow)
    // console.log(props.spanTableData)


    const padding = sizeUnitConvert(4, 'px', 'pt') // round100(sizeUnitConvert(4, 'px', 'pt'))
    const fontSize = Math.ceil(sizeUnitConvert(10, 'px', 'pt')) // 1.15  // round100()
    const lineWidth = sizeUnitConvert(1, 'px', 'pt') // round100()
    const autoTableSetting: Record<string, any> = {
      margin: 24,
      head,
      styles: {
        lineWidth: lineWidth,
        lineColor: 'rgb(215,215,215)',
        font,
        textColor: 'rgb(0,0,0)',
        cellPadding: padding,
        fontSize: fontSize
      },
      headStyles: {
        fillColor: 'rgb(182, 209, 224)'
      },
      body,
      // body: bodyData,
      tableLineWidth: lineWidth,
      tableLineColor: [20, 0, 0] as [number, number, number]
    }


    autoTable(doc, autoTableSetting)

    const fileName = `${props.title}.pdf`

    const docInternal = doc.internal
    const pageSize = docInternal.pageSize
    const maxPage = docInternal.pages.length - 1
    const pageWidth = pageSize.getWidth()
    const pageHeight = pageSize.getHeight()
    // const curTime = dayjs().format('YYYY/MM/DD HH:MM')
    // console.log(maxPage)
    // console.log('Internal', docInternal)
    // console.log('PdfSize', pageWidth, pageHeight)
    // console.log('PaperSize', paperWidth, paperHeight)

    doc.setFontSize(8)
    for (let curPage = 1; curPage <= maxPage ; curPage++) {
      doc.setPage(curPage)
      // 標題
      doc.text(props.title ?? '', 24, 18)
      // 時間
      doc.text(curTimeString.value, pageWidth - 24, 18, { align: 'right'})
      // 頁碼
      const pageInfo = curPage + ' / ' + maxPage
      doc.text(pageInfo, pageWidth / 2, pageHeight - 12, { align: 'center'})
      //
    }

    // console.log('PDF', doc)

    console.log('DOC', doc)
    // console.log(doc.internal.getCoordinateString())

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
  // console.log('======================')
  // console.log(props.columns)
  // console.log(props.headerRow)
  // console.log(props.spanTableData)
})
onBeforeUnmount(() => {
  previewPageWrapper.value.removeEventListener('scroll', previewPageScroll)
})


const displayTableCell = (cell: any) => {
  const { colSpan, rowSpan }  = cell
  if(colSpan === 0 && rowSpan === 0 ) return false
  return true
}

// const setBaseHeaderRef = (el, index ) => {
//   if(index === props.headerRow.length - 1) {
//     columnRef.value = el
//   }
// }

defineExpose({
  print: printPdf,
  initPage,
  scrollToPage
})
</script>

<template>
  <div class="preview-wrapper"  v-loading="isLoading" ref="previewPageWrapper">
    <!-- 預覽用的表格 -->
    <div class="preview-container " ref="previewPageContainer">
      <template v-for="pageTable, index in allPageTables" :key="pageTable">
        <div class="preview-page" :style="containerSize"  :id="`page-${index}`">
          <div class="meta-info title"> {{ title }} </div>
          <div class="meta-info time"> {{ curTimeString }} </div>
          <div class="meta-info page"> {{ `${index + 1 } / ${allPageTables.length}` }} </div>
          <div class="meta-info customer"> {{ customerString }}</div>



          <div class="preview-table"  :style="tableStyle">
            <table class="table-main">
              <thead>
                <tr v-for="row in headerRow" :key="row">
                  <th class="table-cell header"
                    v-for="column in row" :key="column.key"
                    :colspan="column.colSpan"
                    :rowspan="column.rowSpan"
                  >
                    <div class="table-column-header"> {{ column.name }} </div>
                  </th>
                </tr>
                <!-- <tr>
                  <th class="table-cell header"
                    v-for="column, index in pdfColumns" :key="column.key"
                    :style="getTableColumnsWidthStyle(index)"
                  >
                    <div class="table-column-header">{{ column.name }}</div>
                  </th>
                </tr> -->
              </thead>
              <tbody v-if="!isEmpty(pageTable.tableData)">
                <tr v-for="row, rowIndex in pageTable.tableData" :key="row.key">
                  <template v-if="rowIndex ===0">
                    <template v-for="column, columnIndex in row" :key="column.key">
                      <td class="table-cell"
                        v-if="displayTableCell(column)"
                        :colspan="column.colSpan"
                        :rowspan="column.rowSpan"
                        :style="getTableColumnsWidthStyle(columnIndex)"
                      >
                        <div class="table-column-data" > {{  column.context }} </div>
                      </td>
                    </template>
                  </template>
                  <template v-else>
                    <template v-for="column in row" :key="column.key">
                      <td class="table-cell"
                        v-if="displayTableCell(column)"
                        :colspan="column.colSpan"
                        :rowspan="column.rowSpan"
                      >
                        <div class="table-column-data"> {{  column.context }} </div>
                      </td>
                    </template>
                  </template>




                </tr>
                <!-- <tr v-for="row in pageTable.tableData" :key="row.key">
                  <td class="table-cell" v-for="column in pdfColumns" :key="column.key">
                    <div class="table-column-data">{{ row[column.key] }}</div>
                  </td>
                </tr> -->
              </tbody>
            </table>


          </div>
        </div>
    </template>
    </div>
  </div>

  <!-- VirtualTABLE 計算頁數寬度用的非顯示表示-->
  <div class="paper-container hidden" :style="containerSize" ref="paperRef">
      <div class="paper-table" :style="tableStyle" ref="tableRef">
        <table class="table-main">
          <thead ref="tableHeaderRef">
            <!-- <tr v-for="row in headerRow" :key="row"> -->
            <tr v-for="row in headerRow" :key="row">
              <th class="table-cell header"
                v-for="column in row" :key="column.key"
                :colspan="column.colSpan"
                :rowspan="column.rowSpan"
              >
                <div class="table-column-header"> {{ column.name }} </div>
              </th>
            </tr>
          </thead>
          <!-- <thead>
            <tr ref="tableHeaderRef">
              <th class="table-cell header" v-for="column in pdfColumns" :key="column.key">
                <div class="table-column-header">{{ column.name }}</div>
              </th>
            </tr>
          </thead> -->
          <tbody ref="tableBodyRef">
            <tr
              v-for="row, rowIndex in spanTableData"
              :key="row.key"
              :ref="(el: HTMLTableRowElement) => {
                if(rowIndex === 0) columnRef = el
                return el
              }"
            >
              <template v-for="column in row" :key="column.key">
                <td class="table-cell"
                  v-if="displayTableCell(column)"
                  :colspan="column.colSpan"
                  :rowspan="column.rowSpan"
                >
                  <div class="table-column-data"> {{  column.context }} </div>
                </td>
              </template>
            </tr>

            <!-- <tr v-for="row in props.tableData " :key="row.key">
              <td class="table-cell" v-for="column in pdfColumns" :key="column.key">
                <div class="table-column-data">{{ row[column.key] }}</div>
              </td>
            </tr> -->
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
    position: relative;
    padding: 24pt;
  }
  &-table {
    position: relative;
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
    position: relative;
    display: flex;
    flex-direction: column;
    border: 1px solid rgb(0, 0, 0);
  }
}

.table {
  &-main {
    border-spacing: 0pt;
    // width: 100%;
    // height: fit-content;
    width: 100%;
    flex-shrink: 0;
  }
  &-row {
    padding: 0;
  }
  &-cell {
    border-right:  1px solid rgb(215, 215, 215);
    border-bottom:  1px solid rgb(215, 215, 215);
    // box-sizing: content-box;
    // box-shadow:  1px 1px rgb(215, 215, 215);
    padding: 3.45px 3px 4px 4px;
    font-size: 10px;
    line-height: 1.15;
    text-align: left;
    vertical-align: top;
    &.header {
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

.meta-info {
  position: absolute;
  font-size: 11px;

  &.title {
    left: 24pt;
    top: 10pt;
  }
  &.time {
    right: 24pt;
    top: 10pt;
  }
  &.page {
    width: 100%;
    bottom: 10pt;
    left: 0;
    text-align: center;
  }
  &.customer {
    bottom: 10pt;
    right: 24pt;
  }
}

.hidden {
  position: fixed;
  visibility: hidden;
}
</style>
