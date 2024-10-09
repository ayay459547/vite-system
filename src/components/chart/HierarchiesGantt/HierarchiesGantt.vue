<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, inject, nextTick, reactive, computed, onMounted } from 'vue'

import type { UseHook } from '@/declare/hook'
import {
  CustomButton,
  CustomEmpty,
  CustomTabs,
  CustomModal
} from '@/components'
import { useFormSetting } from '@/lib/lib_columns'

import { deepClone, isEmpty, getUuid, hasOwnProperty } from '@/lib/lib_utils'

// import { createYItemByFilters, initOrdersMark, initYItemOrders, initAddYItem } from '@/lib/lib_gantt'
import type { GanttData } from '@/lib/lib_gantt'
import dayjs from 'dayjs'

import RushManagement from './RushManagement/RushManagement.vue'
import MarkView from './MarkView/MarkView.vue'
import GanttView from './GanttView/GanttView.vue'
import CrumbView from './CrumbView/CrumbView.vue'
import DragWindow from './DragWindow/DragWindow.vue'
import GanttOverView from './GanttOverView/ganttOverView.vue'
import ZoomView from './ZoomView/ZoomView.vue'
import { getRushableMachine } from './api'

import {
  createDefaultMarks,
  createDefaultRootYItems,
  createNewRootYItem,
  createFilterColumns,
  createYItemByFilters,
  initOrdersMark,
  initYItemOrders,
  initAddYItem
} from '@/lib/lib_gantt'



const useHook: UseHook = inject('useHook')
const { swal, i18nTest, i18nTranslate } = useHook({
  i18nModule: 'auto_common'
})

export type GanttType = 'Rush' |  'Temp' | 'View'
export type UseFunction = 'RushManagement' | 'ModeTab' | 'OverView' | 'DragData'
const props = defineProps({
  type: {
    type: String as PropType<GanttType>,
    default: 'Rush'
  },
  disableFunctions: {
    type: Array<UseFunction>,
    default: []
  },
  sideMethod: {
    type: Object
  },
  outsideController: {
    type: Object
  }
  // ganttData: {
  //   type: Object
  // },
  // objectController: {
  //   type: Object
  // }

})


const useFunction = reactive({
  RushManagement: true,
  ModeTab: true,
  OverView: true,
  DragData: true,
  Crumb: true
})


const isLoading = ref(false)

const rushManagementRef = ref(null)
const rushManagement = {
  // test: item => rushManagementRef?.value.test(item),
  addRushOrders: (...params) => rushManagementRef?.value.addRushOrders(...params),
  setRushMachines: () => rushManagementRef?.value.setRushMachines()
}

const dragItem = ref({})

const ganttRef =  ref(null)

const overViewData = ref({
  scrollStartTime: NaN,
  scrollEndTime: NaN,
  totalYColumns: NaN,

  displayTimeDuration: NaN,
  displayStartTime: NaN,

  displayYStartRate: NaN,
  displayYHeightRate: NaN,

  // get yScale () {
  //   return 1
  // },
  // get xScale () {
  //   return 1
  // },
  // get secondWidth () {
  //   return 1
  // },
  get totalYColumn () {
    return 1
  },
  // scale: 1,
  // xScale: 1,
  // yScale: 1,
  orders: []
})

// 是否顯示甘特圖
const showGantt = computed(() => {
  return !isEmpty(ganttData.value.orders)
})

// Mode Tab
const modeOptions = [
  { i18nLabel: 'gantt-mode-tab-0', label: '目前排程', value: 'view'},
  { i18nLabel: 'gantt-mode-tab-1', label: '編輯排程', value: 'edit' },
  { i18nLabel: 'gantt-mode-tab-2', label: '結果預覽', value: 'result' }
  // { i18nLabel: 'gantt-mode-tab-0', label: i18nTranslate('gantt-mode-tab-0') /*'目前排程'*/, value: 'view'},
  // { i18nLabel: 'gantt-mode-tab-1', label: i18nTranslate('gantt-mode-tab-1') /*'編輯排程'*/, value: 'edit' },
  // { i18nLabel: 'gantt-mode-tab-2', label: i18nTranslate('gantt-mode-tab-2') /*'結果預覽'*/, value: 'result' }
]

const deleteRushMachine = machineId => {
  inSideController.rushManagement.deleteRushMachine(machineId)
}
const resetRush = () => {
  inSideController.rushManagement.resetRush()
}


const keyEvent = event => {
  if(!showGantt.value) return
  if(event.key === 'Tab') {
    event.preventDefault()
    const curMode = ganttData.value.mode
    const nextModeIndex = (modeOptions.findIndex(option => curMode === option.value) + 1)  % modeOptions.length
    const nextMode = modeOptions[nextModeIndex].value

    inSideController.ganttData.setMode(nextMode)
  }
}


const overViewVisible = ref(false)
const setOverViewVisible = () => {
  overViewVisible.value = !overViewVisible.value
}
const setRushableMap = async orders => {
  const resData = await getRushableMachine(orders)
  resData.forEach(data => {
    const {
      orderId,
      processId,
      machines
    } = data

    const order = orders.find(order => order.orderIds === orderId && order.processId === processId)


    ganttData.value.rushableMachines.set(order.orderKey, machines.map(machine => machine.machineId))

  })
}


const init = () => {
  ganttRef?.value.init()
}
const setLevel = (type, data?) => {
  switch(type) {
    case 'temp': {
      if(data) {
        ganttData.value.tempYItem = data
      }
    }
  }

  ganttRef?.value.setLevel(type, data)
}
const initOrders = () => {
  ganttRef?.value.initOrders()
}
const initYItems = () => {
  ganttRef?.value.initYItems()
}
const markViewChange = () => {
  ganttRef?.value.initOrders()
}
const setXScroll = (value, type) => {
  ganttRef.value.setXScroll(value, type)
}
const setAdjustTime = () => {
  ganttRef.value.setAdjustTime()
}
const getXAxisGrids = () => {
  return (ganttRef.value) ? ganttRef.value.getXAxisGrids() : []
}
const setScrollByOverView = (newTime, newYRate) => {
  ganttRef.value.setScrollByOverView(newTime, newYRate)
}
const getFocusTime = (type) => {
  return ganttRef.value.getFocusTime(type)
}
const getFocusX = (focusTime) => {
  return ganttRef.value.getFocusX(focusTime)
}
const reset = (type) => {
  ganttRef.value.reset(type)
}
const setSearchDisplay = (area, levelIndex, groupLevel) => {
  ganttRef.value.setSearchDisplay(area, levelIndex, groupLevel)
}

const ganttData = ref({
  mode: 'view', // 模式
  isLoading: false, //應該沒用?
  //
  timeRange: ['', ''], // 最大時間範圍
  scrollTimeRange: ['', ''], // 目前可顯示(捲動)的時間範圍
  // Orders show in Gantt
  scheduledOrders: [], // 現在排程中的工單
  editOrders: [], // 編輯後增加的工單
  resultOrders: [], //scheduleOrders + editOrders
  //TimeLevelInfo
  baseLevelIndex: 1,
  activeLevelIndexs: [2, 3],
  //zoomRate 縮放參數
  zoomRate: 0, // 0 ~ 1

  orders: [], // 工單
  marks: [], // 顏色標記
  timeMarks: [], // 時間標記
  yItems: [], //T軸欄位
  tempYItem: {},

  rootYItem: {} as any, //現在使用的根欄位
  rootYItemList: [], //可用根欄位列表
  editYItems: [
    {
      name: '可插單機台',
      type: 'group',
      key: 'edit1',
      depth: 0,
      children: [],
      isOpen: false,
      isRushalble: false,
      rushableCause: '群組無法執行插單'
    },
    {
      name: '已插單機台',
      type: 'group',
      key: 'edit2',
      depth: 0,
      children: [],
      isOpen: false,
      isRushalble: false,
      rushableCause: '群組無法執行插單'
    }
  ],
  // 置頂搜尋
  searchYItem: {
    tab: '編輯',
    name: '搜尋結果',
    type: 'search',
    depth: 0,

    // key: 'search',
    orders: [],
    children: [],
    displayRush: false
  },
  //
  // rushOreYItems: [],
  filterColumns: [],
  rushMachinesMap: new Map(),
  processRushableMachines: new Map(), // processId -> Rushable Machine List
  rushableMachines: new Map(), // orderKey =>  Rushable Machine List
  selectOrders: [],
  levelInfo: {
    curItem: {},
    curLeaves: [],
    crumbs: [
    ]
  },
  //Function
  initOrdersMark () {
    initOrdersMark(this.orders, this.marks)
    // initOrders()
    // ganttRef?.value.initOrders()
  },
  initYItemOrders (yItem) {
    initYItemOrders(yItem, this.orders)
    // ganttRef?.value.initOrders()
  },
  initAddYItem (yItem) {
    initAddYItem(yItem, this.orders)
    // ganttRef?.value.initYItems()
  },
  initYItem () {
    // ganttRef?.value.initYItems()
  },
  setLevel (type, data?) {
    switch(type) {
      case 'reset': {
        setLevel(type)
        break
      }
      case 'temp': {
        if(data) {
          this.tempYItem = data
        }
        setLevel(type)
        break
      }
      case 'root': {
        setLevel(type)
        break
      }
      case 'index': {
        setLevel(type, data)
        break
      }
    }
  },
  init() {
    init()
  }
})


const setGanttData = async (setting) => {
  const {
    orders,
    yItems,
    timeRange,
    timeMarks,
    marks,
    filterColumns
  } = setting

  // orders.value = orders
  // console.log('===============Init===============')
  // console.log(orderFilterColumns, yItems, marks)

  isLoading.value = true
  ganttData.value.timeRange = timeRange // copy Value?
  ganttData.value.orders = orders
  const orderSize = orders.length
  ganttData.value.resultOrders.splice(0)
  ganttData.value.resultOrders.splice(0, orderSize, ...orders)
  ganttData.value.scheduledOrders.splice(0)
  ganttData.value.scheduledOrders.splice(0, orderSize, ...orders)
  // ganttData.yItems = yItems.value
  ganttData.value.tempYItem = {}

  ganttData.value.rootYItemList = yItems
  if(!isEmpty(yItems)) {
    ganttData.value.rootYItem = yItems[0]
    ganttData.value.rootYItem.active = true
  }

  ganttData.value.filterColumns = filterColumns
  ganttData.value.marks = marks
  ganttData.value.timeMarks = timeMarks


  ganttData.value.editYItems =  [
    {
      name: '可插單機台',
      type: 'group',
      key: 'edit1',
      depth: 0,
      children: [],
      isOpen: false,
      isRushalble: false,
      rushableCause: '群組無法執行插單'
    },
    {
      name: '已插單機台',
      type: 'group',
      key: 'edit2',
      depth: 0,
      children: [],
      isOpen: false,
      isRushalble: false,
      rushableCause: '群組無法執行插單'
    }
  ]


  await nextTick()

  inSideController.ganttCanvas.setAdjustTime()
  setTimeout(() => {
    isLoading.value = false
  }, 300)

  // console.log(ganttData)
  // return ganttData
    // return await mainGanttRef?.value.setGanttData(orders, timeRange)
}


const inSideController = {
  ganttData: {
    setMode: (mode) => {
      ganttData.value.mode = mode
      inSideController.ganttCanvas.setAdjustTime()
    },
    setLevelInfo: data => {
      const levelInfo = ganttData.value.levelInfo
      levelInfo.curItem = data.curItem
      levelInfo.crumbs.splice(0)
      data.crumbs.forEach(crumb => levelInfo.crumbs.push(crumb))
    },
    initYItems: () => {
      initOrders()
    },
    // OrderMark Relate
    addOrderMark: orderMark => {
      ganttData.value.marks.push(orderMark)
      initGanttOrdersMark()
    },
    deleteOrderMark: orderMark => {
      const index = ganttData.value.marks.indexOf(orderMark)
      ganttData.value.marks.splice(index, 1)
      initGanttOrdersMark()
    },
    resetOrderMark: orderMark => {
      ganttData.value.marks = orderMark
      initGanttOrdersMark()
    },
    initOrderMark: () => {
      initGanttOrdersMark()
    },
    // TimeMark
    addTimeMark: data => {
      const timeMark = inSideController.ganttData.findTimeMark(data)
      if(timeMark) {
        const timeValue = timeMark.timeValue
        setXScroll(timeValue, 'timeString')
      }
      else {
        ganttData.value.timeMarks.push(data)
        setXScroll(data.timeValue, 'timeString')
      }
      //sort
    },
    findTimeMark: data => {
      const { label } = data
      return ganttData.value.timeMarks.find(timeMark => {
        return timeMark.label === label
      })
    },
    setRushMap: map => {
      ganttData.value.rushMachinesMap = map
    },
    setScheduleOrder: orders => {
      ganttData.value.scheduledOrders.splice(0)
      orders.forEach(order => ganttData.value.scheduledOrders.push(order))
    },
    setEditOrder: () => {
      const sortStartTimeValue = (a, b) => {
        return a.startTimeValue - b.startTimeValue
      }

      const newOrders = [ ...ganttData.value.rushMachinesMap.values()]
      .map(rushMachine => {
        const rushMachineNewOrders = rushMachine.filter(order => order.type === 'new')
        return rushMachineNewOrders
        .map(rushOrder => {
          const { machineId, processId, expectStartTime, duration } = rushOrder
          const newOrder = Object.assign({}, rushOrder.data)
          newOrder.isNew = true
          newOrder.fromMachineId = rushOrder.data.fromMachineId ??  rushOrder.data.machineId
          newOrder.machineId = machineId
          newOrder.processId = processId
          newOrder.startTimeValue = expectStartTime
          newOrder.startTimeString = dayjs(ganttData.value.timeRange[0]).add(expectStartTime, 'second').format('YYYY-MM-DD HH:mm')
          newOrder.endTimeValue = expectStartTime + duration

          return newOrder
        })
        .flat()
      })
      .flat()
      .sort(sortStartTimeValue)

      //複製 NewOrders => EditOrders
      const spliceSize = newOrders.length
      ganttData.value.editOrders.splice(0)
      ganttData.value.editOrders.splice(0, spliceSize, ...newOrders)

      inSideController.ganttData.setAllOrders()
    },
    setAllOrders: () => {
      ganttData.value.resultOrders.splice(0)
      ganttData.value.orders.forEach(order => ganttData.value.resultOrders.push(order))
      ganttData.value.editOrders.forEach(order => ganttData.value.resultOrders.push(order))

    },
    addRootYItem: yItem => {
      ganttData.value.rootYItemList.push(yItem)
    },
    resetTempRootYItem: yItem => {
      ganttData.value.rootYItemList.splice(0)
      ganttData.value.rootYItemList.push(yItem)
      yItem.active = true
      ganttData.value.rootYItem = yItem
      setLevel('root')
      setLevel('next')
    },
    setRootYItem: activeItem => {
      console.log('inside:setRootYItem')
      ganttData.value.rootYItemList.forEach(rootItem => rootItem.active = false)
      activeItem.active = true

      if(activeItem === ganttData.value.rootYItem) return
      ganttData.value.rootYItem = activeItem
      setLevel('root')
    },
    get activeLevelIndexs() {
      return ganttData.value.activeLevelIndexs
    },
    setActiveLevelIndexs(indexs) {
      // ganttData.value.activeLevelIndexs = indexs
      ganttData.value.activeLevelIndexs.splice(0)
      indexs.forEach(index => ganttData.value.activeLevelIndexs.push(index))
      init()
    },
    get baseLevelIndex() {
      return ganttData.value.baseLevelIndex
    },
    setBaseLevelIndex(index) {
      ganttData.value.baseLevelIndex = index
      init()
    },
    setRushableMachine (orders):boolean {
      const rushableMap = ganttData.value.rushableMachines
      const unMapOrders = orders.filter(order => !rushableMap.has(order.orderKey))
      // 所有orderKey都有對應machines，ganttcanvas不須等待
      if(isEmpty(unMapOrders)) return false

      setRushableMap(unMapOrders) // 無對應machines的order需要重新查詢
      return true // 通知ganttcanvas設為等待狀態
    },
    getRushableMachine (orders) {
      const rushableMap = ganttData.value.rushableMachines
      const hasUnMapOrder = orders.some(order => !rushableMap.has(order.orderKey))
      if(hasUnMapOrder) return null

      const allRushMachines = orders.flatMap(order => rushableMap.get(order.orderKey))
      const uniqueRushMachines = [...new Set(allRushMachines)]

      return uniqueRushMachines // 通知ganttcanvas設為等待狀態
    }
  },
  ganttCanvas: {
    setLevelInfo: (type, value?) => {
      setLevel(type, value)
    },
    setAdjustTime: () => {
      setAdjustTime()
      // console.log()
    },
    setXScroll: (value, type) => {
      setXScroll(value, type)
    },
    getXAxisGrids: () => {
      return getXAxisGrids()
    },
    setScrollByOverView: (newTime, newYRate) => {
      setScrollByOverView(newTime, newYRate)
    }
  },
  rushManagement: {
    deleteRushMachine,
    resetRush,
    setRushableMap
  },
  crumbView: {
    setLevelInfo: data => {
      const levelInfo = ganttData.value.levelInfo
      levelInfo.curItem = data.curItem
      levelInfo.crumbs.splice(0)
      data.crumbs.forEach(crumb => levelInfo.crumbs.push(crumb))
    }
  },
  sideView: {
    setNextView: (...params) => {
      props.outsideController.sideView.setNextView(...params)
    }
  },
  overView: {
    setOrders: orders => {
      const descMarkIndex  = (a, b) => b.markIndex - a.markIndex
      overViewData.value.orders = orders.flat()
      overViewData.value.orders.sort(descMarkIndex)
      overViewData.value.totalYColumns = orders.length
    },
    setScrollTimeRange: timeRange => {
      const [ startTime, endTime ]  = timeRange
      overViewData.value.scrollStartTime = startTime
      overViewData.value.scrollEndTime = endTime
      // console.log(overViewData.value)
    },
    setDisplayTime: timeInfo => {
      const {
        displayStartTime,
        displayTimeDuration
      } = timeInfo
      // if(displayStartTime)
      overViewData.value.displayStartTime = displayStartTime
      // if(displayTimeDuration)
      overViewData.value.displayTimeDuration = displayTimeDuration
    },
    setDisplayYRate: rateInfo => {
      const {
        displayYStartRate,
        displayYHeightRate
      } = rateInfo

      // if(displayYStartRate)
      overViewData.value.displayYStartRate = displayYStartRate
      // if(displayYHeightRate)
      overViewData.value.displayYHeightRate = displayYHeightRate

    }
  },
  zoomView: {
    setZoomRate: newRate => {
      // getFocusX
      // getFocusTime
      const focusTime = getFocusTime('center')
      const prevFocusX = getFocusX(focusTime)
      ganttData.value.zoomRate = newRate //change WidthScale
      const tempFocusX = getFocusX(focusTime)
      const shiftX =  tempFocusX - prevFocusX
      // const shiftX =  prevFocusX - tempFocusX
      // ganttRef.value.reset('xScale')
      // reset('xScale')
      setXScroll(shiftX, 'xShift')

      // const tempFocusX2 = ganttRef.value.getFocusX('center')

      // console.log('FOCUSX', prevFocusX, tempFocusX1, tempFocu。sX2 )
      // getFocusX
    }
  },
  search: {
    setDisplay(area, levelIndex, groupLevel) {
      setSearchDisplay(area, levelIndex, groupLevel)
      // console.log(ganttData.value.levelInfo)
    },
    applySearch(groupItem, levelIndex, levelFilter) {
      const orders = ganttData.value.resultOrders

      const setItem = item => {
        switch (item.type) {
          case 'item': {
            if(item.orders.length === 0) return null
            break
          }
          case 'group': {
            item.children = item.children.filter(child => child !== null)
            if(item.children.length === 0) return null
            break
          }
        }
        if(item.i18nLabel) {
          if(i18nTest(item.i18nLabel)) item.name = i18nTranslate(item.i18nLabel)
        }

        return item
      }
      const effectFilters = deepClone([], groupItem.levelFilters )
      effectFilters.splice(levelIndex, 1, levelFilter)
      const newGroup = createYItemByFilters(orders, setItem, effectFilters)


      if(newGroup) {
        groupItem.children.splice(0)
        newGroup.children.forEach(child => {
          groupItem.children.push(child)
        })

        groupItem.nextLevelFilters.splice(0)
        newGroup.nextLevelFilters.forEach(filter => {
          groupItem.nextLevelFilters.push(filter)
        })
      }
      else {
        groupItem.children.splice(0)
        groupItem.nextLevelFilters.splice(0)
      }

      groupItem.levelFilters.splice(0)
      effectFilters.forEach(filter => {
        const { label, tab, param, values, type } = filter
        groupItem.levelFilters.push({ label, tab, param, type, values })
      })
      inSideController.ganttCanvas.setLevelInfo('reset')
    }
  },
  message: {
    tempMessageInfo: null,
    setTempMessageInfo (value) {

    },
    setMessage() {
      if(this.tempMessageInfo) {
        console.log()
      }
    }
  },
  i18n: {
    getTranslate: (i18nKey:string) => {
      return i18nTest(i18nKey) ? i18nTranslate(i18nKey) : i18nKey
    }
  },
  unobserve: () => {
    ganttRef?.value?.unobserve()
  },
  canvasResize: () => {
    ganttRef?.value?.canvasResize()
  }
  // setGanttData: async (orders, timeRange) => {
  //   return await setGanttData(orders, timeRange)
  // }
}


const initGanttOrdersMark = () => {
  initOrdersMark(ganttData.value.orders, ganttData.value.marks)
}



const getGanttData = (param?: string) => {
  if(!param) return ganttData.value

  if(hasOwnProperty(ganttData.value, param)) {
    return ganttData.value[param]
  }
  else {
    console.log(`Get Param:${param} Failed`)
    return null
  }
}


defineExpose({
  init,
  initOrders,
  initYItems,
  markViewChange,
  setLevel,
  setXScroll,
  setAdjustTime,
  getXAxisGrids,
  setScrollByOverView,
  getFocusTime,
  getFocusX,
  reset,
  setSearchDisplay,
  setOverViewVisible,
  setRushableMap,
  setGanttData,
  getGanttData,
  controller: inSideController
})

const tempMode = computed({
  get: () => ganttData.value.mode,
  set: value => {
    inSideController.ganttData.setMode(value)
  }
})


onMounted(() => {
  // 如果有
  switch(props.type) {
    case 'Rush': {
      break
    }
    case 'View': {
      useFunction.DragData = false
      useFunction.RushManagement = false
      useFunction.ModeTab = false
      break
    }
    case 'Temp': {
      useFunction.DragData = false
      useFunction.RushManagement = false
      useFunction.ModeTab = false
      useFunction.Crumb = false
      break
    }
  }


  props.disableFunctions.forEach(funcName => {
    useFunction[funcName] = false
  })

  if(useFunction.ModeTab) window.addEventListener('keydown', keyEvent)


})



</script>

<template>
  <DragWindow
    v-if="useFunction.OverView"
    i18n-title="gantt-overView"
    v-model:visible="overViewVisible"
  >
    <div class="over-container">
      <ZoomView
        :zoomRate="ganttData.zoomRate"
        :controller="inSideController"
      />
      <!-- <div style="height: 200px;"></div> -->
      <GanttOverView
        :visible="overViewVisible"
        :overViewData="overViewData"
        :marks="ganttData.marks"
        :baseLevelIndex="ganttData.baseLevelIndex"
        :controller="inSideController"
      />
    </div>

  </DragWindow>

  <div class="page-container"  v-loading="isLoading" >
    <!-- 插單管理 RushManagement-->
    <RushManagement
      v-if="useFunction.RushManagement"
      ref="rushManagementRef"
      :rush-map="ganttData.rushMachinesMap"
      :controller="inSideController"
      @delete="deleteRushMachine"
      @reset="resetRush"
    />
    <template v-if="showGantt" >
      <div class="info-container between">
        <!-- 調整模式 -->
        <div class="info-tab" v-if="useFunction.ModeTab">
          <CustomTabs
            v-model="tempMode"
            i18n-module="auto_common"
            stretch
            :options="modeOptions"
          />
        </div>
        <!-- 標籤 MarkView -->
        <MarkView
        :ganttData="ganttData"
        @change="markViewChange"
      />
      </div>
      <!-- 麵包屑 CrumbView -->
      <div class="info-container">
        <CrumbView
          :zoom-rate="ganttData.zoomRate"
          :level-info="ganttData.levelInfo"
          :rootYItem="ganttData.rootYItem"
          :rootYItemList="ganttData.rootYItemList"
          :controller="inSideController"
          :useFunction="useFunction"
        />
      </div>
      <!-- 甘特圖 GanttView -->
      <div class="gantt-container">
        <GanttView
          ref="ganttRef"
          :ganttData="ganttData"
          :controller="inSideController"
          :drag-item="dragItem"
          :rush-management="rushManagement"
          :side-view="sideMethod"
          :useFunction="useFunction"
        >
        </GanttView>
      </div>
    </template>
    <template v-else>
      <CustomEmpty :description="i18nTranslate('gantt-empty')/*無工單資料，請先設置日期區間*/"/>
    </template>
  </div>
</template>

<style lang="scss" scoped>
$feature-width: 500px;
$bg-color: #eceff5;

.page {
  &-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row-reverse;

    position: relative;

    overflow: hidden;
  }

  &-container {
    width: 100%;
    height: 100%;

    overflow: hidden;
    display: flex;
    flex-direction: column;
    // flex-wrap: nowrap;
    // gap: 8px;
    position: relative;
  }

  &-feature {
    height: 100%;
    will-change: width;
    transition-duration: 0.3s;
    position: relative;
    // border-radius: 6px;
    display: flex;
    flex-direction: column;
    background-color: $bg-color;

    &.is-open {
      width: $feature-width;
    }

    &.is-close {
      width: 40px;
    }

    .feature {
      &-top {
        width: 100%;
        padding: 4px;
        border-bottom: solid 1px;
        margin-bottom: 6px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        &-btn {
          display: flex;
          gap: 6px;
        }
      }

      &-config {
        display: flex;
        flex-direction: column;
        gap: 8px;

      }

      &-side {
        padding: 4px;
        padding-top: 8px;
        display: flex;

        // border: solid 4px #336194;
        width: fit-content;
        height: 100%;
        background-color: #bdc5cd;
      }
      &-list {
        padding: 8px 0px;
      }

      &-btn {
        transition: transform;

        &-container {
          display: flex;
          flex-direction: column;
          gap: 2px;
          // height: 50px;
          align-content: center;
          // flex-direction: column;
          justify-content: space-between;
        }
        // position: absolute;
        // right: 0;
        // z-index: 1;
        &.is-open {
          transform: rotateZ(0deg); //translateY(-100%) translateX(50%)
        }

        &.is-close {
          transform: rotateZ(180deg); //translateY(-100%) translateX(50%)
        }
      }

      &-container {
        display: flex;
        width: 100%;
        flex: 1;
        height: 100%;
        overflow-y: clip;
        scrollbar-width: none;
        // background-color: $bg-color;
        // border-radius: 0 0 6px 6px;
      }

      &-content {
        width: 100%;
        height: 100%;
        padding: 4px;
        // background-color: white;
        // margin: 8px;
        border-radius: 4px;
        // overflow-y: scroll;
      }


    }
  }
}

.info {
  &-container {
    display: flex;
    align-items: center;
    width: 100%;
    padding-left: 8px;
    padding-right: 8px;

    &.between {
      justify-content: space-between;
    }
  }
  &-tab {
    padding-left: 8px;
    width: fit-content;
  }
}

.gantt {
  &-container {
    width: 100%;
    height: 100%;
    max-height: 100vh;
    padding-left: 8px;
    padding-right: 7px;

    overflow: hidden;
    // flex-shrink: 1;
    // overflow: scroll;
  }
}

.over {
  &-container {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}
</style>
