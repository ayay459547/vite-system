<script lang="ts">
import type { Component } from 'vue'
import { h, inject } from 'vue'

import type { UseHook } from '@/declare/hook'
import { CustomDraggable } from '@/components'
import { getUuid, isEmpty } from '@/lib/lib_utils'
import type { ScopeKey } from '@/i18n/i18n_setting'
import { defaultModuleType } from '@/i18n/i18n_setting'

import type { Props } from './SimpleTableInfo'
import { version, props as simpleTableProps } from './SimpleTableInfo'

let propI18nModule: ScopeKey = defaultModuleType
const getTranslate = (label: string, i18nLabel: string, i18nModule?: string) => {
  if (isEmpty(i18nLabel)) return label

  const useHook: UseHook = inject('useHook')
  const { i18nTranslate } = useHook()
  /**
   * i18nModule優先序
   * 1.columnSetting.i18nModule
   * 2.prop.i18nModule
   * 3.defaultModuleType (預設)
   */
  const module = (i18nModule ?? propI18nModule) as ScopeKey
  return i18nTranslate(i18nLabel, module)
}

function getColumnSlotNode(slots: Record<string, any>, columnKey: string, isHeader: boolean) {
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

const columnNode = (
  slots: Record<string, any>,
  column: Array<any>,
  rowItem: any,
  isHeader: boolean
) => {
  return column.map(columnItem => {
    const {
      label = '',
      i18nLabel = '',
      i18nModule,
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

    const { index: rowIndex = 0 } = rowItem

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
    } else if (Object.prototype.toString.call(columnStyle) === '[object Object]') {
      showStyle = { ...columnStyle }

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

    const defaultRender = isHeader ? getTranslate(label, i18nLabel, i18nModule) : rowItem[prop]

    return h(
      'div',
      {
        class: {
          '__data-table-column': true
        },
        style: showStyle
        // key: columnKey
      },
      ![undefined, null].includes(columnNode)
        ? columnNode({
            key: columnKey,
            prop: columnKey,
            row: rowItem,
            column: { ...columnItem },
            rowIndex,
            columnIndex,
            data: defaultRender
          })
        : defaultRender
    )
  })
}

const rowNode = (
  slots: Record<string, any>,
  column: Array<any>,
  tableData: Array<any>,
  options: {
    isHeader: boolean
    isDraggable: boolean
  }
) => {
  const { isHeader = false } = options

  // 渲染 header 的 row
  if (isHeader) {
    return h(
      'div',
      {
        class: '__data-table-header'
      },
      columnNode(slots, column, {}, true)
    )
    // 渲染 資料 的 row
  } else {
    return tableData.map((rowData: any, rowIndex: number) => {
      return h(
        'div',
        {
          key: rowData.key ? rowData.key : rowIndex,
          class: '__data-table-row'
        },
        columnNode(
          slots,
          column,
          {
            ...rowData,
            index: rowIndex
          },
          false
        )
      )
    })
  }
}

const headerNode = (slots: Record<string, any>, column: Array<any>) => {
  return rowNode(slots, column, [], {
    isHeader: true,
    isDraggable: false
  })
}

const scopedId = getUuid('__i-simple-table__')

const bodyNode = (
  slots: Record<string, any>,
  column: Array<any>,
  options: {
    props: Props
    emit: Function
    tableData: any[]
    isDraggable: boolean
    handle: string
    itemKey: string
    group: string
    move: Function
  }
) => {
  const { props, emit, tableData, isDraggable, handle, itemKey, group, move } = options

  if (tableData.length === 0) {
    return h(
      'div',
      {
        class: '__data-table-body',
        style: 'padding: 12px 16px; font-size: 1.2em'
      },
      h(
        'div',
        {
          class: '__data-table-emtpy'
        },
        '無資料'
      )
    )
  }

  // 可拖拉
  if (isDraggable) {
    return h(
      CustomDraggable,
      {
        class: '__data-table-body',
        modelValue: props.tableData,
        'onUpdate:modelValue': value => {
          emit('update:modelValue', value)
        },
        handle,
        itemKey,
        group,
        move
      },
      {
        item: (scope: any) => {
          const { element: rowData, index: rowIndex } = scope
          return columnNode(
            slots,
            column,
            {
              ...rowData,
              index: rowIndex
            },
            false
          )
        }
      }
    )
  } else {
    return h(
      'div',
      {
        class: '__data-table-body'
      },
      rowNode(slots, column, tableData, {
        isHeader: false,
        isDraggable
      })
    )
  }
}

const SimpleTable = (props: Props, context: any): Component => {
  const { slots = {}, emit } = context

  const {
    modelValue = [],
    isDraggable = false,
    handle = '.__draggable',
    itemKey = 'id',
    group = 'name',
    i18nModule = defaultModuleType,
    hideHeader = false,
    move,

    tableData = [],
    tableColumns = []
  } = props

  propI18nModule = i18nModule // 透過模組傳遞的prop設定i18nModule

  return h<Props>(
    (props, context) => {
      const { slots = {} } = context
      const { tableColumns, tableData, isDraggable } = props
      // console.log('props => ', props)
      // console.log('context => ', context)

      // const tableStyle = props['table-style']
      // const tableClass = props['table-class']
      return h(
        'div',
        {
          class: ['__data-table-wrapper', `SimpleTable_${version}`, `${scopedId}`]
          // style: { ...tableStyle }
        },
        [
          h(
            'div',
            {
              class: ['__data-table-container']
            },
            hideHeader ? [
              h(
                'div',
                {
                  class: ['__data-table-body-container']
                },
                [
                  bodyNode(slots, tableColumns, {
                    props,
                    emit,
                    tableData,
                    isDraggable,
                    handle,
                    itemKey,
                    group,
                    move
                  })
                ]
              )
            ] : [
              headerNode(slots, tableColumns),
              h(
                'div',
                {
                  class: ['__data-table-body-container']
                },
                [
                  bodyNode(slots, tableColumns, {
                    props,
                    emit,
                    tableData,
                    isDraggable,
                    handle,
                    itemKey,
                    group,
                    move
                  })
                ]
              )
            ]
          )
        ]
      )
    },
    {
      modelValue,
      isDraggable,
      handle,
      itemKey,
      group,
      move,
      tableData,
      tableColumns
    },
    slots
  )
}

SimpleTable.props = simpleTableProps

SimpleTable.emits = ['update:modelValue']

export default SimpleTable
</script>

<!-- <template>
  <component :is="SimpleTable"></component>
</template> -->

<style lang="scss">
.__data-table {
  &-wrapper {
    border-radius: 6px;
    border: 1px solid var(--i-color-table-border);
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
    background-color: var(--el-color-info-light-9);
    border-bottom: 1px solid var(--el-table-border-color);
    z-index: 1;
    overflow-y: scroll;
  }

  &-body-container {
    flex: 1;
    width: 100%;
    height: 100%;
    min: {
      width: fit-content;
      height: fit-content;
    }
    position: relative;
    overflow-y: scroll;
  }

  &-header::-webkit-scrollbar-track,
  &-body-container::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px #ffffff00;
    border-radius: 6px;
  }

  &-body {
    background-color: var(--el-bg-color);
    width: 100%;
    height: fit-content;
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
    background-color: var(--el-table-tr-bg-color);
    transition-duration: 0.3s;
    border-bottom: 1px solid var(--el-table-border-color);
    content-visibility: auto;

    &:nth-child(even) {
      background-color: var(--el-fill-color-lighter);
    }

    &:hover,
    &:nth-child(even):hover {
      background-color: var(--el-table-row-hover-bg-color);
    }
  }

  &-column {
    flex: 1;
    border-left: 1px solid var(--el-table-border-color);
    padding: 8px;
    background-color: inherit;

    &:nth-child(1) {
      border-left: none;
    }
  }
}
</style>
