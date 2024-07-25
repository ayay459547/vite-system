<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, shallowRef, onMounted, useSlots, nextTick, computed, inject } from 'vue'

import type { UseHook } from '@/declare/hook'
import type { LazyLoadingStatus } from '@/components'
import { CustomTable, CustomButton, GroupSearch, CustomSearch, CustomInput, CustomTooltip } from '@/components'
import type { TableOptions } from '@/declare/columnSetting'
import { useTableSetting, useFormSetting } from '@/lib/lib_columns'
import throttle from '@/lib/lib_throttle'
import { hasOwnProperty, getProxyData, isEmpty } from '@/lib/lib_utils'
import { defaultModuleType } from '@/i18n/i18n_setting'

import type {
  FakeData,
  TableData,
  FilterData,
  FormatExcel,
  FormatTable,
  FormatSorting
} from './api'
import { getUrlParams, getWebViewParams, getTableData, getExcelData } from './api'

const props = defineProps({
  baseurl: {
    type: String as PropType<string>,
    required: false,
    description: `api baseURL 參數
      baseURL: props.baseurl
    `
  },
  apiurl: {
    type: String as PropType<string>,
    required: false,
    description: `api url 參數
      apiurl 存在時
      url: props.apiurl
      webfuno, funoviewsuffix, designatedview無效

      apiurl 不存在時
      url: /api/ipaspTable/retrieveIpaspTableFromView
      webfuno, funoviewsuffix,  designatedview有效
    `
  },
  webfuno: {
    type: String as PropType<string>,
    required: false,
    description: 'api webfuno 參數'
  },
  funoviewsuffix: {
    type: String as PropType<string>,
    required: false,
    default: '',
    description: 'api funoviewsuffix 參數'
  },
  designatedview: {
    type: String as PropType<string>,
    required: false,
    default: '',
    description: `api designatedview 參數
      designatedview 存在時 webfuno, funoviewsuffix 無效
    `
  },
  tableOptions: {
    type: Object as PropType<TableOptions>,
    required: true,
    description: `CustomTable 參數設定
      CustomTable Props 最後會加在 tableSetting 中
    `
  },
  columnSetting: {
    type: Object as PropType<Record<any, any>>,
    required: true,
    description: '欄位設定'
  },
  tableKey: {
    type: String as PropType<string>,
    required: false,
    default: 'table',
    description: 'useTableSetting 使用 columnSetting中對應的key'
  },
  filterKey: {
    type: String as PropType<string>,
    required: false,
    default: 'filter',
    description: 'useFormSetting 使用 columnSetting中對應的key'
  },
  formatParams: {
    type: Function as PropType<(params: any) => any>,
    required: false,
    default: (params: any) => params,
    description: '自訂送出的api格式'
  },
  formatExcel: {
    type: Function as PropType<FormatExcel>,
    required: false,
    default: (row: any) => row,
    description: '自訂Excel資料格式'
  },
  formatTable: {
    type: Function as PropType<FormatTable>,
    required: false,
    default: (row: any) => row,
    description: '自訂Table資料格式'
  },
  formatSorting: {
    type: Function as PropType<FormatSorting>,
    required: false,
    default: (row: any) => row,
    description: '自訂SortingMap資料格式'
  },
  useFakeData: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: `
      是否使用fakeData假資料
      如果為true則不送出API responseData會使用fakeData
    `
  },
  fakeData: {
    type: Array as PropType<FakeData>,
    required: false,
    default() {
      return []
    },
    description: '替代實際API輸出資料的假資料'
  },
  isMountedInit: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
    description: '是否在 onMounted 初始化'
  },
  //Custom Download Excel
  downloadExcel: {
    type: Function as PropType<any>,
    required: false,
    default: null,
    description: `
      取代downloadExcel的特製表格下載方式
      ex: 子欄位、合併……
    `
  },
  isHiddenPrepend: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否在 隱藏 slot #prepend'
  }
})

const emit = defineEmits([
  // 'header-click',
  'row-click',
  // 'excel',
  // 'columns-change',
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
  'init-start', //初始化開始
  'init-end' //初始化完成
])

const useHook: UseHook = inject('useHook')
const i18nModule = props?.tableOptions?.i18nModule ?? defaultModuleType
const { i18nTranslate } = useHook({ i18nModule })

//emit event
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
const onRowContextmenu = (row: any, column: any, event: Event) => {
  emit('row-contextmenu', row, column, event)
}

// filter
const {
  columns: filterColumn,
  forms: filter,
  activeForms: activeFilter,
  getActiveForms: getFilter,
  reset: resetFilter,
  conditions: filterConditions,
  getConditionFilter
} = useFormSetting<FilterData>(props.columnSetting, props.filterKey)

const setFilter = (_filter: FilterData) => {
  for (const filterKey in _filter) {
    if (hasOwnProperty(filter, filterKey)) {
      filter[filterKey] = _filter[filterKey]
    }
  }
}

// table
const tableData = shallowRef<TableData[]>([])
const tableDataCount = ref(0)

const {
  tableSetting,
  downloadExcel,
  getParams,
  changePage,
  getSelectionRows,
  toggleSelection
} = useTableSetting(props.columnSetting, props.tableKey, props.tableOptions)

const isLoading = ref(false)

const download = async ({ type }) => {
  isLoading.value = true

  const tableParams = getParams()
  const {
    page = 1,
    size = 100,
    // sort = { key: null, order: null },
    // sortingList = [],
    sortingMap = {}
  } = tableParams

  // api 入口
  const urlParams = getUrlParams({
    url: props.apiurl,
    baseURL: props.baseurl
  })

  // 後端指定參數
  const webViewParams = props.apiurl
    ? {}
    : getWebViewParams({
        webfuno: props.webfuno,
        funoviewsuffix: props.funoviewsuffix,
        designatedview: props.designatedview
      })

  const filterData = getFilter(false)
  // 參數格式化
  const _params = props.formatParams({ ...filterData })
  // 排序格式化
  const _sortingMap = props.formatSorting(sortingMap)
  // 條件搜尋
  const conditions = getConditionFilter()

  const params: any = {
    ..._params,
    page,
    size,
    sortingMap: _sortingMap,
    ...webViewParams
  }
  if (!isEmpty(conditions)) {
    params.filter = conditions
  }
  switch (type) {
    // 下載全部資料
    case 'all':
      params.page = 1
      params.size = -1
      break
    case 'page':
      // 懶加載 下載 1 ~ 目前看到的資料
      if (islazyLoading.value) {
        params.size = tableDataCount.value
        // 下載 當前分頁資料
      }
      break
  }

  const tempData = await getExcelData(
    params, // 參數
    props.formatExcel, // Excel資料格式化
    props.fakeData, // 假資料
    props.useFakeData, // 是否使用假資料
    urlParams // api 入口
  )
  if (props.downloadExcel) props.downloadExcel(tempData)
  else downloadExcel(tempData)

  isLoading.value = false
}

const initData = async (tableParams: any) => {
  const {
    page = 1,
    size = 100,
    // sort = { key: null, order: null },
    // sortingList = [],
    sortingMap = {}
  } = tableParams

  // 資料懶加載 + 第一頁 資料清空
  if (islazyLoading.value && page === 1) {
    tableData.value = []
  }

  // api 入口
  const urlParams = getUrlParams({
    url: props.apiurl,
    baseURL: props.baseurl
  })

  // 客製化 api
  const webViewParams = props.apiurl
    // 不給參數
    ? {}
    // 後端指定參數
    : getWebViewParams({
        webfuno: props.webfuno,
        funoviewsuffix: props.funoviewsuffix,
        designatedview: props.designatedview
      })

  // 過濾條件
  const filterData = getFilter(false)
  // 參數格式化
  const _params = props.formatParams({ ...filterData })
  // 排序格式化
  const _sortingMap = props.formatSorting(sortingMap)
  // 條件搜尋
  const conditions = getConditionFilter()

  const params: any = {
    ..._params,
    page,
    size,
    sortingMap: _sortingMap,
    ...webViewParams
  }
  if (!isEmpty(conditions)) {
    params.filter = conditions
  }

  const [
    resData, // api 取得資料
    resDataCount // api 取得資料筆數
  ] = await getTableData(
    params,
    props.formatTable, // 表格資料格式化
    props.fakeData, // 假資料
    props.useFakeData, // 是否使用假資料
    urlParams // api 入口
  )

  // 資料懶加載
  if (islazyLoading.value) {
    const oldData = tableData.value
    tableData.value = [...oldData, ...resData]

    const len = resData.length
    tableDataCount.value += len

    if (len >= size) {
      lazyLoadingStatus.value = 'loadMore'
    } else {
      lazyLoadingStatus.value = 'noMore'
    }
    // 資料依據分頁
  } else {
    tableData.value = resData
    tableDataCount.value = resDataCount
  }

  return [resData, resDataCount]
}

const customTableRef = ref()
/**
 * 確保 CustomTable 初始化 排序(initSortingList) + 欄位(initShowColumns)
 * 才可以送出api
 */
const _isCustomTableInit = ref(false)
const isCustomTableInit = computed({
  get () {
    return _isCustomTableInit.value
  },
  set (v: boolean) {
    _isCustomTableInit.value = v
    if (v) {
      init(null, '')
    }
  }
})

const queue = ref([])
const init = async (params?: any, type?: string) => {
  if (isCustomTableInit.value) {
    emit('init-start')

    isLoading.value = true
    if (type === 'input') {
      changePage()
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
    }, 300)

    emit('init-end', [resData, resDataCount])
    return [resData, resDataCount]
  } else {
    queue.value.push('init')
  }
}

const throttleInit = throttle<typeof init>(init, 200, { isNoTrailing: true })

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
const onViewTypeChange = async () => {
  tableData.value = []
  tableDataCount.value = 0
  await nextTick()
  throttleInit(null, 'input')
}

const lazyLoadingStatus = ref<LazyLoadingStatus>('loadMore')

// 可用函數
defineExpose({
  init,
  getTableData: () => {
    return getProxyData(tableData.value)
  },
  getTableDataCount: () => {
    return getProxyData(tableDataCount.value)
  },
  setFilter,
  getSelectionRows,
  toggleSelection
})

onMounted(() => {
  if (props.isMountedInit) {
    throttleInit(null, '')
  }
})
</script>

<template>
  <div v-loading="isLoading" class="web-view">
    <CustomTable
      ref="customTableRef"
      :table-data="tableData"
      :table-data-count="tableDataCount"
      v-bind="tableSetting"
      :is-lazy-loading="islazyLoading"
      :lazy-loading-status="lazyLoadingStatus"
      @excel="download"
      @expand-change="onExpandChange"
      @select="onSelect"
      @select-all="onSelectAll"
      @selection-change="onSelectionChange"
      @row-click="onRowClick"
      @row-contextmenu="onRowContextmenu"
      @show-change="throttleInit($event, 'table')"
      @load="throttleInit($event, 'table')"
      @init-finish="isCustomTableInit = true"
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
                  @change="onViewTypeChange"
                />
              </CustomTooltip>
            </div>

            <GroupSearch
              :columns="filterColumn"
              class="grid-row"
              @reset="resetFilter"
              @submit="throttleInit()"
            >
              <template #search-all="scope">
                <slot name="search-all" :filter-column="filterColumn" v-bind="scope">
                  <CustomSearch
                    class="grid-col-xs-12 grid-col-md-8 grid-col-lg-6"
                    v-model="filter[scope.prop]"
                    v-model:active="activeFilter[scope.prop]"
                    :i18nModule="i18nModule"
                    v-bind="filterColumn[scope.prop]"
                    :label="i18nTranslate(scope.column?.i18nLabel)"
                  />
                </slot>
              </template>
              <template
                v-for="slotKey in tableSlotKeyList"
                :key="slotKey"
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
              :label="i18nTranslate('refrush', defaultModuleType)"
              icon-name="rotate"
              icon-move="rotate"
              @click="throttleInit(null, 'input')"
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
              v-model:conditions="filterConditions[scope.prop]"
              :i18nModule="i18nModule"
              v-bind="filterColumn[scope.prop]"
              :label="i18nTranslate(scope.column?.i18nLabel)"
              search
              :column-id="scope.prop"
              @change="throttleInit($event, 'input')"
              @submit="throttleInit($event, 'input')"
            />
            <span v-else>{{ i18nTranslate(scope.column?.i18nLabel) }}</span>
          </div>
        </slot>
      </template>
      <template
        v-for="slotKey in tableSlotKeyList"
        :key="slotKey"
        #[getHeaderSlot(slotKey)]="scope"
      >
        <slot :name="getHeaderSlot(slotKey)" :filter-column="filterColumn" v-bind="scope"></slot>
      </template>

      <template
        v-for="slotKey in tableSlotKeyList"
        :key="slotKey"
        #[getColumnSlot(slotKey)]="scope"
      >
        <slot :name="getColumnSlot(slotKey)" :filter-column="filterColumn" v-bind="scope">
          {{ scope.data }}
        </slot>
      </template>
    </CustomTable>
  </div>
</template>

<style lang="scss" scoped>
.web-view {
  width: 100%;
  height: 100%;

  &-column {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
  }
}
</style>
