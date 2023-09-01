<script setup lang="ts">
import {
  useSlots,
  ref,
  shallowRef,
  shallowReactive,
  computed,
  onMounted
} from 'vue'

import type { TableColumnCtx } from 'element-plus'
import { ElPagination } from 'element-plus'

import { tipLog, isEmpty } from '@/lib/lib_utils'

import type { TableColumnsItem } from '@/lib/lib_columns'
import type { ColumnItem } from '@/declare/columnSetting'

import { CustomButton, CustomPopover, CustomSelect, CustomIcon } from '@/components'

import ColumnSetting from './ColumnSetting.vue'
import TableMain from './TableMain.vue'

export interface PropsTableColumn extends Record<string, any>, TableColumnsItem {}
export interface PageChange {
  (page: number, pageSize: number, ...payload: any[]): void
}

export interface Sort {
  key: null | string
  order: null | 'ascending' | 'descending'
}
export interface TableParams {
  page?: number
  size?: number
  sort?: Sort
}

export type SpanMethod = (
  (data: {
    row: any,
    column: TableColumnCtx<any>,
    rowIndex: number,
    columnIndex: number
  }, ...payload: any[]) => number[] | { rowspan: number, colspan: number } | void
) | null

type RowCallback<T> = (
  (data: {
    row: any,
    rowIndex: number
  }, ...payload: any[]) => T
) | null
export type RowClassName = RowCallback<string>
export type RowStyle = RowCallback<Record<string, any>>

type CellCallback<T> = (
  (data: {
    row: any,
    column: TableColumnCtx<any>,
    rowIndex: number,
    columnIndex: number
  }, ...payload: any[]) => T
) | null
export type CellClassName = CellCallback<string>
export type CellStyle = CellCallback<Record<string, any>>
export type LazyLoadingStatus = 'loadMore' | 'loading' | 'noMore'

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
   * settingWidth: 寬度
   */
  version: string
  settingKey: string
  settingWidth?: number
  /**
   * 表單資料相關
   * tableColumns: 表單欄位顯示用設定
   * tableData: 表單資料
   * rowKey: 每行資料的key 預設是id
   * defaultExpandAll: 資料存在 children 時 預設是否展開
   * spanMethod: 資料跨欄
   */
  tableColumns: PropsTableColumn[]
  tableData: any[]
  tableDataCount?: number
  rowKey?: string
  defaultExpandAll?: boolean
  spanMethod?: SpanMethod
  rowClassName?: RowClassName
  rowStyle?: RowStyle
  cellClassName?: CellClassName
  cellStyle?: CellStyle

  showNo?: boolean
  /**
   * 表單顯示相關
   * page 當前分頁
   * pageSize 顯示筆數
   * tableDataCount 資料總筆數 計算頁數用
   * showType:
   *    custom 依據api切資料
   *    auto 依據 page 和 pageSize 切資料
   */
  page?: number
  pageSize?: number
  sort?: Sort
  showType?: 'custom' | 'auto'
  hiddenExcel?: boolean
  /**
   * 資料懶加載
   * lazyLoading: 是否啟用
   * lazyLoadingStatus: 狀態
   */
  lazyLoading?: boolean
  lazyLoadingStatus?: LazyLoadingStatus
}

const props: Props = withDefaults(defineProps<Props>(), {
  title: '',
  version: '',
  settingKey: '',
  settingWidth: 250,
  tableColumns: () => [],
  tableData: () => [],
  tableDataCount: 0,
  rowKey: 'id',
  defaultExpandAll: false,
  spanMethod: null,
  rowClassName: null,
  showNo: false,
  page: 1,
  pageSize: 100,
  sort: () => {
    return { key: null, order: null }
  },
  showType: 'custom',
  hiddenExcel: false,
  lazyLoading: false,
  lazyLoadingStatus: 'noMore'
})

const emit = defineEmits([
  'header-click',
  'row-click',
  'excel',
  'columns-change',
  'sort-change',
  'page-change',
  'size-change',
  'show-change',
  'expand-change',
  'header-dragend',
  'load'
])

const loading = ref(true)
const renderKey = ref(1)
const isRender = ref(false)

// 點擊 excel
const excelIsShow = ref(false)
const excel = (type: 'all' | 'page') => {
  emit('excel', {
    type,
    tableColumns: props.tableColumns,
    tableData: props.tableData
   })
   excelIsShow.value = false
}

// 每頁顯示筆數
const pageSize = ref<number>(props.pageSize)

const sizeOptions = [
  { value: 30, label: '30' },
  { value: 50, label: '50' },
  { value: 100, label: '100' },
  { value: 300, label: '300' },
  { value: 500, label: '500' }
]
const lazyLoadSizeOptions = [
  { value: 100, label: '100' },
  { value: 500, label: '500' },
  { value: 1000, label: '1000' },
  { value: 5000, label: '5000' },
  { value: -1, label: '全部' }
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

const tableMainRef = ref(null)
const pageChange: PageChange = (page, pageSize) => {
  currentPage.value = page

  emit('page-change', { page, pageSize })
  onShowChange({
    page,
    pageSize,
    sort: currentSort.value
  })

  if (tableMainRef.value) {
    tableMainRef.value.resetScroll()
  }
}

const onRowClick = (row: any, column: any, event: Event) => {
  emit('row-click', row, column, event)
}

const currentSort = shallowRef<Sort>({
  key: null,
  order: null
})
const onSortChange = (props: {
  column: any,
  key: string,
  order: null | 'ascending' | 'descending'
}) => {
  const { key = '', order } = props

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
const onExpandChange = (row: any, expanded: boolean) => {
  emit('expand-change', row, expanded)
}
const onHeaderDragend = (newWidth: number, oddWidth: number, column: any, event: Event) => {
  if (columnSetting.value) {
    const props = column?.rawColumnKey ?? column?.property
    columnSetting.value.setColumnWidth(props, newWidth)
  }
  emit('header-dragend', newWidth, oddWidth, column, event)
}
const onLoad = () => {
  emit('load', {
    page: ++currentPage.value,
    size: pageSize.value,
    sort: currentSort.value
  })
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
    size: pageSize,
    sort: JSON.parse(JSON.stringify(sort))
  })
}
// 顯示資料
const showData = computed(() => {
  if (props.showType === 'custom') {
    return props.tableData
  } else {
    const start = (currentPage.value - 1) * pageSize.value
    const end = pageSize.value

    return (props.tableData as Array<any>).slice(start, end)
  }
})

const columnSetting = ref(null)
const showColumns = shallowReactive([...props.tableColumns])

const checkTableColumns = (tempColumnList: ColumnItem[]) => {
  const originColumnsKey = tempColumnList.map(item => item.key)
  const settingColumnsKey = props.tableColumns.map(item => item.key)

  if (originColumnsKey.length !== settingColumnsKey.length) {
    tipLog('欄位數量不同', [
      `table => ${props.title}`,
      `原始欄位列表 => ${tempColumnList.map(item => item?.label ?? '').join(' , ')}`,
      `設定欄位列表 => ${props.tableColumns.map(item => item?.label ?? '').join(' , ')}`,
      '如果欄位有要新增 請變更 version'
    ])
  }

  if (settingColumnsKey.some((itemKey, itemIndex) => itemKey !== originColumnsKey[itemIndex])) {
    tipLog('欄位異動', [
      `table => ${props.title}`,
      `原始欄位列表 => ${originColumnsKey}`,
      `設定欄位列表 => ${settingColumnsKey}`,
      '如果欄位有要異動 請變更 version'
    ])
  }
}

const initShowColumns = async () => {
  loading.value = true

  if (columnSetting.value) {
    await columnSetting.value.checkColumnSetting()

    const tempColumnList = await columnSetting.value.getcolumnList() as ColumnItem[]

    // 確認欄位 如果有變更 給予提示
    checkTableColumns(tempColumnList)

    const resColumns = tempColumnList.reduce((resColumn, tempColumn) => {
      if (tempColumn.isShow) {
        const showColumn = props.tableColumns.find(column => {
          return tempColumn.key === column.key
        })

        if (showColumn) {
          resColumn.push({
            ...showColumn,
            ...tempColumn
          })
        }
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

defineExpose({
  pageChange,
  getTableParams: () => {
    return {
      page: currentPage.value,
      size: pageSize.value,
      sort: currentSort.value
    }
  },
  setTableParams: (params: {
    page?: number
    size?: number
    sort?: Sort
  }) => {
    const {
      page,
      size,
      sort
    } = params

    if (!isEmpty(page) && (typeof page === 'number')) {
      currentPage.value = page
    }
    if (!isEmpty(size)) {
      const _index = ((lazyLoading) => {
        if (lazyLoading) {
          return lazyLoadSizeOptions.findIndex(option => {
            option.value === size
          })
        } else {
          return sizeOptions.findIndex(option => {
            option.value === size
          })
        }
      })(props.lazyLoading)

      if (_index >= 0) {
        pageSize.value = size
      }
    }
    if (!isEmpty(sort)) {
      currentSort.value = sort
    }
  }
})

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}

const getSlot = (slotKey: string, type: ('header' | 'column')): string => {
  switch (type) {
    case 'header':
      if (hasSlot(`header-${slotKey}`)) return `header-${slotKey}`
      if (hasSlot('header-all')) return 'header-all'
      break
    case 'column':
      if (hasSlot(`column-${slotKey}`)) return `column-${slotKey}`
      if (hasSlot('column-all')) return 'column-all'
      break
  }
  return 'null'
}
const getHeaderSlot = (slotKey: string): string => {
  return getSlot(slotKey, 'header')
}
const getColumnSlot = (slotKey: string): string => {
  return getSlot(slotKey, 'column')
}

const slotKeyList = computed(() => {
  return showColumns.flatMap(column => {
    if (column.columns && column.columns.length > 0) {
      return [
        ...column.columns.map(child => `${column.slotKey}-${child.slotKey}`),
        column.slotKey
      ]
    }
    return column.slotKey
  })
})

</script>

<template>
  <div v-i-loading="loading" class="table-wrapper">
    <div class="table-setting grid-row">
      <div class="setting-left grid-col-xs-24 grid-col-lg-24 grid-col-xl-9">
        <CustomPopover
          v-if="!props.hiddenExcel"
          v-model:visible="excelIsShow"
          placement="bottom"
          :width="150"
          trigger="click"
          popper-style="padding: 4px;"
        >
          <template #reference>
            <CustomButton
              icon-name="file-excel"
              label="Excel"
              class="i-mr-xs"
            />
          </template>

          <div class="excel-list">
            <div class="excel-item" @click="excel('all')">
              <CustomIcon name="table-list" class="icon"/>
              <div class="text">全部資料</div>
            </div>
            <div class="excel-item" @click="excel('page')">
              <CustomIcon type="far" name="file-lines" class="icon"/>
              <div class="text">當前頁面資料</div>
            </div>
          </div>
        </CustomPopover>

        <ColumnSetting
          ref="columnSetting"
          :columns="props.tableColumns"
          :version="props.version"
          :setting-key="props.settingKey"
          :setting-width="props.settingWidth"
          @change="initShowColumns"
        />
        <slot name="setting-left"></slot>
      </div>

      <div class="setting-center grid-col-xs-24 grid-col-md-12 grid-col-xl-6">
        <slot name="setting-center">
          <span class="setting-center-title">{{ props.title }}</span>
        </slot>
      </div>

      <div class="setting-right grid-col-xs-24 grid-col-md-12 grid-col-xl-9">
        <slot name="setting-right"></slot>
        <div class="i-ml-xs" style="width: 160px; overflow: hidden;">
          <CustomSelect
            v-if="!props.lazyLoading"
            v-model="pageSize"
            label="顯示筆數"
            :options="sizeOptions"
            direction="row"
            @change="onSizeChange"
          />
          <CustomSelect
            v-if="props.lazyLoading"
            v-model="pageSize"
            label="載入筆數"
            :options="lazyLoadSizeOptions"
            direction="row"
            @change="onSizeChange"
          />
        </div>
      </div>
    </div>

    <div class="table-container">
      <TableMain
        v-if="isRender"
        ref="tableMainRef"
        :show-no="props.showNo"
        :render-key="renderKey"
        :show-data="showData"
        :table-data-count="tableDataCount"
        :show-columns="showColumns"
        :sort="props.sort"
        :row-key="props.rowKey"
        :default-expand-all="props.defaultExpandAll"
        :span-method="props.spanMethod"
        :row-class-name="props.rowClassName"
        :row-style="props.rowStyle"
        :cell-class-name="props.cellClassName"
        :cell-style="props.cellStyle"
        :lazy-loading="lazyLoading"
        :lazy-loading-status="props.lazyLoadingStatus"
        @row-click="onRowClick"
        @sort-change="onSortChange"
        @header-click="onHeaderClick"
        @expand-change="onExpandChange"
        @header-dragend="onHeaderDragend"
        @load="onLoad"
      >
        <template v-if="hasSlot('empty')" #empty>
          <slot name="empty"></slot>
        </template>

        <template v-if="hasSlot('column-expand')" #column-expand="scope">
          <slot name="column-expand" v-bind="scope"></slot>
        </template>

        <template
          v-for="slotKey in slotKeyList"
          :key="slotKey"
          #[getHeaderSlot(slotKey)]="scope"
        >
          <slot :name="getHeaderSlot(slotKey)" v-bind="scope"></slot>
        </template>

        <template
          v-for="slotKey in slotKeyList"
          :key="slotKey"
          #[getColumnSlot(slotKey)]="scope"
        >
          <slot :name="getColumnSlot(slotKey)" v-bind="scope"></slot>
        </template>
      </TableMain>
    </div>

    <div class="table-pagination">
      <div class="table-pagination-left"></div>
      <div class="table-pagination-center">
        <ElPagination
          v-if="!props.lazyLoading"
          background
          layout="prev, pager, next"
          :total="props.tableDataCount"
          :page-size="pageSize"
          :current-page="currentPage"
          @update:current-page="onPageChange"
        />
      </div>
      <div class="table-pagination-right">
        <span>{{ `${!props.lazyLoading ? '總筆數' : '資料筆數'}：${props.tableDataCount}` }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table {
  &-wrapper {
    width: 100%;
    height: 100%;
    border: 1px solid #ebeef5;
    border-radius: 6px;
    display: flex;
    flex-direction: column;

    .header-slot {
      width: calc(100% - 24px);
      padding-right: 8px;;
      display: inline-block;
    }
  }

  &-setting {
    height: fit-content;
    background-color: lighten($system-bg-color, 55%);
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
        font-weight: 600;

        &-title {
          overflow:hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        @media (max-width: 1200px) {
          justify-content: flex-start;
        }
      }
      &-right {
        justify-content: flex-end;
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
    align-items: center;
    height: fit-content;
    min-height: 40px;
    padding: 6px;
    gap: 6px;

    @media (max-width: 992px) {
      justify-content: center;
      flex-direction: column;
    }

    &-left,
    &-right {
      flex: 1;
      display: flex;
    }
    &-right {
      text-align: right;
      justify-content: flex-end;
    }

    &-center {
      flex: 2;
      display: flex;
      justify-content: center;
    }
  }
}

.excel {
  &-list {
    display: flex;
    flex-direction: column;
  }
  &-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 8px;
    background-color: #fff;
    transition-duration: 0.3s;
    cursor: pointer;
    .icon {
      width: 22px;
      text-align: center;
    }
    .text {
      height: 40px;
      line-height: 40px;
    }
    &:hover {
      background-color: #f5f7fa;
    }
  }
}
</style>