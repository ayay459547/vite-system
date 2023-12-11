<script setup lang="ts">
import {
  type PropType,
  ref,
  useSlots,
  onMounted,
  onUnmounted
} from 'vue'
import type { ResizeObserverCallback } from '@/lib/lib_throttle'
import throttle from '@/lib/lib_throttle'
import {
  type ElTableV2 as ElTableV2Type,
  type TableV2Instance,
  ElTableV2
} from 'element-plus'

const props = defineProps({
  renderKey: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
    description: '重新渲染用的key'
  },
  // element ui
  rowKey: {
    type: String as PropType<string>,
    required: false,
    default: 'id',
    description: '每行資料的key 預設是id'
  },
  data: {
    type: Array as PropType<Array<any>>,
    required: false,
    default: () => {
      return []
    },
    description: '顯示資料'
  },
  columns: {
    type: Array as PropType<Array<any>>,
    required: false,
    default: () => {
      return []
    },
    description: '顯示欄位'
  },
  rowHeight: {
    type: Number as PropType<number>,
    required: false,
    default: 50,
    description: 'Row 高度'
  },
  headerHeight: {
    type: Number as PropType<number>,
    required: false,
    default: 50,
    description: 'Header 高度'
  },
  footerHeight: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
    description: 'Footer 高度'
  },
  cache: {
    type: Number as PropType<number>,
    required: false,
    default: 12,
    description: '預先加載資料行數'
  },
  fixed: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
    description: '寬度欄位是否固定 還是自適應'
  }
})

const emit = defineEmits([
  // 更新 table 大小
  'update-size'
])

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}

// 監聽寬度高度變化
const tableV2Ref = ref()
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

onMounted(async () => {
  if (tableV2Ref.value !== null) {
    RO.observe(tableV2Ref.value)
  }
})
onUnmounted(() => {
  if (RO) {
    RO.disconnect()
  }

})

const elTableV2Ref = ref<InstanceType<typeof ElTableV2Type> & TableV2Instance>()
const resetScroll = (): void => {
  if([null, undefined].includes(elTableV2Ref.value)) return
  elTableV2Ref.value.scrollToTop(0)
}

defineExpose({
  resetScroll
})

</script>

<template>
  <div ref="tableV2Ref" class="table-v2-wrapper">
    <div class="table-v2-container">
      <ElTableV2
        :key="props.renderKey"
        ref="elTableV2Ref"
        scrollbar-always-on
        :width="tableWidth"
        :height="tableHeight"
        :columns="props.columns"
        :data="props.data"
        :row-key="props.rowKey"
        :row-height="props.rowHeight"
        :header-height="props.headerHeight"
        :footer-height="props.footerHeight"
        :cache="props.cache"
        :fixed="props.fixed"
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
            <template v-for="column in props.columns" :key="column.prop">
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
            <template v-for="column in props.columns" :key="column.prop">
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
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.table-v2-container) {
  .el-table-v2__table {
    .el-table-v2__header .el-table-v2__header-cell {
      background-color: lighten($system-bg-color, 60%);
      border-right: 1px solid #ebeef5;
      color: #535353;
    }

    .el-table-v2__row {
      .el-table-v2__row-cell {
        border-right: 1px solid #ebeef5;
      }
    }
  }
}

.table-v2 {
  &-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    border: 2px solid #e9e9eb;
    border-radius: 6px;
    overflow: hidden;
  }
  &-container {
    display: contents;
  }
}
</style>
