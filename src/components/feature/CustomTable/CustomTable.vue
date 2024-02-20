<script setup lang="ts">
import { useSlots, ref, shallowRef, shallowReactive, computed, onMounted } from 'vue'
import { ElPagination } from 'element-plus'

import type { ColumnItem } from '@/declare/columnSetting'
import { tipLog, isEmpty, getProxyData, getUuid } from '@/lib/lib_utils'
import { CustomButton, CustomPopover, CustomInput, CustomIcon } from '@/components'

// 欄位設定
import ColumnSetting from './Components/ColumnSetting.vue'
// 欄位排序
import ColumnSorting from './Components/ColumnSorting.vue'
// 群組排序
import GroupSorting from './Components/GroupSorting.vue'
import TableMain from './TableMain.vue'

import type {
  Sort,
  PageChange,
  SortingList,
  SortingMap,
  TableParams
} from './CustomTableInfo'
import {
  version,
  props as tableProps
} from './CustomTableInfo'

const scopedId = getUuid('__i-table__')

const props = defineProps(tableProps)

const emit = defineEmits([
  'header-click',
  'row-click',
  'excel',
  'columns-change',
  'sort-change',
  'sorting-change',
  'page-change',
  'size-change',
  'show-change',
  'expand-change',
  'header-dragend',
  'select',
  'select-all',
  'selection-change',
  'load'
])

const loading = ref(true)
const renderKey = ref(1)
const isRender = ref(false)

// 點擊 excel
const excelIsShow = ref(false)
const onExcelClick = (type: 'all' | 'page') => {
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

const resetScroll = () => {
  if (tableMainRef.value) {
    tableMainRef.value.resetScroll()
  }
}
const toggleSelection = (rows: any[]) => {
  if (tableMainRef.value) {
    tableMainRef.value.toggleSelection(rows)
  }
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
  resetScroll()
}

const onRowClick = (row: any, column: any, event: Event) => {
  emit('row-click', row, column, event)
}

// 單欄排序
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
// 多欄排序
const sortingList = ref<SortingList>([])
const emitSortingData = computed<SortingMap>(() => {
  // return sortingList.value.filter(item => item.order !== 'none')

  return sortingList.value.reduce<SortingMap>((res, curr) => {
    const { key, order } = curr
    switch (order) {
      case 'ascending':
        res[key] = 'Asc'
        break
      case 'descending':
        res[key] = 'Desc'
        break
    }

    return res as SortingMap
  }, {})
})

const activeSort = () => {
  sortingList.value.sort((a, b) => {
    if (
      ['ascending', 'descending'].includes(a.order) &&
      b.order === 'none'
    ) {
      return -1
    }
    return 1
  })
}
const initSortingList = () => {
  sortingList.value = props.tableColumns.reduce<SortingList>((res, column) => {
    const _isOperations = (column?.isOperations ?? false)

    if (!_isOperations && (column?.isSorting ?? true)) {
      res.push({
        label: column.label,
        key: column.key,
        order: column?.order ?? 'none'
      })
    }
    return res
  }, [])

  activeSort()
}
const onSortingChange = () => {
  activeSort()
  emit('sorting-change', getProxyData(emitSortingData.value))

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
const onSelect = (selection: any, row: any) => {
  emit('select', selection, row)
}
const onSelectAll = (selection: any) => {
  emit('select-all', selection)
}
const onSelectionChange = (selection: any) => {
  emit('selection-change', selection)
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
    sort: getProxyData(sort),
    sortingList: getProxyData(sortingList.value),
    sortingMap: getProxyData(emitSortingData.value)
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

    const tempColumnList = await (columnSetting.value?.getcolumnList() ?? []) as ColumnItem[]

    // 確認欄位 如果有變更 給予提示
    if (!isEmpty(tempColumnList)) {
      checkTableColumns(tempColumnList)
    }

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

  initSortingList()
  await initShowColumns()

  isRender.value = true
})

defineExpose({
  resetScroll,
  toggleSelection,
  pageChange,
  getTableParams: () => {
    return {
      page: currentPage.value,
      size: pageSize.value,
      sort: getProxyData(currentSort.value),
      sortingList: getProxyData(sortingList.value),
      sortingMap: getProxyData(emitSortingData.value)
    }
  },
  setTableParams: (params: {
    [P in keyof TableParams]?: TableParams[P]
  }) => {
    const {
      page,
      size,
      sort,
      sortingList: _sortingList
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
    if (!isEmpty(_sortingList)) {
      sortingList.value = _sortingList
    }
  }
})

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}

/**
 * slot 優先順序
 * 1. header-{ slotKey }
 * 2. header-all
 *
 * 1. column-{ slotKey }
 * 2. column-all
 */
const getSlot = (slotKey: string, type: ('header' | 'column')): string => {
  switch (type) {
    case 'header':
      if (hasSlot(`header-${slotKey}`)) return `header-${slotKey}`
      if (hasSlot('header-all') || props.isSorting) return 'header-all'
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
        ...column.columns.map((child: any) => `${column.slotKey}-${child.slotKey}`),
        column.slotKey
      ]
    }
    return column.slotKey
  })
})

// 欄位設定高度不超過 table 本身
type TableSizeSetting = {
  width: number
  height: number
}
const tableWidth = ref(500)
const tableHeight = ref(500)
const onUpdateSize = (newSize: TableSizeSetting) => {
  const { width, height } = newSize
  tableWidth.value = width
  tableHeight.value = height
}

const _prependIsOpen = ref(false)
const prependIsOpen = computed<boolean>({
  get () {
    return _prependIsOpen.value
  },
  set (value) {
    localStorage.setItem('prependIsOpen', `${value}`)
    _prependIsOpen.value = value
  }
})
onMounted(() => {
  const _prependIsOpen = localStorage.getItem('prependIsOpen')
  if (isEmpty(_prependIsOpen)) {
    localStorage.setItem('prependIsOpen', 'true')
    prependIsOpen.value = true
  } else {
    prependIsOpen.value = _prependIsOpen === 'true'
  }
})

</script>

<template>
  <div
    v-loading="loading"
    class="__table-wrapper"
    :class="`CustomTable_${version} ${scopedId}`"
  >
    <template v-if="hasSlot('prepend')">
      <div class="__table-prepend">
        <Transition name="fixed">
          <div v-show="prependIsOpen" class="__table-prepend-content">
            <slot name="prepend"></slot>
          </div>
        </Transition>

        <CustomButton
          :icon-name="prependIsOpen ? 'xmark' : 'angles-down'"
          type="primary"
          class="__table-prepend-btn"
          :class="{
            'is-open': prependIsOpen,
            'is-close': !prependIsOpen,
          }"
          circle
          plain
          @click="prependIsOpen = !prependIsOpen"
        />
      </div>
    </template>

    <div class="__table-setting grid-row">
      <div class="setting-left grid-col-xs-24 grid-col-lg-24 grid-col-xl-9">
        <CustomPopover
          v-if="!props.isHiddenExcel"
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
            />
          </template>

          <div class="__excel-list">
            <div class="__excel-item" @click="onExcelClick('all')">
              <CustomIcon name="table-list" class="icon"/>
              <div class="text">{{ $t('allData') }}</div>
            </div>
            <div class="__excel-item" @click="onExcelClick('page')">
              <CustomIcon type="far" name="file-lines" class="icon"/>
              <div class="text">{{ $t('pageData') }}</div>
            </div>
          </div>
        </CustomPopover>

        <ColumnSetting
          ref="columnSetting"
          :columns="props.tableColumns"
          :version="props.version"
          :setting-key="props.settingKey"
          :setting-width="props.settingWidth"
          :setting-height="`${tableHeight - 40}px`"
          @change="initShowColumns"
        />
        <slot name="setting-left"></slot>
      </div>

      <div class="setting-center grid-col-xs-24 grid-col-md-12 grid-col-xl-6">
        <slot name="setting-center">
          <span class="setting-center-title">{{ $t(props.title) }}</span>
        </slot>
      </div>

      <div class="setting-right grid-col-xs-24 grid-col-md-12 grid-col-xl-9">
        <slot name="setting-right"></slot>

        <div v-if="props.lazyLoading">
          <label>{{ `${$t('dataCount')}：${props.tableDataCount}` }}</label>
        </div>

        <div class="i-ml-xs" style="width: 160px; overflow: hidden;">
          <CustomInput
            v-if="!props.lazyLoading"
            v-model="pageSize"
            validate-key="CustomTable:pageSize"
            type="select"
            :label="$t('showCount')"
            :options="sizeOptions"
            direction="row"
            @change="onSizeChange"
          />
          <CustomInput
            v-if="props.lazyLoading"
            v-model="pageSize"
            validate-key="CustomTable:pageSize"
            type="select"
            :label="$t('loadCount')"
            :options="lazyLoadSizeOptions"
            direction="row"
            @change="onSizeChange"
          />
        </div>

        <GroupSorting
          v-if="props.isSorting"
          v-model="sortingList"
          :setting-width="props.settingWidth"
          :setting-height="`${tableHeight - 40}px`"
          @reset-sorting="initSortingList"
          @submit="onSortingChange"
        />
      </div>
    </div>

    <div class="__table-container">
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
        :table-size="props.tableSize"
        :default-expand-all="props.defaultExpandAll"
        :span-method="props.spanMethod"
        :row-class-name="props.rowClassName"
        :row-style="props.rowStyle"
        :cell-class-name="props.cellClassName"
        :cell-style="props.cellStyle"
        :lazy="props.lazy"
        :load="props.load"
        :tree-props="props.treeProps"
        :selection="props.selection"
        :lazy-loading="lazyLoading"
        :lazy-loading-status="props.lazyLoadingStatus"
        @row-click="onRowClick"
        @sort-change="onSortChange"
        @header-click="onHeaderClick"
        @expand-change="onExpandChange"
        @header-dragend="onHeaderDragend"
        @select="onSelect"
        @select-all="onSelectAll"
        @selection-change="onSelectionChange"
        @load="onLoad"
        @update-size="onUpdateSize"
      >
        <template v-if="hasSlot('empty')" #empty>
          <slot name="empty"></slot>
        </template>

        <template v-if="hasSlot('row-expand')" #row-expand="scope">
          <slot name="row-expand" v-bind="scope"></slot>
        </template>

        <template
          v-for="slotKey in slotKeyList"
          :key="slotKey"
          #[getHeaderSlot(slotKey)]="scope"
        >
          <div class="__table-sorting-column">
            <slot :name="getHeaderSlot(slotKey)" v-bind="scope">
              <label>{{ scope.label }}</label>
            </slot>
          </div>
          <ColumnSorting
            v-if="props.isSorting && (scope.column?.isSorting ?? true)"
            v-model="sortingList"
            :column="scope.column"
            :prop="scope.prop"
            @change="onSortingChange"
          />
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

    <div v-if="!props.lazyLoading" class="__table-pagination">
      <div class="__table-pagination-left"></div>
      <div class="__table-pagination-center">
        <ElPagination
          background
          layout="prev, pager, next"
          :total="props.tableDataCount"
          :page-size="pageSize"
          :current-page="currentPage"
          @update:current-page="onPageChange"
        />
      </div>
      <div class="__table-pagination-right">
        <span>{{ `${$t('total')}：${props.tableDataCount}` }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$border-style: 1px solid #ebeef5;
.__table {
  &-wrapper {
    width: 100%;
    height: 100%;
    border: $border-style;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    position: relative;

    .header-slot {
      width: calc(100% - 24px);
      padding-right: 8px;;
      display: inline-block;
    }
  }

  &-prepend {
    height: fit-content;
    border: $border-style;
    border-radius: 6px 6px 0 0;
    position: relative;
    background-color: lighten($system-bg-color, 33%);

    &-content {
      width: 100%;
      height: 100%;
      padding: 6px;
    }
    &-btn {
      z-index: 1;
      position: absolute;
      top: 0;
      right: 0;
      transition-duration: 0.2s;
      &.is-open {
        transform: translateY(-40%) translateX(40%) rotateZ(180deg);
      }
      &.is-close {
        transform: translateY(-40%) translateX(40%) rotateZ(0deg);
      }
    }
  }

  &-setting {
    height: fit-content;
    background-color: lighten($system-bg-color, 40%);
    overflow: hidden;
    overflow-x: scroll;
    width: 100%;
    padding: 6px;

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
        gap: 8px;
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

  &-sorting-column {
    width: 100%;
    height: 100%;
    margin-top: 4px;
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

.__excel {
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
