<script setup lang="ts">
import type { PropType } from 'vue'
import { useSlots, ref, onMounted, onUnmounted, computed, watch, effectScope, nextTick } from 'vue'
import type { ElTable as ElTableType } from 'element-plus'
import { ElTable, ElTableColumn, ElAutoResizer } from 'element-plus'

import throttle from '@/lib/lib_throttle'
import { CustomButton } from '@/components'
import { isEmpty, getUuid } from '@/lib/lib_utils'

import type {
  Sort,
  SpanMethod,
  RowClassName,
  RowStyle,
  CellClassName,
  CellStyle,
  Load,
  LazyLoadingStatus,
  TableSize,
  // emit
  RowClick,
  HeaderClick,
  ExpandChange,
  HeaderDragend,
  Select,
  SelectAll,
  SelectionChange,
  RowContextmenu
} from './CustomTableInfo'

const scopedId = getUuid('__table-main__')

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}

const props = defineProps({
  renderKey: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
    description: '重新渲染用的key'
  },
  showData: {
    type: Array as PropType<Array<any>>,
    required: false,
    default: () => {
      return []
    },
    description: '顯示資料'
  },
  // tableDataCount: {
  //   type: Number as PropType<number>,
  //   required: false,
  //   description: '總資料筆數 計算虛擬渲染用'
  // },
  showColumns: {
    type: Array as PropType<Array<any>>,
    required: false,
    default: () => {
      return []
    },
    description: '顯示欄位'
  },
  sort: {
    type: Object as PropType<Sort>,
    required: false,
    default: () => {
      return {
        key: null,
        order: null
      }
    },
    description: '資料存在 children 時 預設是否展開'
  },
  isShowNo: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否顯示編號'
  },
  // element ui
  rowKey: {
    type: String as PropType<string>,
    required: false,
    default: 'id',
    description: '每行資料的key 預設是id'
  },
  tableSize: {
    type: String as PropType<TableSize>,
    required: false,
    description: '表格大小'
  },
  defaultExpandAll: {
    type: Boolean as PropType<boolean>,
    required: false,
    description: '資料存在 children 時 預設是否展開'
  },
  spanMethod: {
    type: Function as PropType<SpanMethod | any>,
    description: '資料跨欄'
  },
  rowClassName: {
    type: Function as PropType<RowClassName | any>,
    description: 'row class callback'
  },
  rowStyle: {
    type: Function as PropType<RowStyle | any>,
    description: 'row style callback'
  },
  cellClassName: {
    type: Function as PropType<CellClassName | any>,
    description: 'cell class callback'
  },
  cellStyle: {
    type: Function as PropType<CellStyle | any>,
    description: 'cell style callback'
  },
  lazy: {
    type: Boolean as PropType<boolean>,
    description: '懶加載子節點'
  },
  load: {
    type: Function as PropType<Load | any>,
    description: '懶加載子節點回調函數'
  },
  treeProps: {
    type: Object as PropType<Record<string, any> | any>,
    description: '懶加載子節點回調函數'
  },
  selection: {
    type: Boolean as PropType<boolean>,
    description: 'checkbox'
  },
  isLazyLoading: {
    type: Boolean as PropType<boolean>,
    description: '懶加載'
  },
  lazyLoadingStatus: {
    type: String as PropType<LazyLoadingStatus>,
    description: '懶加載狀態'
  }
})

const emit = defineEmits([
  // element plus ui
  'row-click',
  'sort-change',
  'header-click',
  'expand-change',
  'header-dragend',
  'select',
  'select-all',
  'selection-change',
  'row-contextmenu',
  // 懶加載
  'load',
  // 更新 table 大小
  'update-size'
])

const onRowClick: RowClick = (row, column, event) => {
  emit('row-click', row, column, event)
}
const onSortChange = (props: {
  column: any
  prop: string
  order: null | 'ascending' | 'descending'
}) => {
  const { column, prop: key = '', order } = props
  emit('sort-change', { column, key, order })
}
const onHeaderClick: HeaderClick = (column: any, event: Event) => {
  emit('header-click', column, event)
}
const onExpandChange: ExpandChange = (row: any, expanded: boolean) => {
  emit('expand-change', row, expanded)
}
const onHeaderDragend: HeaderDragend = (
  newWidth: number,
  oddWidth: number,
  column: any,
  event: MouseEvent
) => {
  emit('header-dragend', newWidth, oddWidth, column, event)
}
const onSelect: Select = (selection, row) => {
  emit('select', selection, row)
}
const onSelectAll: SelectAll = selection => {
  emit('select-all', selection)
}
const onSelectionChange: SelectionChange = newSelection => {
  emit('selection-change', newSelection)
}
const onRowContextmenu: RowContextmenu = (row, column, event) => {
  // event.preventDefault()
  emit('row-contextmenu', row, column, event)
}

// 滾動到底時 emit load
const tableMainRef = ref(null)
const loadMoreRef = ref(null)
const load = () => {
  if (props.lazyLoadingStatus === 'loadMore') {
    emit('load')
  }
}
const IOcallback = throttle((entries: IntersectionObserverEntry[]) => {
  entries.forEach((entry: IntersectionObserverEntry & { isVisible: boolean }) => {
    const {
      isIntersecting
      // isVisible
    } = entry
    if (isIntersecting) {
      load()
    }
  })
}, 300) as IntersectionObserverCallback
let IO = null

const scope = effectScope()
const isLazyLoading = computed(() => {
  return props.isLazyLoading
})
onMounted(() => {
  scope.run(() => {
    watch(
      isLazyLoading,
      async newValue => {
        await nextTick()
        if (newValue && loadMoreRef.value !== null) {
          IO = new IntersectionObserver(IOcallback, {
            root: tableMainRef.value,
            rootMargin: '0px 0px 0px 0px',
            threshold: 0.1
          })
          IO.observe(loadMoreRef.value)
        } else if (IO) {
          IO.disconnect()
        }
      },
      {
        deep: false,
        immediate: true
      }
    )
  })
})

onUnmounted(() => {
  scope.stop()
})

const elTableRef = ref<InstanceType<typeof ElTableType>>()
const resetScroll = (): void => {
  elTableRef.value?.setScrollTop(0)
}
const toggleSelection = (rows: any[]): void => {
  if (isEmpty(rows)) {
    elTableRef.value?.clearSelection()
  } else {
    rows.forEach(row => {
      elTableRef.value?.toggleRowSelection(row, undefined)
    })
  }
}
const getSelectionRows = (): void => {
  const selectionRows = elTableRef.value?.getSelectionRows()
  return selectionRows ?? []
}

defineExpose({
  resetScroll,
  toggleSelection,
  getSelectionRows
})
</script>

<template>
  <div ref="tableMainRef" class="__table-main-wrapper">
    <ElAutoResizer class="__table-main-container">
      <template #default="{ width, height }">
        <ElTable
          ref="elTableRef"
          stripe
          scrollbar-always-on
          :border="true"
          :key="`${scopedId}-${props.renderKey}`"
          :data="props.showData"
          :height="height"
          :row-key="props.rowKey"
          :size="props.tableSize"
          :default-expand-all="props.defaultExpandAll"
          :default-sort="{
            prop: props.sort.key,
            order: props.sort.order
          }"
          :span-method="props.spanMethod"
          :row-class-name="props.rowClassName"
          :row-style="props.rowStyle"
          :cell-class-name="props.cellClassName"
          :cell-style="props.cellStyle"
          :lazy="props.lazy"
          :load="props.load"
          :tree-props="props.treeProps"
          @row-click="onRowClick"
          @sort-change="onSortChange"
          @header-click="onHeaderClick"
          @expand-change="onExpandChange"
          @header-dragend="onHeaderDragend"
          @select="onSelect"
          @select-all="onSelectAll"
          @selection-change="onSelectionChange"
          @row-contextmenu="onRowContextmenu"
        >
          <!-- 資料為空 顯示內容 -->
          <template v-if="hasSlot('empty')" #empty>
            <slot name="empty"></slot>
          </template>

          <!-- 懶加載用 滾動到底 emit load -->
          <template v-if="isLazyLoading" #append>
            <div
              v-show="props.lazyLoadingStatus === 'noMore'"
              class="__table-main-append"
              :style="`width: ${width}px;`"
            >
              無更多資料
            </div>

            <div
              v-show="props.lazyLoadingStatus === 'loading'"
              class="__table-main-append"
              :style="`width: ${width}px;`"
            >
              <div
                style="width: 100%; height: 50px"
                v-loading="true"
                element-loading-text="LOADING..."
              ></div>
              <div style="width: 100%; height: 30px"></div>
            </div>

            <div
              v-show="props.lazyLoadingStatus === 'loadMore'"
              class="__table-main-append"
              :style="`width: ${width}px;`"
            >
              <CustomButton label="載入更多資料" type="info" text @click="load" />
              <div ref="loadMoreRef" class="load-more"></div>
            </div>
          </template>

          <!-- 展開 自訂內容 -->
          <template v-if="hasSlot('row-expand')">
            <ElTableColumn type="expand">
              <template #default="scope">
                <slot
                  name="row-expand"
                  :row="scope.row"
                  :row-index="scope.$index"
                  :expanded="scope.expanded"
                  :store="scope.store"
                ></slot>
              </template>
            </ElTableColumn>
          </template>

          <!-- 顯示行數 -->
          <template v-if="props.isShowNo">
            <ElTableColumn
              width="60"
              :align="'center'"
              key="__data-no"
              prop="__data-no"
              label="#"
              :sortable="false"
            >
              <template #default="scope">
                <span>{{ scope.$index + 1 }}</span>
              </template>
            </ElTableColumn>
          </template>

          <!-- 勾選 checkbox -->
          <template v-if="props.selection">
            <ElTableColumn width="50" :align="'center'" type="selection" />
          </template>

          <!-- 欄位設定 -->
          <template v-for="column in showColumns" :key="`column-${column.prop}-${scopedId}`">
            <!-- header 有子欄位 -->
            <template v-if="column.columns && column.columns.length > 0">
              <ElTableColumn
                :key="`column-${column.prop}-${scopedId}`"
                :prop="column.prop"
                :label="column.label"
                :sortable="column.sortable"
                v-bind="column"
              >
                <template v-if="hasSlot(`header-${column.slotKey}`)" #header="scope">
                  <div :class="column.sortable ? 'header-slot' : ''">
                    <slot
                      :name="`header-${column.slotKey}`"
                      :label="column.label"
                      :row-index="scope.$index"
                      :column="column"
                      :prop="column.prop"
                    ></slot>
                  </div>
                </template>
                <template v-else-if="hasSlot('header-all')" #header="scope">
                  <div :class="column.sortable ? 'header-slot' : ''">
                    <slot
                      name="header-all"
                      :label="column.label"
                      :row-index="scope.$index"
                      :column="column"
                      :prop="column.prop"
                    ></slot>
                  </div>
                </template>
                <ElTableColumn
                  v-for="child in column.columns"
                  :key="`child-${child.prop}-${scopedId}`"
                  v-bind="child"
                >
                  <template
                    v-if="hasSlot(`header-${column.slotKey}-${child.slotKey}`)"
                    #header="scope"
                  >
                    <div :class="child.sortable ? 'header-slot' : ''">
                      <slot
                        :name="`header-${column.slotKey}-${child.slotKey}`"
                        :label="child.label"
                        :row-index="scope.$index"
                        :column="child"
                        :prop="child.prop"
                      ></slot>
                    </div>
                  </template>
                  <template v-else-if="hasSlot(`header-${child.slotKey}-all`)" #header="scope">
                    <div :class="child.sortable ? 'header-slot' : ''">
                      <slot
                        :name="`header-${column.slotKey}-all`"
                        :label="child.label"
                        :row-index="scope.$index"
                        :column="child"
                        :prop="child.prop"
                      ></slot>
                    </div>
                  </template>
                  <template v-else-if="hasSlot('header-all')" #header="scope">
                    <div :class="column.sortable ? 'header-slot' : ''">
                      <slot
                        name="header-all"
                        :label="child.label"
                        :row-index="scope.$index"
                        :column="child"
                        :prop="child.prop"
                      ></slot>
                    </div>
                  </template>

                  <template
                    v-if="hasSlot(`column-${column.slotKey}-${child.slotKey}`)"
                    #default="scope"
                  >
                    <slot
                      :name="`column-${column.slotKey}-${child.slotKey}`"
                      :label="child.label"
                      :data="scope.row[child.key]"
                      :row="scope.row"
                      :row-index="scope.$index"
                      :column="child"
                      :prop="child.prop"
                    ></slot>
                  </template>
                  <template v-else-if="hasSlot(`column-${column.slotKey}-all`)" #default="scope">
                    <slot
                      :name="`column-${column.slotKey}-all`"
                      :label="child.label"
                      :data="scope.row[child.key]"
                      :row="scope.row"
                      :row-index="scope.$index"
                      :column="child"
                      :prop="child.prop"
                    ></slot>
                  </template>
                  <template v-else-if="hasSlot(`column-all`)" #default="scope">
                    <slot
                      :name="`column-all`"
                      :label="child.label"
                      :data="scope.row[child.key]"
                      :row="scope.row"
                      :row-index="scope.$index"
                      :column="child"
                      :prop="child.prop"
                    ></slot>
                  </template>
                </ElTableColumn>
              </ElTableColumn>
            </template>

            <!-- header 沒有子欄位 -->
            <template v-else>
              <ElTableColumn
                :key="`header-${column.prop}-${scopedId}`"
                :prop="column.prop"
                :label="column.label"
                :sortable="column.sortable"
                v-bind="column"
              >
                <template v-if="hasSlot(`header-${column.slotKey}`)" #header="scope">
                  <div :class="column.sortable ? 'header-slot' : ''">
                    <slot
                      :name="`header-${column.slotKey}`"
                      :label="column.label"
                      :row-index="scope.$index"
                      :column="column"
                      :prop="column.prop"
                    ></slot>
                  </div>
                </template>
                <template v-else-if="hasSlot('header-all')" #header="scope">
                  <div :class="column.sortable ? 'header-slot' : ''">
                    <slot
                      name="header-all"
                      :label="column.label"
                      :row-index="scope.$index"
                      :column="column"
                      :prop="column.prop"
                    ></slot>
                  </div>
                </template>

                <template v-if="hasSlot(`column-${column.slotKey}`)" #default="scope">
                  <slot
                    :name="`column-${column.slotKey}`"
                    :label="column.label"
                    :data="scope.row[column.key]"
                    :row="scope.row"
                    :row-index="scope.$index"
                    :column="column"
                    :prop="column.prop"
                  ></slot>
                </template>
                <template v-else-if="hasSlot('column-all')" #default="scope">
                  <slot
                    name="column-all"
                    :label="column.label"
                    :data="scope.row[column.key]"
                    :row="scope.row"
                    :row-index="scope.$index"
                    :column="column"
                    :prop="column.prop"
                  ></slot>
                </template>
              </ElTableColumn>
            </template>
          </template>
        </ElTable>
      </template>
    </ElAutoResizer>
  </div>
</template>

<style lang="scss" scoped>
:deep(.__table-main-container) {
  .el-table {
    // 修 table 寬度自適應
    position: absolute;
    width: 100%;
    .el-table__header-wrapper {
      background-color: var(--i-color-table-thead);
    }

    .el-table__header {
      table-layout: fixed;
      border-collapse: separate;
      height: 100%;
      thead {
        background-color: var(--i-color-table-thead);
        & > tr,
        & th {
          background-color: inherit;
        }

        th.el-table__cell {
          user-select: auto;
        }
      }
      .cell {
        box-sizing: border-box;
        // overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
        word-break: break-all;
        line-height: 23px;
        padding: 0 8px;

        display: flex;
        align-items: center;

        height: 100%;
        color: var(--el-text-color-primary);
        & > div {
          width: 100%;
          height: 100%;
          color: inherit;

          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }

      .is {
        &-left > .cell {
          justify-content: flex-start;
        }
        &-center > .cell {
          justify-content: center;
        }
        &-right > .cell {
          justify-content: flex-end;
        }
      }
    }

    .el-table__body {
      // border 生效
      border-collapse: collapse;
      // border-collapse: separate;

      // fix table x scroll
      &-wrapper {
        width: calc(100% + 1px);
      }

      .el-table__row {
        background-color: var(--i-color-table-odd);
        &:hover {
          background-color: var(--i-color-table-odd-hover);
        }
      }
      .el-table__row--striped {
        background-color: var(--i-color-table-even);
        &:hover {
          background-color: var(--i-color-table-even-hover);
        }
      }

      .el-table__row,
      .el-table__row--striped {
        content-visibility: auto;

        &:hover {
          transition-duration: 0.2s;
        }
      }
      .el-table__row .el-table__cell {
        padding: 8px 0;
        background-color: inherit;
        transition: background-color 0.1s ease-out;
        & > .cell {
          overflow: visible;
        }
      }
    }

    .el-table__body-wrapper {
      background-color: var(--i-color-table-body);
    }

    .el-table__append-wrapper {
      overflow: visible;
      position: relative;
    }
  }
  .caret-wrapper {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    height: 14px;
    width: 24px;
    vertical-align: middle;
    cursor: pointer;
    overflow: initial;
    position: relative;
  }
  .sort-caret {
    width: 0;
    height: 0;
    border: solid 5px transparent;
    position: absolute;
    left: 7px;
  }
}

.__table-main {
  &-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
  }
  &-container {
    width: 100%;
    height: 100%;
  }
  &-append {
    height: 80px;
    min-height: 80px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: sticky;
    left: 0;
    top: 0;

    .load-more {
      width: 100px;
      height: 2px;
      position: absolute;
      bottom: 0;
      background-color: #ff000000;
    }
  }
}
</style>

<style lang="scss">
@use '@/assets/styles/utils' as utils;

$light-color: (
  'table-thead': #eceff5,
  'table-body': #FFFFFF,

  'table-odd': #fcfcfc,
  'table-odd-hover': #f2f4f8,
  'table-even': #f7f7f7,
  'table-even-hover': #f2f4f8
);

$dark-color: (
  'table-thead': #262727,
  'table-body': #141414,

  'table-odd': #303030,
  'table-odd-hover': #424243,
  'table-even': #39393A,
  'table-even-hover': #424243
);

@mixin set-css-vars($color-map) {
  // var(--i-color-table-thead)
  @each $type, $color in $color-map {
    @include utils.set-css-var-value(('color', $type), $color);
  }
}

// 顏色設定
html {
  @include set-css-vars($light-color);
}
html.dark {
  @include set-css-vars($dark-color);
}
</style>
