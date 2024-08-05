<script setup lang="ts">
import type { PropType } from 'vue'
import { reactive, computed, ref, onMounted, nextTick, inject } from 'vue'

import type { UseHook } from '@/declare/hook.ts'
import type { Options, Option } from '@/components'
import {
  GanttChart,
  CustomTabs,
  CustomInput,
  CustomEmpty,
  CustomIcon,
  CustomPopover,
  CustomModal
} from '@/components'
import { isEmpty, hasOwnProperty, getUuid } from '@/lib/lib_utils'
import { getMilliseconds } from '@/lib/lib_day'
import { formatDatetime } from '@/lib/lib_format'
import { object_forEach, object_reduce } from '@/lib/lib_object'

import type { TableData } from '../api'
import type {
  GroupCallback,
  TooltipCallback,
  TextCallback,
  TooltipPositionCallback
} from './callback'
import {
  groupKeyword,
  groupCallbackMap,
  defaultTooltipCallback,
  defaultTextCallback,
  defaultTooltipPositionCallback
} from './callback'

import ScheduleGantt from './ScheduleGantt.vue'

export type Tab = 'order' | 'workOrder' | 'process' | 'machine'
type OrderStatus = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '999'

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook({
  i18nModule: 'system'
})

const scopedId = getUuid('ScheduleGantt')

const props = defineProps({
  level: {
    type: Number as PropType<number>,
    default: 1
  },
  title: {
    type: String as PropType<string>,
    default: ''
  },
  dateFormatX: {
    type: String as PropType<string>,
    default: 'YYYY-MM-DD',
    description: '決定 x 軸上方的日期顯示'
  },
  tableData: {
    type: Array as PropType<any[]>,
    default: () => {
      return []
    }
  },
  tabs: {
    type: Array as PropType<Options>,
    default: () => {
      return []
    }
  },
  defaultTab: {
    type: String as PropType<Tab>,
    default: ''
  }
})

const ganttRef = ref()
const tab = ref<Tab>(props.defaultTab)
const activeTabText = computed(() => {
  const currTab = props.tabs.find(tabItem => tabItem.value === tab.value) ?? ({} as Option)
  return currTab.i18nLabel ? i18nTranslate(currTab.i18nLabel) : currTab?.label ?? ''
})

const checkboxValue = ref<OrderStatus[]>(['0', '1', '2', '3', '4', '5', '6', '999'])
const statusType = {
  '0': { i18nLabel: 'gantt-state0', label: '未開工', value: 'status_waiting', color: '#909399' },
  '1': { i18nLabel: 'gantt-state1', label: '已結清', value: 'cleared', color: '#b88230' },
  '2': { i18nLabel: 'gantt-state2', label: '已完工', value: 'status_completed', color: '#67C23A' },
  '3': { i18nLabel: 'gantt-state3', label: '生產中', value: 'inProduction', color: '#F56C6C' },
  '4': { i18nLabel: 'gantt-state4', label: '已發放', value: 'release', color: '#409EFF' },
  '5': { i18nLabel: 'gantt-state5', label: '未發放', value: 'Unrelease', color: '#E6A23C' },
  '6': { i18nLabel: 'gantt-state6', label: '暫緩', value: 'hold', color: '#be72e1' },
  '999': { i18nLabel: 'gantt-state999', label: '結案', value: 'status_close', color: '#c45656' }
}

const checkboxOptions = computed(() => {
  return object_reduce<any[]>(
    statusType,
    (res: any[], curr: any, status: string) => {
      res.push({
        label: i18nTranslate(curr.i18nLabel),
        value: status,
        color: curr.color
      })

      return res
    },
    []
  )
})

const filter = ref<string[]>([])
const optionsSet = new Set()
const filterOptions = reactive([])
const onFilterChange = () => {
  initGantt(tab.value)
}

const onTabChange = async () => {
  isLoading.value = true
  filter.value = []
  await nextTick()

  setNextProps()

  setTimeout(() => {
    initFilterOptions()
  }, 10)

  setTimeout(() => {
    initGantt(tab.value)
  }, 300)
}

const onCheckboxChange = () => {
  initGantt(tab.value)
}

// 群組資料
const groupData = reactive<Record<string, any>>({})
// 甘特圖資料
const ganttData = reactive<any[]>([])

const ganttHeight = computed(() => {
  const tempHeight = ganttData.length / 3
  return (tempHeight > 500 ? tempHeight : 500) + 'px'
})

const isLoading = ref(true)

const ganttDateRange = reactive({
  startDate: '',
  startMilliseconds: null,
  endDate: '',
  endMilliseconds: null
})

/**
 * 甘特圖客製化顯示
 * tooltipCallback
 * textCallback
 * colorCallback
 * tooltipPositionCallback
 */
const translateTooltipCallback = (value, start, end, title) => {
  // 將翻譯引入defaultTooltipCallback
  return defaultTooltipCallback(value, start, end, title, i18nTranslate)
}
const ganttTooltipCallback = ref(translateTooltipCallback)
const ganttTextCallback = ref(defaultTextCallback)

type ColorCallback = (value: any) => string
const defaultColorCallback: ColorCallback = function (value) {
  const _status = `${value.status}` as OrderStatus
  if (checkboxValue.value.includes(_status)) {
    return statusType[value.status].color
  } else {
    return '#d0e7ff70'
  }
}
const ganttColorCallback = ref(defaultColorCallback)
const ganttTooltipPositionCallback = ref(defaultTooltipPositionCallback)

/**
 * @description 設定甘特圖資料
 * @param {Function} callback 設定甘特圖資料
 * @param {Object} param 甘特圖其他參數
 */
const setGanttData = (
  callback: GroupCallback,
  {
    tooltipCallback,
    textCallback,
    colorCallback,
    tooltipPositionCallback
  }: {
    tooltipCallback?: TooltipCallback
    textCallback?: TextCallback
    colorCallback?: ColorCallback
    tooltipPositionCallback?: TooltipPositionCallback
  }
): void => {
  // 清空資料
  object_forEach(groupData, (_item: any, key: string) => {
    delete groupData[key]
  })
  ganttData.splice(0)
  let typeIndex = 0

  ganttDateRange.startDate = ''
  ganttDateRange.startMilliseconds = null
  ganttDateRange.endDate = ''
  ganttDateRange.endMilliseconds = null

  props.tableData.forEach(item => {
    if (item.startDate && item.endDate) {
      const [_startDate, _startTime] = item.startDate.split(' ')
      const [_endDate, _endTime] = item.endDate.split(' ')

      const startMilliseconds = getMilliseconds(_startDate, _startTime)
      const endMilliseconds = getMilliseconds(_endDate, _endTime)
      // 設定最小日期 與 最大日期
      if (
        ganttDateRange.startMilliseconds === null ||
        startMilliseconds < ganttDateRange.startMilliseconds
      ) {
        ganttDateRange.startDate = formatDatetime(item.startDate, 'YYYY-MM-DD HH:mm')
        // ganttDateRange.startDate = item.startDate
        ganttDateRange.startMilliseconds = startMilliseconds
      }
      if (
        ganttDateRange.endMilliseconds === null ||
        endMilliseconds > ganttDateRange.endMilliseconds
      ) {
        ganttDateRange.endDate = formatDatetime(item.endDate, 'YYYY-MM-DD HH:mm')
        // ganttDateRange.endDate = item.endDate
        ganttDateRange.endMilliseconds = endMilliseconds
      }

      const isTypeIndexAdd = callback(item, typeIndex, groupData, ganttData, filter.value)
      if (isTypeIndexAdd) typeIndex++
    }
  })
  console.log('ganttData => ', ganttData)

  ganttTooltipCallback.value =
    typeof tooltipCallback === 'function' ? tooltipCallback : translateTooltipCallback
  ganttTextCallback.value = typeof textCallback === 'function' ? textCallback : defaultTextCallback
  ganttColorCallback.value =
    typeof colorCallback === 'function' ? colorCallback : defaultColorCallback
  ganttTooltipPositionCallback.value =
    typeof tooltipPositionCallback === 'function'
      ? tooltipPositionCallback
      : defaultTooltipPositionCallback
}

/**
 * 初始化甘特圖資料
 * 利用 call by reference
 * 初始化 群組資料(groupData), 甘特圖用的資料(ganttData)
 */
const initGantt = async (type?: Tab) => {
  isLoading.value = true
  await nextTick()

  const _type = (type => {
    if (isEmpty(type)) return tab.value

    return type
  })(type)

  switch (_type) {
    // 訂單
    case 'order': {
      const orderMinStart = {}
      const orderMaxEnd = {}
      const _keyword = groupKeyword['order']

      setGanttData(
        (rowData, typeIndex, groupData, ganttData, filter) => {
          let isTypeIndexAdd = false

          if (filter.length > 0 && !filter.includes(rowData[_keyword])) return

          if (!hasOwnProperty(groupData, rowData[_keyword])) {
            // 分組資料
            groupData[rowData[_keyword]] = {
              id: rowData[_keyword],
              name: rowData.machineName,
              index: typeIndex,
              dataList: []
            }
            // 甘特圖類型(y軸)
            ganttData.push({
              type: rowData[_keyword],
              index: typeIndex,
              list: []
            })

            isTypeIndexAdd = true
          }

          if (![null, undefined].includes(rowData[_keyword])) {
            // 分組資料
            groupData[rowData[_keyword]].dataList.push({
              ...rowData
            })

            const [_startDate, _startTime] = rowData.startDate.split(' ')
            const [_endDate, _endTime] = rowData.endDate.split(' ')

            const startMilliseconds = getMilliseconds(_startDate, _startTime)
            const endMilliseconds = getMilliseconds(_endDate, _endTime)
            // 設定最小日期 與 最大日期
            if (!hasOwnProperty(orderMinStart, rowData[_keyword])) {
              orderMinStart[rowData[_keyword]] = {
                date: '',
                milliseconds: null,
                rowData: null
              }
            }
            if (!hasOwnProperty(orderMaxEnd, rowData[_keyword])) {
              orderMaxEnd[rowData[_keyword]] = {
                date: '',
                milliseconds: null,
                rowData: null
              }
            }
            if (
              orderMinStart[rowData[_keyword]].milliseconds === null ||
              startMilliseconds < orderMinStart[rowData[_keyword]].milliseconds
            ) {
              orderMinStart[rowData[_keyword]].date = rowData.startDate
              orderMinStart[rowData[_keyword]].milliseconds = startMilliseconds
              orderMinStart[rowData[_keyword]].rowData = rowData
            }
            if (
              orderMaxEnd[rowData[_keyword]].milliseconds === null ||
              endMilliseconds > orderMaxEnd[rowData[_keyword]].milliseconds
            ) {
              orderMaxEnd[rowData[_keyword]].date = rowData.endDate
              orderMaxEnd[rowData[_keyword]].milliseconds = endMilliseconds
              orderMaxEnd[rowData[_keyword]].rowData = rowData
            }

            const title = `${rowData[_keyword]}`
            const start = orderMinStart[rowData[_keyword]].milliseconds
            const end = orderMaxEnd[rowData[_keyword]].milliseconds
            const endrowData = orderMaxEnd[rowData[_keyword]].rowData

            const tempIndex = groupData[rowData[_keyword]].index
            ganttData[tempIndex].list.splice(0, 1, [
              start,
              end,
              title,
              {
                ...endrowData,
                startDate: orderMinStart[rowData[_keyword]].date,
                endDate: orderMaxEnd[rowData[_keyword]].date
              }
              // start, end, title, rowData
            ])
          }

          return isTypeIndexAdd
        },
        {
          tooltipCallback: function (value, start, end, title) {
            const mo = title
            const text1 = `${i18nTranslate('startTime-time')} : ${value.startDate}`
            const text2 = `${i18nTranslate('endTime-time')} : ${value.endDate}`

            const tempStatus = (_status => {
              switch (_status) {
                case 0:
                  return i18nTranslate('gantt-state0')
                case 1:
                  return i18nTranslate('gantt-state1')
                case 2:
                  return i18nTranslate('gantt-state2')
                case 3:
                  return i18nTranslate('gantt-state3')
                case 4:
                  return i18nTranslate('gantt-state4')
                case 5:
                  return i18nTranslate('gantt-state5')
                case 6:
                  return i18nTranslate('gantt-state6')
                case 999:
                  return i18nTranslate('gantt-state999')
              }
            })(value.status)
            const text6 = `${i18nTranslate('status')} : ${tempStatus}`

            return `
            <div 
              class="gantt-tooltip" 
              style="display: flex; flex-direction: column; gap: 8px;"
            >
              <div style="font-size: 1.2em;">${mo}</div>
              <div>${text1}</div>
              <div>${text2}</div>
              <div>${text6}</div>
            </div>
          `
          },
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          textCallback: function (value, title) {
            return `${value.orderIds}`
          },
          colorCallback: null,
          tooltipPositionCallback: function (x, y) {
            return {
              x: x > 1000 ? x - 150 : x - 100,
              y: y < 180 ? y + 30 : y - 140
            }
          }
        }
      )
      break
    }
    // 工單
    case 'workOrder':
      setGanttData(groupCallbackMap.workOrder, {
        tooltipCallback: null,
        textCallback: null,
        colorCallback: null,
        tooltipPositionCallback: null
      })
      break
    // 製程
    case 'process':
      setGanttData(groupCallbackMap.process, {
        tooltipCallback: null,
        textCallback: null,
        colorCallback: null,
        tooltipPositionCallback: null
      })
      break
    // 機台
    case 'machine':
      setGanttData(groupCallbackMap.machine, {
        tooltipCallback: null,
        textCallback: null,
        colorCallback: null,
        tooltipPositionCallback: null
      })
      break
  }

  // console.log('ganttData => ', ganttData)
  if (!isEmpty(ganttData)) {
    ganttData.sort((a, b) => {
      const { list: aList = [0, 0] } = a
      const { list: bList = [0, 0] } = b
      if (!isEmpty(aList) && !isEmpty(bList)) {
        const [
          aStartTime = 0
          // aEndTime = 0
        ] = aList[0]
        const [
          bStartTime = 0
          // bEndTime = 0
        ] = bList[0]

        return aStartTime - bStartTime
      }
      return 1
    })
  }
  setTimeout(() => {
    // 初始化甘特圖
    if (ganttRef.value) {
      ganttRef.value.init()
    }
  }, 300)

  setTimeout(() => {
    const { startDate, endDate } = ganttDateRange
    if (!isEmpty(startDate) && !isEmpty(endDate)) {
      popoverValue.value = true
    }
    isLoading.value = false
  }, 500)
}

// 設定過濾選項
const setFilterOptions = (callback: (rowData: TableData) => string) => {
  optionsSet.clear()
  filterOptions.splice(0)

  props.tableData.forEach(rowData => {
    const keyword = callback(rowData)

    if (!optionsSet.has(keyword)) {
      optionsSet.add(keyword)
      filterOptions.push({ label: keyword, value: keyword })
    }
  })
}
const initFilterOptions = (type?: Tab) => {
  const _type = (type => {
    if (isEmpty(type)) return tab.value

    return type
  })(type)

  switch (_type) {
    case 'order':
      setFilterOptions(rowData => rowData[groupKeyword['order']])
      break
    case 'workOrder':
      setFilterOptions(rowData => rowData[groupKeyword['workOrder']])
      break
    case 'process':
      setFilterOptions(rowData => rowData[groupKeyword['process']])
      break
    case 'machine':
      setFilterOptions(rowData => rowData[groupKeyword['machine']])
      break
  }
}

const init = () => {
  isLoading.value = false
  initFilterOptions()
  initGantt()

  setNextProps()
}

onMounted(() => {
  init()
})

defineExpose({
  init
})

// 多層甘特圖
const modal = reactive({
  detail: false,

  title: ''
})
const nextProps: {
  tableData: any[]
  tabs: Options
  defaultTab: Tab
} = {
  tableData: [],
  tabs: [],
  defaultTab: 'machine'
}
const setNextProps = () => {
  const _type = tab.value

  nextProps.tabs = props.tabs.filter(item => {
    return item.value !== _type
  })

  if (!isEmpty(nextProps.tabs)) {
    nextProps.defaultTab = nextProps.tabs[0].value as Tab
  }
}

const onTypeClick = (param: [number, string]) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [typeIndex, typeName] = param
  const _tableData = groupData[typeName]?.dataList ?? []
  nextProps.tableData = _tableData

  let title = ''
  if (!isEmpty(props.title)) {
    title += `${props.title} > `
  }
  modal.title = title + typeName
  modal.detail = true
}

const onItemClick = (param: [number, number, number, string, string]) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [typeIndex, start, end, barName, value] = param
  const rowData = JSON.parse(value)

  const _type = tab.value
  let typeName = ''
  switch (_type) {
    case 'order':
      typeName = rowData[groupKeyword['order']]
      break
    case 'workOrder':
      typeName = rowData[groupKeyword['workOrder']]
      break
    case 'process':
      typeName = rowData[groupKeyword['process']]
      break
    case 'machine':
      typeName = rowData[groupKeyword['machine']]
      break
  }
  const _tableData = groupData[typeName]?.dataList ?? []
  nextProps.tableData = _tableData

  let title = ''
  if (!isEmpty(props.title)) {
    title += `${props.title} > `
  }
  modal.title = title + typeName
  modal.detail = true
}

// 日期顯示
const popoverValue = ref(false)
</script>

<template>
  <div v-loading="isLoading" class="gantt-wrapper" :key="scopedId">
    <template v-if="!isEmpty(nextProps.tabs)">
      <CustomModal
        v-model="modal.detail"
        :title="modal.title"
        width-size="large"
        height-size="large"
        click-outside
        hidden-footer
      >
        <div class="gantt-modal">
          <ScheduleGantt
            date-format-x="MM-DD hh:mm"
            :level="props.level + 1"
            :title="modal.title"
            :table-data="nextProps.tableData"
            :default-tab="nextProps.defaultTab"
            :tabs="nextProps.tabs"
          />
        </div>
      </CustomModal>

      <CustomTabs
        v-model="tab"
        :options="props.tabs"
        i18n-module="system"
        @tab-change="onTabChange"
      />
    </template>

    <div class="gantt-header">
      <label class="gantt-label">{{ `${activeTabText} (${ganttData.length})` }}</label>

      <div class="gantt-filter text-info">
        <CustomIcon name="magnifying-glass" />
        <CustomInput
          v-model="filter"
          hidden-label
          type="select"
          :options="filterOptions"
          direction="row"
          multiple
          filterable
          clearable
          :max-collapse-tags="1"
          @change="onFilterChange"
        />
      </div>

      <div class="gantt-status">
        <CustomInput
          type="checkbox"
          hidden-label
          v-model="checkboxValue"
          :options="checkboxOptions"
          @change="onCheckboxChange"
        />
      </div>

      <CustomPopover v-model:visible="popoverValue" :width="320" trigger="click" placement="left">
        <div class="gantt-time-range">
          <span>{{ ganttDateRange.startDate }}</span>
          <span> ~ </span>
          <span>{{ ganttDateRange.endDate }}</span>
        </div>
        <template #reference>
          <div class="text-info">
            <CustomIcon name="calendar-days" />
          </div>
        </template>
      </CustomPopover>
    </div>

    <div
      class="gantt-container"
      :style="{
        width: '100%',
        height: '100%',
        minHeight: ganttHeight,
        padding: '0 48px'
      }"
    >
      <GanttChart
        v-if="props.tableData.length > 0"
        ref="ganttRef"
        :gantt-data="ganttData"
        :min-x="ganttDateRange.startDate"
        :max-x="ganttDateRange.endDate"
        :date-format-x="props.dateFormatX"
        :tooltip-callback="ganttTooltipCallback"
        :bar-text-callback="ganttTextCallback"
        :bar-color-callback="ganttColorCallback"
        :tooltip-position-callback="ganttTooltipPositionCallback"
        @type-click="onTypeClick"
        @item-click="onItemClick"
      />

      <div v-else>
        <CustomEmpty />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@mixin checkboxInnerColor($status, $color) {
  label[class*='#{$status}'].is-checked .el-checkbox__inner {
    background-color: $color !important;
    border-color: $color !important;
  }
}

:deep(.gantt-status) {
  .el-checkbox-group {
    @include checkboxInnerColor('0', #909399);
    @include checkboxInnerColor('1', #b88230);
    @include checkboxInnerColor('2', #67c23a);
    @include checkboxInnerColor('3', #f56c6c);
    @include checkboxInnerColor('4', #409eff);
    @include checkboxInnerColor('5', #e6a23c);
    @include checkboxInnerColor('6', #be72e1);
    @include checkboxInnerColor('999', #c45656);
  }
}

.gantt {
  &-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    // overflow: hidden;
  }

  &-modal {
    width: 100%;
    height: 100%;
    padding: 16px;
  }

  &-container {
    flex: 1;
  }

  &-header {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
    padding: 8px 2px;
  }

  &-label {
    width: fit-content;
  }

  &-filter {
    width: 300px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &-status {
    flex: 1;
  }

  &-time-range {
    font-size: 1.2em;
  }
}
</style>
