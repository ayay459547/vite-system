<script lang="ts">
import { h } from 'vue'

function getColumnSlotNode (slots: Record<string, any>, columnKey: string, isHeader: boolean) {
  let temp = null
  if (isHeader) {
    temp = slots[`header-${columnKey}`]
    if (![null, undefined, ''].includes(temp)) return temp

    temp = slots['header-all']
    if (![null, undefined, ''].includes(temp)) return temp
  } else {
    temp = slots[`column-${columnKey}`]
    if (![null, undefined, ''].includes(temp)) return temp

    temp = slots['column-all']
    if (![null, undefined, ''].includes(temp)) return temp
  }
  return null
}

const columnNode = (slots: Record<string, any>, column: Record<string, any>, rowItem: any, isHeader: boolean) => {
  return column.map(columnItem => {
    const {
      label = '',
      width = 0,
      minWidth = 0,
      align = 'left',
      // class: columnClass = '',
      style: columnStyle = '',
      key: columnKey = '',
      prop = '',
      slotKey = '',
      index: columnIndex = 0
    } = columnItem

    const {
      index: rowIndex = 0
    } = rowItem

    const columnNode = getColumnSlotNode(slots, slotKey, isHeader)

    // let showClass = null
    // if (typeof columnClass === 'string') {
    //   showClass = {
    //     'column-class': true
    //   }
    // } else if(Object.prototype.toString.call(columnClass) === '[object Object]') {
    //   showClass = {...columnClass}
    // } else {
    //   showClass = {}
    // }

    let showStyle = null
    if (typeof columnStyle === 'string') {
      showStyle = columnStyle

      if (width > 0) {
        showStyle += `
          max-width: ${width}px;
          min-width: ${width}px;
        `
      }
      if (minWidth > 0) {
        showStyle += `
          width: ${minWidth}px;
          min-width: ${width}px;
        `
      }

      showStyle += 'display: flex; align-items: center;'
      switch (align) {
        case 'left':
          showStyle += 'justify-content: flex-start;'
          break
        case 'center':
          showStyle += 'justify-content: center;'
          break
        case 'right':
          showStyle += 'justify-content: flex-end;'
          break
      }

    } else if(Object.prototype.toString.call(columnStyle) === '[object Object]') {
      showStyle = {...columnStyle}

      if (width > 0) {
        showStyle['max-width'] = `${width}px`
        showStyle['min-width'] = `${width}px`
      }
      if (minWidth > 0) {
        showStyle['width'] = `${minWidth}px`
        showStyle['min-width'] = `${width}px`
      }

      showStyle['display'] = 'flex'
      showStyle['align-items'] = 'center'
      switch (align) {
        case 'left':
          showStyle['justify-content'] = 'flex-start'
          break
        case 'center':
          showStyle['justify-content'] = 'center'
          break
        case 'right':
          showStyle['justify-content'] = 'flex-end'
          break
      }
    } else {
      showStyle = {}
    }

    const defaultRender = isHeader ? label : rowItem[prop]

    return h(
      'div',
      {
        class: {
          '__data-table-column': true
        },
        style: showStyle
        // key: columnKey
      },
      ![undefined, null].includes(columnNode) ? columnNode({
        key: columnKey,
        row: rowItem,
        column: { ...columnItem },
        rowIndex,
        columnIndex,
        data: defaultRender
      }) : defaultRender
    )
  })
}

const rowNode = (slots: Record<string, any>, column: Record<string, any>, tableData: any[], isHeader: boolean) => {
  if (isHeader) {
    return h(
      'div',
      {
        class: '__data-table-header'
      },
      columnNode(slots, column, {}, true)
    )
  } else {
    return tableData.map((rowData: any, rowIndex: number) => {

      return h(
        'div',
        {
          key: rowData.key ? rowData.key : rowIndex,
          class: '__data-table-row'
        },
        columnNode(slots, column, {
          ...rowData,
          index: rowIndex
        }, false)
      )
    })
  }
}

const headerNode = (slots: Record<string, any>, column: Record<string, any>) => {
  return rowNode(slots, column, [], true)
}

const bodyNode = (slots: Record<string, any>, column: Record<string, any>, tableData: any[]) => {
  if (tableData.length === 0) {
    return h('div', {
      class: '__data-table-body',
      style: 'padding: 12px 16px; font-size: 1.2em'
    }, h(
      'div',
      {
        class: '__data-table-emtpy'
      },
      '無資料'
    ))
  } else {
    return h(
      'div',
      {
        class: '__data-table-body'
      },
      rowNode(slots, column, tableData, false)
    )
  }
}

export interface Props {
  tableColumns?: Array<any> | any
  tableData?: Array<any> | any
}

const SimpleTable = (props: Props, context: any) => {
  const { slots = {} } = context

  const{
    tableColumns = [],
    tableData = []
  } = props

  return h<{
    tableColumns: Array<any>
    tableData: Array<any>
  }>((props, context) => {

    const { slots = {} } = context
    const { tableColumns, tableData } = props
    // console.log('props => ', props)
    // console.log('context => ', context)

    // const tableStyle = props['table-style']
    // const tableClass = props['table-class']
    return h(
      'div',
      {
        class: [
          '__data-table-wrapper'
        ]
        // style: { ...tableStyle }
      },
      [
        h(
          'div',
          {
            class: ['__data-table-container']
          },
          [
            headerNode(slots, tableColumns),
            h(
              'div',
              {
                class: ['__data-table-body-container']
              },
              [ bodyNode(slots, tableColumns, tableData) ]
            )
          ]
        )
      ]
    )
  }, {
    tableColumns,
    tableData
  }, slots)
}

SimpleTable.props = {
  tableColumns: {
    type: Array,
    default () {
      return []
    }
  },
  tableData: {
    type: Array,
    default () {
      return []
    }
  }
}

export default SimpleTable
</script>

<style lang="scss">
.__data-table {
  &-wrapper {
    border-radius: 6px;
    border: 1px solid #ebeef5;
    width: 100%;
    height: 100%;
    overflow-x: auto;
  }

  &-container {
    width: fit-content;
    min-width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  &-header {
    height: fit-content;
    display: flex;
    background-color: #f5f7fa;
    border-bottom: 1px solid #ebeef5;
    z-index: 1;
    overflow-y: scroll;
  }

  &-body-container {
    flex: 1;
    width: 100%;
    height: 100%;
    min-width: fit-content;
    min-height: fit-content;
    position: relative;
    overflow-y: scroll;
  }

  &-header::-webkit-scrollbar-track,
  &-body-container::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px #ffffff00;
    border-radius: 6px;
  }

  &-body {
    background-color: #fff;
    width: 100%;
    height: fit-content
  }

  &-emtpy {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &-row {
    display: flex;
    background-color: #fff;
    transition-duration: 0.2s;
    border-bottom: 1px solid #ebeef5;

    &:nth-child(even) {
      background-color: #fafafa;
    }

    &:hover,
    &:nth-child(even):hover {
      background-color: #f5f7fa;
    }
  }

  &-column {
    flex: 1;
    border-left: 1px solid #ebeef5;
    padding: 8px;
    background-color: inherit;

    &:nth-child(1) {
      border-left: none;
    }
  }
}
</style>