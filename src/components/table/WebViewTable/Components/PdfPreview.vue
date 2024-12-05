
<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, onMounted, computed, nextTick } from 'vue'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import { setPdfLangFont } from '@/lib/lib_pdf'

type Orientation = 'p' | 'l'
const props = defineProps({
  columns: {
    type: Array<any>
  },
  title: {
    type: String
  },
  tableData: {
    type: Array<any>
  },
  pdfSize: {
    type: String
  },
  orientation: {
    type: String as PropType<Orientation>
  }
})

const isLoading = ref(false)

const pdfRef = ref(null)
const pdfColumns = computed(() => props.columns)

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

onMounted(() => {
  pdfTableData.value = props.tableData.map((rowData, index) => {
    return { ...rowData, key: index }
  })
})

const pdfTableData = ref([])
const paperRef = ref(null)

/**
 * 單位轉換(dpi:72)
 ** value: 轉換前值
 ** unit1: 轉換前單位
 ** unit2: 轉換後單位
 ** => 轉換後值
*/
const sizeUnitConvert = (value, unit1, unit2) => {
  const getScale = unit => {
    switch (unit) {
       case 'px': return 96
       case 'pt': return 72
       case 'mm': return 25.4
    }
  }

  const scale1 = getScale(unit1)
  const scale2 = getScale(unit2)
  return value / scale1 * scale2
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
        font,
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



defineExpose({
  getTable: () => pdfRef.value,
  print: printPdf
})


</script>

<template>
  <div class="preview-wrapper" >
    <div class="paper-container" v-loading="isLoading" :style="containerSize" ref="paperRef">
      <div class="paper-table" :style="tableStyle">
        <table class="table-test" id="pdf-test" :ref="(el) => pdfRef = el">
          <thead>
            <tr>
              <th class="table-cell header" v-for="column in pdfColumns" :key="column.key">
                <div class="table-column-header"> {{ column.name }} </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in props.tableData" :key="row.key" >
              <td class="table-cell" v-for="column in pdfColumns" :key="column.key">
                <div class="table-column-data"> {{  row[column.key] }} </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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
    &-test {
      border-spacing: 0pt;
      width: 100%;
      height: fit-content;
    }
    &-row {
      padding: 0;
    }
    &-cell {
      border: rgb(215, 215, 215);
      box-shadow:  1px 1px rgb(215, 215, 215);
      padding: 4px;
      font-size: 10px;
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




</style>
