<script setup lang="ts">
import { shallowRef, ref, reactive, onMounted, nextTick, computed, inject } from 'vue'

import type { Hook } from '@/declare/hook'

import {
  type DraggableChange,
  CustomDraggable,
  type SpanMethod,
  TableMain,
  CustomInput,
  CustomButton,
  CustomTabs,
  CustomIcon,
  CustomSearch
} from '@/components'
import { isEmpty, scrollToEl, getUuid } from '@/lib/lib_utils'
import { getSimpleTableSetting, getFormSetting } from '@/lib/lib_columns'
import dayjs from '@/lib/lib_day'

import type { TableData, Search } from './api'
import { getVersionOptions, getData } from './api'
import { columnSetting } from './columns'

const hook: Hook = inject('hook')
const { i18nTranslate } = hook()

const isLoading = ref(true)

const tab = ref('search')
const tabs = [
  { label: '搜尋', key: 'search' },
  { label: '排序', key: 'sort' }
]

const dateTab = ref('')
const dateTabs = ref([
  // { label: '20231128', key: '20231128' },
  // { label: '20231129', key: '20231129' }
])

const isOpen = ref(true)

const options = reactive({
  // search
  version: [],
  dateInterval: [],

  // filter
  machine: [],
  custProduct: [],
  process: [],
  product: [],
  productGroup: [],
  reportRestrictedGroup: []
})

// search
const {
  columns: searchColumn,
  forms: search,
  reset: resetForm,
  getActiveForms: getSearch,
  validate: validateForm
} = getFormSetting<Search>(columnSetting, 'search')

// filter
const {
  columns: filterColumn,
  forms: filter,
  activeForms: activeFilter,
  getActiveForms: getFilter
} = getFormSetting<TableData>(columnSetting, 'filter')

const isSubmitDisabled = computed(() => {
  return isEmpty(search.version) || isEmpty(search.dateInterval)
})

const getDateIntervalOptions = () => {
  const _options = []
  const getDay = (dayIndex: number) => {
    return dayjs(new Date()).add(dayIndex, 'days')
  }

  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    const date = getDay(dayIndex).format('YYYY-MM-DD')

    _options.push({
      label: date,
      value: date
    })
  }
  return _options
}

// 前六個欄位
const propList = [
  { prop: 'machine', value: '機台' },
  { prop: 'custProduct', value: '客戶產品編號' },
  { prop: 'process', value: '製程' },
  { prop: 'product', value: '產品型號' },
  { prop: 'productGroup', value: '產品族' },
  { prop: 'reportRestrictedGroup', value: 'Device Group' }
]
const sortList = ref([])
const sortMap = {
  machine: 0,
  custProduct: 1,
  process: 2,
  product: 3,
  productGroup: 4,
  reportRestrictedGroup: 5,

  length: 6
}
/**
 * 欄位資料 prop: { uuid: rowspan }
 *
 * 跨欄用資料 示意圖
 *        c1  c2  c3  c4
 * uuid1   6   4   3   1
 * uuid2   0   0   0   1
 * uuid3   0   0   0   1
 * uuid4   0   0   1   1
 * uuid5   0   2   1   1
 * uuid6   0   0   1   1
 */
const spanMethodMap = reactive({
  machine: {},
  custProduct: {},
  process: {},
  product: {},
  productGroup: {},
  reportRestrictedGroup: {},

  restrictionCategoryName: {},
  restrictionResourceName: {},

  restrictionName: {}
})
// 欄位資料 prop: uuid
const spanMethodPoint = {
  machine: '',
  custProduct: '',
  process: '',
  product: '',
  productGroup: '',
  reportRestrictedGroup: '',
  restrictionCategoryName: '',
  restrictionResourceName: '',

  restrictionName: ''
}

const rowSpanMethod: SpanMethod = (data) => {
  // console.log(data)
  const { row, column } = data
  const { property = '' } = column
  if (isEmpty(spanMethodMap[property])) return

  const rowspan = spanMethodMap[property][row.id] ?? 1
  return {
    rowspan,
    colspan: 1
  }
}

// table
const resData = ref<Record<string, TableData[]>>({})
const showData = shallowRef<TableData[]>([])

// 資源警示
const { tableColumns } = getSimpleTableSetting(columnSetting, 'table', '')
const showColumns = shallowRef([])

const initShowColumns = async () => {
  await nextTick()

  const _showColumns = new Array(sortMap.length)

  tableColumns.forEach(column => {
    const insertIndex = sortMap[column?.prop ?? '']
    if (!isEmpty(insertIndex) && typeof insertIndex === 'number') {
      _showColumns.splice(insertIndex, 1, column)
    } else {
      _showColumns.push(column)
    }
  })

  showColumns.value = _showColumns.filter(column => !isEmpty(column))
}

const initShowData = async () => {
  let _showData = []
  await nextTick()

  // 前8個欄位需要計算 rowspan
  const columnLength = 8
  const spanMethodColumns = showColumns.value.slice(0, columnLength)

  // 依據上一筆資料 比對判斷是否切換 uuid
  const isChangePoint = (_prevRow: TableData | {}, _row: TableData, _spanMethodColumns: any[]) => {
    return _spanMethodColumns.some(_column => {
      const { prop: _prop } = _column

      return _prevRow[_prop] !== _row[_prop]
    })
  }

  let prevRow = {}

  // 針對前六個欄位
  propList.forEach(propItem => {
    const { prop } = propItem
    spanMethodMap[prop] = {}

    spanMethodPoint[prop] = ''

    options[prop].splice(0)
  })
  // 清空欄位計算資料
  spanMethodMap.restrictionCategoryName = {}
  spanMethodMap.restrictionResourceName = {}

  spanMethodMap.restrictionName = {}
  // 清空指針位置
  spanMethodPoint.restrictionCategoryName = ''
  spanMethodPoint.restrictionResourceName = ''

  spanMethodPoint.restrictionName = ''

  const filterSet = new Set()
  const filter = getFilter(false)

  if (!isEmpty(resData.value[dateTab.value])) {
    _showData = resData.value[dateTab.value].reduce((res, row) => {
      const {
        id
        // restrictionCompareReportsLength = 0
      } = row

      // 是否顯示
      let isShow = true

      // 計算跨欄
      for (let i = (columnLength - 1); i >= 0; i--) {
        const column = spanMethodColumns[i]
        const { prop } = column

        if ([undefined, null].includes(spanMethodMap[prop])) continue

        // 跨欄用欄位要存在 && 還未設置 uuid
        if (isEmpty(spanMethodMap[prop][id])) {
          spanMethodMap[prop][id] = 0
        }

        if (isEmpty(prevRow) || isChangePoint(prevRow, row, spanMethodColumns.slice(0, i + 1))) {
          spanMethodPoint[prop] = id

          // 設定過濾選項
          if (!filterSet.has(row[prop]) && Array.isArray(options[prop])) {
            filterSet.add(row[prop])

            options[prop].push({
              label: row[prop],
              value: row[prop]
            })
          }
        }

        // 有過濾資料 && 不包含
        if (!isEmpty(filter[prop]) && !filter[prop].includes(row[prop])) {
          isShow = false
          spanMethodPoint[prop] = id
        }

        const insetUuid = spanMethodPoint[prop]
        spanMethodMap[prop][insetUuid] += 1

        // 觀察用
        spanMethodMap['restrictionName'][id] = 1
      }

      if (isShow) {
        res.push(row)
        // 上一筆資料
        prevRow = row
      }

      return res
    }, [])
  }

  showData.value = _showData
}

const initShowTable = async () => {
  isLoading.value = true

  await nextTick()
  setTimeout(() => {
    initShowColumns()
  }, 0)

  await nextTick()
  setTimeout(() => {
    initShowData()
  }, 100)

  await nextTick()
  setTimeout(() => {
    isLoading.value = false
  }, 300)
}

const onSortChange = async (draggable: DraggableChange) => {
  isLoading.value = true

  await nextTick()
  const { moved } = draggable

  if (!isEmpty(moved)) {
    setTimeout(() => {
      sortList.value.forEach((element, elementIndex) => {
        sortMap[element.id] = elementIndex
      })

      initShowTable()
    }, 200)
  }
}

// 初始化顯示用資料
const initData = async () => {
  const _resData = await getData(getSearch(false))
  _resData.forEach(row => {
    const { relatingObjects = [] } = row

    relatingObjects.forEach(relatingObject => {
      const { dateOfPlan, objectDetails = [] } = relatingObject

      // 依照日期切割資料
      if (isEmpty(resData.value[dateOfPlan]) && !Array.isArray(resData.value[dateOfPlan])) {
        resData.value[dateOfPlan] = []
      }

      // 有排序
      objectDetails.forEach(objectDetail => {
        const {
          machineId,
          productId,
          processId,
          limit2CertainTypeOfObj,
          compareResults = []
        } = objectDetail

        const { productGroup, custProduct, resourceScheduleRestrictedGroup } = limit2CertainTypeOfObj

        // 無排序
        compareResults.forEach(compareResult => {
          const { restrictionCategoryName, restrictionResources = [] } = compareResult

          restrictionResources.forEach(restrictionResource => {
            const { restrictionResourceName, restrictionCompareReports } = restrictionResource
            const restrictionCompareReportsLength = restrictionCompareReports.length

            const _data = {
              id: getUuid(`${dateOfPlan}-${machineId}-${processId}-${productGroup}-${custProduct}-${productId}-${resourceScheduleRestrictedGroup}`),
              dateInterval: dateOfPlan,
              machine: machineId,
              process: processId,
              productGroup: productGroup,
              custProduct: custProduct,
              product: productId,
              reportRestrictedGroup: resourceScheduleRestrictedGroup,

              restrictionCategoryName,
              restrictionResourceName,
              restrictionCompareReportsLength,

              restrictionName: '',
              restrictionValue: '',
              matchingType: '',
              inputValue: '',
              compareDetailInsufficient: '',
              compareDetailExtra: '',
              discrepancy: ''
            }
            // 塞入資料
            if (isEmpty(restrictionCompareReports)) {
              resData.value[dateOfPlan].push({ ..._data })
            } else {
              restrictionCompareReports.forEach(restrictionCompareReport => {
                const {
                  restrictionName,
                  restrictionValue,
                  matchingType,
                  inputValue,
                  compareDetailInsufficient,
                  compareDetailExtra,
                  discrepancy
                } = restrictionCompareReport

                // 塞入資料
                resData.value[dateOfPlan].push({
                  ..._data,

                  id: getUuid(`${dateOfPlan}-${machineId}-${processId}-${productGroup}-${custProduct}-${productId}-${resourceScheduleRestrictedGroup}`),
                  restrictionName,
                  restrictionValue,
                  matchingType,
                  inputValue,
                  compareDetailInsufficient,
                  compareDetailExtra,
                  discrepancy
                })
              })
            }
          })
        })

      })
    })
  })
}

const init = async () => {
  options.version = await getVersionOptions()
  options.dateInterval = getDateIntervalOptions()

  sortList.value.splice(0)
  await nextTick()
  initShowTable()

  propList.forEach(propItem => {
    const { prop, value } = propItem
    sortList.value.push({ id: prop, value })
  })
}

const initTabs = async () => {
  await nextTick()
  dateTabs.value.splice(0)

  search.dateInterval.forEach((date, dateIndex) => {
    if (dateIndex === 0) {
      dateTab.value = date
    }

    dateTabs.value.push({ label: date, key: date })
  })

  // 測試用
  dateTabs.value.unshift(...[
    { label: '20231128', key: '20231128' },
    { label: '20231129', key: '20231129' }
  ])
  dateTab.value = '20231128'
}

const filterSearch = async () => {
  await validateForm().then(async () => {
    isLoading.value = true
    await nextTick()

    initTabs()
    await initData()

    await nextTick()
    initShowTable()

  }).catch(errorList => {
    console.log(errorList)
    const el = errorList[0]?.getDom()
    if (el) {
      scrollToEl(el)
    }
  })
}

onMounted(async () => {
  isLoading.value = true

  await init()
  await nextTick()
  setTimeout(() => {
    isLoading.value = false
  }, 300)
})

const isShowChange = async () => {
  isLoading.value = true

  await nextTick()
  isOpen.value = !isOpen.value

  await nextTick()
  setTimeout(() => {
    isLoading.value = false
  }, 500)
}

</script>

<template>
  <div v-loading="isLoading" class="fund-1608 page-wrapper">
    <div class="page-feature" :class="isOpen ? 'is-open': 'is-close'">
      <!-- 縮放箭頭 -->
      <CustomButton
        icon-name="chevron-left"
        class="feature-btn"
        :class="isOpen ? 'is-open': 'is-close'"
        circle
        @click="isShowChange"
      />

      <CustomTabs v-model="tab" :list="tabs" />

      <div class="feature-container">
        <div class="feature-content">
          <Transition name="fixed" mode="out-in">
            <KeepAlive>
              <div v-if="tab === 'search'">
                <CustomInput
                  v-model="search.version"
                  v-bind="searchColumn.version"
                  :options="options.version"
                />
                <CustomInput
                  v-model="search.dateInterval"
                  v-bind="searchColumn.dateInterval"
                  :options="options.dateInterval"
                />
                <CustomInput
                  v-model="search.showCorrectCompare"
                  v-bind="searchColumn.showCorrectCompare"
                />
                <div class="flex-row content-end i-ga-md">
                  <CustomButton
                    :label="i18nTranslate('reset')"
                    icon-name="broom"
                    icon-move="rotate"
                    @click="resetForm"
                  />
                  <CustomButton
                    type="primary"
                    :label="i18nTranslate('search')"
                    icon-name="magnifying-glass"
                    :disabled="isSubmitDisabled"
                    @click="filterSearch"
                  />
                </div>
              </div>
              <div v-else-if="tab === 'sort'">
                <CustomDraggable
                  v-model="sortList"
                  :row-style="{ borderRadius: '6px', backgroundColor: '#a0cfff' }"
                  @change="onSortChange"
                >
                  <template #item="{ element, index }">
                    <div class="flex-row-center content-between fill i-pa-md cursor-pointer">
                      <label class="cursor-pointer">{{ `${index + 1}. ${element.value}` }}</label>

                      <CustomIcon name="bars" />
                    </div>
                  </template>
                </CustomDraggable>
              </div>
            </KeepAlive>
          </Transition>
        </div>
      </div>

    </div>

    <div class="page-table">
      <CustomTabs v-model="dateTab" :list="dateTabs" @change="initShowTable"/>

      <TableMain
        class="page-table"
        :show-data="showData"
        :show-columns="showColumns"
        :span-method="rowSpanMethod"
      >
        <template #header-all="{ label }">
          <label>{{ label }}</label>
        </template>
        <template
          v-for="key in [
            'machine',
            'process',
            'productGroup',
            'custProduct',
            'product',
            'reportRestrictedGroup'
          ]"
          :key="key"
          #[`header-${key}`]="{ prop }"
        >
          <div class="i-py-xxs">
            <CustomSearch
              v-model="filter[prop]"
              v-model:active="activeFilter[prop]"
              v-bind="filterColumn[prop]"
              :options="options[prop]"
              search
              @blur="initShowTable"
            />
          </div>
        </template>

        <template
          v-for="key in [
            'machine',
            'process',
            'productGroup',
            'custProduct',
            'product',
            'reportRestrictedGroup',
            'restrictionCategoryName',
            'restrictionResourceName',
            'restrictionName'
          ]"
          :key="key"
          #[`column-${key}`]="{ row, prop }"
        >
          <div>{{ `${row[prop]}(${spanMethodMap[prop][row.id]})` }}</div>
        </template>
      </TableMain>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$feature-width: 270px;
$bg-color: #ecf5ff;

:deep(.page-table) {
  .cell {
    position: sticky;
    bottom: 30px;
    top: 30px
  }
}
.page {
  &-wrapper {
    width: 100%;
    height: 100%;
    padding: 16px;
    display: flex;
    gap: 16px;
    position: relative;
  }

  &-feature {
    width: $feature-width;
    height: 100%;
    will-change: margin-left;
    transition-duration: 0.3s;
    position: relative;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    &.is-open {
      margin-left: 0;
    }
    &.is-close {
      margin-left: -$feature-width;
    }

    .feature {
      &-btn {
        position: absolute;
        right: 0;
        top: 50%;
        z-index: 1;
        &.is-open {
          transform: translateY(-100%) translateX(50%) rotateZ(0deg);
        }
        &.is-close {
          transform: translateY(-100%) translateX(50%) rotateZ(180deg);
        }
      }
      &-container {
        width: 100%;
        flex: 1;
        height: 100%;
        padding: 16px;
        overflow-y: auto;
        background-color: $bg-color;
        border-radius: 0 0 6px 6px;
      }
      &-content {
        width: 100%;
        height: fit-content;
        padding: 8px 0;
      }
    }
  }

  &-table {
    flex: 1;
    width: 100%;
    will-change: width;
    position: relative;
    display: flex;
    flex-direction: column;
  }
}
</style>

<style lang="scss">
.fund-1608 .list-group {
  gap: 8px;
}
</style>
