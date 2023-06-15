import { h } from 'vue'

function getColumnSlotNode (slots, columnKey, isHeader) {
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

const columnNode = (slots, column, rowItem, isHeader) => {
  return column.map(columnItem => {
    const {
      label = '',
      width = 0,
      minWidth = 0,
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
        showStyle += `width: ${width}px;`
      }
      if (minWidth > 0) {
        showStyle += `min-width: ${minWidth}px;`
      }
    } else if(Object.prototype.toString.call(columnStyle) === '[object Object]') {
      showStyle = {...columnStyle}

      if (width > 0) {
        showStyle['width'] = `${width}px`
      }
      if (minWidth > 0) {
        showStyle['minWidth'] = `${minWidth}px`
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
        rowIndex,
        columnIndex,
        data: defaultRender
      }) : defaultRender
    )
  })
}

const rowNode = (slots, column, tableData, isHeader) => {
  if (isHeader) {
    return h(
      'div',
      {
        class: '__data-table-header'
      },
      columnNode(slots, column, {}, true)
    )
  } else {
    return tableData.map((rowData, rowIndex) => {
      return h(
        'div',
        {
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

const headerNode = (slots, column) => {
  return rowNode(slots, column, [], true)
}

const bodyNode = (slots, column, tableData) => {
  if (tableData.length === 0) {
    return h('div', {
      class: '__data-table-body',
      style: 'padding: 16px; font-size: 1.2em'
    }, h(
      'div',
      {
        class: '__data-emtpy'
      },
      'No Data'
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

interface Props {
  tableColumns: Record<string, any>
  tableData?: Array<any>
}


const DataTable = (props: Props, context) => {
  const { slots = {} } = context
  const _tableColumns = props['table-columns']
  const _tableData = props['table-data'] ?? []

  return h<{
    tableColumns: Record<string, any>
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
      h(
        'div',
        {
          class: ['container', '__data-table-container']
        },
        [
          headerNode(slots, tableColumns),
          bodyNode(slots, tableColumns, tableData)
        ]
      )
    )
  }, {
    tableColumns: _tableColumns,
    tableData: _tableData
  }, slots)
}

export default DataTable