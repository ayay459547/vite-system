<script setup lang="ts">
import type { PropType } from 'vue'
import { useSlots, ref, onMounted, onUnmounted } from 'vue'
import type { ResizeObserverCallback } from '@/lib/lib_throttle'
import throttle from '@/lib/lib_throttle'
import type { Sort } from './CustomTable.vue'
import type { ElTable as ElTableType } from 'element-plus'
import { ElTable, ElTableColumn } from 'element-plus'

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
  }
})

const emit = defineEmits([
  'row-click',
  'sort-change',
  'header-click',
  'expand-change'
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


// height rwd
let tableHeight = ref(500)
const ROcallback = throttle((entries: ResizeObserverEntry[]) => {
  entries.forEach((entry) => {
    tableHeight.value = entry.contentRect.height
  })
}, 100) as ResizeObserverCallback
const RO = new ResizeObserver(ROcallback)

const tableMain = ref(null)
onMounted(() => {
  if (tableMain.value !== null) {
    RO.observe(tableMain.value)
  }
})
onUnmounted(() => {
  RO.disconnect()
})

const elTableRef = ref<InstanceType<typeof ElTableType>>()
const resetScroll = (): void => {
  elTableRef.value?.setScrollTop(0)
}

defineExpose({
  resetScroll
})

</script>

<template>
  <div ref="tableMain" class="table-main">
    <ElTable
      ref="elTableRef"
      stripe
      style="width: 100%"
      :key="props.renderKey"
      :data="props.showData"
      :height="tableHeight"
      :border="true"
      :row-key="props.rowKey"
      :default-expand-all="props.defaultExpandAll"
      :default-sort="{
        prop: props.sort.key,
        order: props.sort.order,
      }"
      @row-click="onRowClick"
      @sort-change="onSortChange"
      @header-click="onHeaderClick"
      @expand-change="onExpandChange"
    >
      <template v-if="hasSlot('column-expand')">
        <ElTableColumn type="expand">
          <template #default="scope">
            <slot
              name="column-expand"
              :row="scope.row"
              :row-index="scope.$index"
              :expanded="scope.expanded"
              :store="scope.store"
            ></slot>
          </template>
        </ElTableColumn>
      </template>

      <template v-for="column in showColumns" :key="column.prop">
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
              <template v-else-if="hasSlot(`header-${column.slotKey}-all}`)" #header="scope">
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
            </ElTableColumn>
          </ElTableColumn>
        </template>

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
</template>

<style lang="scss" scoped>
.table-main::v-deep {
  .el-table {
    // 修 table 寬度自適應
    position: absolute;
    .el-table__header {
      table-layout: fixed;
      border-collapse: separate;
      height: 100%;
      .cell {
        box-sizing: border-box;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
        word-break: break-all;
        line-height: 23px;
        padding: 0 12px;

        display: flex;
        align-items: center;

        height: 100%;
        & > div {
          width: 100%;
          height: 100%;
        }
      }
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
  width: 100%;
  height: 100%;
  position: relative;
}
</style>