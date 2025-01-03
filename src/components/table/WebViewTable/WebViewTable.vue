<script setup lang="ts">
import {
  ref,
  shallowRef,
  useSlots,
  nextTick,
  computed,
  inject,
  reactive
} from 'vue'

import type { UseHook } from '@/declare/hook' // 全域功能類型

import type { CustomTableProps } from '@/components' // 系統組件
import {
  CustomTable,
  CustomButton,
  GroupSearch,
  CustomSearch,
  CustomInput,
  CustomTooltip,
  CustomModal,
  TimeLineTable,
  DownloadModal,
  SubTable
} from '@/components' // 系統組件
import type { FormOptions } from '@/declare/columnSetting'
import { useTableSetting, useFormSetting } from '@/lib/lib_columns'
import { getColumnSetting } from '@/lib/lib_idb'
import throttle from '@/lib/lib_throttle'
import { hasOwnProperty, getProxyData, isEmpty, getUuid } from '@/lib/lib_utils' // 工具
import { defaultModuleType } from '@/i18n/i18n_setting'

import type { Types } from './WebViewTableInfo'
import { version, props as webViewCustomTableProps } from './WebViewTableInfo'

import {
  webViewUrl,
  getUrlParams,
  getWebViewParams,
  getTableData,
  getExcelData,
  // 進階搜尋可用選項
  webViewUrlOperator,
  getColumnOperator
} from './api'

const scopedId = getUuid(version)

const props = defineProps(webViewCustomTableProps)

const emit = defineEmits([
  // 'header-click',
  'row-click',
  // 'excel',
  'columns-change',
  // 'sort-change',
  // 'sorting-change',
  // 'page-change',
  // 'size-change',
  // 'show-change',
  'expand-change',
  // 'header-dragend',
  'select',
  'select-all',
  'selection-change',
  'row-contextmenu',
  // 'load',
  'init', // 初始化完成
  'mounted' // WebViewTable mounted
])

const useHook = inject('useHook') as UseHook
const i18nModule = props?.tableOptions?.i18nModule ?? defaultModuleType
const { i18nTranslate, i18nTest } = useHook({ i18nModule })

// emit event
const onExpandChange = (row: any, expanded: boolean) => {
  emit('expand-change', row, expanded)
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
const onRowClick = (row:any, column: any, event: any) => {
  emit('row-click', row, column, event)
}
const onColumnsChange = (showColumns: any) => {
  emit('columns-change', showColumns)
}
const onRowContextmenu = (row: any, column: any, event: Event) => {
  emit('row-contextmenu', row, column, event)
}

// filter
const formOptions: FormOptions = computed(() => {
  const { version, settingKey, i18nModule } = props?.tableOptions ?? {}

  if (!isEmpty(version) && !isEmpty(settingKey)) {
    return { version, settingKey, i18nModule }
  }
  return {}
})
const {
  columns: filterColumn,
  forms: filter,
  activeForms: activeFilter,
  getActiveForms: getFilter,
  reset: resetFilter,
  activeConditions: activeConditions,
  conditions: filterConditions,
  getConditionFilter,
  updateIDB: updateIDBFilter
} = useFormSetting<Types.FilterData>(
  props.columnSetting ?? {},
  props.filterKey,
  formOptions.value
)

// 另外設定過濾條件(ex: 跳頁查詢), 不自動更新 indexedDB
const isUpdateIDB = ref(true)
const setFilter = (_filter: Types.FilterData) => {
  isUpdateIDB.value = false
  resetFilter({})

  if (typeof _filter !== 'object') return
  for (const _filterKey in _filter) {
    if (hasOwnProperty(filter, _filterKey)) {
      filter[_filterKey] = _filter[_filterKey]
    }
  }
}
const filterConditionMap: Record<string, any> = {}
/**
 * 初始化 進階搜尋 欄位資料
 * dataType 影響輸入
 * conditionOptions 有後端給
 */
const initFilterConditionMap = async () => {
  // 清空可用選項
  for (const columnKey in filterConditionMap) {
    delete filterConditionMap[columnKey]
  }

  const urlParams = getUrlParams({
    url: props.apiOperator ?? webViewUrlOperator,
    baseURL: props.baseurl
  })
  const isWebView = webViewUrlOperator === urlParams.url

  // 客製化 api
  const webViewParams = getWebViewParams({
    webfuno: props.webfuno,
    funoviewsuffix: props.funoviewsuffix,
    designatedview: props.designatedview
  }, isWebView)

  // 如果是 SQL View, 必需要有參數
  let columnOperatorMap: Record<string, any> = {}
  if (isWebView && !isEmpty(webViewParams)) {
    columnOperatorMap = await getColumnOperator(webViewParams, urlParams)
  }

  // 設定可用選項
  for (const columnKey in filterColumn) {
    if (!Array.isArray(columnOperatorMap[columnKey])) continue
    filterConditionMap[columnKey] = columnOperatorMap[columnKey]
  }
}
// 依據後端資料 決定是否可進階搜尋
const getIsCondition = (columnKey: string) => {
  if (Array.isArray(filterConditionMap[columnKey])) {
    return filterConditionMap[columnKey].length > 0
  }
  // 無後端資料 使用欄位設定
  return filterColumn[columnKey]?.isCondition ?? false
}

// table
const tableData = shallowRef<Array<Types.TableData>>([])
const tableDataCount = ref(0)

const {
  tableSetting,
  downloadExcel,
  // setParams,
  getParams,
  changePage,
  getSelectionRows,
  toggleSelection,
  getDisplayData,
  spanInfo
} = useTableSetting(
  props.columnSetting ?? {},
  props.tableKey,
  props.tableOptions ?? {},
  { i18nTranslate, i18nTest }
)

const isLoading = ref(false)


const getDownloadTableData = async (type: string) => {
  const tableParams = getParams() ?? {}
  const {
    page = 1,
    size = 100,
    sortingMap = {}
  } = tableParams

  // api 入口
  const urlParams = getUrlParams({
    baseURL: props.baseurl,
    url: props.apiurl
  })
  const isWebView = webViewUrl === urlParams.url

  // 客製化 api
  const webViewParams = getWebViewParams({
    webfuno: props.webfuno,
    funoviewsuffix: props.funoviewsuffix,
    designatedview: props.designatedview
  }, isWebView)

  const filterData = getFilter(false)
  // 參數格式化
  const _params = props.formatParams({ ...filterData })
  // 排序格式化
  const _sortingMap = props.formatSorting(sortingMap)
  // 條件搜尋
  const conditions = getConditionFilter()

  // 防呆
  if (isWebView && isEmpty(webViewParams)) {
    isLoading.value = false
    return
  }

  const params: any = {
    ..._params,
    // page,
    // size,
    paging: {
      page,
      size
    },
    advanced: conditions,
    sortingMap: _sortingMap,
    ...webViewParams
  }

  switch (type) {
    // 下載全部資料
    case 'all':
      params.paging = {
        page: 1,
        size: -1
      }
      break
    case 'page':
      // 懶加載 下載 1 ~ 目前看到的資料
      if (islazyLoading.value) {
        params.paging.size = tableDataCount.value
        // 下載 當前分頁資料
      }
      break
  }

  const formatExcel = props.formatExcel ?? props.formatData

  const downloadData = await getExcelData(
    params, // 參數
    formatExcel, // Excel資料格式化
    props.fakeData, // 假資料
    props.useFakeData, // 是否使用假資料
    props.isLog, // 是否console.log訊息
    urlParams // api 入口
  )

  const keys = Object.keys(props.columnSetting ?? {})
  downloadData.forEach(rowData => {
    keys.forEach(key => {
      if(hasOwnProperty(rowData, key)) {
        const prop = key
        rowData[key] = getDisplayData(rowData, prop)
      }
    })
  })

  return downloadData
}

// 下載excel
const onExcelClick = async ({ type }: any) => {
  isLoading.value = true
  // 取得要下載的表格資料
  const downloadData = await getDownloadTableData(type)
  // 生成Excel
  if (props.downloadExcel) props.downloadExcel(downloadData)
  else downloadExcel(downloadData ?? [])

  isLoading.value = false
}

// 下載Pdf
const pdfRef = ref()
const isShowPdf = ref(false)
const onPdfClick = async (type: string) => {
  isShowPdf.value = true
  await nextTick()
  const { settingKey, i18nTitle, title} = tableSetting
  // 取得要下載的表格資料
  const downloadData = await getDownloadTableData(type)
  const tempColumns = await getColumnSetting(settingKey)
  const pdfColumns = tempColumns.columns.map((column: any) => {
    const { label, i18nLabel, isShow, isOperations } = column
    if(isOperations) return null
    const name = i18nTest(i18nLabel ?? '') ? i18nTranslate(i18nLabel) : label
    return {
      ...column,
      name,
      active: isShow
    }
  }).filter((column: any) => column)
  const pdfTitle = i18nTest(i18nTitle ?? '') ? i18nTranslate(i18nTitle ?? '') : title

  pdfRef.value.setPdfSetting({
    data: downloadData,
    columns: pdfColumns,
    title: pdfTitle,
    spanInfo
  })

  setTimeout(() => {
    modal.pdf = true
  }, 300)
}


const getColumnsWidth = (prop: string) => {
  const columsWidth = spanInfo.basePropSubTableInfoMap.get(prop).columnsWidth
  return columsWidth
}

const onColumnWidthChange = async (prop: string, newWidth: number) => {
  const subTableInfo = spanInfo.basePropSubTableInfoMap.get(prop)
  if(subTableInfo) subTableInfo.columnsWidth[prop] = newWidth
}

const initData = async (tableParams: any) => {
  const {
    page = 1,
    size = 100,
    sortingMap = {},
    emitType = ''
  } = tableParams

  let _page = page
  const isReset = ['sorting-change', 'sort-change'].includes(emitType)
  if (isReset) {
    changePage(1)
    _page = 1
  }

  // 資料懶加載 + 第一頁 資料清空
  if (islazyLoading.value && _page === 1) {
    tableData.value = []
  }

  // api 入口
  const urlParams = getUrlParams({
    url: props.apiurl,
    baseURL: props.baseurl
  })
  const isWebView = webViewUrl === urlParams.url

  // 客製化 api
  const webViewParams = getWebViewParams({
    webfuno: props.webfuno,
    funoviewsuffix: props.funoviewsuffix,
    designatedview: props.designatedview
  }, isWebView)

  // 過濾條件
  const filterData = getFilter(false)
  // 參數格式化
  const _params = props.formatParams({ ...filterData })
  // 排序格式化
  const _sortingMap = props.formatSorting(sortingMap)
  // 條件搜尋
  const conditions = getConditionFilter()

  // 防呆
  if (isWebView && isEmpty(webViewParams)) {
    isLoading.value = false
    // return
  }

  const params: any = {
    ..._params,
    // page: _page,
    // size,
    paging: {
      page: _page,
      size
    },
    advanced: conditions,
    sortingMap: _sortingMap,
    ...webViewParams
  }

  const formatData = props.formatTable ?? props.formatData

  const [
    resData, // api 取得資料
    resDataCount // api 取得資料筆數
  ] = await getTableData(
    params,
    formatData, // 表格資料格式化
    props.fakeData, // 假資料
    props.useFakeData, // 是否使用假資料
    props.isLog, // 是否console.log訊息
    urlParams // api 入口
  )

  // 資料懶加載
  if (islazyLoading.value) {
    const oldData = tableData.value
    const newData = isReset ? resData : [...oldData, ...resData]
    tableData.value = newData
    tableDataCount.value = newData.length
    lazyLoadingStatus.value = resData.length >= size ? 'loadMore' : 'noMore'

    // 資料依據分頁
  } else {
    tableData.value = resData
    tableDataCount.value = resDataCount
  }

  return [resData, resDataCount]
}

const timeLineTableRef = ref()
const _isShowTimeLineTable = computed(() => {
  return props.isShowTimeLineTable &&
    tableSetting.tableColumns.some(tableColumn => {
      return tableColumn?.isTimeLineDate ?? false
    })
})

// 初始化資料
const init = async (params?: any, type?: string) => {
  isLoading.value = true
  if (isUpdateIDB.value) {
    await updateIDBFilter()
  }

  if (type === 'input') {
    changePage(1)
  }
  if (islazyLoading.value) {
    lazyLoadingStatus.value = 'loading'
  }
  await nextTick()
  const tableParams = type === 'table' ? params : getParams()

  const [resData, resDataCount] = await initData(tableParams)
  await nextTick()

  setTimeout(() => {
    isLoading.value = false
  }, 240)

  // 時間線表格 同步更新
  if (modal.timeLine && timeLineTableRef.value) {
    setTimeout(() => {
      timeLineTableRef.value?.init()
    }, 800)
  }

  emit('init', [resData, resDataCount])
  return [resData, resDataCount]
}

const throttleInit = throttle<typeof init>(init, 200, {
  // isNoLeading: true,
  isNoTrailing: true
})

/**
 * 確保 CustomTable 初始化 排序(initSortingList) + 欄位(initShowColumns)
 * 才可以送出api
 */
 const onTableMounted = async () => {
  await nextTick()
  emit('mounted')

  await initFilterConditionMap()

  if (props.isMountedInit) {
    throttleInit(null, '')
  }
}

// slot
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
const getSlot = (slotKey: string, type: 'search' | 'header' | 'column'): string => {
  switch (type) {
    case 'search':
      if (hasSlot(`search-${slotKey}`)) return `search-${slotKey}`
      break
    case 'header':
      if (hasSlot(`header-${slotKey}`)) return `header-${slotKey}`
      break
    case 'column':
      if (hasSlot(`column-${slotKey}`)) return `column-${slotKey}`
      if (hasSlot('column-all')) return 'column-all'
      break
  }
  return 'null'
}

const getSearchSlot = (slotKey: string): string => {
  return getSlot(slotKey, 'search')
}
const getHeaderSlot = (slotKey: string): string => {
  return getSlot(slotKey, 'header')
}
const getColumnSlot = (slotKey: string): string => {
  return getSlot(slotKey, 'column')
}

const tableSlotKeyList = computed(() => {
  return tableSetting.tableColumns.flatMap(column => {
    if (column.columns && column.columns.length > 0) {
      return [
        ...column.columns.map((child: any) => `${column.slotKey}-${child.slotKey}`),
        column.slotKey
      ]
    }
    return column.slotKey
  })
})

// 顯示模式
type ViewType = 'pagination' | 'loadMore'
const viewType = ref<ViewType>('pagination')
const viewTypeOptions = [
  { label: '分頁顯示', value: 'pagination', i18nLabel: 'show-mode-page' },
  { label: '載入更多', value: 'loadMore', i18nLabel: 'show-mode-more' }
]

const islazyLoading = computed(() => {
  return viewType.value === 'loadMore'
})

const onReset = async () => {
  tableData.value = []
  tableDataCount.value = 0
  // setParams({ page: 1 })
  changePage(1)

  await nextTick()
  throttleInit(null, 'input')
}

const lazyLoadingStatus = ref<CustomTableProps.LazyLoadingStatus>('loadMore')

/**
 * 可用函數
 * 建議在 emit('mounted') 後使用
 */
defineExpose({
  setFilter,
  init,
  getTableData: () => {
    return getProxyData(tableData.value)
  },
  getTableDataCount: () => {
    return getProxyData(tableDataCount.value)
  },
  getSelectionRows,
  toggleSelection
})

// 時間線表格
// modal
// const detailRef = ref(null)
const modal = reactive({
  timeLine: false,
  pdf: false
})

</script>

<template>
  <div
    v-loading="isLoading"
    class="web-view"
    :class="scopedId"
  >
    <!-- 一般表格 -->
    <CustomTable
      :table-data="tableData"
      :table-data-count="tableDataCount"
      :spanMethod="spanInfo.spanMethod"
      v-bind="tableSetting"
      :is-lazy-loading="islazyLoading"
      :lazy-loading-status="lazyLoadingStatus"
      :is-show-no="islazyLoading"
      use-download-modal
      @excel="onExcelClick"
      @pdf="onPdfClick"
      @expand-change="onExpandChange"
      @select="onSelect"
      @select-all="onSelectAll"
      @selection-change="onSelectionChange"
      @row-click="onRowClick"
      @columns-change="onColumnsChange"
      @row-contextmenu="onRowContextmenu"
      @show-change="throttleInit($event, 'table')"
      @load="throttleInit($event, 'table')"
      @mounted="onTableMounted"
      @column-width-change="onColumnWidthChange"
    >
      <template v-if="!props.isHiddenPrepend" #prepend>
        <div class="flex-row i-ga-xs content-between">
          <slot name="prepend">
            <div></div>
          </slot>

          <div class="flex-row i-ga-xs">
            <div style="width: 120px; overflow: hidden">
              <CustomTooltip placement="top">
                <template #content>
                  <div>{{ i18nTranslate('show-mode', defaultModuleType) }}</div>
                </template>
                <CustomInput
                  v-model="viewType"
                  validate-key="WebViewTable:viewType"
                  :i18n-module="defaultModuleType"
                  type="select"
                  :options="viewTypeOptions"
                  hidden-label
                  @change="onReset"
                />
              </CustomTooltip>
            </div>

            <GroupSearch
              :columns="filterColumn"
              class="grid-row"
              :size="480"
              @reset="resetFilter"
              @submit="throttleInit(null, 'input')"
            >
              <template #search-all="scope">
                <slot name="search-all" :filter-column="filterColumn" v-bind="scope">
                  <CustomSearch
                    v-if="hasOwnProperty(filter, scope.prop)"
                    class="grid-col-xs-24 grid-col-sm-12 grid-col-md-8 grid-col-lg-6"
                    v-model="filter[scope.prop]"
                    v-model:active="activeFilter[scope.prop]"
                    v-model:activeConditions="activeConditions[scope.prop]"
                    v-model:conditions="filterConditions[scope.prop]"
                    v-bind="filterColumn[scope.prop]"
                    :i18n-module="i18nModule"
                    :label="i18nTranslate(scope.column?.i18nLabel ?? scope.column?.label, i18nModule)"
                    :column-id="scope.prop"
                    :allow-conditions="filterConditionMap[scope.prop]"
                    :is-condition="getIsCondition(scope.prop)"
                  />
                </slot>
              </template>
              <template
                v-for="slotKey in tableSlotKeyList"
                :key="`search-slotKey-${slotKey}-${scopedId}`"
                #[getSearchSlot(slotKey)]="scope"
              >
                <slot
                  :name="getSearchSlot(slotKey)"
                  :filter-column="filterColumn"
                  v-bind="scope"
                ></slot>
              </template>
            </GroupSearch>

            <CustomButton
              :label="i18nTranslate('refresh', defaultModuleType)"
              icon-name="rotate"
              icon-move="rotate"
              @click="onReset"
            />
          </div>
        </div>
      </template>

      <template v-if="hasSlot('setting-left')">
        <slot name="setting-left"></slot>
      </template>
      <template v-if="hasSlot('setting-center')">
        <slot name="setting-center"></slot>
      </template>
      <template v-if="hasSlot('setting-right')">
        <slot name="setting-right"></slot>
      </template>

      <template v-if="hasSlot('empty')" #empty>
        <slot name="empty"></slot>
      </template>

      <template v-if="hasSlot('row-expand')" #row-expand="scope">
        <slot name="row-expand" v-bind="scope"></slot>
      </template>

      <template #header-all="scope">
        <slot name="header-all" :filter-column="filterColumn" v-bind="scope">
          <div class="web-view-column">
            <CustomSearch
              v-if="hasOwnProperty(filter, scope.prop)"
              v-model="filter[scope.prop]"
              v-model:active="activeFilter[scope.prop]"
              v-model:activeConditions="activeConditions[scope.prop]"
              v-model:conditions="filterConditions[scope.prop]"
              v-bind="filterColumn[scope.prop]"
              :i18n-module="i18nModule"
              :label="i18nTranslate(scope.column?.i18nLabel ?? scope.column?.label, i18nModule)"
              :column-id="scope.prop"
              :allow-conditions="filterConditionMap[scope.prop]"
              :is-condition="getIsCondition(scope.prop)"
              search
              @change="throttleInit($event, 'input')"
              @submit="throttleInit($event, 'input')"
            />
            <span v-else>{{ i18nTranslate(scope.column?.i18nLabel ?? scope.column?.label) }}</span>
          </div>
        </slot>
      </template>
      <template
        v-for="slotKey in tableSlotKeyList"
        :key="`view-header-slotKey-${slotKey}-${scopedId}`"
        #[getHeaderSlot(slotKey)]="scope"
      >
        <slot :name="getHeaderSlot(slotKey)" :filter-column="filterColumn" v-bind="scope"></slot>
      </template>

      <template #column-all="{row, prop}">
        {{ getDisplayData(row, prop) }}
      </template>

      <template v-for="columnKey in spanInfo.leftProps" :key="columnKey"
        #[columnKey]="{ row, prop }"
      >
        <SubTable
          v-if="!isLoading"
          :columnKey="prop"
          :rowData="row"
          :spanInfo="spanInfo"
          :columnsWidth="getColumnsWidth(prop)"
        />
      </template>

      <!-- <template v-for="slotKey in spanColumns"
       :key="`view-column-slotKey-${slotKey}-${scopedId}`"
       #[`column-${slotKey}`]="{prop, rowData}"
      >
        <SubTable data="getSubTableData(prop, rowData)"/>
      </template> -->

      <template
        v-for="slotKey in tableSlotKeyList"
        :key="`view-column-slotKey-${slotKey}-${scopedId}`"
        #[getColumnSlot(slotKey)]="scope"
      >
        <slot :name="getColumnSlot(slotKey)" :filter-column="filterColumn" v-bind="scope">
          {{ scope.data }}
        </slot>
      </template>
    </CustomTable>

    <!-- 時間線表格 -->
    <CustomModal
      v-if="_isShowTimeLineTable"
      v-model="modal.timeLine"
      :title="i18nTranslate('timeLine-table', defaultModuleType)"
      :modal="false"
      draggable
      hidden-footer
      :hidden-collapse="false"
    >
      <TimeLineTable
        ref="timeLineTableRef"
        :tableColumns="tableSetting.tableColumns"
        :i18n-module="tableSetting.i18nModule"
        :table-data="tableData"
      />
    </CustomModal>
    <div v-show="_isShowTimeLineTable" class="web-view-time-line">
      <CustomTooltip trigger="hover" placement="top">
        <template #content>{{ i18nTranslate('timeLine-table', defaultModuleType) }}</template>
        <CustomButton
          icon-name="calendar-day"
          plain
          :disabled="modal.timeLine"
          @click="modal.timeLine = true"
        />
      </CustomTooltip>
    </div>
    <!-- PDF下載 -->
    <DownloadModal
      v-if="isShowPdf"
      v-model="modal.pdf"
      ref="pdfRef"
    />
  </div>
</template>

<style lang="scss" scoped>
.web-view {
  width: 100%;
  height: 100%;
  position: relative;

  &-column {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
  }
  &-time-line {
    position: absolute;
    left: 8px;
    bottom: 8px;
    z-index: 3;
    box-shadow: 0px 0px 6px 1px var(--el-text-color-disabled);
  }
}
</style>
