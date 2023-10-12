<script setup lang="ts">
import type { PropType } from 'vue'
import { useSlots, ref, onMounted, onUnmounted } from 'vue'
import type { ResizeObserverCallback } from '@/lib/lib_throttle'
import throttle from '@/lib/lib_throttle'
import type { Sort } from './CustomTable.vue'
import type { ElTable as ElTableType } from 'element-plus'
import { ElTable, ElTableColumn } from 'element-plus'
import type {
  SpanMethod,
  RowClassName,
  RowStyle,
  CellClassName,
  CellStyle,
  Load,
  LazyLoadingStatus
} from './CustomTable.vue'
import { CustomButton } from '@/components'

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}

const props = defineProps({
  renderKey: {
    type: Number as PropType<number>,
    required: true,
    description: '重新渲染用的key'
  },
  showData: {
    type: Array as PropType<Array<any>>,
    required: true,
    description: '顯示資料'
  },
  tableDataCount: {
    type: Number as PropType<number>,
    required: true,
    description: '總資料筆數 計算虛擬渲染用'
  },
  showColumns: {
    type: Array as PropType<Array<any>>,
    required: true,
    description: '顯示欄位'
  },
  sort: {
    type: Object as PropType<Sort>,
    required: true,
    description: '資料存在 children 時 預設是否展開'
  },
  showNo: {
    type: Boolean as PropType<boolean>,
    required: true,
    description: '重新渲染用的key'
  },
  // element ui
  rowKey: {
    type: String as PropType<string>,
    required: true,
    description: '每行資料的key 預設是id'
  },
  defaultExpandAll: {
    type: Boolean as PropType<boolean>,
    required: true,
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
  lazyLoading: {
    type: Boolean as PropType<boolean>,
    description: '懶加載'
  },
  lazyLoadingStatus: {
    type: String as PropType<LazyLoadingStatus>,
    description: '懶加載狀態'
  }
})

const emit = defineEmits([
  'row-click',
  'sort-change',
  'header-click',
  'expand-change',
  'header-dragend',
  'select',
  'select-all',
  'selection-change',
  'load',
  // 更新 table 大小
  'update-size'
])

const onRowClick = (row: any, column: any, event: Event) => {
  emit('row-click', row, column, event)
}
const onSortChange = (props: {
  column: any,
  prop: string,
  order: null | 'ascending' | 'descending'
}) => {
  const { column, prop: key = '', order } = props
  emit('sort-change', { column, key, order })
}
const onHeaderClick = (column: any, event: Event) => {
  emit('header-click', column, event)
}
const onExpandChange = (row: any, expanded: boolean) => {
  emit('expand-change', row, expanded)
}
const onHeaderDragend = (newWidth: number, oddWidth: number, column: any, event: Event) => {
  emit('header-dragend', newWidth, oddWidth, column, event)
}
const onSelect = (selection: any, row: any) => {
  emit('select', selection, row)
}
const onSelectAll = (selection: any) => {
  emit('select-all', selection)
}
const onSelectionChange = (selection: any) => {
  emit('selection-change', selection)
}

// 監聽寬度高度變化
const tableMainRef = ref(null)
const tableWidth = ref(500)
const tableHeight = ref(500)
const ROcallback = throttle((entries: ResizeObserverEntry[]) => {
  entries.forEach((entry) => {
    const newWidth = entry.contentRect.width
    const newHeight = entry.contentRect.height
    tableWidth.value = newWidth
    tableHeight.value = newHeight

    emit('update-size', {
      width: newWidth,
      height: newHeight
    })
  })
}, 100) as ResizeObserverCallback
const RO = new ResizeObserver(ROcallback)

// 滾動到底時 emit load
const loadMoreRef = ref(null)
const load = () => {
  if (props.lazyLoadingStatus === 'loadMore') {
    emit('load')
  }
}
const IOcallback = throttle((entries: IntersectionObserverEntry[]) => {
  entries.forEach((entry: IntersectionObserverEntry & { isVisible: boolean }) => {
    const { isIntersecting, isVisible } = entry
    if (isIntersecting) {
      load()
    }
  })
}, 300) as IntersectionObserverCallback
let IO = null

onMounted(async () => {
  if (tableMainRef.value !== null) {
    RO.observe(tableMainRef.value)

    if (loadMoreRef.value !== null) {
      IO = new IntersectionObserver(IOcallback, {
        root: tableMainRef.value,
        rootMargin: '0px 0px 0px 0px',
        threshold: 0.1
      })
      IO.observe(loadMoreRef.value)
    }
  }
})
onUnmounted(() => {
  RO.disconnect()

  if (IO) {
    IO.disconnect()
  }
})

const elTableRef = ref<InstanceType<typeof ElTableType>>()
const resetScroll = (): void => {
  elTableRef.value?.setScrollTop(0)
}

defineExpose({
  resetScroll
})

const svg = `
  <path 
    class="path"
    d="
      M 30 15
      L 28 17
      M 25.61 25.61
      A 15 15, 0, 0, 1, 15 30
      A 15 15, 0, 1, 1, 27.99 7.5
      L 15 15
    "
    style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"
  />
`

</script>

<template>
  <div ref="tableMainRef" class="table-main-wrapper">
    <div class="table-main-container">
      <ElTable
        ref="elTableRef"
        stripe
        scrollbar-always-on
        :border="true"
        :key="props.renderKey"
        :data="props.showData"
        :height="tableHeight"
        :row-key="props.rowKey"
        :default-expand-all="props.defaultExpandAll"
        :default-sort="{
          prop: props.sort.key,
          order: props.sort.order,
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
      >
        <!-- 資料為空 顯示內容 -->
        <template v-if="hasSlot('empty')" #empty>
          <slot name="empty"></slot>
        </template>

        <!-- 懶加載用 滾動到底 emit load -->
        <template v-if="props.lazyLoading" #append>
          <div
            v-show="props.lazyLoadingStatus === 'noMore'"
            class="table-main-append"
            :style="`width: ${tableWidth}px;`"
          >
            無更多資料
          </div>

          <div
            v-show="props.lazyLoadingStatus === 'loading'"
            class="table-main-append"
            :style="`width: ${tableWidth}px;`"
          >
            <div
              style="width: 100%; height: 50px;"
              v-loading="true"
              element-loading-text="Loading..."
              :element-loading-spinner="svg"
              element-loading-svg-view-box="-10, -10, 50, 50"
            ></div>
            <div style="width: 100%; height: 30px;"></div>
          </div>

          <div
            v-show="props.lazyLoadingStatus === 'loadMore'"
            class="table-main-append"
            :style="`width: ${tableWidth}px;`"
          >
            <CustomButton
              label="載入更多資料"
              type="info"
              text
              @click="load"
            />
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
        <template v-if="props.showNo">
          <ElTableColumn
            width="80"
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
          <ElTableColumn
            width="50"
            :align="'center'"
            type="selection"
          />
        </template>

        <!-- 欄位設定 -->
        <template v-for="column in showColumns" :key="column.prop">
          <!-- header 有子欄位 -->
          <template v-if="column.columns && column.columns.length > 0">
            <ElTableColumn
              :key="column.prop"
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
                :key="child.prop"
                v-bind="child"
              >
                <template v-if="hasSlot(`header-${column.slotKey}-${child.slotKey}`)" #header="scope">
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
                <template v-else-if="hasSlot(`header-${child.slotKey}-all}`)" #header="scope">
                  <div :class="child.sortable ? 'header-slot' : ''">
                    <slot
                      :name="`header-${column.slotKey}-all}`"
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

                <template v-if="hasSlot(`column-${column.slotKey}-${child.slotKey}`)" #default="scope">
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
                <template v-else-if="hasSlot(`column-${column.slotKey}-all}`)" #default="scope">
                  <slot
                    :name="`column-${column.slotKey}-all}`"
                    :label="child.label"
                    :data="scope.row[child.key]"
                    :row="scope.row"
                    :row-index="scope.$index"
                    :column="child"
                    :prop="child.prop"
                  ></slot>
                </template>
                <template v-else-if="hasSlot(`column-all}`)" #default="scope">
                  <slot
                    :name="`column-all}`"
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
              :key="column.prop"
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
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.table-main-container) {
  .el-table {
    // 修 table 寬度自適應
    position: absolute;
    width: 100%;
    .el-table__header {
      table-layout: fixed;
      border-collapse: separate;
      height: 100%;
      thead {
        background-color: lighten($system-bg-color, 60%);
        & > tr {
           background-color: inherit;

          & > th {
             background-color: inherit;
          }
        }
      }
      .cell {
        box-sizing: border-box;
        // overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
        word-break: break-all;
        line-height: 23px;
        padding: 0 12px;

        display: flex;
        align-items: center;

        height: 100%;
        color: #535353;
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
      // fix table x scroll
      &-wrapper {
        width: calc(100% + 1px);
      }
      // border 生效
      border-collapse: collapse;
      // border-collapse: separate;
      .el-table__row--striped {
        background: var(--el-fill-color-lighter);
      }
      .el-table__row,
      .el-table__row--striped {
        &:hover {
          transition-duration: 0.2s;
          background-color: var(--el-table-row-hover-bg-color);
        }
      }
      .el-table__row .el-table__cell {
        background-color: inherit;
        transition: background-color 0.1s ease-out;
      }
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

.table-main {
  &-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
  }
  &-container {
    display: contents;
  }
  &-append {
    height: 80px;
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