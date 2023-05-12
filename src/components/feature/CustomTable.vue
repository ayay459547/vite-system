<script setup lang="ts">
import {
  useSlots,
  ref,
  computed,
  onUpdated,
  onMounted,
  onUnmounted
} from 'vue'
import type { ResizeObserverCallback } from '@/lib/throttle'
import throttle from '@/lib/throttle'

import type { ElTable as ElTableType } from 'element-plus'
import { ElTable, ElTableColumn, ElPagination } from 'element-plus'

const props = defineProps({
  tableColumn: {
    type: Object,
    default () {
      return {}
    }
  },
  tableData: {
    type: Array,
    default () {
      return []
    }
  },
  loading: {
    type: Boolean,
    default: true
  },
  total: {
      type: [Number, null],
      default: 100,
      description: `table 資料總筆數
          如果是 null 換頁不顯示`
  }
})

const emit = defineEmits([
  'change',
  'row-click'
])

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}

// 切換頁
const total = ref(1)
onUpdated(() => {
  total.value = props.total
})

// 每頁顯示筆數
const showDataCount = ref(100)
// const sizeOptions = [
//     { value: 30, label: '30' },
//     { value: 50, label: '50' },
//     { value: 100, label: '100' },
//     { value: 200, label: '200' },
//     { value: 300, label: '300' }
// ]
// const onSizeChange = (v) => {
//     changePage(1, v)
// }

const currentPage = ref(1)
const onPageChange = (v: number) => {
    changePage(v, showDataCount.value)
}

const elTableRef = ref<InstanceType<typeof ElTableType>>()
const resetScroll = (): void => {
  elTableRef.value?.setScrollTop(0)
}

const changePage = (page: number, showDataCount: number): void => {
  currentPage.value = page

  emit('change', { page, showDataCount })
  resetScroll()
  // console.log(elTableRef.value)
}

// 顯示資料
const showData = computed(() => {
  const start = (currentPage.value - 1) * showDataCount.value
  const end = start + showDataCount.value

  return (props.tableData as Array<any>).slice(start, end)
})

// 表單高度
let tableHeight = ref(500)
const ROcallback = throttle((entries) => {
  entries.forEach((entry) => {
    tableHeight.value = entry.contentRect.height - 10
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

</script>

<template>
  <div class="table-wrapper">
    <div ref="tableMain" class="table-container">
      <ElTable
        ref="elTableRef"
        :data="showData"
        :height="tableHeight"
        style="width: 100%"
      >
        <ElTableColumn
          v-for="column in tableColumn"
          :key="column.prop"
          v-bind="column"
        >
          <template v-if="hasSlot(`column-${column.prop}`)" #default="scope">
            <slot
              :name="`column-${column.prop}`"
              :data="{
                index: scope.$index,
                row: scope.row,
                column: scope.column,
                prop: column.prop
              }"
            ></slot>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>

    <div class="table-pagination">
      <ElPagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="showDataCount"
        :current-page="currentPage"
        @update:current-page="onPageChange"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
$pagination-height: 40px;
.table {
  &-wrapper {
    width: 100%;
    height: 100%;
    border: 1px solid #ebeef5;
    border-radius: 6px;
    overflow: hidden;
  }
  &-container {
    width: inherit;
    height: calc(100% - $pagination-height);
    overflow-y: auto;
  }
  &-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    height: $pagination-height;
  }
}
</style>