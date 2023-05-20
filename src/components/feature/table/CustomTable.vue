<script setup lang="ts">
import {
  useSlots,
  ref,
  reactive,
  computed,
  onUpdated,
  onMounted,
  onUnmounted
} from 'vue'
import type { WritableComputedRef } from 'vue'
import type { ResizeObserverCallback } from '@/lib/throttle'
import throttle from '@/lib/throttle'

import type { ElTable as ElTableType } from 'element-plus'
import { ElTable, ElTableColumn, ElPagination } from 'element-plus'

import type { TableColumnsItem } from '@/lib/columns'
import type { ColumnItem } from './ColumnSetting.vue'

import ColumnSetting from './ColumnSetting.vue'

export interface PropsTableColumn extends Record<string, any>, TableColumnsItem {}

interface Props extends Record<string, any> {
  tableColumns: PropsTableColumn[]
  tableData: any[]
  /**
   * 欄位設定 版本
   * 如果版本更換 會重置欄位設定
   */
  version: string
  /**
   * 欄位設定 在 indexedDB 上的 key
   */
  settingKey:string
  /**
   * table 標題
   */
   title?: string
  /**
   * table 資料總筆數
   * 計算頁數用
   */
  total?: number
}
// eslint-disable-next-line vue/valid-define-props

const props = withDefaults(defineProps<Props>(), {
  tableData: () => [],
  title: '',
  total: 0
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

const loading = ref(true)
const renderKey = ref(1)
const isRender = ref(false)

// 點擊 excel
const excel = () => {
  emit('excel', {
    tableColumns: props.tableColumns,
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

const columnSetting = ref(null)
const showColumns = reactive([...props.tableColumns])

const initShowColumns = async () => {
  loading.value = true

  if (columnSetting.value) {
    const tempColumnList = await columnSetting.value.getcolumnList() as ColumnItem[]

    const resColumns = tempColumnList.reduce((resColumn, tempColumn) => {
      if (tempColumn.isShow) {
        const showColumn = props.tableColumns.find(column => {
          return tempColumn.key === column.key
        })
        resColumn.push(showColumn)
      }

      return resColumn
    }, [])

    showColumns.splice(0)
    showColumns.push(...resColumns)
    renderKey.value++
  }

  setTimeout(() => {
    loading.value = false
  }, 400) // 設 0.4s 才不會閃一下
}

onMounted(async () => {
  isRender.value = false
  await initShowColumns()

  isRender.value = true
})

// 表單高度
let tableHeight = ref(500)
const ROcallback = throttle((entries) => {
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

</script>

<template>
  <div v-loading="loading" class="table-wrapper">
    <div class="table-setting grid-row">
      <div class="setting-left grid-col-xs-24 grid-col-lg-8">
        <CustomButton
          icon-name="file-excel"
          label="Excel"
          class="i-mr-xs"
          @click="excel"
        />
        <ColumnSetting
          ref="columnSetting"
          :columns="props.tableColumns"
          :version="props.version"
          :setting-key="props.settingKey"
          @change="initShowColumns"
        />
        <slot name="setting-left"></slot>
      </div>

      <div class="setting-center grid-col-xs-24 grid-col-lg-8">
        <slot name="setting-center">
          <span>{{ props.title }}</span>
        </slot>
      </div>

      <div class="setting-right grid-col-xs-24 grid-col-lg-8">
        <slot name="setting-right"></slot>
        <div class="i-ml-xs" style="width: 160px; overflow: hidden;">
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
    </div>

    <div ref="tableMain" class="table-container">
      <ElTable
        v-if="isRender"
        ref="elTableRef"
        :key="renderKey"
        :data="showData"
        :height="tableHeight"
        style="width: 100%"
        :border="true"
        stripe
        @row-click="onRowClick"
      >
        <ElTableColumn
          v-for="column in showColumns"
          :key="column.prop"
          v-bind="column"
        >
          <template v-if="hasSlot(`header-${column.prop}`)" #header="scope">
            <slot
              :name="`header-${column.prop}`"
              :row-index="scope.$index"
              :column="column"
            ></slot>
          </template>
          <template v-else-if="hasSlot('header')" #header="scope">
            <slot
              name="header"
              :row-index="scope.$index"
              :column="column"
            ></slot>
          </template>

          <template v-if="hasSlot(`column-${column.prop}`)" #default="scope">
            <slot
              :name="`column-${column.prop}`"
              :data="scope.row[column.key]"
              :row="scope.row"
              :row-index="scope.$index"
              :column="column"
            ></slot>
          </template>
          <template v-else-if="hasSlot('column')" #default="scope">
            <slot
              name="column"
              :data="scope.row[column.key]"
              :row="scope.row"
              :row-index="scope.$index"
              :column="column"
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
    height: fit-content;
    background-color: #f5f7fa;
    overflow: hidden;
    overflow-x: scroll;
    width: 100%;
    padding: 4px 8px;

    &::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }
    &::-webkit-scrollbar-track {
      box-shadow: inset 0 0 5px #ebeef500;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #ebeef500;
    }

    &:hover {
      &::-webkit-scrollbar-thumb {
        background-color: #a2a2a272;
      }
    }

    .setting {
      &-left,
      &-center,
      &-right {
        display: flex;
        align-items: center;
        width: 100%;
      }

      &-left {
        justify-content: flex-start;
      }
      &-center {
        justify-content: center;
        min-height: 40px;
      }
      &-right {
        justify-content: flex-end;
        @media (max-width: 992px) {
          justify-content: center;
        }
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