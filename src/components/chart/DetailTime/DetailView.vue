<script setup lang="ts">
import type { PropType } from 'vue'
import { onMounted, ref, inject, computed } from 'vue'
import type { UseHook } from '@/types/types_hook' // 全域功能類型
import { CustomTooltip, CustomInput } from '@/components' // 系統組件

import type { TimeUnit, MachineStateTimeInfo, DetailTimeInfo, TimePointInfo } from './api'
import MarkInfo from './MarkInfo.vue'
// Table Column
import { useSimpleTableSetting } from '@/lib/lib_columns'
import { orderDetailTimeColumnSetting, machineStateTimeColumnSetting } from './columns.ts'
import TimeTable from './TimeTable.vue'

import dayjs from 'dayjs'
import { isEmpty } from '@/lib/lib_utils.ts'

const useHook = inject('useHook') as UseHook
const { i18nTranslate } = useHook({
  i18nModule: 'auto_common'
})

const props = defineProps({
  timePointInfo: {
    type: Object as  PropType<TimePointInfo>,
    required: true,
    description: `
      工單時間點
      到站、上機、開工、完工、下機、出站
    `
  },
  detailTimeInfo: {
    type: Object as  PropType<DetailTimeInfo>,
    required: true,
    description: '工單階段時間資訊'
  },
  stateTimeInfo: {
    type: Object as  PropType<MachineStateTimeInfo>,
    required: true,
    description: '機台狀態時間資訊'
  }
})

// TimeLine
const timeLineRef = ref() // <div class="timeline-main">
/**
 * 捲動時間軸至指定時間點
 * @param timeUnix 時間點 (unix)
 */
const scrollToTimeUnix = (timeUnix:number | 'all') => {
  if(timeUnix === 'all') return
  const top = getTimeYCoordinate(timeUnix)
  const option = {
    top,
    behavior: 'smooth'
  }

  timeLineRef.value.scrollTo(option)
}
/**
 * 根據輸入時間取得Y軸座標(px)
 * @param timeUnix 時間點 (unix)
 */
const getTimeYCoordinate = (timeUnix:number) => {
  const gridStartUnix = gridItems.value[0].startTimeUnix
  return (timeUnix - gridStartUnix) * gridHeightPerSecond
}

// Grid
// gridItems 格線繪製物件
const gridHeight = 30 // px
const gridSecond = 60 * 60 // 3600 秒
const gridHeightPerSecond = gridHeight / gridSecond // 每秒的畫面高度

type GridItem = {
  startTime: string
  startTimeUnix: number

  displayDate: boolean
  year: string // YYYY
  date: string // MM-DD
  time: string // HH:mm
}


const getAllTime = () => {
  const timePoint = Object.values(props.timePointInfo)
  const detailTime = Object.values(props.detailTimeInfo).flatMap(detailTime => {
    return detailTime.flat(2)
  })

  const allTime = timePoint.concat(detailTime).filter(time => !isEmpty(time))
  return [...new Set(allTime)]
}


const gridItems = ref<Array<GridItem>>([])
const setGridItems = () => {
  const allTime = getAllTime().sort()
  const startUnix = dayjs(allTime[0]).startOf('hour').unix()
  const endUnix = dayjs(allTime.at(-1)).startOf('hour').unix()

  const gridUnitTime = 60 * 60

  const newGridItems:Array<GridItem> = []
  let curTime = startUnix
  while (curTime <= endUnix) {
    const dayjsStartTime = dayjs.unix(curTime)
    const newGridItem:GridItem = {
      startTime: dayjsStartTime.format('YYYY-MM-DD HH:mm'),
      startTimeUnix: curTime,
      displayDate: false,
      year: dayjsStartTime.format('YYYY'),
      date: dayjsStartTime.format('MM-DD'),
      time: dayjsStartTime.format('HH:mm')
    }
    newGridItems.push(newGridItem)
    curTime = curTime + gridUnitTime
  }

  let recordTime
  const getRecordTime = item => item.date
  newGridItems.forEach((item, index) => {
    if(index === 0) {
      item.displayDate = true
      recordTime = getRecordTime(item)
    }
    else {
      const _recordTime = getRecordTime(item)
      if(_recordTime !== recordTime) {
        item.displayDate = true
        recordTime = _recordTime
      }
    }
  })
  // for (let curTime = startUnix; curTime <= endUnix; cur)

  gridItems.value = newGridItems


}

// DetailTime Step 工單階段
// stepData 工單階段全資料 for Table
// stepGroups 工單各階段物件 for TimeLine, MarkView
const stepGroups = ref([])
const stepDataList = ref([])
const baseStyle = ref({}) // 工單底色

const stepSetting = [
  {
    param: 'transferTime', // 轉移
    i18nLabel: 'step-transfer',
    color: '#f7c444'
  },
  {
    param: 'preProcessTime', // 前處理
    i18nLabel: 'step-preProcess',
    color: '#c100c1'
  },
  {
    param: 'changeLineTime', // 換線
    i18nLabel: 'step-changeLine',
    color: '#FF9B05'
  },
  {
    param: 'loadingTime', // 裝載
    i18nLabel: 'step-loading',
    color: '#040ec6'
  },
  {
    param: 'workingTime', // 生產
    i18nLabel: 'step-working',
    color: '#1593F3'
  },
  {
    param: 'unloadTime', // 卸載
    i18nLabel: 'step-unload',
    color: '#04a03b'
  },
  {
    param: 'postProcessTime', // 後處理
    i18nLabel: 'step-postProcess',
    color: '#850085'
  }
]
const setStepGroups = () => {
  // Create Columns
  stepGroups.value = stepSetting.map(step => {
    return {
      ...step,
      active: true,
      timeItems: []
    }
  })

  const stepItemsMap = new Map()
  stepGroups.value.forEach(column => {
    const { param } = column
    stepItemsMap.set(param, column)
  })

  const gridStartUnix = gridItems.value[0].startTimeUnix
  stepDataList.value.forEach(unitItem => {
    const { step, startUnix, endUnix } = unitItem
    const top = (startUnix - gridStartUnix) * gridHeightPerSecond
    const height = (endUnix - startUnix) * gridHeightPerSecond

    const stepColumn = stepItemsMap.get(step)
    const { color, timeItems } = stepColumn
    const style = {
      top: top + 'px',
      height: height + 'px',
      'background-color': color
    }

    timeItems.push({
      ...unitItem,
      style
    })
  })

}
const setStepTimeData = () => {
  const concatStepTimeUnits = (allTimes, [ stepName, timeUnits ]) => {
    const newTimes = timeUnits.map((timeUnit: TimeUnit) => {
      const [start, end ] = timeUnit
      return {
        step: stepName,
        start: dayjs(start).format('YYYY-MM-DD HH:mm:ss'),
        startUnix: dayjs(start).unix(),
        end: dayjs(end).format('YYYY-MM-DD HH:mm:ss'),
        endUnix: dayjs(end).unix()
      }
    })
    return allTimes.concat(newTimes)
  }
  const allTimeUnits = Object.entries(props.detailTimeInfo).reduce(concatStepTimeUnits, [])

  const sortTimeUnits = (a, b) => a.startUnix - b.startUnix
  allTimeUnits.sort(sortTimeUnits)

  const getDateStartUnix = item => dayjs(item.start).startOf('date')
  const startDate = getDateStartUnix(allTimeUnits[0])
  const endDate = getDateStartUnix(allTimeUnits.at(-1))

  const newOptions = []
  newOptions.push( { i18nLabel: 'all', label: '全部', value: 'all' })
  let curDate = startDate
  while(!dayjs(curDate).isAfter(endDate)) {
    const option = {
      label: curDate.format('YYYY-MM-DD'),
      value: curDate.unix()
    }
    newOptions.push(option)
    curDate = curDate.add(1, 'day')
  }


  stepDataList.value = allTimeUnits
  displayDay.value = 'all'
  dayOptions.value = newOptions
  // console.log( dayOptions.value)
}
const setBaseStyle = () => {
  const gridStartUnix = gridItems.value[0].startTimeUnix
  const startUnix = dayjs(props.timePointInfo.moveInTime).unix()
  const endUnix =  dayjs(props.timePointInfo.moveOutTime).unix()
  const top = (startUnix - gridStartUnix) * gridHeightPerSecond
  const height = (endUnix - startUnix) * gridHeightPerSecond
  const color = 'rgba(0,0,0, 0.1)'
  const style = {
    top: top + 'px',
    height: height + 'px',
    'background-color': color,
    border: '1px solid rgba(220,220,220)',
    'box-shadow': 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px'
  }
  baseStyle.value = style
}

// Table Columns
const { tableColumns: detailTimeColumns } = useSimpleTableSetting(orderDetailTimeColumnSetting, 'table')
const { tableColumns: stateTimeColumns } = useSimpleTableSetting(machineStateTimeColumnSetting, 'table')


// 工單各時間點
type TimePointItem = {
  i18nLabel: string
  time: string
  timeUnix: number
}
const timePointItems = ref<Array<TimePointItem>>([])
const setTimePointItems = () => {
  const formatTime = (timePoint): TimePointItem => {
    const { param, i18nLabel } = timePoint
    const inputTime = props.timePointInfo[param]
    const dayjsTime = inputTime ?  dayjs(inputTime) : null
    const time = dayjsTime ? dayjsTime.format('YYYY-MM-DD HH:mm:ss') : ''
    const timeUnix = dayjsTime ? dayjsTime.unix() : 0
    return {
      i18nLabel,
      time,
      timeUnix
    }
  }

  const timePointList = [
    {
      param: 'transferStartTime',
      i18nLabel: 'transfer-startTime'
    },
    // {
    //   param: 'transferFinishTime',
    //   i18nLabel: 'transfer-endTime'
    // },
    {
      param: 'moveInTime',
      i18nLabel: 'move-in-time'
    },
    {
      param: 'preProcessTimestamp',
      i18nLabel: 'estimate-preProcessTime'
    },
    {
      param: 'checkInTime',
      i18nLabel: 'estimate-checkInTime'
    },
    {
      param: 'startTime',
      i18nLabel: 'estimate-startTime'
    },
    {
      param: 'endTime',
      i18nLabel: 'estimate-endTime'
    },
    {
      param: 'checkOutTime',
      i18nLabel: 'estimate-checkOutTime'
    },
    {
      param: 'postProcessTimestamp',
      i18nLabel: 'estimate-postProcessTime'
    },
    {
      param: 'moveOutTime',
      i18nLabel: 'move-out-time'
    }
  ]

  timePointItems.value = timePointList.map(formatTime)
}

// Machine State
// stateTimeItems 機台狀態全資料 for Table
// stepColumns 機台各狀態物件 for TimeLine, MarkView
const stateDataList = ref([])
const stateGroups = ref([])

const stateSetting = [
  {
    param: 'maintenance',
    i18nLabel: 'machine-state-maintenance',
    color: '#d46007'
  },
  {
    param: 'shutdown',
    i18nLabel: 'machine-state-shutdown',
    color: '#e3436b'
  }
]
const setStateTimeData = () => {
  const concatStateTimeUnits = (allTimes, state) => {
    const stateTimeUnits = props.stateTimeInfo[state] ?? []

    const newTimes = stateTimeUnits.map(timeUnit => {
      const { start, end } = timeUnit
      return {
        state,
        start: dayjs(start).format('YYYY-MM-DD HH:mm:ss'),
        startUnix: dayjs(start).unix(),
        end: dayjs(end).format('YYYY-MM-DD HH:mm:ss'),
        endUnix: dayjs(end).unix()
      }
    })
    return allTimes.concat(newTimes)
  }

  const stateList = ['shutdown', 'maintenance']

  const allTimeUnits = stateList.reduce(concatStateTimeUnits, [])

  const sortTimeUnits = (a, b) => a.startUnix - b.startUnix
  allTimeUnits.sort(sortTimeUnits)

  stateDataList.value = allTimeUnits
}
const setStateGroups = () => {
  stateGroups.value = stateSetting.map(state => {
    return {
      ...state,
      active: true,
      timeItems: []
    }
  })

  const stateItemsMap = new Map()
  stateGroups.value.forEach(column => {
    const { param } = column
    stateItemsMap.set(param, column)
  })

  const gridStartUnix = gridItems.value[0].startTimeUnix

  stateDataList.value.forEach(unitItem => {
    const { state, startUnix, endUnix } = unitItem
    const top = (startUnix - gridStartUnix) * gridHeightPerSecond
    const height = (endUnix - startUnix) * gridHeightPerSecond

    const stateColumn = stateItemsMap.get(state)
    const { color, timeItems } = stateColumn
    const style = {
      top: top + 'px',
      height: height + 'px',
      'background-color': color
    }

    timeItems.push({
      ...unitItem,
      style
    })
  })
}

// Date Filter
const displayDay = ref('all')
const dayOptions = ref([])
const displayTimeItems = computed(() => {
  const limitStep = displayStep.value
  const limitStartUnix = displayDay.value
  const limitEndUnix = limitStartUnix + 60 * 60 * 24

  const checkTime = unit => {
    if(displayDay.value === 'all') return true
    const { startUnix, endUnix } = unit
    if(endUnix < limitStartUnix) return false
    if(startUnix >= limitEndUnix) return false
    return true
   }
  const checkStep = unit => {
  const { step } = unit
  if(limitStep === 'all') return true
  return limitStep === step
  }

  return stepDataList.value.filter(stepData => {
    return checkTime(stepData) && checkStep(stepData)
  })
})
const displayStateTimeItems = computed(() => {
  // const limitStep = displayStep.value
  const limitStartUnix = displayDay.value
  const limitEndUnix = limitStartUnix + 60 * 60 * 24

  const checkTime = unit => {
    if(displayDay.value === 'all') return true
    const { startUnix, endUnix } = unit
    if(endUnix < limitStartUnix) return false
    if(startUnix >= limitEndUnix) return false
    return true
   }

  return stateDataList.value.filter(timeUnit => checkTime(timeUnit))
})
const dayChange = (value: any) => {
  scrollToTimeUnix(value)
}

// Step Filter not use now
const displayStep = ref('all')
const createStepOptions = steps => {
  const options = []
  options.push({ label: '全部', value: 'all' })
  steps.forEach(step => {
    const option = {
      label: step.param,
      value: step.param
    }
    options.push(option)
  })
  return options
}
const stepOptions = createStepOptions(stepSetting)
stepOptions.unshift({ i18nLabel: 'all', label: '全部', value: 'all' })

onMounted(() => {
  setStepTimeData() // 工單階段資料
  setStateTimeData() // 機台狀態資料
  setGridItems() // 設置格線繪製物件
  setStepGroups() // 設置工單各階段繪物件
  setStateGroups()  // 設置機台各狀態物件
  setBaseStyle()
  setTimePointItems() // 設置工單各時間點
})

// Translate
const getStepTranslate = (stepName: string) => {
  switch (stepName) {
    case 'preProcessTime': return i18nTranslate('step-preProcess')
    case 'changeLineTime': return i18nTranslate('step-changeLine')
    case 'loadingTime': return i18nTranslate('step-loading')
    case 'workingTime': return i18nTranslate('step-working')
    case 'unloadTime': return i18nTranslate('step-unload')
    case 'postProcessTime': return i18nTranslate('step-postProcess')
    case 'transferTime': return i18nTranslate('step-transfer')
    default: return stepName
  }
}
const getStateTranslate  = (stateName: string) => {
  switch (stateName) {
    case 'maintenance': return i18nTranslate('machine-state-maintenance')
    case 'shutdown': return i18nTranslate('machine-state-shutdown')
    default: return stateName
  }
}

</script>

<template>
  <div class="modal-container">
    <div class="modal-container-left">
      <div class="timeline-container" >
        <div class="timeline-start">
          <span class="timeline-start-title">  {{ i18nTranslate('manufacturing-order-timeline') /*'工單時間軸'*/ }}</span>
        </div>
        <div class="timeline-main" ref="timeLineRef">
          <div class="timeline-scroll">
            <!-- StepTimeUnit 工單階段繪製 -->
            <div class="step-container">
              <div class="step-unit" :style="baseStyle"> </div>
              <template v-for="group in stepGroups" :key="group.param">
                <template v-if="group.active">
                  <template v-for="item in group.timeItems" :key="item">
                    <CustomTooltip
                      placement="left-start"
                    >
                      <template #content>
                        <div class="message-container">
                          <div> {{ `${i18nTranslate('phase-step')} : ${getStepTranslate(item.step)} ` }}</div>
                          <div> {{ `${i18nTranslate('datetime-startTime')} : ${item.start} ` }}</div>
                          <div> {{ `${i18nTranslate('datetime-endTime')} : ${item.end} ` }}</div>
                        </div>
                      </template>
                      <div class="step-unit" :style="item.style"> </div>
                    </CustomTooltip>
                  </template>
                </template>
              </template>
            </div>
            <!-- Grid 時間軸格線 -->
            <div class="grid-container" ref="testRef">
              <template v-for="gridItem in gridItems" :key="gridItem.startTimeUnix">
                <div class="grid-row">
                  <div class="grid-time1">
                    <template v-if="gridItem.displayDate">
                      <div class="grid-text">
                        {{ gridItem.date }}
                      </div>
                    </template>
                  </div>
                  <div class="grid-time2">
                    <div class="grid-text">
                      {{ gridItem.time }}</div>
                  </div>
                </div>

              </template>
            </div>
            <!-- StateTimeUnit 機台狀態繪製 -->
            <div class="state-container">
              <template v-for="group in stateGroups" :key="group.param">
                <template v-if="group.active">
                  <template v-for="item in group.timeItems" :key="item">
                    <div class="state-unit" :style="item.style"> </div>
                  </template>
                </template>

              </template>
            </div>
          </div>
          <div class="timeline-info">
            <!-- Mark 工單階段 -->
            <MarkInfo
              :marks="stepGroups"
              :title="i18nTranslate('phase-step-title')"
            />
            <!-- Mark 機台狀態 -->
            <MarkInfo
              :marks="stateGroups"
              :title="i18nTranslate('machine-state')"
            />
            <!-- Time 工單各時間點 -->
            <div class="time-container">
              <template v-for="timePoint in timePointItems" :key="timePoint.i18nLabel">
                <div class="time-item" @click="scrollToTimeUnix(timePoint.timeUnix)">
                  <div class="time-header"> {{  i18nTranslate(timePoint.i18nLabel)}}</div>
                  <div class="time-content">  {{ timePoint.time }}</div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-container-right">
      <div class="info-container">
        <div class="info-top">
          <CustomInput
            v-model="displayDay"
            :label="i18nTranslate('date')"
            direction="row"
            type="select"
            :options="dayOptions"
            @change="dayChange"
          />
        </div>
        <div class="info-main">
          <div class="table-container">
            <TimeTable
              :tableData="displayTimeItems"
              :columns="detailTimeColumns"
              :translate="getStepTranslate"
              @scrollToTime="scrollToTimeUnix"
            />
          </div>
          <div class="table-container">
            <TimeTable
              :tableData="displayStateTimeItems"
              :columns="stateTimeColumns"
              :translate="getStateTranslate"
              @scrollToTime="scrollToTimeUnix"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  :root {
    --timeline-width: 260px;
  }

  .top {
    &-container {
      width: 100%;
      height: 50px;
    }
  }

  .modal {
    &-container {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
      overflow: hidden;
      background-color: rgb(241, 241, 241);
      padding: 8px;
      overflow-x: auto;


      &-left {
        width: fit-content;
        height: 100%;
        background-color: white;
        border: 1px solid lightgray;
      }
      &-right {
        min-width: 500px;
        height: 100%;
        flex-grow: 1;
        padding: 0px 8px;
        background-color: rgb(241, 241, 241);
      }
    }
  }

  .timeline {
    &-container {
      width: fit-content;
      height: 100%;
    }
    &-start {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
      height: 45px;
      padding: 12px;
      z-index: 1;
      background-color: white;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);

      &-title {
        font-weight: bold;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
      }
    }

    &-main {
      display: flex;
      flex-direction: row;
      padding: 8px;
      width: fit-content;
      height: calc(100% - 45px);
      overflow-y: scroll;
      position: relative;
    }
    &-scroll {
      display: flex;
      flex-direction: column;
      width: var(--timeline-width);
      padding: 20px 20px;
      position: relative;
    }
    &-info {
      position: sticky;
      padding-top: 10px;
      gap: 8px;
      top: 0px;
      width: max-content;
      height: 100%;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      font-size: 14px;
    }

    &-item {
      height: 28px;
    }

    &-grid {
      height: 30px;
      border-bottom: 1px dashed lightgray;
    }
  }
  .info {
    &-container {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;

      box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1);
    }
    &-top {
      width: 100%;
      padding: 6px;
      border-radius: 6px 6px 0px 0px;
      background-color: white;
    }
    &-main {
      width: 100%;
      height: calc(100% - 30px);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow-x: auto;
    }

  }

  .grid {
    &-container {
      z-index: 11;
      border-top: 1px dashed lightgray;
      padding-bottom: 20px;

      font-size: 14px;
    }


    &-row {
      width: 220px;
      height: 30px;
      border-bottom: 1px dashed lightgray;
      border-right: 1px dashed lightgray;
      display: flex;
      flex-direction: row;
      // border-bottom: 1px dashed lightgray;
    }
    &-time1 {
      // border-right: 1px dashed lightgray;
      border-left: 1px dashed lightgray;
      // padding-left: 4px;
      display: flex;
      justify-content: end;
      // align-items: center;
      width: 50px;
    }
    &-time2 {
      display: flex;
      justify-content: start;
      border-right: 1px dashed lightgray;
      // padding-left: 4px;
      width: 50px;
    }
    &-text {
      // width: 100%;
      transform: translate(0, -8px);
      background-color: white;
    }
  }

  .table {
    &-container {
      width: 100%;
      height: 49.5%;
    }
    &-click {
      cursor: pointer;
    }
  }

  // Order Step
  .step {
    &-container {
      z-index: 12;
      position: absolute;
      left: 100px;
      width: 100px;
    }
    &-unit {
      position: absolute;
      left: 46px;
      width: 80px;
    }
  }
  // Machine State
  .state {
    &-container {
      z-index: 10;
      position: absolute;
      left: 90px;
      width: 100px;
    }
    &-unit {
      position: absolute;
      left: 46px;
      width: 100px;
    }
  }
  // Order Time
  .time {
    &-container {
      padding: 0px 8px;
      width: fit-content;
      height: fit-content;
    }
    &-item {
      height: 50px;
      width: fit-content;
      display: flex;
      flex-direction: column;
      justify-content: center;
      overflow: hidden;
      cursor: pointer;
    }
    &-header {
      font-weight: bold;
      padding-top: 4px;
      height: 25px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipse;
    }
    &-content {
      white-space: nowrap;
    }
  }
</style>