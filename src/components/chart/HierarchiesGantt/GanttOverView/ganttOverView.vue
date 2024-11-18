<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'

const props = defineProps({
  overViewData: {
    type: Object,
    required: true
  },
  visible: {
    type: Boolean,
    required: true
  },
  marks: {
    type: Array,
    required: true
  },
  baseLevelIndex: {
    type: Number,
    required: true
  },
  controller: {
    type: Object,
    required: true
  }
})



//drawFunction
const clipRect = (ctx, x, y, width, height) => {
    const _x = Math.floor(x) + 0.5
    const _y = Math.floor(y) + 0.5
    const _width = Math.floor(width)
    const _height =  Math.floor(height)
    ctx.beginPath()
    ctx.rect(_x, _y, _width, _height)
    ctx.clip()
}
const drawRect = (ctx, x, y, width, height, type) => {
    const _x = Math.floor(x) //+ 0.5
    const _y = Math.floor(y) //+ 0.5
    const _width = Math.floor(width)
    const _height =  Math.floor(height)

    ctx.beginPath()
    ctx.rect(_x, _y, _width, _height)

    switch (type) {
      case 'stroke': {
        ctx.stroke()
        break
      }
      case 'fill': {
        ctx.fill()
        break
      }
      case 'block': {
        ctx.fill()
        ctx.stroke()
        break
      }
    }
}
const drawLine = (ctx, x, y, width, height) => {
    const _x = Math.floor(x) + 0.5
    const _y = Math.floor(y) + 0.5
    const _width = Math.floor(width)
    const _height =  Math.floor(height)

    ctx.beginPath()
    ctx.moveTo(_x, _y)
    ctx.lineTo(_x + _width, _y + _height)
    ctx.stroke()
}
const ctxClear = (ctx) => {
  ctx.clearRect(0, 0, canvasContainer.value.clientWidth, canvasContainer.value.clientHeight )
}

//
const overViewParams = {
  // OverView Common
  get startTime () {
    return props.overViewData.scrollStartTime
  },
  get totalTime () {
    return props.overViewData.scrollEndTime - props.overViewData.scrollStartTime
  },
  get secondWidth () {
    return overViewRef.value.width / overViewParams.totalTime
  },
  get columnHeight () {
    const tempHeight = (canvasContainer.value.clientHeight - 4) / props.overViewData.totalYColumns
    const maxHeight = 6
    const minHeight = 3

    if (tempHeight > maxHeight) return maxHeight
    if (tempHeight < minHeight) return minHeight
    return tempHeight
  },
  get totalHeight () {
    return overViewParams.columnHeight * props.overViewData.totalYColumns
  },
  // DisplayArea
  get displayX () {
    const { startTime, secondWidth } = overViewParams
    return (props.overViewData.displayStartTime - startTime) * secondWidth
  },
  get displayY () {
    const { totalHeight } = overViewParams
    return props.overViewData.displayYStartRate * totalHeight
  },
  get displayWidth () {
    const { totalTime, secondWidth } = overViewParams
    const { displayTimeDuration } = props.overViewData
    if(displayTimeDuration < totalTime) return displayTimeDuration * secondWidth
    return totalTime * secondWidth
  },
  get displayHeight () {
    const { totalHeight } = overViewParams
    const { displayYHeightRate } = props.overViewData
    return displayYHeightRate * totalHeight
  },
  get displayArea () {
    const { displayX, displayY, displayWidth, displayHeight } = overViewParams
    return [ displayX, displayY, displayWidth, displayHeight ] as [
      number,
      number,
      number,
      number,
    ]
  }
}

const canvasContainer = ref(null)
const canvasScroll = ref(null)
const setCanvasSize = () => {
  const { totalHeight } = overViewParams
  const width = canvasScroll.value.clientWidth - 4
  const height = (totalHeight > 0) ?  totalHeight :  canvasContainer.value.clientHeight - 4
    // (totalHeight > canvasContainer.value.clientHeight - 4) ?
    // totalHeight : canvasContainer.value.clientHeight - 4
  if(totalHeight < canvasContainer.value.clientHeight) {
    containerStyle.value = ['align-items: center;']
  }
  else {
    containerStyle.value = ['align-items: normal;']
  }

  // console.log('HEIGTH',  canvasContainer.value.scrollHeight,  canvasContainer.value.clientHeight)

  overViewRef.value.width = width
  overViewRef.value.height = height
  gridCanvas.width = width
  gridCanvas.height = height
  orderViewCanvas.width = width
  orderViewCanvas.height = height
  displayAreaCanvas.width = width
  displayAreaCanvas.height = height

}
const overViewRef = ref(null)
const overViewDraw = () => {
  const ctx = overViewRef.value.getContext('2d')
  ctxClear(ctx)
  ctx.drawImage(gridCanvas, 0, 0)
  ctx.drawImage(orderViewCanvas, 0, 0)
  ctx.drawImage(displayAreaCanvas, 0, 0)
}

const createCanvas = () => {
  return document.createElement('canvas')
}

// order 現在levelFilter篩選出的工單
const orderViewCanvas = createCanvas()
const orderViewCtx = orderViewCanvas.getContext('2d')
const orderViewDraw = () => {
  // const ctx = orderViewCanvas.getContext('2d')
  const ctx = orderViewCtx
  const {
    startTime,
    // totalTime,
    secondWidth,
    columnHeight
  } = overViewParams

  const minOrderWidth = 2
  // ctx.lineWidth = 1
  // ctx.strokeStyle = 'rgba(255,255,255,0.8)'

  const paramIsEditingOrders = [] //正在編輯中的橘色標識物
  const paramWasRushOrders = [] //過去曾經編輯過的紅底提示

  ctxClear(ctx)
  props.overViewData.orders.forEach(order => {
    if(ctx.fillStyle !== order.markColor) ctx.fillStyle = order.markColor

    const orderX = (order.startTimeValue - startTime) * secondWidth
    const tempOrderWidth = (order.endTimeValue - order.startTimeValue) * secondWidth
    const orderWidth = (tempOrderWidth > minOrderWidth) ? tempOrderWidth : minOrderWidth

    const orderY = (order.yIndex + 0.3) * columnHeight
    const orderHeight = 0.7 * columnHeight

    if(order.isNew) {
      const editingOrderX =  orderX
      const editingOrderY = order.yIndex * columnHeight
      const params = [editingOrderX, editingOrderY]
      paramIsEditingOrders.push(params)
    }
    else if(order.wasRush) {
      const wasRushgOrderX =  orderX
      const wasRushOrderY = (order.yIndex + 1) * columnHeight
      const wasRushOrderWidth = orderWidth
      const params = [wasRushgOrderX, wasRushOrderY, wasRushOrderWidth]
      paramWasRushOrders.push(params)

      drawRect(ctx, orderX, orderY, orderWidth, orderHeight, 'fill')
    }
    else {
      drawRect(ctx, orderX, orderY, orderWidth, orderHeight, 'fill')
    }
  })


  ctx.strokeStyle = '#D70909'
  const drawWasRushOrder = ([x, y, width]) => {
    drawLine(ctx, x, y, width, 0)
  }
  paramWasRushOrders.forEach(drawWasRushOrder)

  ctx.strokeStyle = 'darkorange'
  ctx.lineWidth = 2
  const drawIsEditingOrders = ([x, y]) => {
    drawLine(ctx, x, y, 0, columnHeight)
  }
  paramIsEditingOrders.forEach(drawIsEditingOrders)

}
// Grid 根據BaseTime的格線
const gridCanvas = createCanvas()
const gridCtx = gridCanvas.getContext('2d')
const gridDraw = () => {
  const {
    startTime,
    secondWidth,
    totalHeight
  } = overViewParams


  // const gridCtx = gridCanvas.getContext('2d')
  gridCtx.save()
  gridCtx.fillStyle = 'white'
  gridCtx.lineWidth = 1
  gridCtx.strokeStyle = 'rgb(240,240,240)'

  ctxClear(gridCtx)
  clipRect(gridCtx, 0, 0, gridCanvas.width, totalHeight)
  drawRect(gridCtx, 0, 0, gridCanvas.width, totalHeight, 'block')

  const gridTimeValues = props.controller.ganttCanvas.getXAxisGrids()
  const gridY = 0
  const gridHeight = gridCanvas.height

  gridTimeValues.forEach(timeValue => {
    const gridX = (timeValue - startTime) * secondWidth
    drawLine(gridCtx, gridX, gridY, 0,  gridHeight)
  })


  gridCtx.restore()

}
// display 現在甘特圖顯示中的範圍
const displayAreaCanvas = createCanvas()
const displayAreaDraw = () => {
  const {
    totalHeight,
    displayArea
  } = overViewParams

  const ctx = displayAreaCanvas.getContext('2d')
  // Draw Shield
  ctx.clearRect(0, 0, displayAreaCanvas.width, displayAreaCanvas.height)
  ctx.fillStyle = 'rgba(100, 100, 100, 0.1)'
  drawRect(ctx, 0, 0, displayAreaCanvas.width, totalHeight, 'fill')
  // Draw DisplayArea
  ctx.lineWidth = 1
  ctx.strokeStyle = 'rgb(30,144,255)'

  const adjustArea = [
    displayArea[0] + 1,
    displayArea[1] + 1,
    displayArea[2] - 2,
    displayArea[3] - 2
  ] as [number, number, number, number]
  ctx.clearRect(...adjustArea)
  drawRect(ctx, ...adjustArea, 'stroke')
}



const drawable = computed(() => {
  return props.visible
  // if(!props.visible) return false
  // if
  // return props.overViewData.scrollStartTime && props.overViewData.scrollEndTime
})
const drawTrigger = {
  resize: false,
  grid: false,
  order: false,
  displayArea: false,
  overView: false,
  checkTrigger (param) {
    return this[param]
  },
  setTrigger (type) {
    switch (type) {
      case 'all': {
        this.resize = true,
        this.grid = true
        this.order = true
        this.displayArea = true
        this.overView = true
        break
      }
      case 'clear': {
        this.resize = false,
        this.grid = false
        this.order = false
        this.displayArea = false
        this.overView = false
        break
      }
    }
  }
}
// 繪製Canvas
const drawCanvas = () => {
  // 無法繪製則略過
  if(drawable.value) {
    // 有需要重新繪製 => Trigger被觸發為True
    if(drawTrigger.resize) setCanvasSize()
    if(drawTrigger.grid) gridDraw()
    if(drawTrigger.order) orderViewDraw()
    if(drawTrigger.displayArea) displayAreaDraw()
    if(drawTrigger.overView) overViewDraw()
    // 清空所有Trigger
    drawTrigger.setTrigger('clear')
  }
  //要求繪製下一幀
  if(!stopDrawRequest.value) requestAnimationFrame(drawCanvas)
}

// 監聽繪製用的參數以觸發DrawTrigger
watch(
  [
    () => props.visible,
    () => props.overViewData.orders
  ],
  () => {
    drawTrigger.setTrigger('all')
  }
)
watch(
  [
    () => props.overViewData.scrollStartTime,
    () => props.overViewData.scrollEndTime
  ],
  () => {
    drawTrigger.grid = true
    drawTrigger.order = true
    drawTrigger.displayArea = true
    drawTrigger.overView = true
  }
)
watch(
  [
    () => props.baseLevelIndex
  ],
  () => {
    drawTrigger.grid = true
    drawTrigger.displayArea = true
    drawTrigger.overView = true
  }
)
watch(
  [
    () => props.overViewData.displayStartTime,
    () => props.overViewData.displayTimeDuration,
    () => props.overViewData.displayYStartRate,
    () => props.overViewData.displayYHeightRate
  ],
  () => {
    drawTrigger.displayArea = true
    drawTrigger.overView = true
  }
)

const grabController = {
  isGrabing: false,
  recordClientX: NaN,
  recordClientY: NaN,
  recordDisplayX: NaN,
  recordDisplayY: NaN,

  grabStart (event) {
    if(grabController.isGrabing) return
    grabController.isGrabing = true

    const { clientX, clientY } = event
    const { displayX, displayY } = overViewParams
    grabController.recordClientX = clientX
    grabController.recordClientY = clientY
    grabController.recordDisplayY = displayY,
    grabController.recordDisplayX = displayX,
    setCursor('grabbing')
  },
  grabMove (event) {
    if(!grabController.isGrabing) return

    const { clientX, clientY } = event
    const moveX = clientX - grabController.recordClientX
    const moveY = clientY - grabController.recordClientY

    const { secondWidth, totalHeight, startTime } = overViewParams
    const newTime = (moveX + grabController.recordDisplayX) / secondWidth + startTime
    const newYRate = (grabController.recordDisplayY + moveY) / totalHeight

    props.controller.ganttCanvas.setScrollByOverView(newTime, newYRate)
  },
  grabEnd () {
    grabController.isGrabing = false
    grabController.recordClientX = NaN
    grabController.recordClientY = NaN
    setCursor('default')
  }
}



const containerStyle = ref([])
const setCursor = type => {
  overViewRef.value.style.cursor = type
  // document.body.style.cursor = type
}

const isInArea = (event, area) => {
  const {
    offsetX,
    offsetY
  } = event
  const [
    left,
    top,
    width,
    height
 ] = area

  const inX = left <= offsetX && offsetX <= (left + width)
  const inY = top <= offsetY && offsetY <= (top + height)
  return inX && inY
}

const checkMove = event => {
  if(grabController.isGrabing) {
    grabController.grabMove(event)
  }
  else {
    const { displayArea } = overViewParams
    if(isInArea(event, displayArea)) setCursor('grab')
    else setCursor('default')
  }

}
const checkClick = event => {
  const { displayArea } = overViewParams
  if(isInArea(event, displayArea)) {
    grabController.grabStart(event)
  }
}
const checkDblClick = event => {
  const { displayWidth, displayHeight } = overViewParams
  const { offsetX, offsetY } = event
  const { secondWidth, totalHeight, startTime } = overViewParams
  // 點擊位置 - 半寬高 = 新座標
  const newTime = (offsetX - displayWidth / 2 ) / secondWidth + startTime
  const newYRate = (offsetY - displayHeight / 2) / totalHeight

  props.controller.ganttCanvas.setScrollByOverView(newTime, newYRate)
}
const mouseRelease = () => {
  if(grabController.isGrabing) {
    grabController.grabEnd()
  }
}

onMounted(() => {
  overViewRef.value.addEventListener('mousedown', checkClick, false)
  overViewRef.value.addEventListener('dblclick', checkDblClick, false)
  overViewRef.value.addEventListener('mousemove', checkMove, false)
  window.addEventListener('mouseup', mouseRelease, false)

  drawCanvas()
})


const stopDrawRequest = ref(false)
onUnmounted(() => {
  stopDrawRequest.value = true
})

</script>


<template>
  <div class="canvas-wrapper">
    <div
      ref="canvasContainer"
      class="canvas-container"
      :style="containerStyle"
    >
    <!-- :style="`cursor: ${cursorType};`" -->
      <div class="canvas-scroll"
        ref="canvasScroll"
      >
        <canvas
          class="canvas-all"
          ref="overViewRef"
        >
        </canvas>
      </div>
      <!-- <canvas
        class="canvas-grid"
        ref="gridRef"
      >
      </canvas>
      <canvas
        class="canvas-order"
        ref="orderViewRef"
      >
      </canvas>
      <canvas
        class="canvas-display"
        ref="displayAreaRef"
      >
      </canvas> -->
        <!-- <div v-else>
          <CustomEmpty />
        </div> -->
    </div>
  </div>

</template>



<style lang="scss" scoped>

.canvas
{
  &-container {
    position: absolute;
    display: flex;
    //min-width
    //min-height
    top: 2px;
    left: 2px;
    width: calc(100% - 4px);
    height: calc(100% - 4px);
    overflow-y: scroll;
    overflow-x: hidden;
  }

  &-wrapper {
    flex-grow: 1;
    position: relative;
    //min-width
    //min-height
    width: 100%;
    background-color: rgb(251, 251, 251);
    padding: 2px;
  }

  &-scroll {
    height: fit-content;
    width: 100%;
    // height: 100%;
    // width: fit-content;
    // overflow-x: hidden;
  }
  // max-height: 100%;
  // flex-shrink: 1;

  // height: max-content;
  // max-height: 100vh;
  // flex-wrap: nowrap;
}

</style>