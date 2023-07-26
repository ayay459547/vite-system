<script setup lang="ts">
import {
  useSlots,
  ref,
  reactive,
  computed,
  onMounted,
  onUnmounted
} from 'vue'

import { ElPagination } from 'element-plus'

import type { ResizeObserverCallback } from '@/lib/lib_throttle'
import throttle from '@/lib/lib_throttle'

import { tipLog } from '@/lib/lib_utils'

import type { TableColumnsItem } from '@/lib/lib_columns'
import type { ColumnItem } from '@/declare/columnSetting'

import { CustomButton, CustomPopover, CustomSelect, CustomIcon } from '@/components'

import ColumnSetting from './ColumnSetting.vue'
import TableMain from './TableMain.vue'

export interface PropsTableColumn extends Record<string, any>, TableColumnsItem {}
export interface PageChange {
  (page: number, pageSize: number): void
}

export interface Sort {
  key: null | string
  order: null | 'ascending' | 'descending'
}
export interface TableParams {
  page: number
  size: number
  sort: Sort
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
  'show-change',
  'expand-change'
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

const elTableRef = ref(null)
const pageChange: PageChange = (page, pageSize) => {
  currentPage.value = page

  emit('page-change', { page, pageSize })
  onShowChange({
    page,
    pageSize,
    sort: currentSort.value
  })

  if (elTableRef.value) {
    elTableRef.value.resetScroll()
  }
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
const onExpandChange = (row: any, expanded: boolean) => {
  emit('expand-change', row, expanded)
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
    const end = start + pageSize.value

    return (props.tableData as Array<any>).slice(start, end)
  }
})

const columnSetting = ref(null)
const showColumns = reactive([...props.tableColumns])

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
          resColumn.push(showColumn)
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
  pageChange,
  getTableParams: () => {
    return {
      page: currentPage.value,
      size: pageSize.value,
      sort: currentSort.value
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
    if (column.columns.length > 0) {
      return [
        ...column.columns.map(child => `${column.slotKey}-${child.slotKey}`),
        column.slotKey
      ]
    }
    return column.slotKey
  })
})

onMounted(() => {
  console.log(slotKeyList.value)
})

</script>

<template>
  <div v-i-loading="loading" class="table-wrapper">
    <div class="table-setting grid-row">
      <div class="setting-left grid-col-xs-24 grid-col-lg-8">
        <CustomPopover
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
          <CustomSelect
            v-model="pageSize"
            label="顯示筆數 : "
            :options="sizeOptions"
            direction="row"
            @change="onSizeChange"
          />
        </div>
      </div>
    </div>

    <div ref="tableMain" class="table-container">
      <TableMain
        v-if="isRender"
        ref="elTableRef"
        :render-key="renderKey"
        :show-data="showData"
        :show-columns="showColumns"
        :sort="props.sort"
        :row-key="props.rowKey"
        :default-expand-all="props.defaultExpandAll"
        @row-click="onRowClick"
        @sort-change="onSortChange"
        @header-click="onHeaderClick"
        @expand-change="onExpandChange"
      >
        <template v-if="hasSlot('column-expand')" #column-expand="scope">
          <slot v-bind="scope"></slot>
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
    background-color: #f5f7fa;
    overflow: hidden;
    overflow-x: scroll;
    width: 100%;
    padding: 0 8px;

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