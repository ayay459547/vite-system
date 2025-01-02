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

import type { UseHook } from '@/declare/hook' // 全域功能類型
import type { ColumnItem } from '@/declare/columnSetting'
import { isEmpty, getProxyData, getUuid } from '@/lib/lib_utils' // 工具
import { defaultModuleType } from '@/i18n/i18n_setting'
import { object_findIndex } from '@/lib/lib_object'
import { numberFormat } from '@/lib/lib_format' // 格式化
import { printElement } from '@/lib/lib_utils' // 工具
import {
  CustomButton,
  CustomPopover,
  CustomInput,
  CustomIcon,
  CustomTooltip,
  CustomText
} from '@/components' // 系統組件

// 欄位設定
import ColumnSetting from './Components/ColumnSetting.vue'
// 欄位排序
import ColumnSorting from './Components/ColumnSorting.vue'
// 群組排序
import GroupSorting from './Components/GroupSorting.vue'
import TableMain from './TableMain.vue'

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
const excelIsShow = ref(false)
const onExcelClick = (type: 'all' | 'page') => {
  emit('excel', {
    type,
    tableColumns: props.tableColumns,
    tableData: props.tableData
  })
  excelIsShow.value = false
}

// 點擊 pdf
const isHiddenPdf = () => {
  if(!props.useDownloadModal) return true
}
const pdfIsShow = ref(false)
const onPdfClick = (type: 'all' | 'page') => {
  emit('pdf', type)
  pdfIsShow.value = false
}

// 列印
const printData = () => {
  const tableElement = document.querySelector(`.${scopedId} .el-table__inner-wrapper`)
  if (tableElement) {
    printElement(tableElement)
  }
}

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

const pageChange: Types.PageChange = (page, pageSize) => {
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
const currentSort = shallowRef<Types.Sort>({
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
const sortingList = ref<Types.SortingList>([])
const emitSortingData = computed<Types.SortingMap>(() => {
  // return sortingList.value.filter(item => item.order !== 'none')
  return sortingList.value.reduce<Types.SortingMap>((res, curr) => {
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

    return res as Types.SortingMap
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
const initSortingList = async () => {
  sortingList.value = tempColumns.value.reduce<Types.SortingList>((res, column) => {
    const _isOperations = column?.isOperations ?? false

    if (!_isOperations && (column?.isSorting ?? true)) {
      res.push({
        label: column.label,
        i18nLabel: column.i18nLabel,
        key: column.key,
        order: (column?.order ?? 'none') as Types.Order,
        orderIndex: (column?.orderIndex ?? -1) as number
      })
    }
    return res
  }, [])

  activeSort()
  await nextTick()
}
const resetSorting = () => {
  sortingList.value = sortingList.value.map(sortingItem => {
    return { ...sortingItem, order: 'none', orderIndex: -1 }
  })
}
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

          const columnElements = [...headerColumnElement, ...bodyColumnElements]
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
const onRowClick: Emits.RowClick = (row, column, event) => {
  emit('row-click', row, column, event)
}
const onHeaderClick: Emits.HeaderClick = (column, event) => {
  emit('header-click', column, event)
}
const onExpandChange: Emits.ExpandChange = (row, expanded) => {
  emit('expand-change', row, expanded)
}
const onHeaderDragend: Emits.HeaderDragend = (newWidth: number, oddWidth: number, column: any, event: Event) => {
  if (columnSetting.value) {
    const props = column?.rawColumnKey ?? column?.property
    setColumnWidth(props, newWidth)
  }
  emit('header-dragend', newWidth, oddWidth, column, event)
}
const onSelect: Emits.Select = (selection, row) => {
  emit('select', selection, row)
}
const onSelectAll: Emits.SelectAll = (selection: any) => {
  emit('select-all', selection)
}
const onSelectionChange: Emits.SelectionChange = (newSelection: any) => {
  emit('selection-change', newSelection)
}
const onRowContextmenu: Emits.RowContextmenu = (row, column, event) => {
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
const onShowChange = (props: { page: number; pageSize: number; sort: Types.Sort, emitType?: string }) => {
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

const columnSetting = ref<typeof ColumnSetting>()
const tempColumns = shallowRef([...props.tableColumns])
const showColumns = shallowReactive([...props.tableColumns])

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

const tableMainRef = ref<typeof TableMain>()
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
    [P in keyof Types.TableParams]?: Types.TableParams[P]
  }) => {
    const { page, size, sort, sortingList: _sortingList } = params

    if (!isEmpty(page) && typeof page === 'number') {
      currentPage.value = page
    }
    if (!isEmpty(size)) {
      const _index = sizeOptions.findIndex(option => {
        option.value === size
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
  <div v-loading="isLoading" class="__table-wrapper" :class="`CustomTable_${version} ${scopedId}`">
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

        <!-- Download -->
        <!-- <CustomPopover
          v-if="!isHiddenPdf()"
          v-model:visible="pdfIsShow"
          placement="bottom"
          :width="150"
          trigger="click"
          popper-style="padding: 4px;"
        >
          <template #reference>
            <CustomButton
              plain
              icon-name="file-arrow-down"
            />
          </template>
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
        </CustomPopover> -->

        <div class="flex-row-center">
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
              <CustomButton icon-name="file-excel" text>
                <template #icon>
                  <svg viewBox="0 0 32 32" style="font-size: 1.5em;">
                    <path d="M28.781,4.405H18.651V2.018L2,4.588V27.115l16.651,2.868V26.445H28.781A1.162,1.162,0,0,0,30,25.349V5.5A1.162,1.162,0,0,0,28.781,4.405Zm.16,21.126H18.617L18.6,23.642h2.487v-2.2H18.581l-.012-1.3h2.518v-2.2H18.55l-.012-1.3h2.549v-2.2H18.53v-1.3h2.557v-2.2H18.53v-1.3h2.557v-2.2H18.53v-2H28.941Z" style="fill:#20744a;fill-rule:evenodd"/>
                    <rect x="22.487" y="7.439" width="4.323" height="2.2" style="fill:#20744a"/>
                    <rect x="22.487" y="10.94" width="4.323" height="2.2" style="fill:#20744a"/>
                    <rect x="22.487" y="14.441" width="4.323" height="2.2" style="fill:#20744a"/>
                    <rect x="22.487" y="17.942" width="4.323" height="2.2" style="fill:#20744a"/>
                    <rect x="22.487" y="21.443" width="4.323" height="2.2" style="fill:#20744a"/>
                    <polygon points="6.347 10.673 8.493 10.55 9.842 14.259 11.436 10.397 13.582 10.274 10.976 15.54 13.582 20.819 11.313 20.666 9.781 16.642 8.248 20.513 6.163 20.329 8.585 15.666 6.347 10.673" style="fill:#ffffff;fill-rule:evenodd"/>
                  </svg>
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
            v-model:visible="pdfIsShow"
            placement="bottom"
            :width="150"
            trigger="click"
            popper-style="padding: 4px;"
          >
            <template #reference>
              <CustomButton icon-name="file-pdf" text>
                <template #icon>
                  <svg  viewBox="0 0 56 56" style="font-size: 1.4em;">
                    <g>
                      <path style="fill:#E9E9E0;" d="M36.985,0H7.963C7.155,0,6.5,0.655,6.5,1.926V55c0,0.345,0.655,1,1.463,1h40.074   c0.808,0,1.463-0.655,1.463-1V12.978c0-0.696-0.093-0.92-0.257-1.085L37.607,0.257C37.442,0.093,37.218,0,36.985,0z"/>
                      <polygon style="fill:#D9D7CA;" points="37.5,0.151 37.5,12 49.349,12  "/>
                      <path style="fill:#CC4B4C;" d="M19.514,33.324L19.514,33.324c-0.348,0-0.682-0.113-0.967-0.326   c-1.041-0.781-1.181-1.65-1.115-2.242c0.182-1.628,2.195-3.332,5.985-5.068c1.504-3.296,2.935-7.357,3.788-10.75   c-0.998-2.172-1.968-4.99-1.261-6.643c0.248-0.579,0.557-1.023,1.134-1.215c0.228-0.076,0.804-0.172,1.016-0.172   c0.504,0,0.947,0.649,1.261,1.049c0.295,0.376,0.964,1.173-0.373,6.802c1.348,2.784,3.258,5.62,5.088,7.562   c1.311-0.237,2.439-0.358,3.358-0.358c1.566,0,2.515,0.365,2.902,1.117c0.32,0.622,0.189,1.349-0.39,2.16   c-0.557,0.779-1.325,1.191-2.22,1.191c-1.216,0-2.632-0.768-4.211-2.285c-2.837,0.593-6.15,1.651-8.828,2.822   c-0.836,1.774-1.637,3.203-2.383,4.251C21.273,32.654,20.389,33.324,19.514,33.324z M22.176,28.198   c-2.137,1.201-3.008,2.188-3.071,2.744c-0.01,0.092-0.037,0.334,0.431,0.692C19.685,31.587,20.555,31.19,22.176,28.198z    M35.813,23.756c0.815,0.627,1.014,0.944,1.547,0.944c0.234,0,0.901-0.01,1.21-0.441c0.149-0.209,0.207-0.343,0.23-0.415   c-0.123-0.065-0.286-0.197-1.175-0.197C37.12,23.648,36.485,23.67,35.813,23.756z M28.343,17.174   c-0.715,2.474-1.659,5.145-2.674,7.564c2.09-0.811,4.362-1.519,6.496-2.02C30.815,21.15,29.466,19.192,28.343,17.174z    M27.736,8.712c-0.098,0.033-1.33,1.757,0.096,3.216C28.781,9.813,27.779,8.698,27.736,8.712z"/>
                      <path style="fill:#CC4B4C;" d="M48.037,56H7.963C7.155,56,6.5,55.345,6.5,54.537V39h43v15.537C49.5,55.345,48.845,56,48.037,56z"/>
                      <g>
                        <path style="fill:#FFFFFF;" d="M17.385,53h-1.641V42.924h2.898c0.428,0,0.852,0.068,1.271,0.205    c0.419,0.137,0.795,0.342,1.128,0.615c0.333,0.273,0.602,0.604,0.807,0.991s0.308,0.822,0.308,1.306    c0,0.511-0.087,0.973-0.26,1.388c-0.173,0.415-0.415,0.764-0.725,1.046c-0.31,0.282-0.684,0.501-1.121,0.656    s-0.921,0.232-1.449,0.232h-1.217V53z M17.385,44.168v3.992h1.504c0.2,0,0.398-0.034,0.595-0.103    c0.196-0.068,0.376-0.18,0.54-0.335c0.164-0.155,0.296-0.371,0.396-0.649c0.1-0.278,0.15-0.622,0.15-1.032    c0-0.164-0.023-0.354-0.068-0.567c-0.046-0.214-0.139-0.419-0.28-0.615c-0.142-0.196-0.34-0.36-0.595-0.492    c-0.255-0.132-0.593-0.198-1.012-0.198H17.385z"/>
                        <path style="fill:#FFFFFF;" d="M32.219,47.682c0,0.829-0.089,1.538-0.267,2.126s-0.403,1.08-0.677,1.477s-0.581,0.709-0.923,0.937    s-0.672,0.398-0.991,0.513c-0.319,0.114-0.611,0.187-0.875,0.219C28.222,52.984,28.026,53,27.898,53h-3.814V42.924h3.035    c0.848,0,1.593,0.135,2.235,0.403s1.176,0.627,1.6,1.073s0.74,0.955,0.95,1.524C32.114,46.494,32.219,47.08,32.219,47.682z     M27.352,51.797c1.112,0,1.914-0.355,2.406-1.066s0.738-1.741,0.738-3.09c0-0.419-0.05-0.834-0.15-1.244    c-0.101-0.41-0.294-0.781-0.581-1.114s-0.677-0.602-1.169-0.807s-1.13-0.308-1.914-0.308h-0.957v7.629H27.352z"/>
                        <path style="fill:#FFFFFF;" d="M36.266,44.168v3.172h4.211v1.121h-4.211V53h-1.668V42.924H40.9v1.244H36.266z"/>
                      </g>
                    </g>
                  </svg>
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

          <!-- Print: 開發中 尚未完成 -->
          <CustomButton
            icon-name="print"
            text
            class="i-hidden"
            @click="printData"
          />
        </div>


        <slot name="setting-left"></slot>
      </div>

      <div class="setting-center">
        <slot name="setting-center">
          <CustomText>
            <slot name="title">
              {{ i18nTranslate(props?.i18nTitle ?? props.title) }}
            </slot>
          </CustomText>
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
          @reset-sorting="resetSorting"
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
          `${i18nTranslate('total-amount', defaultModuleType)}：${props.tableDataCount}`
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
        gap: 4px;
      }

      &-left {
        justify-content: flex-start;
      }
      &-center {
        justify-content: center;
        font-weight: 600;

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
