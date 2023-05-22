import { h } from 'vue'

function getColumnSlotNode (slots, columnKey, isHeader) {
  let temp = null
  if (isHeader) {
    temp = slots[`header-${columnKey}`]
    if (![null, undefined, ''].includes(temp)) return temp

    temp = slots['header']
    if (![null, undefined, ''].includes(temp)) return temp
  } else {
    temp = slots[`column-${columnKey}`]
    if (![null, undefined, ''].includes(temp)) return temp

    temp = slots['column']
    if (![null, undefined, ''].includes(temp)) return temp
  }
  return null
}

const columnNode = (slots, column, rowItem, isHeader) => {
  return column.map(columnItem => {
    const {
      title = '',
      width = 0,
      minWidth = 0,
      class: columnClass = '',
      style: columnStyle = '',
      key: columnKey = '',
      index: columnIndex = 0
    } = columnItem

    const {
      index: rowIndex = 0
    } = rowItem

    const columnNode = getColumnSlotNode(slots, columnKey, isHeader)

    let showClass = null
    if (typeof columnClass === 'string') {
      showClass = {
        columnClass: true
      }
    } else if(Object.prototype.toString.call(columnClass) === '[object Object]') {
      showClass = {...columnClass}
    } else {
      showClass = {}
    }

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

    const defaultRender = isHeader ? title : rowItem[columnKey]

    return h(
      'div',
      {
        class: {
            ...showClass,
          'table-column': true
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
        class: 'table-header'
      },
      columnNode(slots, column, {}, true)
    )
  } else {
    return tableData.map((rowData, rowIndex) => {
      return h(
        'div',
        {
          class: 'table-row'
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
      class: 'flex-row content-center table-body',
      style: 'padding: 16px; font-size: 1.2em'
    }, '無資料')
  } else {
    return h(
      'div',
      {
        class: 'table-body'
      },
      rowNode(slots, column, tableData, false)
    )
  }
}

const vnode = (props, context) => {
  const { slots = {} } = context
  const { column = [], tableData = [], tableStyle = {}, tableClass = {} } = props

  return h(
    'div',
    {
      class: [
        { ...tableClass },
        'table-wrapper'
      ],
      style: { ...tableStyle }
    },
    h(
      'div', { class: 'table-container'},
      [
        headerNode(slots, column),
        bodyNode(slots, column, tableData)
      ]
    )
  )
}

export default vnode