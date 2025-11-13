<script setup lang="ts">
import { ref, useSlots, nextTick, computed, inject, reactive } from 'vue'

import type { UseHook } from '@/types/types_hook' // 全域功能類型
import type { CustomTableProps } from '@/components/table' // 系統組件: 表格

import { useTableSlot } from '@/components/table/BasicTable/hook'
import CustomTable from '@/components/table/CustomTable/CustomTable.vue'
import TimeLineTable from '@/components/table/TimeLineTable/TimeLineTable.vue'
import SubTable from '@/components/table/SubTable/SubTable.vue'
import DownloadModal from '@/components/table/DownloadModal/DownloadModal.vue'

import GroupSearch from '@/components/input/CustomSearch/GroupSearch.vue'
import CustomSearch from '@/components/input/CustomSearch/CustomSearch.vue'
import CustomInput from '@/components/input/CustomInput/CustomInput.vue'

import CustomIcon from '@/components/feature/CustomIcon/CustomIcon.vue'
import CustomButton from '@/components/feature/CustomButton/CustomButton.vue'
import CustomModal from '@/components/feature/CustomModal/CustomModal.vue'
import CustomTooltip from '@/components/feature/CustomTooltip/CustomTooltip.vue'

import { getColumnSetting } from '@/lib/lib_idb'
import { throttle } from '@/lib/lib_lodash'
import { hasOwnProperty, getProxyData, isEmpty, getUuid, deepClone } from '@/lib/lib_utils' // 工具
import { defaultModuleType } from '@/declare/declare_i18n'

import { version, props as webViewCustomTableProps } from './WebViewTableInfo'
// import FilterLoader from './Components/FilterLoader.vue'
import DataLoader from '@/components/views/Common/DataLoader.vue'

import {
  webViewUrl,
  getUrlParams,
  getWebViewParams,
  getTableData,
  getExcelData
} from './api'

import {
  useWebViewFilter,
  useWebViewFilterCondition,
  useWebViewSelection,
  useWebViewTable
} from './hook'

// import dayjs from 'dayjs'
// import { ConsoleSqlOutlined } from '@vicons/antd'

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
  'reset', // onReset
  'mounted' // WebViewTable mounted
])

const useHook = inject('useHook') as UseHook
const i18nModule = props?.tableOptions?.i18nModule ?? defaultModuleType
const { i18nTranslate, i18nTest } = useHook({ i18nModule })

const isLoading = ref(false)

// 勾選資訊
const {
  selectionRow,
  selectionList,
  isShowSelectionInfo
} = useWebViewSelection()

// emit event
const onExpandChange = (row: any, expanded: boolean) => {
  emit('expand-change', row, expanded)
}
const onSelect = (selection: any, row: any) => {
  selectionRow.value = row
  selectionList.value = Array.isArray(selection) ? selection : []
  emit('select', selection, row)
}
const onSelectAll = (selection: any) => {
  selectionList.value = Array.isArray(selection) ? selection : []
  emit('select-all', selection)
}
const onSelectionChange = (selection: any) => {
  emit('selection-change', selection)
}
const onRowClick = (row: any, column: any, event: any) => {
  emit('row-click', row, column, event)
}
const onColumnsChange = (showColumns: any) => {
  emit('columns-change', showColumns)
}
const onRowContextmenu = (row: any, column: any, event: Event) => {
  emit('row-contextmenu', row, column, event)
}

// 搜尋資訊
const {
  filterColumn,
  filter,
  activeFilter,
  getFilter,
  resetFilter,
  activeConditions,
  filterConditions,
  getConditionFilter,
  setConditionFilter,
  // expose
  setFilter
} = useWebViewFilter(props)

// 進階搜尋
const {
  filterConditionMap,
  initFilterConditionMap,
  getIsCondition
} = useWebViewFilterCondition(props)

// 表格
const {
  tableData,
  tableDataCount,

  tableSetting,
  downloadExcel,
  // setParams,
  getParams,
  changePage,
  toggleSelection,
  getSelectionRows,
  getDisplayData,
  spanInfo
} = useWebViewTable(props, i18nModule)

const ajaxOptions = computed(() => {
  return  {
    isFakeData: props.useFakeData, // 是否使用假資料
    fakeDataPath: props.fakeDataPath, // 假資料get路徑
    fakeData: props.fakeData, // 假資料
    isLog: props.isLog // 是否console.log訊息
  }
})

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
    advanced: conditions,
    sortingMap: _sortingMap,
    // page,
    // size,
    paging: {
      page,
      size
    },
    ..._params,
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
    urlParams, // api 入口
    params, // 參數
    formatExcel, // Excel資料格式化
    ajaxOptions.value
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
const DownloadModalRef = ref<InstanceType<typeof DownloadModal>>()
const isShowPdf = ref(false)
const onPdfClick = async (type: string) => {
  isShowPdf.value = true
  await nextTick()
  const { settingKey, i18nTitle, title } = tableSetting
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

  DownloadModalRef.value.setPdfSetting({
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
  if (subTableInfo) subTableInfo.columnsWidth[prop] = newWidth
}

// 初始化表格資料
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
    // page: _page,
    // size,
    paging: {
      page: _page,
      size
    },
    advanced: conditions,
    sortingMap: _sortingMap,
    ..._params,
    ...webViewParams
  }

  const formatData = props.formatTable ?? props.formatData

  const [
    resData, // api 取得資料
    resDataCount // api 取得資料筆數
  ] = await getTableData(
    urlParams, // api 入口
    params,
    formatData, // 表格資料格式化
    ajaxOptions.value
  )

  // 資料懶加載
  if (islazyLoading.value) {
    const oldData = tableData.value
    const newData = isReset ? resData : [...oldData, ...resData]
    tableData.value = newData
    tableDataCount.value = resDataCount // newData.length
    lazyLoadingStatus.value = resData.length >= size ? 'loadMore' : 'noMore'

    // 資料依據分頁
  } else {
    tableData.value = resData
    tableDataCount.value = resDataCount
  }

  // 重新設定資料 清除選取
  selectionRow.value = null
  selectionList.value = []

  return [resData, resDataCount]
}

const TimeLineTableRef = ref<InstanceType<typeof TimeLineTable>>()
const __isShowTimeLineTable__ = computed(() => {
  return props.isShowTimeLineTable &&
    tableSetting.tableColumns.some(tableColumn => {
      return tableColumn?.isTimeLineDate ?? false
    })
})

// 初始化資料
const init = async (params?: any, type?: string) => {
  isLoading.value = true
  await nextTick()

  // 初始化資料前 可執行其他事件
  if (typeof props.beforeInitCallBack === 'function') {
    props.beforeInitCallBack()
  }

  if (type === 'input') {
    changePage(1)
    if(params !== 'DataLoader') dataLoaderRef.value.autoSave()
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

  // 初始化資料後 可執行其他事件
  if (typeof props.afterInitCallBack === 'function') {
    props.afterInitCallBack()
  }

  // 時間線表格 同步更新
  if (modal.timeLine && TimeLineTableRef.value) {
    setTimeout(() => {
      TimeLineTableRef.value?.init()
    }, 800)
  }


  // dataLoaderRef?.value.autoSave()
  emit('init', [resData, resDataCount])
  return [resData, resDataCount]
}

const throttleInit = throttle<typeof init>(init, 300, {
  // leading: false,
  trailing: false
})

/**
 * 確保 CustomTable 初始化 排序(initSortingList) + 欄位(initShowColumns)
 * 才可以送出api
 */
 const onTableMounted = async () => {
  await nextTick()
  emit('mounted')

  await initFilterConditionMap(filterColumn)
  if (dataLoaderRef.value) dataLoaderRef.value.init()

  if (props.isMountedInit) {
    throttleInit(null, '')
  }
}

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
  emit('reset')
  changePage(1)

  await nextTick()
  throttleInit(null, 'input')
}

const lazyLoadingStatus = ref<CustomTableProps['lazyLoadingStatus']>('loadMore')

/**
 * 可用函數
 * 建議在 emit('mounted') 後使用
 */
defineExpose({
  // 搜尋
  setFilter,
  getConditions: () => getConditionFilter(),
  setConditions: (key: string, conditions: any[]) => {
    activeConditions[key] = !isEmpty(conditions)
    setConditionFilter(key, conditions)
  },
  // 初始化
  init,
  // 表格資料
  getTableData: () => getProxyData(tableData.value),
  getTableDataCount: () => getProxyData(tableDataCount.value),
  // 勾選
  toggleSelection,
  getSelectionRows
})

// modal
const modal = reactive({
  timeLine: false, // 時間線表格
  pdf: false // PDF下載
})

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}

// Filter
const sendFilter = (event: any, type?: any) => {
  throttleInit(event, type)
  // updateIDBFilter()
}

const dataLoaderRef = ref()
const getCurFilter = () => {
  const value = {
    activeFilter: deepClone({}, activeFilter),
    filter: deepClone({}, filter),
    activeConditions: deepClone({}, activeConditions),
    filterConditions: deepClone({}, filterConditions)
  }
  return value



  // const filterProps = Object.values(filterColumn).map(column => column.prop)
  // const filterSet = filterSetMap.get(key).value

  // const value = filterProps.forEach(prop => {
  //   activeFilter[prop] = filterSet.activeFilter[prop]
  //   filter[prop] = filterSet.filter[prop]
  //   activeConditions[prop] = filterSet.activeConditions[prop]
  //   filterConditions[prop] = filterSet.filterConditions[prop]
  // })



  // const value = {
  //   searchForm: deepClone({}, searchForm),
  //   searchActiveForms: deepClone({}, searchActiveForms)
  // }
  // return value
}
const loadFilter = (loadfilter: any) => {
  const filterProps = Object.values(filterColumn).map(column => column.prop)
  filterProps.forEach(prop => {
    activeFilter[prop] = loadfilter.activeFilter[prop] ?? true
    filter[prop] = loadfilter.filter[prop] ?? null
    activeConditions[prop] = loadfilter.activeConditions[prop] ?? false
    filterConditions[prop] = loadfilter.filterConditions[prop] ?? []
  })

  sendFilter('DataLoader', 'input')
}
const saveFilter = () => {
  sendFilter('DataLoader', 'input')
}


// const updateDB = async () => {
//   const dbKey = `filterSetOptions_${props.tableOptions.settingKey}`
//   const dbValue = {
//     defaultOptionKey,
//     options: [...filterSetMap.values()]
//   }

//   await setDataOptions(dbKey, dbValue)
// }
// const setFilterSetOption = dbOption => {
//   const { key, name, date } = dbOption
//   filterSetMap.set(key, dbOption)
//   return { key, name, date }
// }
// const initFilterSet = async () => {
//   const dbKey = `filterSetOptions_${props.tableOptions.settingKey}`
//   const dbDateOptions = await getDataOptions(dbKey) ?? { options: [], defaultOptionKey: null }
//   const { options } = dbDateOptions
//   defaultOptionKey = dbDateOptions.defaultOptionKey

//   filterSetOptions.value = options.map(setFilterSetOption)
// }
// const saveFilterSet = async (name?: string) => {
//   // Create Option
//   const key = getUuid()
//   const date = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
//   const value = {
//     activeFilter: deepClone({}, activeFilter),
//     filter: deepClone({}, filter),
//     activeConditions: deepClone({}, activeConditions),
//     filterConditions: deepClone({}, filterConditions)
//   }

//   const nameList =  filterSetOptions.value.map(option => option.name)
//   const formatName = (inputName, count) => {
//     if(isEmpty(inputName)) return formatName(i18nTranslate('setting', 'System_common'), 1)

//     const tempName = (count === 1) ? inputName : `${inputName} (${count})`
//     if(nameList.includes(tempName)) return formatName(inputName, count + 1)
//     return tempName
//   }
//   const option = { key, name: formatName(name, 1), date, value }

//   const filterSetOption = setFilterSetOption(option)
//   filterSetOptions.value.push(filterSetOption)

//   await updateDB()
// }

// const loadFilterSet = (key: string) => {
//   const filterProps = Object.values(filterColumn).map(column => column.prop)
//   const filterSet = filterSetMap.get(key).value

//   filterProps.forEach(prop => {
//     activeFilter[prop] = filterSet.activeFilter[prop]
//     filter[prop] = filterSet.filter[prop]
//     activeConditions[prop] = filterSet.activeConditions[prop]
//     filterConditions[prop] = filterSet.filterConditions[prop]
//   })

//   sendFilter(null, 'input')
// }
// const removeFilterSet = async (key: string) => {
//   const spliceIndex = filterSetOptions.value.findIndex(option => option.key === key)
//   filterSetOptions.value.splice(spliceIndex, 1)
//   filterSetMap.delete(key)

//   await updateDB()
// }
const {
  slotKeyList,
  getSearchSlot,
  getHeaderSlot,
  getColumnSlot
} = useTableSlot(tableSetting.tableColumns)


const displayBatchAction = computed(() => {
  return isShowSelectionInfo && selectionList.value.length > 0
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
        <div class="flex-row content-between">
          <div
            v-if="hasSlot('selection-operations')"
            class="batch-container" :class="displayBatchAction ? 'display': 'hidden'"
          >
            <slot
              name="selection-operations"
              :selection-row="selectionRow"
              :selection-list="selectionList"
              :length="selectionList.length"
              >
            </slot>
          </div>
          <slot name="prepend">
            <div></div>
          </slot>
        </div>
      </template>

      <template #setting-right>
        <GroupSearch
          :columns="filterColumn"
          class="grid-row"
          :size="480"
          @reset="resetFilter"
          @submit="sendFilter(null, 'input')"
        >
          <template
            v-for="slotKey in slotKeyList"
            :key="`search-slotKey-${slotKey}-${scopedId}`"
            #[getSearchSlot(`${slotKey}`)]="scope"
          >
            <slot
              :name="getSearchSlot(`${slotKey}`)"
              :filter-column="filterColumn"
              v-bind="scope"
            ></slot>
          </template>
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
                :is-condition="getIsCondition(scope.prop, filterColumn)"
              />
            </slot>
          </template>

          <template #footer>
            <DataLoader ref="dataLoaderRef"
              :db-key="tableSetting.settingKey"
              :getCurData="getCurFilter"
              @load="loadFilter"
              @save="saveFilter"
            />
            <!-- <div class="filter-set-container">
              <FilterLoader
                :options="filterSetOptions"
                @load="loadFilterSet"
                @remove="removeFilterSet"
              />
            </div>
            <div class="filter-set-container"
              @mouseover="setHover(true)"
              @mouseleave="setHover(false)"
            >
              <div class="filter-set-save-btn">
                <CustomButton
                  type="success"
                  :label="i18nTranslate('setting-save', 'System_common')"
                  icon-name="save"
                  @click="saveFilterSet(filterSetName)"
                />
              </div>
              <div class="filter-set-save-input" :class="filterSetSaveHover? 'display': 'hidden'">
                <CustomInput
                  v-model="filterSetName"
                  :placeholder="`${i18nTranslate('setting-placeholder', 'System_common')}`"
                  hiddenLabel
                  direction="row"
                  clearable
                  @keyup.enter="saveFilterSet(filterSetName)"
                />
              </div>
            </div> -->

          </template>

        </GroupSearch>

        <CustomButton
          :label="i18nTranslate('refresh', defaultModuleType)"
          icon-name="rotate"
          icon-move="rotate"
          hover-display
          @click="onReset"
        />
      </template>

      <template #append>
        <div v-show="__isShowTimeLineTable__" class="web-view-time-line">
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

      <!-- 展開 自訂內容 -->
      <template v-if="hasSlot('row-expand-header')" #row-expand-header="scope">
        <slot name="row-expand-header" v-bind="scope"></slot>
      </template>
      <template v-if="hasSlot('row-expand')" #row-expand="scope">
        <slot name="row-expand" v-bind="scope"></slot>
      </template>

      <!-- 勾選 checkbox -->
      <template v-if="hasSlot('row-selection-header')" #row-selection-header="scope">
        <slot name="row-selection-header" v-bind="scope"></slot>
      </template>
      <template v-if="hasSlot('row-selection')" #row-selection="scope">
        <slot name="row-selection" v-bind="scope"></slot>
      </template>

      <!-- 顯示行數編號  -->
      <template v-if="hasSlot('row-no-header')" #row-no-header="scope">
        <slot name="row-no-header" v-bind="scope"></slot>
      </template>
      <template v-if="hasSlot('row-no')" #row-no="scope">
        <slot name="row-no" v-bind="scope"></slot>
      </template>

      <!-- 顯示操作 -->
      <template #row-operations-header="scope">
        <div class="i-selection-operations-header">
          <slot
            name="row-operations-header"
            v-bind="scope"
            :selection-row="selectionRow"
            :selection-list="selectionList"
            :length="selectionList.length"
          >
            <CustomIcon name="gear" />
          </slot>
        </div>
        <!-- 勾選 checkbox 批次操作用 -->
        <!-- <CustomPopover
          v-model:visible="isShowSelectionInfo"
          :disabled="!tableSetting.selection"
          trigger="click"
          popper-class="web-view-selection-popover"
          placement="top"
          :show-after="200"
          :offset="8"
        >
          <template #reference>
            <div class="i-selection-operations-header">
              <slot
                name="row-operations-header"
                v-bind="scope"
                :selection-row="selectionRow"
                :selection-list="selectionList"
                :length="selectionList.length"
              >
                <CustomIcon name="gear" />
              </slot>
            </div>
          </template>
          勾選資訊
          <div class="web-view-selection">
            <div>{{ i18nTranslate('selection-count', defaultModuleType) }}：{{ selectionList.length }}</div>
            批次操作使用
            <slot
              name="selection-operations"
              :selection-row="selectionRow"
              :selection-list="selectionList"
              :length="selectionList.length"
            ></slot>
          </div>
          跨頁選取介面 (尚未製作)
        </CustomPopover> -->
      </template>
      <template v-if="hasSlot('row-operations')" #row-operations="scope">
        <slot name="row-operations" v-bind="scope">
          <div class="i-selection-operations-column">
            <CustomIcon name="ellipsis-vertical" />
          </div>
        </slot>
      </template>

      <!-- 欄位設定 -->
      <template
        v-for="slotKey in slotKeyList"
        :key="`view-header-slotKey-${slotKey}-${scopedId}`"
        #[getHeaderSlot(`${slotKey}`)]="scope"
      >
        <slot :name="getHeaderSlot(`${slotKey}`)" :filter-column="filterColumn" v-bind="scope"></slot>
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
              :is-condition="getIsCondition(scope.prop, filterColumn)"
              search
              @change="sendFilter($event, 'input')"
              @submit="sendFilter($event, 'input')"
            />
            <span v-else>{{ i18nTranslate(scope.column?.i18nLabel ?? scope.column?.label) }}</span>
          </div>
        </slot>
      </template>
      <template #column-all="{row, prop}">
        {{ getDisplayData(row, prop) }}
      </template>

      <template
        v-for="columnKey in spanInfo.leftProps"
        :key="columnKey"
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

      <!-- <template
        v-for="slotKey in spanColumns"
       :key="`view-column-slotKey-${slotKey}-${scopedId}`"
       #[`column-${slotKey}`]="{ prop, rowData }"
      >
        <SubTable data="getSubTableData(prop, rowData)"/>
      </template> -->

      <template
        v-for="slotKey in slotKeyList"
        :key="`view-column-slotKey-${slotKey}-${scopedId}`"
        #[getColumnSlot(`${slotKey}`)]="scope"
      >
        <slot :name="getColumnSlot(`${slotKey}`)" :filter-column="filterColumn" v-bind="scope">
          {{ scope.data }}
        </slot>
      </template>
    </CustomTable>

    <!-- 客製圖表 -->
    <slot
      name="chart"
      :table-columns="tableSetting.tableColumns"
      :i18n-module="tableSetting.i18nModule"
      :table-data="tableData"
    ></slot>

    <!-- 時間線表格 -->
    <CustomModal
      v-if="__isShowTimeLineTable__"
      v-model="modal.timeLine"
      :title="i18nTranslate('timeLine-table', defaultModuleType)"
      :modal="false"
      draggable
      hidden-footer
      :hidden-collapse="false"
    >
      <TimeLineTable
        ref="TimeLineTableRef"
        :table-columns="tableSetting.tableColumns"
        :i18n-module="tableSetting.i18nModule"
        :table-data="tableData"
      />
    </CustomModal>

    <!-- PDF下載 -->
    <DownloadModal
      v-if="isShowPdf"
      v-model="modal.pdf"
      :i18n-module="i18nModule"
      ref="DownloadModalRef"
    />
  </div>
</template>

<style lang="scss" scoped>
:global(.el-popper.web-view-selection-popover) {
  width: fit-content !important;
  min-width: fit-content !important;
  z-index: var(--i-z-index-table-selection-popover) !important;
}

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

  &-selection {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &-time-line {
    margin-right: 6px;
  }
}

.filter-set {
  &-container {
    display: flex;
    flex: row;
    width: fit-content;
  }
  &-save {
    &-input {
      width: 200px;
      transition-property: max-width;
      transition-duration: 1s;

      &.display {
        max-width: 400px;
      }
      &.hidden {
        max-width: 0px;
      }
    }
  }

  &-load {
    &-input {
      width: 300px;
    }
    &-option {
      &-container {
        display: flex;
        flex-direction: column;
      }
      &-item {
        display: flex;
        padding: 0 4px 0 8px;
        align-items: center;
        border-bottom: 3px solid #00000000;

        cursor: pointer;
        &:hover {
          background-color: var(--el-color-primary-light-9);
        }
      }
    }
  }
}
.batch {
  &-container {
    transition:  max-width 0.5s, margin-right 0.3s;
    &.display {
      margin-right: 8px;
      max-width: 1000px;
    }
    &.hidden {
      margin-right: 0px;
      max-width: 0px;
      overflow: hidden;
    }
  }
}
</style>
