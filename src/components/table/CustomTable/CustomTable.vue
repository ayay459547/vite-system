<script setup lang="ts">
import {
  useSlots,
  inject,
  ref,
  shallowRef,
  shallowReactive,
  computed,
  onMounted,
  nextTick
} from 'vue'
import { ElPagination } from 'element-plus'

import type { UseHook } from '@/declare/hook'
import type { ColumnItem } from '@/declare/columnSetting'
import { isEmpty, getProxyData, getUuid, awaitTime } from '@/lib/lib_utils'
import { defaultModuleType } from '@/i18n/i18n_setting'
import { object_findIndex } from '@/lib/lib_object'
import { CustomButton, CustomPopover, CustomInput, CustomIcon, CustomTooltip } from '@/components'

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
  Order,
  TableParams,
  // emit
  RowClick,
  HeaderClick,
  ExpandChange,
  // HeaderDragend,
  Select,
  SelectAll,
  SelectionChange,
  RowContextmenu
} from './CustomTableInfo'
import { version, props as tableProps } from './CustomTableInfo'

const scopedId = getUuid('__i-table__')

const props = defineProps(tableProps)

const useHook: UseHook = inject('useHook')
const { i18nTranslate, message } = useHook({
  i18nModule: props?.i18nModule ?? defaultModuleType
})

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
  'row-contextmenu',
  'load',
  'init-finish'
])

const loading = ref(true)
const renderKey = ref(1)
const isRender = ref(false)
// const isResizing = ref(false)

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
  { value: -1, label: '全部', i18nLabel: 'all' }
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

// 單欄排序
const currentSort = shallowRef<Sort>({
  key: null,
  order: null
})
const onSortChange = (props: {
  column: any
  key: string
  order: null | 'ascending' | 'descending'
}) => {
  const { key = '', order } = props

  if (order) {
    currentSort.value = { key, order }
  } else {
    currentSort.value = { key: null, order: null }
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
    if (['ascending', 'descending'].includes(a.order) && b.order === 'none') {
      return -1
    }
    return 1
  })
}
const initSortingList = async () => {
  sortingList.value = props.tableColumns.reduce<SortingList>((res, column) => {
    const _isOperations = column?.isOperations ?? false

    if (!_isOperations && (column?.isSorting ?? true)) {
      res.push({
        label: column.label,
        i18nLabel: column.i18nLabel,
        key: column.key,
        order: (column?.order ?? 'none') as Order,
        orderIndex: (column?.orderIndex ?? -1) as number
      })
    }
    return res
  }, [])

  activeSort()
  await awaitTime(120)
}

// Header 欄位寬度最適化:調整子元素寬度
// const setElementWidth = (curElement: any) => {
//   const length = curElement.children.length
//   if (length === 0) {
//     // 最底層元素設置為fit-content
//     curElement.classList.add('__table-sorting-column-resizing-child')
//     return curElement.scrollWidth
//   }

//   const childrenList = []
//   // 取得元素內的子元素列表
//   for (let i = 0; i < length; i++) {
//     childrenList.push(curElement.children.item(i))
//   }
//   // 設置每個元素的最適寬度
//   const maxWidth = childrenList.reduce((curMaxWidth, childElement) => {
//     const childeWidth = setElementWidth(childElement)
//     return childeWidth > curMaxWidth ? childeWidth : curMaxWidth
//   }, 0)

//   // 配合子元素寬度設置為min-content
//   curElement.classList.add('__table-sorting-column-resizing-parent')
//   return maxWidth > curElement.scrollWidth ? maxWidth : curElement.scrollWidth
//   // return curElement.scrollWidth
// }

// 基本計算 尚未有子欄位為計算
const setElementWidth = (column: any, trIndex: number): Promise<any> => {
  const headerKey = column?.key // 欄位Key值
  const originWidth = column?.width ?? 100
  // console.log('setElementWidth => ', column)

  return new Promise((resolve, reject) => {
    try {
      let newWidth = originWidth
      // 針對全部行數 取最大寬度
      setTimeout(async () => {
        // headerElements type: NodeList
        const headreElements = document.querySelectorAll(`.${scopedId} tr:nth-child(${trIndex}) th`) // 所有 header column

        // 找出對應的 index
        const resizingIndex = object_findIndex<string>(headreElements, (thElement: Element) => {
          const columnElement = thElement.querySelector('div[resizing-key]')

          if (isEmpty(columnElement)) return false
          return `${headerKey}` === columnElement.getAttribute('resizing-key')
        })

        await nextTick()
        if (!isEmpty(resizingIndex)) {
          const cellIndex = Number.parseInt(resizingIndex) + 1
          const headerColumnElement = document.querySelectorAll(`.${scopedId} tr:nth-child(${trIndex}) th:nth-child(${cellIndex})`)
          const bodyColumnElements = document.querySelectorAll(`.${scopedId} tr td:nth-child(${cellIndex})`)

          const columnElements = [...headerColumnElement, ...bodyColumnElements]
          columnElements.forEach(element => {
            element.classList.add('__is-resizing__') // 添加類別
          })
          await nextTick()

          newWidth = columnElements.reduce((maxWidth: number, curElement: Element) => {
            const cellElements = curElement.querySelector('.cell')
            const curWidth = !isEmpty(cellElements) ? cellElements?.scrollWidth : 0
            const childWidth = 0 // 尚未計算子欄位寬度
            return Math.max(curWidth + 18, childWidth, maxWidth)
          }, 0)

          // columnElements.forEach(element => {
          //   element.classList.remove('__is-resizing__') // 移除類別
          // })
          // await nextTick()
          columnSetting.value?.setColumnWidth(headerKey, newWidth) // 欄位設定套用最適化寬度
        }
        resolve(newWidth)
      }, 0)
    } catch (e) {
      message({
        type: 'error',
        message: e,
        duration: 10000
      })
      reject(originWidth)
    }
  })
}

// Column 欄位寬度最適化
const optimizeColumnWidth = (column: any) => {
  setElementWidth(column, 1).then(() => {
    // 重新渲染欄位
    initShowColumns({ isLoading: true })
  })

  /*
  // 開始計算最適化寬度
  isResizing.value = true
  await nextTick()

  const headerKey = column?.key // 欄位Key值
  const element = document.getElementById('header-' + headerKey) // 由Key取得對應欄位元素
  if (!element) return

  const isSorting = props.isSorting && (column?.isSorting ?? true) // 有無sorting按鍵
  const newWidth = setElementWidth(element) + 24 + (isSorting ? 28 : 0) // 設置元素與其子元素最適寬度

  // 結束計算最適化寬度
  isResizing.value = false
  await nextTick()

  columnSetting.value?.setColumnWidth(headerKey, newWidth) // 欄位設定套用最適化寬度
  await initShowColumns({ isLoading: false }) // 重新渲染欄位, isLoading:false 不使用isLoading
  */
}

// Column All 欄位寬度最適化
const optimizeAllColumnWidth = () => {
  Promise.all(showColumns.map(column => setElementWidth(column, 1))).then(() => {
    // 重新渲染欄位
    initShowColumns({ isLoading: true })
  })

  /*
  // 開始計算最適化寬度
  isResizing.value = true
  await nextTick()

  const isSortingMap = new Map()
  showColumns.forEach(column => {
    isSortingMap.set(column.key, column?.isSorting ?? true)
  })

  slotKeyList.value.forEach(headerKey => {
    const element = document.getElementById('header-' + headerKey) // 由Key取得對應欄位元素
    if (element) {
      const isSorting = props.isSorting && isSortingMap.get(headerKey) // 有無sorting按鍵
      const newWidth = setElementWidth(element) + 24 + (isSorting ? 28 : 0) // 設置元素與其子元素最適寬度
      if (columnSetting.value) {
        columnSetting.value.setColumnWidth(headerKey, newWidth) // 欄位設定套用最適化寬度
      }
    }
  })

  // 結束計算最適化寬度
  isResizing.value = false
  await nextTick()

  // 重新渲染欄位
  await initShowColumns()
  */
}

// Emit
const onRowClick: RowClick = (row, column, event) => {
  emit('row-click', row, column, event)
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
const onHeaderClick: HeaderClick = (column, event) => {
  emit('header-click', column, event)
}
const onExpandChange: ExpandChange = (row, expanded) => {
  emit('expand-change', row, expanded)
}
const onHeaderDragend = (newWidth: number, oddWidth: number, column: any, event: Event) => {
  if (columnSetting.value) {
    const props = column?.rawColumnKey ?? column?.property
    columnSetting.value.setColumnWidth(props, newWidth)
  }
  emit('header-dragend', newWidth, oddWidth, column, event)
}
const onSelect: Select = (selection, row) => {
  emit('select', selection, row)
}
const onSelectAll: SelectAll = (selection: any) => {
  emit('select-all', selection)
}
const onSelectionChange: SelectionChange = (newSelection: any) => {
  emit('selection-change', newSelection)
}
const onRowContextmenu: RowContextmenu = (row, column, event) => {
  emit('row-contextmenu', row, column, event)
}
const onLoad = () => {
  emit('load', {
    page: ++currentPage.value,
    size: pageSize.value,
    sort: currentSort.value,
    sortingList: getProxyData(sortingList.value),
    sortingMap: getProxyData(emitSortingData.value)
  })
}

/**
 * 更換設定
 * 顯示筆數
 * 頁碼
 * 排序
 */
const onShowChange = (props: { page: number; pageSize: number; sort: Sort }) => {
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

// 初始化顯示欄位
const initShowColumns = async (setting?: any) => {
  const {
    //預設的Setting各項參數
    isLoading = true
    // scrollElement = null,
    // columnKey = null
  } = setting ?? {} //param沒有傳入則用空物件替代

  loading.value = isLoading //是否使用Loading, 不輸入函數則預設為使用

  if (columnSetting.value) {
    // 確認欄位設定
    await columnSetting.value.checkColumnSetting()

    const tempColumnList = (await (columnSetting.value?.getColumnList() ?? [])) as ColumnItem[]
    columnSetting.value?.setColumnList(tempColumnList)

    const resColumns = tempColumnList.reduce((resColumn, tempColumn) => {
      if (tempColumn.isShow) {
        const showColumn = props.tableColumns.find(column => {
          return tempColumn.key === column.key
        })

        if (showColumn) {
          resColumn.push({...showColumn, ...tempColumn})
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
  // 初始化排序
  await initSortingList()
  // 第一次依照欄位設定排序
  sortingList.value.sort((a, b) => {
    if (
      ['ascending', 'descending'].includes(a.order) &&
      ['ascending', 'descending'].includes(b.order)
    ) {
      return (a?.orderIndex ?? -1) - (b?.orderIndex ?? -1)
    }
    return 0
  })

  await initShowColumns()
  await nextTick()

  setTimeout(() => {
    isRender.value = true
    emit('init-finish')
  }, 120)
})

const tableMainRef = ref(null)
const resetScroll = () => {
  tableMainRef.value?.resetScroll()
}
const toggleSelection = (rows: any[]) => {
  tableMainRef.value?.toggleSelection(rows)
}
const getSelectionRows = () => {
  const selectionRows = tableMainRef.value?.getSelectionRows() ?? []
  return getProxyData(selectionRows)
}

defineExpose({
  resetScroll,
  toggleSelection,
  getSelectionRows,
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
    const { page, size, sort, sortingList: _sortingList } = params

    if (!isEmpty(page) && typeof page === 'number') {
      currentPage.value = page
    }
    if (!isEmpty(size)) {
      const _index = ((isLazyLoading: boolean) => {
        if (isLazyLoading) {
          return lazyLoadSizeOptions.findIndex(option => {
            option.value === size
          })
        } else {
          return sizeOptions.findIndex(option => {
            option.value === size
          })
        }
      })(props.isLazyLoading)

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
const getSlot = (slotKey: string, type: 'header' | 'column'): string => {
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

const slotKeyList = computed<string[]>(() => {
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

const _isPrependOpen = ref(false)
const isPrependOpen = computed<boolean>({
  get() {
    return _isPrependOpen.value
  },
  set(value) {
    localStorage.setItem('isPrependOpen', `${value}`)
    _isPrependOpen.value = value
  }
})
onMounted(() => {
  const _isPrependOpen = localStorage.getItem('isPrependOpen')
  if (isEmpty(_isPrependOpen)) {
    localStorage.setItem('isPrependOpen', 'true')
    isPrependOpen.value = true
  } else {
    isPrependOpen.value = _isPrependOpen === 'true'
  }
})
</script>

<template>
  <div v-loading="loading" class="__table-wrapper" :class="`CustomTable_${version} ${scopedId}`">
    <template v-if="hasSlot('prepend')">
      <div class="__table-prepend">
        <Transition name="fixed">
          <div v-show="isPrependOpen" class="__table-prepend-content">
            <slot name="prepend"></slot>
          </div>
        </Transition>

        <CustomButton
          :icon-name="isPrependOpen ? 'xmark' : 'angles-down'"
          type="primary"
          class="__table-prepend-btn"
          :class="{
            'is-open': isPrependOpen,
            'is-close': !isPrependOpen
          }"
          circle
          plain
          @click="isPrependOpen = !isPrependOpen"
        />
      </div>
    </template>

    <div class="__table-setting">
      <div class="setting-left">
        <!-- 顯示更多 -->
        <template v-if="props.isLazyLoading">
          <div style="width: 120px; overflow: hidden">
            <CustomTooltip placement="top" :show-after="300">
              <template #content>
                <div>{{ i18nTranslate('load-count', defaultModuleType) }}</div>
              </template>
              <CustomInput
                v-model="pageSize"
                validate-key="CustomTable:pageSize"
                :i18n-module="defaultModuleType"
                type="select"
                :options="lazyLoadSizeOptions"
                hidden-label
                @change="onSizeChange"
              />
            </CustomTooltip>
          </div>
          <div>
            <label>
              {{ `${i18nTranslate('data-count', defaultModuleType)}：${props.tableDataCount}` }}
            </label>
          </div>
        </template>
        <!-- 分頁 -->
        <template v-else>
          <div style="width: 120px; overflow: hidden">
            <CustomTooltip placement="top" :show-after="300">
              <template #content>
                <div>{{ i18nTranslate('show-count', defaultModuleType) }}</div>
              </template>
              <CustomInput
                v-model="pageSize"
                validate-key="CustomTable:pageSize"
                type="select"
                :options="sizeOptions"
                hidden-label
                @change="onSizeChange"
              />
            </CustomTooltip>
          </div>
        </template>

        <!-- Excel -->
        <CustomPopover
          v-if="!props.isHiddenExcel"
          v-model:visible="excelIsShow"
          placement="bottom"
          :width="150"
          trigger="click"
          popper-style="padding: 4px;"
        >
          <template #reference>
            <CustomButton icon-name="file-excel" label="Excel" />
          </template>
          <div class="__excel-list">
            <div class="__excel-item" @click="onExcelClick('all')">
              <CustomIcon name="table-list" class="icon" />
              <div class="text">{{ i18nTranslate('all-data', defaultModuleType) }}</div>
            </div>
            <div class="__excel-item" @click="onExcelClick('page')">
              <CustomIcon type="far" name="file-lines" class="icon" />
              <div class="text">{{ i18nTranslate('page-data', defaultModuleType) }}</div>
            </div>
          </div>
        </CustomPopover>
        <slot name="setting-left"></slot>
      </div>

      <div class="setting-center">
        <slot name="setting-center">
          <span class="setting-center-title">
            <slot name="title">
              {{ i18nTranslate(props?.i18nTitle ?? props.title) }}
            </slot>
          </span>
        </slot>
      </div>

      <div class="setting-right">
        <slot name="setting-right"></slot>
        <ColumnSetting
          v-show="!props.isHiddenColumnSetting"
          ref="columnSetting"
          :columns="props.tableColumns"
          :i18n-module="props.i18nModule"
          :version="props.version"
          :setting-key="props.settingKey"
          :setting-width="props.settingWidth"
          :setting-height="`${tableHeight - 40}px`"
          @change="initShowColumns"
          @resize="optimizeAllColumnWidth"
        />

        <GroupSorting
          v-if="props.isSorting"
          v-model="sortingList"
          :i18n-module="props.i18nModule"
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
        :is-show-no="props.isShowNo"
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
        :is-lazy-loading="isLazyLoading"
        :lazy-loading-status="props.lazyLoadingStatus"
        @row-click="onRowClick"
        @sort-change="onSortChange"
        @header-click="onHeaderClick"
        @expand-change="onExpandChange"
        @header-dragend="onHeaderDragend"
        @select="onSelect"
        @select-all="onSelectAll"
        @selection-change="onSelectionChange"
        @row-contextmenu="onRowContextmenu"
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
          :key="`header-slotKey-${slotKey}-${scopedId}`"
          #[getHeaderSlot(slotKey)]="scope"
        >
          <div
            :id="`header-${scope.column.key}`"
            class="__table-sorting-column"
            :class="[
              `__header-${scope.column.key}`,
              {
                'has-sorting': props.isSorting && (scope.column?.isSorting ?? true)
                // resize: isResizing
              }
            ]"
            :resizing-key="scope.column.key"
          >
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

          <!-- resizer: 調整寬度用不佔位元素 -->
          <div
            class="__table-sorting-column-resizer"
            @dblclick="optimizeColumnWidth(scope.column)"
          ></div>
        </template>

        <template
          v-for="slotKey in slotKeyList"
          :key="`column-slotKey-${slotKey}-${scopedId}`"
          #[getColumnSlot(slotKey)]="scope"
        >
          <slot :name="getColumnSlot(slotKey)" v-bind="scope"></slot>
        </template>
      </TableMain>
    </div>

    <div v-if="!props.isLazyLoading" class="__table-pagination">
      <div class="__table-pagination-left"></div>
      <div class="__table-pagination-center">
        <ElPagination
          v-show="props.tableDataCount > 0"
          background
          layout="prev, pager, next"
          :total="props.tableDataCount"
          :page-size="pageSize"
          :current-page="currentPage"
          @update:current-page="onPageChange"
        />
      </div>
      <div class="__table-pagination-right">
        <span>{{
          `${i18nTranslate('totalAmount', defaultModuleType)}：${props.tableDataCount}`
        }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$border-style: 1px solid var(--i-color-table-border);

.__table {
  &-wrapper {
    width: 100%;
    height: 100%;
    border: $border-style {
      radius: 6px;
    }
    display: flex;
    flex-direction: column;
    position: relative;

    .header-slot {
      width: calc(100% - 24px);
      padding-right: 8px;
      display: inline-block;
    }
  }

  &-prepend {
    height: fit-content;
    position: relative;
    background-color: var(--i-color-table-prepend);
    border: {
      bottom: $border-style;
      radius: 6px 6px 0 0;
    }

    &-content {
      width: 100%;
      height: 100%;
      padding: 6px;
      overflow: auto;
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
    width: 100%;
    height: fit-content;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--i-color-table-setting);
    padding: 6px;
    overflow: hidden {
      x: scroll;
    }

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
        background-color: var(--el-color-info-light-7);
      }
    }

    .setting {
      &-left,
      &-center,
      &-right {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        width: fit-content;
        gap: 8px;
      }

      &-left {
        justify-content: flex-start;
      }
      &-center {
        justify-content: center;
        font-weight: 600;

        &-title {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        @media (max-width: 1200px) {
          overflow: hidden;
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

    &.has-sorting {
      width: calc(100% - 28px);
    }

    &.resize {
      width: 1px; // 先最小化以取得scrollWidth
      white-space: nowrap; // 強制不換行以取得scrollWidth
    }

    &-resizer {
      // 定位在欄位右側的不佔位Resizer
      width: 7px;
      height: calc(100%);
      right: 0px;
      transform: translateX(2px);
      position: absolute;
      cursor: col-resize;
      // background-color: #dddddd;
    }

    &-resizing {
      //僅在resize時使用的Class，層級最優先
      &-child,
      &-parent {
        width: min-content !important;
        overflow: hidden;
        white-space: nowrap;
        // text-overflow: ellipsis;
      }
    }
  }

  &-pagination {
    display: flex;
    align-items: center;
    height: fit-content;
    min-height: 40px;
    padding: 6px;
    gap: 6px;
    background-color: var(--i-color-table-footer);

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
    padding: 0 6px;
    background-color: inherit;
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
      background-color: var(--el-color-info-light-9);
    }
  }
}
</style>

<style lang="scss">
@use '@/assets/styles/utils' as utils;

// 自動計算欄位寬度
table .__is-resizing__ > div.cell {
  &,
  & :where(label, span, div, a) {
    color: var(--el-text-color-secondary);
    // background-color: lightgreen;
    width: fit-content !important;
    word-wrap: break-word !important;
    white-space: nowrap !important;
    overflow: visible !important;
    text-overflow: clip !important;
  }
}

$light-color: (
  'table-border': #EBEEF5,
  'table-prepend': #B9C6DB,
  'table-setting': #D1D9E7,
  'table-footer': #F5F7FA
);

$dark-color: (
  'table-border': #363637,
  'table-prepend': #141414,
  'table-setting': #1D1D1D,
  'table-footer': #39393A
);

@mixin set-css-vars($color-map) {
  // var(--i-color-table-border)
  @each $type, $color in $color-map {
    @include utils.set-css-var-value(('color', $type), $color);
  }
}

// 顏色設定
html {
  @include set-css-vars($light-color);
}
html.dark {
  @include set-css-vars($dark-color);
}
</style>
