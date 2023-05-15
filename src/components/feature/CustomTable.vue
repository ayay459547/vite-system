<script setup lang="ts">
import {
  useSlots,
  ref,
  computed,
  onUpdated,
  onMounted,
  onUnmounted
} from 'vue'
import type { PropType, WritableComputedRef } from 'vue'
import type { ResizeObserverCallback } from '@/lib/throttle'
import throttle from '@/lib/throttle'

import type { ElTable as ElTableType } from 'element-plus'
import { ElTable, ElTableColumn, ElPagination } from 'element-plus'

import type { TableColumns } from '@/lib/columns'

interface PropsTableColumn extends Record<string, any>, TableColumns {}

const props = defineProps({
  tableColumn: {
    type: Object as PropType<PropsTableColumn>,
    default () {
      return {}
    }
  },
  tableData: {
    type: Array as PropType<any[]>,
    default () {
      return []
    }
  },
  label: {
    type: String as PropType<string>,
    default: ''
  },
  loading: {
    type: Boolean as PropType<boolean>,
    default: true
  },
  total: {
    type: Number as PropType<number>,
    default: 100,
    description: `table 資料總筆數
      如果是 null 換頁不顯示`
  }
})

const emit = defineEmits([
  'change',
  'row-click',
  'excel'
])

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}

// 點擊 excel
const excel = () => {
  emit('excel', {
    tableColumn: props.tableColumn,
    tableData: props.tableData
   })
}

// 切換頁
const total = ref(1)
onUpdated(() => {
  total.value = props.total
})

// 每頁顯示筆數
const pageSizeValue = ref('100')
const pageSize: WritableComputedRef<number> = computed({
  get: () => {
    return parseInt(pageSizeValue.value)
  },
  set: (v: number) => {
    pageSizeValue.value = `${v}`
  }
})
const sizeOptions = [
  { value: 30, label: '30' },
  { value: 50, label: '50' },
  { value: 100, label: '100' },
  { value: 200, label: '200' },
  { value: 300, label: '300' }
]
const onSizeChange = (v: number) => {
  changePage(1, v)
}

const currentPage = ref(1)
const onPageChange = (v: number) => {
  const tempPageSize = pageSize.value
  changePage(v, tempPageSize)
}

const elTableRef = ref<InstanceType<typeof ElTableType>>()
const resetScroll = (): void => {
  elTableRef.value?.setScrollTop(0)
}

const changePage = (page: number, pageSize: number): void => {
  currentPage.value = page

  emit('change', { page, pageSize })
  resetScroll()
  // console.log(elTableRef.value)
}

const onRowClick = (row: any, column: any, event: Event) => {
  emit('row-click', row, column, event)
}

// 顯示資料
const showData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value

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
    <div class="table-setting">
      <div class="setting-left">
        <CustomButton
          icon-name="file-excel"
          size="large"
          text
          @click="excel"
        />
        <slot name="setting-left"></slot>
      </div>

      <div class="setting-center">
        <slot name="setting-center">
          <span>{{ props.label }}</span>
        </slot>
      </div>
      <div class="setting-right">
        <slot name="setting-right"></slot>
        <FormSelect
          label="顯示筆數 : "
          :model-value="pageSizeValue"
          :options="sizeOptions"
          direction="row"
          @update:modelValue="pageSize"
          @change="onSizeChange"
        />
      </div>
    </div>

    <div ref="tableMain" class="table-container">
      <ElTable
        ref="elTableRef"
        :data="showData"
        :height="tableHeight"
        style="width: 100%"
        :border="true"
        stripe
        @row-click="onRowClick"
      >
        <ElTableColumn
          v-for="column in tableColumn"
          :key="column.prop"
          v-bind="column"
        >
          <template v-if="hasSlot(`header-${column.prop}`)" #header="scope">
            <slot
              :name="`header-${column.prop}`"
              :attributes="{
                index: scope.$index,
                row: scope.row,
                column: scope.column,
                data: scope.row[column.key],
                key: column.key,
                prop: column.prop,
                label: column.label
              }"
            ></slot>
          </template>
          <template v-else-if="hasSlot('header')" #header="scope">
            <slot
              name="header"
              :attributes="{
                index: scope.$index,
                row: scope.row,
                column: scope.column,
                data: scope.row[column.key],
                key: column.key,
                prop: column.prop,
                label: column.label
              }"
            ></slot>
          </template>

          <template v-if="hasSlot(`column-${column.prop}`)" #default="scope">
            <slot
              :name="`column-${column.prop}`"
              :data="scope.row[column.key]"
              :attributes="{
                  index: scope.$index,
                  row: scope.row,
                  column: scope.column,
                  data: scope.row[column.key],
                  key: column.key,
                  prop: column.prop,
                  label: column.label
              }"
            ></slot>
          </template>
          <template v-else-if="hasSlot('column')" #default="scope">
            <slot
              name="column"
              :data="scope.row[column.key]"
              :attributes="{
                  index: scope.$index,
                  row: scope.row,
                  column: scope.column,
                  data: scope.row[column.key],
                  key: column.key,
                  prop: column.prop,
                  label: column.label
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
        :page-size="pageSize"
        :current-page="currentPage"
        @update:current-page="onPageChange"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.table-container) {
  .el-table {
    // 修 table 寬度自適應
    position: absolute;
  }
}
.table {
  &-wrapper {
    width: 100%;
    height: 100%;
    border: 1px solid #ebeef5;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
  }

  &-setting {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    height: fit-content;
    padding: 0 8px;
    background-color: #f5f7fa;
    flex-wrap: wrap;

    .setting {
      &-left {
        width: 180px;
      }
      &-center {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 180px;
      }
      &-right {
        width: 180px;
      }
    }
  }

  &-container {
    flex: 1;
    width: 100%;
    position: relative;
  }
  &-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
  }
}
</style>