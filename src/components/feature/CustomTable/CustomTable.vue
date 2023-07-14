<script setup lang="ts">
import {
  useSlots,
  ref,
  reactive,
  computed,
  onMounted,
  onUnmounted,
  inject
} from 'vue'

import type { ElTable as ElTableType } from 'element-plus'
import { ElTable, ElTableColumn, ElPagination } from 'element-plus'

import type { ResizeObserverCallback } from '@/lib/throttle'
import throttle from '@/lib/throttle'

import type { TableColumnsItem } from '@/lib/columns'
import type { ColumnItem } from '@/declare/columnSetting'

import { CustomButton, FormSelect } from '@/components'

import type { Hook } from '@/declare/hook'

import ColumnSetting from './ColumnSetting.vue'

export interface PropsTableColumn extends Record<string, any>, TableColumnsItem {}
export interface PageChange {
  (page: number, pageSize: number): void
}

export type Sort = {
  key: null | string
  order: null | 'ascending' | 'descending'
}

export interface Props extends Record<string, any> {
  /**
   * table 標題
   */
  title?: string

  /**
   * 欄位設定相關
   * version: 欄位設定 版本
   *     如果版本更換 會重置欄位設定
   * settingKey:
   *     欄位設定 在 indexedDB 上的 key
   *     建議參考路由 避免重複使用 key
   */
  version: string
  settingKey: string

  /**
   * 表單資料相關
   * tableColumns: 表單欄位顯示用設定
   * tableData: 表單資料
   * rowKey: 每行資料的key 預設是id
   * defaultExpandAll: 資料存在 children 時 預設是否展開
   */
  tableColumns: PropsTableColumn[]
  tableData: any[]
  tableDataCount?: number
  rowKey?: string
  defaultExpandAll?: boolean

  /**
   * 表單顯示相關
   * page 當前分頁
   * pageSize 顯示筆數
   * tableDataCount 資料總筆數 計算頁數用
   * showType: custom 依據api切資料
   *           auto 依據 page 和 pageSize 切資料
   */
  page?: number
  pageSize?: number
  sort?: Sort
  showType?: 'custom' | 'auto'
}

const props: Props = withDefaults(defineProps<Props>(), {
  title: '',
  version: '',
  settingKey: '',
  tableColumns: () => [],
  tableData: () => [],
  tableDataCount: 0,
  rowKey: 'id',
  defaultExpandAll: false,
  page: 1,
  pageSize: 100,
  sort: () => {
    return { key: null, order: null }
  },
  showType: 'custom'
})

const emit = defineEmits([
  'header-click',
  'row-click',
  'excel',
  'columns-change',
  'sort-change',
  'page-change',
  'size-change',
  'show-change'
])

const hook: Hook = inject('hook')
const { i18nTranslate } = hook()

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

// 每頁顯示筆數
const pageSize = ref(props.pageSize)

const sizeOptions = [
  { value: 30, label: '30' },
  { value: 50, label: '50' },
  { value: 100, label: '100' },
  { value: 200, label: '200' },
  { value: 300, label: '300' }
]
const onSizeChange = (v: number) => {
  pageChange(1, v)

  emit('size-change', { page: currentPage.value, pageSize: v })
}

// 分頁
const currentPage = ref(props.page)
const onPageChange = (v: number) => {
  const tempPageSize = pageSize.value
  pageChange(v, tempPageSize)
}

const elTableRef = ref<InstanceType<typeof ElTableType>>()
const resetScroll = (): void => {
  elTableRef.value?.setScrollTop(0)
}

const pageChange: PageChange = (page, pageSize) => {
  currentPage.value = page

  emit('page-change', { page, pageSize })
  onShowChange({
    page,
    pageSize,
    sort: currentSort.value
  })

  resetScroll()
}

const onRowClick = (row: any, column: any, event: Event) => {
  emit('row-click', row, column, event)
}

const currentSort = ref<Sort>({
  key: null,
  order: null
})
const onSortChange = (props: {
  column: any,
  prop: string,
  order: null | 'ascending' | 'descending'
}) => {
  const { prop: key = '', order } = props

  if (order) {
    currentSort.value = { key, order }
  } else {
    currentSort.value = { key: null, order: null}
  }
  emit('sort-change', { key, order })

  onShowChange({
    page: currentPage.value,
    pageSize: pageSize.value,
    sort: currentSort.value
  })
}
const onHeaderClick = (column: any, event: Event) => {
  emit('header-click', column, event)
}

/**
 * 更換設定
 * 顯示筆數
 * 頁碼
 * 排序
 */
const onShowChange = (props: { page: number, pageSize: number, sort: Sort}) => {
  const { page, pageSize, sort } = props

  emit('show-change', {
    page,
    pageSize,
    sort: JSON.parse(JSON.stringify(sort))
  })
}
// 顯示資料
const showData = computed(() => {
  if (props.showType === 'custom') {
    return props.tableData
  } else {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value

    return (props.tableData as Array<any>).slice(start, end)
  }
})

const columnSetting = ref(null)
const showColumns = reactive([...props.tableColumns])

const initShowColumns = async () => {
  loading.value = true

  if (columnSetting.value) {
    await columnSetting.value.checkColumnSetting()

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
    emit('columns-change', showColumns)
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

defineExpose({
  pageChange
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
          :label="i18nTranslate('columnSetting')"
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
            :label="`${i18nTranslate('showCount')} : `"
            v-model="pageSize"
            :options="sizeOptions"
            direction="row"
            @change="onSizeChange"
          />
        </div>
      </div>
    </div>

    <div ref="tableMain" class="table-container">
      <ElTable
        v-if="isRender"
        ref="elTableRef"
        stripe
        style="width: 100%"
        :key="renderKey"
        :data="showData"
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
      >
        <ElTableColumn
          v-for="column in showColumns"
          :key="column.prop"
          v-bind="column"
        >
          <template v-if="hasSlot(`header-${column.slotKey}`)" #header="scope">
            <div :class="column.sortable ? 'header-slot' : ''">
              <slot
                :name="`header-${column.prop}`"
                :label="column.label"
                :row-index="scope.$index"
                :column="column"
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
              ></slot>
            </div>
          </template>

          <template v-if="hasSlot(`column-${column.slotKey}`)" #default="scope">
            <slot
              :name="`column-${column.prop}`"
              :data="scope.row[column.key]"
              :row="scope.row"
              :row-index="scope.$index"
              :column="column"
            ></slot>
          </template>
          <template v-else-if="hasSlot('column-all')" #default="scope">
            <slot
              name="column-all"
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
        :total="props.tableDataCount"
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

    .header-slot {
      width: fit-content;
      max-width: calc(100% - 24px);
      display: inline-block;
    }
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