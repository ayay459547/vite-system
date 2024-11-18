<script setup lang="ts">
import type { PropType } from 'vue'
import { onMounted, onUnmounted, ref, reactive, inject, nextTick, watch } from 'vue'

// import { useLocaleStore } from '@/stores/stores_locale'
import type { ResizeObserverCallback } from '@/lib/lib_throttle'
import throttle from '@/lib/lib_throttle'

import type { UseHook } from '@/declare/hook' // 全域功能類型
import { SimpleFilter, CustomInput, CustomButton, CustomTabs, CustomDivider } from '@/components' // 系統組件
import { isEmpty } from '@/lib/lib_utils' // 工具
import { createGanttView } from './ganttSetting'

import MessageView from './MessageView.vue'
import SearchView from './SearchView.vue'
const useHook: UseHook = inject('useHook')
const { swal, i18nTranslate } = useHook({
  i18nModule: 'auto_common'
})


// store
// const localeStore = useLocaleStore()
// const curLang = localeStore.currentLang
// @ts-ignore TEST 更換語言




const props = defineProps({
  ganttData: {
    type: Object,
    required: true
  },
  controller: {
    type: Object,
    required: true
  },
  dragItem: {
    type: [Object, null] as PropType<any>,
    required: true
  },
  rushManagement: {
    type: [Object, null]  as PropType<any>,
    required: true
  },
  sideView: {
    type: [Object, null]  as PropType<any>,
    required: true
  },
  useFunction: {
    type: [Object, null]  as PropType<any>,
    required: true
  }
})


const resetCanvas = async (type) => {
  await nextTick()
  ganttObject.reset(type)
}

const initOrders = async () => {
  await nextTick()
  ganttObject.reset('yItems')
}
const initYItems = async () => {
  await nextTick()
  init()
}

const setLevel = async (type, data?) => {
  await nextTick()
  ganttObject.setLevelInfo(type, data)
  init()
}
const setXScroll = (value, type) => {
  ganttObject.setXScroll(value, type)
  resetCanvas('xScale')
  // init()
}
const setYScroll = (value, type) => {
  ganttObject.setYScroll(value, type)
  // init()
}
const setScrollByOverView = (newTime, newYRate) => {
  ganttObject.setXScroll(newTime, 'timeValue')
  ganttObject.setYScroll(newYRate, 'rate')
}
const setAdjustTime = () => {
  init()
  // await nextTick()
  ganttObject.setAdjustTime()
  // init()
}

const getXAxisGrids = () => {
  return ganttObject.getXAxisGrids()
}
const getFocusX = time => {
  return ganttObject.getFocusX(time)
}
const getFocusTime = type => {
  return ganttObject.getFocusTime(type)
}

// Resize 設定
const ROcallback = throttle((entries: ResizeObserverEntry[]) => {
  entries.forEach(() => {
    // const { x, y, width, height } = entry.contentRect
    // console.log('ENTRY', entry.contentRect)
    ganttResize()
  })
}, 10) as ResizeObserverCallback

const RO = new ResizeObserver(ROcallback)


// 甘特圖設定
let ganttObject
const ganttIsDrawing = ref(false)
// const popoverValue = ref(false)

const ganttResize = () => {
  // console.log('Resize!')
  if(!canvasContainer.value) return
  ganttCanvas.value.width = canvasContainer.value.clientWidth
  ganttCanvas.value.height = canvasContainer.value.clientHeight
  if(isEmpty(ganttObject)) return
  // ganttObject.init()
  ganttObject.reset('canvasSize')
  ganttObject.drawFrame()
  // init()
}


const canvasResize = () => {
  if(!canvasContainer.value) return
  const width = canvasContainer.value.clientWidth
  const height = canvasContainer.value.clientHeight

  if(ganttCanvas.value.width !== width || ganttCanvas.value.height !== height) {
    // console.log(width, height)
    ganttCanvas.value.width = width
    ganttCanvas.value.height = height
    if(isEmpty(ganttObject)) return
    ganttObject.reset('canvasSize')
    // ganttObject.drawFrame()
  }
}


const canvasContainer = ref(null)

// const checkSize = async () => {
//   console.log(canvasContainer.value.clientWidth, canvasContainer.value.clientHeight)
//   setTimeout(checkSize, 100)
// }



const ganttCanvas = ref(null)
let requestId
let stopDraw = false
const init = () => {
  if(isEmpty(ganttObject)) return

  ganttObject.init()
  if(!ganttIsDrawing.value) {
    // nIntervId = setInterval(ganttObject.drawArea, 10)
    requestId = requestAnimationFrame(ganttObject.drawArea)
    // console.log('RESET')
    // requestId = requestAnimationFrame(drawCanvas)
    ganttIsDrawing.value = true
  }
}


const drawCanvas = () => {
  if(stopDraw) {
    cancelAnimationFrame(requestId)
  }
  else {
    canvasResize()
    ganttObject.drawFrame()
    requestId = requestAnimationFrame(drawCanvas)
  }

}






// Event Listener

const ganttClick = (event) => {
  ganttObject.checkEvent(event)
  // console.log('click', [params.offsetX, params.offsetY])
  //offSetXm
}
const ganttMove = (event) => {
  ganttObject.checkEvent(event)
  if(props.dragItem.value) {
    // console.log('DRAG', props.dragItem.value)
    // console.log('Info', canvasMessage.value)
    dragStyle.top = event.layerY + 'px'
    dragStyle.left = event.layerX + 20 + 'px'

    // console.log()
    // console.log(event)
  }

  // console.log('Move', event)
}
const ganttKey = (event) => {
  if(event.key === 'Alt') {
    event.preventDefault()
  }
  ganttObject.checkEvent(event)
  // console.log('Key', event.type)
}
const ganttScroll = (event) => {
  event.preventDefault()
  ganttObject.checkEvent(event)
  // console.log('scroll', event)
}

const dragStyle = reactive({
  position: 'absolute' as 'absolute',
  top: '0px',
  left: '0px'
})

const ganttDrag = event => {
  event.preventDefault()
  ganttObject.checkEvent(event)
  switch (event.type) {
    case 'dragstart': {
      // ganttObject.checkEvent(event)
      // console.log('DRAGSTART', props.dragItem.value)
      dragStyle.top = event.layerY + 'px'
      dragStyle.left = event.layerX + 20 + 'px'

      break
    }
  }

  // console.log('Drag', event)
}

const cursorType = ref('default')



const canvasMessage = ref({})
// const messageData = ref({})


const searchDisplay = ref(false)
const searchArea = ref(null)
const searchLevelIndex = ref(null)
const searchLevelFilters = ref([])
const searchGroupItem = ref({})
const searchName = ref('')
const setSearchDisplay = (area, levelIndex, data) => {
  searchDisplay.value = !searchDisplay.value
  searchArea.value  = area
  searchLevelIndex.value = levelIndex
  searchLevelFilters.value = data.levelFilters
  searchName.value =  data.name
  searchGroupItem.value = data

}



const unobserve = () => {
  // RO.unobserve(canvasContainer.value)
}

defineExpose(
  {
    init,
    reset: resetCanvas,
    // initGant,
    initOrders,
    initYItems,
    setLevel,
    setXScroll,
    setYScroll,
    setAdjustTime,
    setScrollByOverView,
    getXAxisGrids,
    getFocusX,
    getFocusTime,
    setSearchDisplay,
    unobserve,
    canvasResize
  }
)




onMounted(() => {
  // console.log(localeStore.currentLang)
  // 設定監聽事件
  // ganttCanvas.value.addEventListener('resize', ganttResize, false)
  ganttCanvas.value.addEventListener('click', ganttClick, false)
  ganttCanvas.value.addEventListener('dblclick', ganttClick, false)
  ganttCanvas.value.addEventListener('mousedown', ganttClick, false)

  window.addEventListener('mouseup', ganttClick, false)
  window.addEventListener('mousemove', ganttMove, false)
  // ganttCanvas.value.addEventListener('mousemove', ganttMove, false)
  // Drag Event
  ganttCanvas.value.addEventListener('dragstart', ganttDrag, false)
  ganttCanvas.value.addEventListener('wheel', ganttScroll, false)
  // Key Event
  window.addEventListener('keydown', ganttKey)
  window.addEventListener('keyup', ganttKey)
 // 設定甘特圖
  ganttObject = createGanttView(
    ganttCanvas?.value,
    props.ganttData,
    props.dragItem,
    props.rushManagement,
    props.sideView,
    props.controller,
    canvasMessage,
    cursorType,
    props.useFunction
  )
  // checkSize()
  // RO.observe(canvasContainer.value)
})
onUnmounted(() => {
  // ganttCanvas.value.removeEventListener('click', ganttClick, false)
  // ganttCanvas.value.removeEventListener('dblclick', ganttClick, false)
  // ganttCanvas.value.removedEventListener('mousedown', ganttClick, false)
  window.removeEventListener('mouseup', ganttClick, false)
  window.removeEventListener('mousemove', ganttMove, false)
  // ganttCanvas.value.removeEventListener('dragstart', ganttDrag, false)
  window.removeEventListener('keydown', ganttKey)
  window.removeEventListener('keyup', ganttKey)
  // ganttCanvas.value.removeEventListener('wheel', ganttScroll, false)

  // RO.unobserve(canvasContainer.value)
  stopDraw = true
})

</script>

<template>
  <div v-loading="ganttData.isLoading" class="page">
    <!-- <div class="drag-item" v-if="props.dragItem.value" :style="dragStyle">
      <div class="drag-data" v-for="item in props.dragItem.value.data" :key="item">
        {{ item.orderIds }}
      </div>
    </div> -->
    <template v-if="!isEmpty(canvasMessage)">
      <MessageView :message="canvasMessage"/>
    </template>
    <template v-if="searchDisplay">
      <SearchView
        v-model:display="searchDisplay"
        :area="searchArea"
        :level-index="searchLevelIndex"
        :level-filters="searchLevelFilters"
        :name="searchName"
        :group-item="searchGroupItem"
        :filter-columns="props.ganttData.filterColumns"
        :controller="props.controller"
      />
    </template>


    <div
      ref="canvasContainer"
      class="canvas-container"
      :style="{
        cursor: cursorType
      }"
    >
      <div class ="canvas-main">
        <canvas
          v-show="!isEmpty(props.ganttData.orders)"
          ref="ganttCanvas"
          draggable="true"
        >
        </canvas>
      </div>
        <!-- <div v-else>
          <CustomEmpty />
        </div> -->
        </div>

  </div>
</template>

<style lang="scss" scoped>
.page {
  // position: relative;
  width: 100%;
  height: 100%;

  // display: flex;

  // padding: 16px;
  display: flex;
  align-content: stretch;
  flex-direction: column;

  overflow: hidden;
  // gap: 8px;
  // overflow-x: hidden;

  // overflow-y: scroll;

  &-top {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}


.drag {
  &-item {
    position: 'absolute';
    width: 120px;
    height: fit-content;
    gap: 8px;
    background-color: white;
    border-radius: 5px;
    pointer-events: none;
    opacity: 0.8;
  }


  &-data {
    // width: 160px;
    height: 30px;
    // margin: 4px;
    // display: flex;
    padding-left: 1px;
    padding-right: 1px;
    margin: 2px;
    border: 1px solid #c8c9cc;
    background-color: #f4f4f5; // #ebeef5;
    border-radius: 5px;

    // width: 100%;
    overflow: hidden;
    text-align: center;
    justify-content: center;
    align-content: center;

  }
}

.bubble {
  &-item {
    position: relative;
    // width: 120px;
    height: 40px;
    padding: 8px;
    // gap: 8px;

    border: 1px solid #c8c9cc;
    background-color: white;
    border-radius: 2px;
    pointer-events: none;
    // overflow: hidden;
    text-align: center;
    justify-content: center;
    align-content: center;
    box-shadow: 0px 1px 2px 1px lightgray;

    &:before {
      content: "";
      position: absolute;
      // background: red;
      top: 100%;
      left: 28px;
      border-top: solid 10px lightgray;
      border-left: solid 10px transparent;
      border-right: solid 10px transparent;




      // box-shadow: 0px 0px 5px 3px lightgray;
    }
    &:after {
      content: "";
      position: absolute;
      // background: red;
      top: 100%;
      left: 30px;
      border-top: solid 8px white;
      border-left: solid 8px transparent;
      border-right: solid 8px transparent;
      // box-shadow: 0px 0px 5px 3px lightgray;
    }


  }

  // &-data {
  //   background-color: white;
  //   border: 1px black solid;
  //   padding: 4px;
  //   margin: 2px;
  //   height: 24px;
  //   text-align: center;
  // }


  &-data {
    // width: 160px;
    // height: 30px;
    // margin: 4px;
    // display: flex;
    // padding-left: 2px;
    // padding-right: 2px;
    // margin: 2px;
    // border: 1px solid #c8c9cc;
    // background-color: #f4f4f5; // #ebeef5;
    // border-radius: 5px;

    // width: 100%;
    overflow: hidden;
    text-align: center;
    justify-content: center;
    align-content: center;

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
    width: 100%;
    height: 100vh;
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

.canvas-container {
  display: flex;
  width: 100%;
  height: 100%;
  // max-height: 100%;
  // flex-shrink: 1;

  // align-items: stretch;
  // height: max-content;
  // max-height: 100vh;
  // flex-wrap: nowrap;
}
.canvas-main {
  width: 100%;
  height: 100%;
}

</style>
