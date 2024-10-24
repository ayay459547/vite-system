<script setup lang="ts">
import { ref, useSlots } from 'vue'
import type { ElTableV2 as ElTableV2Type, TableV2Instance } from 'element-plus'
import { ElTableV2, ElAutoResizer } from 'element-plus'

import { getUuid } from '@/lib/lib_utils' // 工具

import { version, props as tableV2Props } from './CustomTableV2Info'

const scopedId = getUuid('__i-table-v2__')

const props = defineProps(tableV2Props)

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}

// const tableV2Ref = ref()
const elTableV2Ref = ref<InstanceType<typeof ElTableV2Type> & TableV2Instance>()
const resetScroll = (): void => {
  if ([null, undefined].includes(elTableV2Ref.value)) return
  elTableV2Ref.value.scrollToTop(0)
}

defineExpose({
  resetScroll
})
</script>

<template>
  <div ref="tableV2Ref" class="__table-v2-wrapper" :class="`CustomTableV2_${version} ${scopedId}`">
    <div class="__table-v2-container">
      <ElAutoResizer>
        <template #default="{ height, width }">
          <ElTableV2
            :key="props.renderKey"
            ref="elTableV2Ref"
            scrollbar-always-on
            :width="width"
            :height="height"
            :columns="props.columns"
            :data="props.data"
            :row-key="props.rowKey"
            :row-height="props.rowHeight"
            :header-height="props.headerHeight"
            :footer-height="props.footerHeight"
            :fixed="props.fixed"
            :cache="props.cache"
          >
            <template v-if="hasSlot('header')" #header="scope">
              <slot name="header" v-bind="scope"></slot>
            </template>
            <template #header-cell="scope">
              <slot
                v-if="hasSlot('header-cell')"
                name="header-cell"
                v-bind="scope"
                :column="scope.column"
                :columns="scope.columns"
                :column-index="scope.columnIndex"
                :header-index="scope.headerIndex"
                :prop="scope.column.prop"
                :label="scope.column.label"
              ></slot>
              <!-- 個別欄位設定 -->
              <template v-else>
                <template v-for="column in props.columns" :key="`header-cell-${column.prop}-${scopedId}`">
                  <template v-if="column.slotKey === scope.column.slotKey">
                    <slot
                      v-if="hasSlot(`header-${column.slotKey}`)"
                      :name="`header-${column.slotKey}`"
                      v-bind="scope"
                      :column="scope.column"
                      :columns="scope.columns"
                      :column-index="scope.columnIndex"
                      :header-index="scope.headerIndex"
                      :prop="scope.column.prop"
                      :label="scope.column.label"
                    ></slot>
                    <slot
                      v-else-if="hasSlot('header-all')"
                      :name="'header-all'"
                      v-bind="scope"
                      :column="scope.column"
                      :columns="scope.columns"
                      :column-index="scope.columnIndex"
                      :header-index="scope.headerIndex"
                      :prop="scope.column.prop"
                      :label="scope.column.label"
                    ></slot>
                  </template>
                </template>
              </template>
            </template>

            <template #cell="scope">
              <slot
                v-if="hasSlot('cell')"
                name="cell"
                v-bind="scope"
                :column="scope.column"
                :columns="scope.columns"
                :column-index="scope.columnIndex"
                :row-data="scope.rowData"
                :row="scope.rowData"
                :row-index="scope.rowIndex"
                :prop="scope.column.prop"
                :label="scope.column.label"
              ></slot>
              <template v-else>
                <template v-for="column in props.columns" :key="`cell-${column.prop}-${scopedId}`">
                  <div v-if="column.slotKey === scope.column.slotKey">
                    <slot
                      v-if="hasSlot(`column-${column.slotKey}`)"
                      :name="`column-${column.slotKey}`"
                      v-bind="scope"
                      :column="scope.column"
                      :columns="scope.columns"
                      :column-index="scope.columnIndex"
                      :row-data="scope.rowData"
                      :row="scope.rowData"
                      :row-index="scope.rowIndex"
                      :prop="scope.column.prop"
                      :label="scope.column.label"
                    ></slot>
                    <slot
                      v-else-if="hasSlot('column-all')"
                      :name="'column-all'"
                      v-bind="scope"
                      :column="scope.column"
                      :columns="scope.columns"
                      :column-index="scope.columnIndex"
                      :row-data="scope.rowData"
                      :row="scope.rowData"
                      :row-index="scope.rowIndex"
                      :prop="scope.column.prop"
                      :label="scope.column.label"
                    ></slot>
                    <div v-else>{{ scope.rowData[column.slotKey] }}</div>
                  </div>
                </template>
              </template>
            </template>

            <template v-if="hasSlot('row')" #row="scope">
              <slot name="row" v-bind="scope"></slot>
            </template>

            <template v-if="hasSlot('footer')" #footer>
              <slot name="footer"></slot>
            </template>
            <template v-if="hasSlot('empty')" #empty>
              <slot name="empty"></slot>
            </template>
            <template v-if="hasSlot('overlay')" #overlay>
              <slot name="overlay"></slot>
            </template>
          </ElTableV2>
        </template>
      </ElAutoResizer>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.__table-v2-container) {
  .el-table-v2__table {
    .el-table-v2__header {
      .el-table-v2__header-cell,
      .el-table-v2__dynamic-header-row {
        background-color: var(--i-color-table-thead);
      }

      .el-table-v2__header-cell {
        color: var(--el-text-color-primary);

        border-right: 1px solid var(--i-color-table-border);
        &:last-child {
          border-right: none;
        }
      }
    }

    .el-table-v2__row {
      .el-table-v2__row-cell {
        border-right: 1px solid var(--i-color-table-border);

        &:last-child {
          border-right: none;
        }

        & > div {
          width: 100%;
        }
      }
    }
  }
}

.__table-v2 {
  &-wrapper {
    width: 100%;
    height: 100%;
    // position: relative;
    border: 2px solid var(--i-color-table-border) {
      radius: 6px;
    }
    overflow: hidden;
  }
  &-container {
    display: contents;
  }
}
</style>
