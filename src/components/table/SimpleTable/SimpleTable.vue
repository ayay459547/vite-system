<script lang="ts">
import type { Component } from 'vue'
import { h, inject, defineComponent } from 'vue'

import type { UseHook } from '@/declare/hook'
import { CustomDraggable, CustomScrollbar } from '@/components' // 系統組件
import { getUuid, isEmpty } from '@/lib/lib_utils' // 工具
import type { ScopeKey } from '@/i18n/i18n_setting'
import { defaultModuleType } from '@/i18n/i18n_setting'

import type { Props } from './SimpleTableInfo'
import { version, props as simpleCustomTableProps } from './SimpleTableInfo'

type GetRowCallbackAttrOptions = {
  rowData: any
  rowIndex: number
  rowClassName: Props.RowClassName
  rowStyleCallback: Props.RowStyle
}
type GetRowCallbackAttrRes = {
  rowClass: string
  rowStyle: Record<string, any>
}
function getRowCallbackAttr(options: GetRowCallbackAttrOptions): GetRowCallbackAttrRes {
  const { rowData, rowIndex, rowClassName, rowStyleCallback } = options

  let _rowClass = ''
  if (typeof rowClassName === 'function') {
    _rowClass = rowClassName({
      row: rowData,
      rowIndex
    }, [])
  }

  let _rowStyle = {}
  if (typeof rowStyleCallback === 'function') {
    _rowStyle = rowStyleCallback({
      row: rowData,
      rowIndex
    }, [])
  }

  return {
    rowClass: _rowClass,
    rowStyle: _rowStyle
  }
}

type GetCellCallbackAttrOptions = {
  rowData: any
  rowIndex: number
  column: any
  columnIndex: number
  cellClassName: Props.CellClassName
  cellStyleCallback: Props.CellStyle
}
type GetCellCallbackAttrRes = {
  cellClass: string
  cellStyle: Record<string, any>
}
function getCellCallbackAttr(options: GetCellCallbackAttrOptions): GetCellCallbackAttrRes {
  const { rowData, rowIndex, column, columnIndex, cellClassName, cellStyleCallback } = options

  let _cellClass = ''
  if (typeof cellClassName === 'function') {
    _cellClass = cellClassName({
      row: rowData,
      column,
      rowIndex,
      columnIndex
    }, [])
  }

  let _cellStyle = {}
  if (typeof cellStyleCallback === 'function') {
    _cellStyle = cellStyleCallback({
      row: rowData,
      column,
      rowIndex,
      columnIndex
    }, [])
  }

  return {
    cellClass: _cellClass,
    cellStyle: _cellStyle
  }
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

// SimpleTable.props = simpleCustomTableProps
// SimpleTable.emits = ['update:modelValue']

export default defineComponent({
  name: 'SimpleTable',
  props: simpleCustomTableProps,
  emits: ['update:modelValue'],
  setup(props: any, context: any) {
    const SimpleTable = (): Component => {
      const { slots = {}, emit } = context

      const {
        // modelValue = [],
        isDraggable = false,
        handle = '.__draggable',
        group = 'name',
        itemKey = 'id',
        move,
        disabled,
        hideHeader = false,
        i18nModule = defaultModuleType,

        // tableData = [],
        // tableColumns = [],

        rowClassName = null,
        rowStyle: rowStyleCallback = null,
        cellClassName = null,
        cellStyle: cellStyleCallback = null
      } = props

      const useHook: UseHook = inject('useHook')
      const { i18nTranslate } = useHook({ i18nModule })

      const getTranslate = (label: string, i18nLabel: string, columnI18nModule?: string) => {
        if (isEmpty(i18nLabel)) return label
        /**
         * i18nModule優先序
         * 1.columnSetting.i18nModule
         * 2.prop.i18nModule
         * 3.defaultModuleType (預設)
         */
        const _i18nModule = (columnI18nModule ?? i18nModule) as ScopeKey
        return i18nTranslate(i18nLabel, _i18nModule)
      }

      const renderColumnNode = (rowItem: any, isHeader: boolean) => {
        return props.tableColumns.map((columnItem: any) => {
          const {
            label = '',
            i18nLabel = '',
            i18nModule: columnI18nModule,
            width = 0,
            minWidth = 0,
            align = 'left',
            class: columnClass = '',
            style: columnStyle = {},
            key: columnKey = '',
            prop = '',
            slotKey = '',
            index: columnIndex = 0
          } = columnItem

          const { index: rowIndex = 0 } = rowItem

          const columnNode = getColumnSlotNode(slots, slotKey, isHeader)

          const { cellClass, cellStyle } = getCellCallbackAttr({
            rowData: rowItem,
            rowIndex,
            column: { ...columnItem },
            columnIndex,
            cellClassName,
            cellStyleCallback
          })

          let showClass: any = []
          if (typeof columnClass === 'string' && columnClass.length > 0) {
            showClass.push(columnClass)
          }

          let showStyle = {...cellStyle}
          if (Object.prototype.toString.call(columnStyle) === '[object Object]') {
            showStyle = {...columnStyle, ...cellStyle}

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
          }

          const defaultRender = isHeader ? getTranslate(label, i18nLabel, columnI18nModule) : rowItem[prop]

          return h('div',
            {
              class: [
                '__data-table-column',
                cellClass,
                ...showClass
              ],
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

      const rowNode = (options: { isHeader: boolean }) => {
        const { isHeader = false } = options

        // 渲染 header 的 row
        if (isHeader) {
          return h('div', { class: '__data-table-header' }, renderColumnNode({}, true))

        // 渲染 資料 的 row
        } else {
          return props.tableData.map((rowData: any, rowIndex: number) => {
            const { rowClass, rowStyle } = getRowCallbackAttr({
              rowData,
              rowIndex,
              rowClassName,
              rowStyleCallback
            })

            return h('div',
              {
                key: rowData.key ? rowData.key : rowIndex,
                class: [
                  '__data-table-row',
                  `key:${rowData.key}`,
                  rowClass
                ],
                style: rowStyle
              },
              renderColumnNode({...rowData, index: rowIndex}, false)
            )
          })
        }
      }

      const headerNode = () => {
        return rowNode({ isHeader: true })
      }

      const scopedId = getUuid('__i-simple-table__')

      const bodyNode = () => {
        if (props.tableData.length === 0) {
          return h('div',
            {
              class: '__data-table-body',
              style: 'padding: 12px 16px; font-size: 1.2em'
            },
            h('div', { class: '__data-table-emtpy' }, i18nTranslate('empty-data'))
          )
        }

        // 可拖拉
        if (isDraggable) {
          return h(CustomDraggable,
            {
              class: '__data-table-body',
              modelValue: props.tableData,
              'onUpdate:modelValue': (value: any) => {
                emit('update:modelValue', value)
              },
              handle,
              itemKey,
              group,
              move,
              disabled
            },
            {
              // slot
              item: (scope: any) => {
                const { element: rowData, index: rowIndex } = scope
                return renderColumnNode({...rowData, index: rowIndex}, false)
              }
            }
          )
        } else {
          return h('div',
            { class: '__data-table-body' },
            rowNode({ isHeader: false })
          )
        }
      }

      const bodyContainerNode = () => {
        return h('div',
          { class: ['__data-table-body-container'] },
          [ bodyNode() ]
        )
      }

      return h<any>(() => {
        return h('div',
          {
            class: [
              '__data-table-wrapper',
              `SimpleTable_${version}`,
              `${scopedId}`
            ]
          },
          [
            h(CustomScrollbar, {}, {
                default: () => {
                  return h('div',
                    { class: ['__data-table-container'] },
                    [
                      hideHeader ?
                        bodyContainerNode() :
                        headerNode(),
                        bodyContainerNode()
                    ]
                  )
                }
              }
            )
          ]
        )
      })
    }

    return SimpleTable
  }
})
</script>

<style lang="scss">
.__data-table {
  &-wrapper {
    border-radius: 6px;
    border: 1px solid var(--i-color-table-border);
    width: 100%;
    height: 100%;
    // overflow: auto;
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
    background-color: var(--i-color-table-thead);
    color: var(--el-table-header-text-color);
    border-bottom: 1px solid var(--el-table-border-color);
    z-index: 1;
    position: sticky;
    top: 0;
    transform: translateY(-1px);
  }

  &-body-container {
    flex: 1;
    width: 100%;
    height: 100%;
    padding: 0 2px;
    min: {
      width: fit-content;
      height: fit-content;
    }
  }

  // &-header::-webkit-scrollbar-track,
  // &-body-container::-webkit-scrollbar-track {
  //   box-shadow: inset 0 0 5px #ffffff00;
  //   border-radius: 6px;
  // }

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
    background-color: var(--i-color-table-odd);
    transition-duration: 0.3s;
    border-bottom: 1px solid var(--el-table-border-color);
    content-visibility: auto;
    &:hover {
      background-color: var(--i-color-table-odd-hover);
    }
    &:nth-child(even) {
      background-color: var(--i-color-table-even);
    }
    &:nth-child(even):hover {
      background-color: var(--i-color-table-even-hover);
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
