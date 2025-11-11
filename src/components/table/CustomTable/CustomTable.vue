<script setup lang="ts">
import {
  useSlots,
  inject,
  ref,
  reactive,
  shallowRef,
  shallowReactive,
  computed,
  onMounted,
  nextTick
} from 'vue'
import { ElPagination } from 'element-plus'

import type { UseHook } from '@/types/types_hook' // 全域功能類型
import type { ColumnItem } from '@/types/types_columnSetting'
import { isEmpty, getProxyData, getUuid } from '@/lib/lib_utils' // 工具
import { defaultModuleType } from '@/declare/declare_i18n'
import { object_findIndex } from '@/lib/lib_object'
import { numberFormat } from '@/lib/lib_format' // 格式化
import { setLocalStorage, getLocalStorage } from '@/lib/lib_storage'
// import { printElement } from '@/lib/lib_utils' // 工具

import CustomInput from '@/components/input/CustomInput/CustomInput.vue'
import CustomButton from '@/components/feature/CustomButton/CustomButton.vue'
import CustomPopover from '@/components/feature/CustomPopover/CustomPopover.vue'
import CustomIcon from '@/components/feature/CustomIcon/CustomIcon.vue'
import CustomTooltip from '@/components/feature/CustomTooltip/CustomTooltip.vue'
import CustomText from '@/components/feature/CustomText/CustomText.vue'
import CustomSvg from '@/components/feature/CustomSvg/CustomSvg.vue'

// 表格
import { useTableSlot } from '@/components/table/BasicTable/hook'
import BasicTable from '@/components/table/BasicTable/BasicTable.vue'

// 欄位設定
import { rowOperationsColumn, rowNoColumn } from './extendColumns'
import ColumnSetting from './Components/ColumnSetting.vue'
// 欄位排序
import ColumnSorting from './Components/ColumnSorting.vue'
// 群組排序
import GroupSorting from './Components/GroupSorting.vue'

import type { Types, Emits } from './CustomTableInfo'
import { version, props as tableProps } from './CustomTableInfo'

const scopedId = getUuid('__i-table__')

const props = defineProps(tableProps)

const useHook = inject('useHook') as UseHook
const { i18nTranslate, message } = useHook({
  i18nModule: props.i18nModule
})

const emit = defineEmits([
  'header-click',
  'row-click',
  'excel',
  'pdf',
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
  'column-width-change',
  'load',
  'mounted'
])

const isLoading = ref(true)
const renderKey = ref(1)
const isRender = ref(false)
// const isResizing = ref(false)

// 點擊 excel
const isShowExcel = ref(false)
const onExcelClick = (type: 'all' | 'page') => {
  emit('excel', {
    type,
    tableColumns: props.tableColumns,
    tableData: props.tableData
  })
  isShowExcel.value = false
}

// 點擊 pdf
const isHiddenPdf = () => {
  return !props.useDownloadModal
}
const isShowPdf = ref(false)
const onPdfClick = (type: 'all' | 'page') => {
  emit('pdf', type)
  isShowPdf.value = false
}

// 列印
// const printData = () => {
//   const tableElement = document.querySelector(`.${scopedId} .el-table__inner-wrapper`)
//   if (tableElement) {
//     printElement(tableElement)
//   }
// }

// 每頁顯示筆數
let lastValue: number = props.pageSize
const tempPageSize = ref<number | string>(props.pageSize)
const pageSize = computed<number>({
  get: () => {
    if (typeof tempPageSize.value === 'string') {
      return Number.parseInt(tempPageSize.value)
    }
    return tempPageSize.value
  },
  set: (v: number | string) => {
    let _value = v
    // 轉化數字
    if (typeof _value === 'string') {
      _value = Number.parseFloat(_value)

      // 不是數字 給最後一次的值
      if (Number.isNaN(_value)) {
        _value = lastValue
      }
    }

    if (typeof _value === 'number') {
      _value = numberFormat<number>(_value, { type: 'floor', toFixed: 0 })
    }

    if (lastValue !== _value) {
      lastValue = _value
    }

    tempPageSize.value = _value
  }
})
const sizeOptions = [
  // { value: 3, label: '3' },
  // { value: 10, label: '10' },
  // { value: 30, label: '30' },
  { value: 50, label: '50' },
  { value: 100, label: '100' },
  { value: 300, label: '300' },
  { value: 500, label: '500' },
  { value: 1000, label: '1000' },
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

// 計算行數的編號
const getRowNo = (rowIndex?: number) => {
  const rowNo = (rowIndex ?? -1) + 1
  if (props.isLazyLoading) return rowNo
  return rowNo + ((currentPage.value - 1) * pageSize.value)
}

const pageChange: Types['pageChange'] = (page, pageSize) => {
  currentPage.value = page

  emit('page-change', { page, pageSize })
  onShowChange({
    page,
    pageSize,
    sort: currentSort.value,
    emitType: 'page-change'
  })
  resetScroll()
}

// 單欄排序
const currentSort = shallowRef<Types['sort']>({
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
    sort: currentSort.value,
    emitType: 'sort-change'
  })
}
// 多欄排序
const sortingList = ref<Types['sortingList']>([])
const emitSortingData = computed<Types['sortingMap']>(() => {
  // return sortingList.value.filter(item => item.order !== 'none')
  return sortingList.value.reduce<Types['sortingMap']>((res, curr) => {
    const { key, order } = curr

    if (typeof key === 'string') {
      switch (order) {
        case 'ascending':
          res[key] = 'Asc'
          break
        case 'descending':
          res[key] = 'Desc'
          break
      }
    }

    return res as Types['sortingMap']
  }, {})
})

// 有使用的往前
const activeSort = () => {
  sortingList.value.sort((a, b) => {
    const { order: aOrder, orderIndex: aOrderIndex } = a ?? {}
    const { order: bOrder, orderIndex: bOrderIndex } = b ?? {}
    const aIsActive = ['ascending', 'descending'].includes(aOrder ?? '')
    const bIsActive = ['ascending', 'descending'].includes(bOrder ?? '')

    if (aIsActive && bIsActive) {
      return (aOrderIndex ?? -1) - (bOrderIndex ?? -1)
    } else if (aIsActive && !bIsActive) {
      return -1
    } else if (!aIsActive && bIsActive) {
      return 1
    } else {
      return 0
    }
  })
}
// 初始化排序設定
const initSortingList = async () => {
  sortingList.value = tempColumns.value.reduce<Types['sortingList']>((res, column) => {
    const _isOperations = column?.isOperations ?? false

    if (!_isOperations && (column?.isSorting ?? true)) {
      res.push({
        label: column.label,
        i18nLabel: column.i18nLabel,
        key: column.key,
        order: (column?.order ?? 'none') as Types['order'],
        orderIndex: (column?.orderIndex ?? -1) as number
      })
    }
    return res
  }, [])
  activeSort()
  await nextTick()
}
// 重置排序
const resetSorting = async () => {
  sortingList.value = extendTableColumns.value.reduce<Types['sortingList']>((res, column) => {
    const _isOperations = column?.isOperations ?? false

    if (!_isOperations && (column?.isSorting ?? true)) {
      res.push({
        label: column.label,
        i18nLabel: column.i18nLabel,
        key: column.key,
        order: (column?.order ?? 'none') as Types['order'],
        orderIndex: (column?.orderIndex ?? -1) as number
      })
    }
    return res
  }, [])
  activeSort()
  // onSortingChange()
  await nextTick()
}
// 排序異動 (設定新的排序資料到 indexedDB)
const onSortingChange = () => {
  activeSort()
  emit('sorting-change', getProxyData(emitSortingData.value))

  sortingList.value.forEach((sortingItem, sortingIndex) => {
    const headerKey = sortingItem?.key // 欄位Key值
    const order = sortingItem?.order
    const orderIndex = sortingIndex ?? sortingItem?.orderIndex
    columnSetting.value?.setColumnOrder(headerKey, order, orderIndex)
  })

  onShowChange({
    page: currentPage.value,
    pageSize: pageSize.value,
    sort: currentSort.value,
    emitType: 'sorting-change'
  })
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
          return `${headerKey}` === columnElement?.getAttribute('resizing-key')
        })

        await nextTick()
        if (!isEmpty(resizingIndex)) {
          const cellIndex = Number.parseInt(`${resizingIndex}`) + 1
          const headerColumnElement = document.querySelectorAll(`.${scopedId} tr:nth-child(${trIndex}) th:nth-child(${cellIndex})`)
          const bodyColumnElements = document.querySelectorAll(`.${scopedId} tr td:nth-child(${cellIndex})`)

          const columnElements = [
            ...Array.from(headerColumnElement),
            ...Array.from(bodyColumnElements)
          ]
          columnElements.forEach(element => {
            element.classList.add('__is-resizing__') // 添加類別
          })
          await nextTick()

          newWidth = columnElements.reduce((maxWidth: number, curElement: Element) => {
            const cellElements = curElement.querySelector('.cell')
            const curWidth = cellElements?.scrollWidth ?? 0
            const childWidth = 0 // 尚未計算子欄位寬度
            return Math.max(curWidth + 18, childWidth, maxWidth)
          }, 0)

          // columnElements.forEach(element => {
          //   element.classList.remove('__is-resizing__') // 移除類別
          // })
          // await nextTick()
          setColumnWidth(headerKey, newWidth) // 欄位設定套用最適化寬度
        }
        resolve(newWidth)
      }, 0)
    } catch (e) {
      message({
        type: 'error',
        message: `${e}`,
        duration: 10000
      })
      reject(originWidth)
    }
  })
}

const setColumnWidth = async (prop: any, newWidth: number) => {
  columnSetting.value?.setColumnWidth(prop, newWidth)
  await nextTick()
  emit('column-width-change', prop, newWidth )
}

// Column 欄位寬度最適化
const optimizeColumnWidth = (column: any) => {
  setElementWidth(column, 1).then(() => {
    // 重新渲染欄位
    initShowColumns({ isLoading: true })
  })
}

// Column All 欄位寬度最適化
const optimizeAllColumnWidth = () => {
  Promise.all(showColumns.map(column => setElementWidth(column, 1))).then(() => {
    // 重新渲染欄位
    initShowColumns({ isLoading: true })
  })
}

// Emit
const onRowClick: Emits['rowClick'] = (row, column, event) => {
  emit('row-click', row, column, event)
}
const onHeaderClick: Emits['headerClick'] = (column, event) => {
  emit('header-click', column, event)
}
const onExpandChange: Emits['expandChange'] = (row, expanded) => {
  emit('expand-change', row, expanded)
}
const onHeaderDragend: Emits['headerDragend'] = (newWidth: number, oddWidth: number, column: any, event: Event) => {
  if (columnSetting.value) {
    const props = column?.rawColumnKey ?? column?.property
    setColumnWidth(props, newWidth)
  }
  emit('header-dragend', newWidth, oddWidth, column, event)
}
const onSelect: Emits['select'] = (selection, row) => {
  emit('select', selection, row)
}
const onSelectAll: Emits['selectAll'] = (selection: any) => {
  emit('select-all', selection)
}
const onSelectionChange: Emits['selectionChange'] = (newSelection: any) => {
  emit('selection-change', newSelection)
}
const onRowContextmenu: Emits['rowContextmenu'] = (row, column, event) => {
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
const onShowChange = (props: { page: number; pageSize: number; sort: Types['sort'], emitType?: string }) => {
  const { page, pageSize, sort, emitType = 'show-change' } = props

  emit('show-change', {
    page,
    size: pageSize,
    sort: getProxyData(sort),
    sortingList: getProxyData(sortingList.value),
    sortingMap: getProxyData(emitSortingData.value),
    emitType
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



const hasSlotReactive = reactive({
  rowOperations: false,
  rowNo: false
})
const extendTableColumns =  computed(() => {
  const tableColumns = [...props.tableColumns]

  if(hasSlotReactive.rowOperations) tableColumns.push(rowOperationsColumn)
  if(hasSlotReactive.rowNo) tableColumns.unshift(rowNoColumn)

  return tableColumns // props.tableColumns
})

const columnSetting = ref<typeof ColumnSetting>()
const tempColumns = shallowRef([...extendTableColumns.value])
const showColumns = shallowReactive([...extendTableColumns.value])

// 初始化顯示欄位
const initShowColumns = async (setting?: any) => {
  const {
    // 預設的Setting各項參數
    isLoading: isUseLoading = true
    // scrollElement = null,
    // columnKey = null
  } = setting ?? {} // param沒有傳入則用空物件替代

  isLoading.value = isUseLoading // 是否使用Loading, 不輸入函數則預設為使用

  if (columnSetting.value) {
    // 確認欄位設定
    await columnSetting.value?.checkColumnSetting()

    tempColumns.value = (await (columnSetting.value?.getColumnList() ?? [])) as ColumnItem[]
    columnSetting.value?.setColumnList(tempColumns.value)

    const resColumns = tempColumns.value.reduce<any[]>((resColumn, tempColumn) => {
      if (tempColumn.isShow) {
        const showColumn = extendTableColumns.value.find(column => {
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
    isLoading.value = false
  }, 240) // 設定一段時間才取消 避免閃一下
}

onMounted(async () => {
  isRender.value = false
  // 初始化欄位
  await initShowColumns()

  // 初始化排序
  await initSortingList()

  setTimeout(async () => {
    isRender.value = true
    await nextTick()
    emit('mounted')
  }, 0)
})

const BasicTableRef = ref<InstanceType<typeof BasicTable>>()
const resetScroll = () => {
  BasicTableRef.value?.resetScroll()
}
const toggleSelection = (rows: any[]) => {
  BasicTableRef.value?.toggleSelection(rows)
}
const getSelectionRows = () => {
  const selectionRows = BasicTableRef.value?.getSelectionRows() ?? []
  return getProxyData(selectionRows)
}

defineExpose({
  // BasicTable
  resetScroll,
  toggleSelection,
  getSelectionRows,
  // custom
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
    [P in keyof Types['tableParams']]?: Types['tableParams'][P]
  }) => {
    const { page, size, sort, sortingList: _sortingList } = params

    if (!isEmpty(page) && typeof page === 'number') {
      currentPage.value = page
    }
    if (!isEmpty(size)) {
      const _index = sizeOptions.findIndex(option => {
        return option.value === size
      })

      if (_index >= 0 && typeof size === 'number') {
        pageSize.value = size
      }
    }
    if (typeof sort === 'string') {
      currentSort.value = sort
    }
    if (Array.isArray(_sortingList)) {
      sortingList.value = _sortingList
    }
  }
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
  get: () => _isPrependOpen.value,
  set: (value: boolean) => {
    setLocalStorage('isPrependOpen', `${value}`)
    _isPrependOpen.value = value
  }
})
onMounted(() => {
  const _isPrependOpen = getLocalStorage('isPrependOpen')
  if (isEmpty(_isPrependOpen)) {
    setLocalStorage('isPrependOpen', 'true')
    isPrependOpen.value = true
  } else {
    isPrependOpen.value = _isPrependOpen === 'true'
  }

  hasSlotReactive.rowOperations = hasSlot('row-operations')
  hasSlotReactive.rowNo = hasSlot('row-no')
})

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}

const {
  slotKeyList,
  getHeaderSlot,
  getColumnSlot
} = useTableSlot(showColumns)
</script>

<template>
  <div v-loading="isLoading" class="__table-wrapper" :class="`CustomTable_${version} ${scopedId}`">
    <!-- <template v-if="hasSlot('prepend')">
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
    </template> -->

    <div class="__table-setting">
      <div class="setting-left" v-if="hasSlot('prepend')">
        <slot name="prepend"></slot>
      </div>

      <div class="setting-center">
        <slot name="setting-center">
          <CustomText>
            <strong class="setting-center-title">
              <slot name="title">
                {{ i18nTranslate(props?.i18nTitle ?? props.title) }}
              </slot>
            </strong>
          </CustomText>
        </slot>
      </div>

      <div class="setting-right">
        <slot name="setting-left"></slot>
        <!-- Excel -->
        <CustomPopover
          v-if="!props.isHiddenExcel"
          v-model:visible="isShowExcel"
          placement="bottom"
          :width="150"
          trigger="click"
          popper-style="padding: 4px;"
        >
          <template #reference>
            <CustomButton icon-name="file-excel" text>
              <template #icon>
                <CustomSvg name="xlsx"/>
              </template>
            </CustomButton>
          </template>
          <!-- 列印全部資料 列印分頁資料 -->
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

        <!-- Pdf -->
        <CustomPopover
          v-if="!isHiddenPdf()"
          v-model:visible="isShowPdf"
          placement="bottom"
          :width="150"
          trigger="click"
          popper-style="padding: 4px;"
        >
          <template #reference>
            <CustomButton icon-name="file-pdf" text>
              <template #icon>
                <CustomSvg name="pdf"/>
              </template>
            </CustomButton>
          </template>
          <!-- 列印全部資料 列印分頁資料 -->
          <div class="__excel-list">
            <div class="__excel-item" @click="onPdfClick('all')">
              <CustomIcon name="table-list" class="icon" />
              <div class="text">{{ i18nTranslate('all-data', defaultModuleType) }}</div>
            </div>
            <div class="__excel-item" @click="onPdfClick('page')">
              <CustomIcon type="far" name="file-lines" class="icon" />
              <div class="text">{{ i18nTranslate('page-data', defaultModuleType) }}</div>
            </div>
          </div>
        </CustomPopover>
        <ColumnSetting
          v-show="!props.isHiddenColumnSetting"
          ref="columnSetting"
          :columns="extendTableColumns"
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
          @reset-sorting="resetSorting"
          @submit="onSortingChange"
        />
        <slot name="setting-right"></slot>
      </div>
    </div>

    <div class="__table-container">
      <BasicTable
        v-if="isRender"
        ref="BasicTableRef"
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
        :selectable="props.selectable"
        :is-lazy-loading="isLazyLoading"
        :lazy-loading-status="props.lazyLoadingStatus"
        :i18n-module="props.i18nModule"
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

        <!-- 展開 自訂內容 -->
        <template v-if="hasSlot('row-expand-header')" #row-expand-header="scope">
          <slot name="row-expand-header" v-bind="scope"></slot>
        </template>
        <template v-if="hasSlot('row-expand')" #row-expand="scope">
          <slot name="row-expand" v-bind="scope"></slot>
        </template>

        <!-- 勾選 checkbox -->
        <template v-if="hasSlot('row-selection-header')" #row-selection-header="scope">
          <!-- 目前 Element Plus UI 不開放設定 -->
          <slot name="row-selection-header" v-bind="scope"></slot>
        </template>
        <template v-if="hasSlot('row-selection')" #row-selection="scope">
          <slot name="row-selection" v-bind="scope"></slot>
        </template>

        <!-- Extend Row Columns -->
        <!-- 顯示行數編號  -->
        <template v-if="hasSlot('row-no-header')" #column-row-no-header="scope">
          <slot name="row-no-header" v-bind="scope"></slot>
        </template>
        <template v-if="hasSlot('row-no')" #column-row-no="scope">
          <slot name="row-no" v-bind="scope" :no="getRowNo(scope?.$index)">
            {{ getRowNo(scope?.$index) }}
          </slot>
        </template>

        <!-- 顯示操作 slot row-expand 會決定是否 顯示此欄位 -->
        <template #header-row-operations="scope">
          <slot name="row-operations-header" v-bind="scope"></slot>
        </template>
        <!-- 配合欄位設定使用 slot: column-rowOperations -->
        <template v-if="hasSlot('row-operations')" #column-row-operations="scope">
          <slot name="row-operations" v-bind="scope"></slot>
        </template>

        <template
          v-for="slotKey in slotKeyList"
          :key="`header-slotKey-${slotKey}-${scopedId}`"
          #[getHeaderSlot(`${slotKey}`)]="scope"
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
            <slot :name="getHeaderSlot(`${slotKey}`)" v-bind="scope">
              <label>{{ i18nTranslate(scope?.column?.i18nLabel ?? scope?.column?.label) }}</label>
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
          #[getColumnSlot(`${slotKey}`)]="scope"
        >
          <slot :name="getColumnSlot(`${slotKey}`)" v-bind="scope"></slot>
        </template>


      </BasicTable>
    </div>

    <div class="__table-pagination">

      <template v-if="!props.isLazyLoading" >
        <div class="__table-pagination-left">
          <template v-if="hasSlot('append')">
            <slot name="append"></slot>
          </template>
          <div style="width: 85px; overflow: hidden">
            <CustomTooltip placement="top" :show-after="300">
              <template #content>
                <!-- 顯示更多 : 分頁 -->
                <div>{{ i18nTranslate(props.isLazyLoading ? 'load-count' : 'show-count', defaultModuleType) }}</div>
              </template>
              <CustomInput
                v-model="pageSize"
                validate-key="CustomTable:pageSize"
                type="select"
                :options="sizeOptions"
                hidden-label
                :filterable="false"
                :allow-create="false"
                :default-first-option="false"
                @change="onSizeChange"
              />
            </CustomTooltip>
          </div>

          <!-- 顯示更多 -->
          <div v-if="props.isLazyLoading">
            <label>
              {{ `${i18nTranslate('data-count', defaultModuleType)}：${props.tableDataCount}` }}
            </label>
          </div>

        </div>
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
          <span>{{ `${i18nTranslate('total-amount', defaultModuleType)}`}}</span>
          <span>：</span>
          <span>{{ `${props.tableDataCount}` }}</span>
        </div>
      </template>
      <template v-else>
        <div class="__table-pagination-left">
          <template v-if="hasSlot('append')">
            <slot name="append"></slot>
          </template>
          <div style="width: 85px; overflow: hidden">
            <CustomTooltip placement="top" :show-after="300">
              <template #content>
                <!-- 顯示更多 : 分頁 -->
                <div>{{ i18nTranslate(props.isLazyLoading ? 'load-count' : 'show-count', defaultModuleType) }}</div>
              </template>
              <CustomInput
                v-model="pageSize"
                validate-key="CustomTable:pageSize"
                type="select"
                :options="sizeOptions"
                hidden-label
                :filterable="false"
                :allow-create="false"
                :default-first-option="false"
                @change="onSizeChange"
              />
            </CustomTooltip>
          </div>
        </div>
        <div class="__table-pagination-center">
        </div>
        <div class="__table-pagination-right">
          <span>{{ `${i18nTranslate('total-amount', defaultModuleType)}`}}</span>
          <span>：</span>
          <span>{{ `${props.tableDataCount}` }}</span>
        </div>
      </template>

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
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    background-color: var(--i-color-table-setting);
    padding: 6px;
    border: {
      radius: 6px 6px 0 0;
    }
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
        gap: 4px;
      }

      &-left {
        justify-content: flex-start;
        flex: 1;
        // @media (max-width: 800px) {
        //   width: 100%;
        // }
        // @media (min-width: 801px) {
        //   flex: 1;
        // }
      }
      &-center {
        justify-content: center;

        @media (max-width: 1200px) {
          overflow: hidden;
        }
        &-title {
          padding: 0px 8px;
          font-size: 1rem; //0.95rem;
        }
      }
      &-right {
        flex: 1;
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
      // 僅在resize時使用的Class，層級最優先
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
