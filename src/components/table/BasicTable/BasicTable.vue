<script setup lang="ts">
import { useSlots, ref, inject, onMounted, onUnmounted, computed, watch, effectScope, nextTick } from 'vue'
import { ElTable, ElTableColumn, ElAutoResizer } from 'element-plus'

import type { UseHook } from '@/types/types_hook' // 全域功能類型
import { throttle } from '@/lib/lib_lodash'
import CustomButton from '@/components/feature/CustomButton/CustomButton.vue'
import { getUuid, hasOwnProperty, isEmpty } from '@/lib/lib_utils' // 工具
import { defaultModuleType } from '@/declare/declare_i18n'

import type { Emits, Expose } from './BasicTableInfo'
import { version, props as elTableProps } from './BasicTableInfo'
import { useTableSlot } from './hook'
import BasicTableColumn from './BasicTableColumn/BasicTableColumn.vue'

const scopedId = getUuid(version)

const slots: Record<string, any> = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}

const props = defineProps(elTableProps)

const useHook = inject('useHook') as UseHook
const { i18nTranslate } = useHook({
  i18nModule: props.i18nModule
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

const onRowClick: Emits['rowClick'] = (row, column, event) => {
  emit('row-click', row, column, event)
}
const onSortChange: Emits['sortChange'] = props => {
  const { column, prop: key = '', order } = props
  emit('sort-change', { column, key, order })
}
const onHeaderClick: Emits['headerClick'] = (column: any, event: Event) => {
  emit('header-click', column, event)
}
const onExpandChange: Emits['expandChange'] = (row: any, expanded: boolean) => {
  emit('expand-change', row, expanded)
}
const onHeaderDragend: Emits['headerDragend'] = (newWidth, oddWidth, column, event) => {
  emit('header-dragend', newWidth, oddWidth, column, event)
}
const onSelect: Emits['select'] = (selection, row) => {
  emit('select', selection, row)
}
const onSelectAll: Emits['selectAll'] = selection => {
  emit('select-all', selection)
}
const onSelectionChange: Emits['selectionChange'] = newSelection => {
  emit('selection-change', newSelection)
}
const onRowContextmenu: Emits['rowContextmenu'] = (row, column, event) => {
  // event.preventDefault()
  emit('row-contextmenu', row, column, event)
}

// 滾動到底時 emit load
const tableMainRef = ref<HTMLDivElement>()
const loadMoreRef = ref<HTMLDivElement>()
const load = () => {
  if (props.lazyLoadingStatus === 'loadMore') {
    emit('load')
  }
}
// loading 樣式
const svg = `<path
  class="path"
  d="
    M 30 15
    M 25.61 25.61
    A 14 14, 0, 0, 1, 15 30
    A 14 14, 0, 1, 1, 27.99 7.5
  "
  style="stroke-width: 2px; fill: rgba(0, 0, 0, 0)"
/>`

const IOcallback = throttle((entries: IntersectionObserverEntry[]) => {
  entries.forEach((entry: IntersectionObserverEntry) => {
    const { isIntersecting } = entry
    if (isIntersecting) {
      load()
    }
  })
}, 300) as IntersectionObserverCallback
let IO: any = null

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

const ElTableRef = ref<InstanceType<typeof ElTable>>()

// 用於多選表格，清空使用者的選擇
const clearSelection: Expose['clearSelection'] = () => {
  ElTableRef.value?.clearSelection()
}
// 傳回目前選取的行
const getSelectionRows: Expose['getSelectionRows'] = () => {
  const selectionRows = ElTableRef.value?.getSelectionRows()
  return Array.isArray(selectionRows) ? selectionRows : []
}
// 用於多選表格，切換某一行的選取狀態， 如果使用了第二個參數，則可直接設定這一行選取與否
const toggleRowSelection: Expose['toggleRowSelection'] = (row: any, selected?: boolean, ignoreSelectable?: boolean) => {
  ElTableRef.value?.toggleRowSelection(row, selected, (ignoreSelectable ?? true))
}
// 用於多選表格，切換全選和全不選
const toggleAllSelection: Expose['toggleAllSelection'] = () => {
  ElTableRef.value?.toggleAllSelection()
}
// 用於可擴展的表格或樹表格，如果某行擴展，則切換。 使用第二個參數，您可以直接設定該行應該被擴展或折疊。
const toggleRowExpansion: Expose['toggleRowExpansion'] = (row: any, expanded?: boolean) => {
  ElTableRef.value?.toggleRowExpansion(row, expanded)
}
// 用於單選表格，設定某一行為選取行， 如果呼叫時不加參數，則會取消目前高亮行的選取狀態。
const setCurrentRow: Expose['setCurrentRow'] = (row: any) => {
  ElTableRef.value?.setCurrentRow(row)
}
// 對 Table 進行重新佈局。 當表格可見性變更時，您可能需要呼叫此方法以獲得正確的佈局
const doLayout: Expose['doLayout'] = () => {
  ElTableRef.value?.doLayout()
}
// 捲動到一組特定座標
const scrollTo: Expose['scrollTo'] = (options: number | ScrollToOptions, yCoord?: number) => {
  ElTableRef.value?.scrollTo(options, yCoord)
}
// 設定垂直滾動位置
const setScrollTop: Expose['setScrollTop'] = (top?: number) => {
  ElTableRef.value?.setScrollTop(top)
}
// 設定水平滾動位置
const setScrollLeft: Expose['setScrollLeft'] = (left?: number) => {
  ElTableRef.value?.setScrollLeft(left)
}
// 適用於 lazy Table, 需要設定 rowKey, 更新 key children
const updateKeyChildren: Expose['updateKeyChildren'] = (key: string, data: any[]) => {
  ElTableRef.value?.updateKeyChildren(key, data)
}
// 滾動到最上方
const resetScroll: Expose['resetScroll'] = () => {
  ElTableRef.value?.setScrollTop(0)
}
// 設定checkbox
const toggleSelection: Expose['toggleSelection'] = (rows: any[]) => {
  if (isEmpty(rows)) {
    clearSelection()
  } else {
    rows.forEach(row => {
      toggleRowSelection(row)
    })
  }
}

defineExpose({
  // element ui plus
  clearSelection,
  getSelectionRows,

  toggleAllSelection,
  toggleRowExpansion,
  setCurrentRow,

  doLayout,
  scrollTo,
  setScrollTop,
  setScrollLeft,
  updateKeyChildren,

  // 不使用 element plus ui 的排序
  // clearSort: () => ElTableRef.value?.clearSort(),
  // sort: () => ElTableRef.value?.sort(),

  // 不使用 element plus ui 的過濾
  // clearFilter:() => ElTableRef.value?.clearFilter(),

  // custom
  resetScroll,
  toggleSelection
})

// slot
const {
  getHeaderSlot,
  getColumnSlot
} = useTableSlot(props.showColumns)
</script>

<template>
  <div ref="tableMainRef" class="__table-main-wrapper">
    <ElAutoResizer class="__table-main-container">
      <template #default="{ width, height }">
        <ElTable
          ref="ElTableRef"
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
            prop: props.sort?.key ?? '',
            order: props.sort?.order ?? 'ascending'
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

          <!-- 展開 自訂內容 -->
          <ElTableColumn
            v-if="hasSlot('row-expand')"
            type="expand"
            fixed="left"
          >
            <template #header="scope">
              <slot name="row-expand-header" v-bind="scope"></slot>
            </template>
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

          <!-- 勾選 checkbox -->
          <ElTableColumn
            v-if="props.selection"
            width="50"
            :align="'center'"
            type="selection"
            :selectable="props.selectable"
          >
            <template v-if="hasSlot('row-selection-header')" #header="scope">
              <slot name="row-selection-header" v-bind="scope"></slot>
            </template>
            <template v-if="hasSlot('row-selection')" #default>
              <slot name="row-selection" v-bind="scope"></slot>
            </template>
          </ElTableColumn>

          <!-- 顯示行數編號  -->
          <!-- <ElTableColumn
            v-if="(
              props.isShowNo ||
              hasSlot('row-no-header') ||
              hasSlot('row-no')
            )"
            width="60"
            :align="'center'"
            type="index"
            label="#"
          >
            <template #header="scope">
              <slot name="row-no-header" v-bind="scope"></slot>
            </template>
            <template #default="scope">
              <slot name="row-no" v-bind="scope"></slot>
            </template>
          </ElTableColumn> -->

          <!-- 顯示操作 -->
          <!-- <ElTableColumn
            v-if="hasSlot('row-operations')"
            prop="__operations__"
            width="60"
            :label="i18nTranslate('operationCommands', defaultModuleType)"
            :align="'center'"
            fixed="right"
          >
            <template #header="scope">
              <slot name="row-operations-header" v-bind="scope"></slot>
            </template>
            <template #default="scope">
              <slot name="row-operations" v-bind="scope"></slot>
            </template>
          </ElTableColumn> -->

          <!-- 懶加載用 滾動到底 emit load -->
          <template v-if="isLazyLoading" #append>
            <div
              v-show="props.lazyLoadingStatus === 'noMore'"
              class="__table-main-append"
              :style="`width: ${width}px;`"
            >
              {{ i18nTranslate('empty-data-more', defaultModuleType) }}
            </div>

            <div
              v-show="props.lazyLoadingStatus === 'loading'"
              class="__table-main-append"
              :style="`width: ${width}px;`"
            >
              <div
                style="width: 100%; height: 50px"
                v-loading="true"
                :element-loading-spinner="svg"
                element-loading-text="LOADING..."
                element-loading-svg-view-box="-10, -10, 50, 50"
              ></div>
              <div style="width: 100%; height: 30px"></div>
            </div>

            <div
              v-show="props.lazyLoadingStatus === 'loadMore'"
              class="__table-main-append"
              :style="`width: ${width}px;`"
            >
              <CustomButton
                :label="i18nTranslate('show-mode-more', defaultModuleType)"
                type="info"
                text
                @click="load()"
              />
              <div ref="loadMoreRef" class="load-more"></div>
            </div>
          </template>

          <!-- 欄位設定 -->
          <BasicTableColumn
            v-if="Array.isArray(props.showColumns)"
            :i18n-module="props.i18nModule"
            :show-columns="props.showColumns"
            :show-data="props.showData"
            parent-slot-key=""
          >
            <template #header="{ scope, column, slotKey, rowIndex }">
              <div class="header-slot" :class="{ sortable: column.sortable }">
                <slot
                  :name="getHeaderSlot((slotKey ?? column.key))"
                  v-bind="scope"
                  :label="column.label"
                  :row-index="rowIndex"
                  :column="column"
                  :prop="column.prop"
                >
                  {{ i18nTranslate(column.i18nLabel ?? column.label) }}
                </slot>
              </div>
            </template>
            <template #column="{ scope, column, slotKey, rowIndex, data }">
              <slot
                :name="getColumnSlot((slotKey ?? column.key))"
                v-bind="scope"
                :label="column.label"
                :data="data"
                :row="scope.row"
                :row-index="rowIndex"
                :column="column"
                :prop="column.prop"
              >
                {{ scope.row[column.key] }}
              </slot>
            </template>
          </BasicTableColumn>
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
    position: absolute;
    left: 7px;
  }
}

.header-slot {
  display: flex;
  width: 100%;
  // 預留空間 給 Element Plus UI sortable 空間
  &.sortable {
    width: calc(100% - 24px);
    padding-right: 8px;
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
  .el-table {
    --el-table-border-color: #E4E7ED;
  }
  @include set-css-vars($light-color);
}
html.dark {
  .el-table {
    --el-table-border-color: #606266;
  }
  @include set-css-vars($dark-color);
}
</style>
