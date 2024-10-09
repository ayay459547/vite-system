
import { nextTick, computed } from 'vue'
import { useLocaleStore } from '@/stores/stores_locale'
import { isEmpty,deepClone, message } from '@/lib/lib_utils'
import type { YItemStick } from '@/lib/lib_gantt'
import {
  createYItemByFilters,
  setYItemDepth,
  resetYItemByFilters,
  applyLevelFilters,
  filterColumnSetting
} from '@/lib/lib_gantt'
import dayjs, { getQuarter, getWeekOfYear } from '@/lib/lib_day'
import set from '@/views/TestPage/Howard/CustomInput_Test/set'
import { controlledRef } from '@vueuse/core'
import { Console } from 'console'
// import { Child, Envelope } from '@vicons/fa'
// import { EventBusyFilled } from '@vicons/material'
// import { init } from 'echarts'
// import { stat } from 'fs'
// import { S } from '@vicons/carbon'
// import { machine } from 'os'
// import { BorderBottom } from '@vicons/tabler'
// import { vModelText } from 'vue'





type DrawRect = 'fill' | 'stroke' | 'block'
type Area = {
  left: number
  right: number
  top: number
  bottom: number
}

const colorHover = '#F0F8FF'
const colorNoMark = '#F8F8FF'
const wasRush = '#D70909'
// const colorRushOrder = 'rgba(220, 220, 220, 0.4)'


const useExpectTime = false


// timeRange => scheduledOrder
// scheduledOrder, editingOrder, allTypeOrder
// levelInfo :
//
// levelCurOrder


// set: 變更物件參數
// get: 給出物件參數，或根據物件參數給計算值，不依賴外部傳入的參數計算
// compute: 根據函示參數給計算值，可能會使用物件參數

// 創造甘特圖物件
// ganttView
//   xAxis
//     baseTime
//     upperTime
//   yAxis
//     header
//     stickyArea
//     scrollArea
//   xAxisController
//   yAxisController
//   ganttGrid



// 圖程順序 Layer z-index
// 底層 -> 頂層
// Grid
// yAxisColumn
// Orders
//  EditingOrder
//  NormalOrder
//  SelectOrder
//  HoverOrder
//  EditingIndicate
// xAXisColumn
// yAxisController
// xAxisController



interface SizeObject  { width: number, height: number}
interface AreaObject  { left: number,  right: number,  top: number,  bottom: number }

interface GanttObject {
  // canvasX: number, // 相對於canvas左上角的X座標
  // canvasY: number, // 相對於canvas左上角的Y座標
  // areaWidth: number,
  // areaHeight: number,
  getSize: () => SizeObject,
  getArea: () => AreaObject,
  init: () => void,
  draw: () => void,
  check?: (event) => void
}

// interface YAxisHeader extends GanttObject {}
interface YAxisStickArea extends GanttObject {
  display: boolean
  hoverInfo: {
    type: string
    index: number | null
    data: any
  }
  clickInfo: {
    type: string
    index: number | null
    data: any
  }
  dragInfo: {
    isDragging: boolean
    type: string
    index: number | null
    data: any
  }
  yItem: {[name: string] : YItemStick}
  setEditOrders (type, value?) : void
  setCurItem ():void
  getOrders ():Array<any>
}
interface YAxisScrollArea extends GanttObject {
  hoverInfo: {
    type: string
    index: number | null
    data: any
  }
  clickInfo: {
    type: string
    index: number | null
    data: any
  }
  dragInfo: {
    isDragging: boolean
    type: string
    index: number | null
    data: any
  }
  computeItemIndex (value:any, type: string) : number
  setEditYItems (orders) : void
}

export const createGanttView = (canvasRef, ganttData, dragItem, rushManagement, sideView, objectController, canvasMessage, cursorType, useFunction) => {
  const ctx = canvasRef.getContext('2d')
  const canvasPadding = {
    left: 0,
    right: 2,
    top: 0,
    bottom: 10
  }

  const canvasInfo = {
    get isHover () { return canvasRef.parentNode.matches(':hover')}
  }
  // 變數
  let limitStartTime
  let limitEndTime

  const mousedownCoordinate = {x: 0, y: 0}
  const mouseInfo = {
    time: null,
    yIndex: -1,
    inCanvas: false
  }
  const setMouseInfo = event =>  {
    if(canvasInfo.isHover) {
      mouseInfo.time = xAxis.getMouseTime(event)
      mouseInfo.yIndex = yAxis.getMouseYIndex(event)
      mouseInfo.inCanvas = true
    }
    else {
      mouseInfo.time = null
      mouseInfo.yIndex = -1
      mouseInfo.inCanvas = false
    }
  }

  const isInController = event => {
    return isInArea(event, xAxisController.getArea()) || isInArea(event, yAxisController.getArea())
  }

  const setDragItem = (type, newItem?) => {
    if(!useFunction.DragData) return
    switch (type) {
      // 清空
      case 'clear': dragItem.value = null; break
      // 拖曳工單
      case 'orders': {
        dragItem.value = {
          type,
          data: newItem
        }

        // console.log(newItem, ganttData.selectOrders)
        yAxis.setEditOrders('add', ganttData.selectOrders)
        yAxis.setRusablehMachine(newItem)
        // yAxis.setEditYItems(newItem)
        yAxisController.setYScroll(0, 'assign')
        break
      }
      default : dragItem.value = {
        type,
        data: newItem
      }; break
    }
  }





  const messageController = {
    nextMessage: null,
    setNextMessage (value?) { this.nextMessage = value ??  null },
    setMessage() {
      if(isEmpty(this.nextMessage)) {
        canvasMessage.value = {}
      }
      else {
        const { type, data, left, top} = this.nextMessage
        canvasMessage.value.type = type
        canvasMessage.value.style = {
          left,
          top
        }
        canvasMessage.value.data = data
      }

      this.nextMessage = null
    }
  }

  const setMessage = (type, x?, y?, data?) => {
    switch (type) {
      case 'orders': {
        if(mouseInfo.yIndex === 0 && !useFunction.RushManagement) {
          // 不使用RushManagement時上方空間太小，需要調整Message位置
          messageController.setNextMessage({
            type: 'orders2',
            left: (canvasRef.offsetLeft + x),
            top: (canvasRef.offsetTop + y + yAxis.getParams('orderHeight')) + 10,
            data
          })
        }
        else {
          messageController.setNextMessage({
            type,
            left: (canvasRef.offsetLeft + x),
            top: (canvasRef.offsetTop + y),
            data
          })
        }

        break
      }
      case 'dragTimeLine': {
        if(useExpectTime) {
          messageController.setNextMessage({
            type,
            left: (canvasRef.offsetLeft + x),
            top: (canvasRef.offsetTop + y),
            data
          })
        }
        break
      }
      default: {
        messageController.setNextMessage({
          type,
          left: (canvasRef.offsetLeft + x),
          top: (canvasRef.offsetTop + y),
          data
        })
      }
    }

  }
  const getFilterValue = (item, param) => {
    if (item.type === 'group') return null
    return item?.orderFilters.find(filter => {
      return filter.param === param
    })?.value
  }
  const getCanvasSize = () => {
    return {
      width: canvasRef.width,
      height: canvasRef.height
    }
  }


  const resetCanvas = type => {
    switch (type) {
      case 'init': {
        resetCanvas('timeRange')
        resetCanvas('yItems')

        initChildren()
        break
      }
      case 'timeRange': {
        const { timeRange } = ganttData
        limitStartTime = dayjs(timeRange[0]).format('YYYY-MM-DD HH:mm:ss')
        limitEndTime = dayjs(timeRange[1]).add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
        break
      }
      case 'yItems': {
        yAxis.setYItems()
        break
      }
      case 'size':
      case 'canvasSize': {
        // resetCanvas('yItems')
        const type = 'size'
        yAxis.reset(type)
        xAxis.reset(type)
        xAxisController.init()
        ganttGrid.init()
        yAxisController.init()
        // initChildren()
        break
      }
      case 'xScale': {
        // xAxis.zoomFocus('center')
        xAxisController.init()
        break
      }
      case 'refresh' : {
        initChildren()
        break
      }
    }
  }

  const isNewOrder = order => {
    const existMachineIds = ganttData.filterColumns
    .find(column => column.param === 'machineId').options
    .map(option => option.value)
    return !existMachineIds.some(machineId => machineId === order.machineId)
  }

  const initCanvas =  () => {
    resetCanvas('init')
    // initChildren()
  }
  const initChildren = () => {
    childrenList.forEach(child => {
      if(child['init']) child['init']()
    })
  }


  // ctx Style
  const setStyle = style => {
    switch (style) {
      case 'loadingMask': {
        // ctx.filter = "drop-shadow(0px 0px "+distance+"px #000000 ) ";
        ctx.fillStyle = 'rgba(0,0,0,0.05)'
        // ctx.shadowBlur = 4
        // ctx.shadowOffsetX = 0
        // ctx.shadowOffsetY = 0
        // ctx.shadowColor = 'rgb(0,0,0)'
        // 'rgba(255,255,255,0.8)'
        break
      }
      case 'loadingCircleBasic': {
        ctx.lineWidth = 5
        ctx.strokeStyle = 'rgba(255,255,255,0.8)'
        ctx.shadowBlur = 4
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
        ctx.shadowColor = 'rgba(0,0,0,0.1)'
        break
      }
      case 'loadingCircleRotate': {
        ctx.lineWidth = 4
        ctx.strokeStyle  = '#31AFFF'
        ctx.shadowBlur = 2
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
        ctx.shadowColor = '00CCFF'
        break
      }
      case 'noLine' : {
        ctx.lineWidth = 0
        break
      }
      case 'lightLine' : {
        ctx.lineWidth = 1
        ctx.strokeStyle = 'rgb(240,240,240)'
        break
      }
      case 'standardLine' : {
        ctx.lineWidth = 1
        ctx.strokeStyle = 'rgb(200,200,200)'
        break
      }
      case 'timeMarkLine' : {
        ctx.lineWidth = 2
        ctx.shadowBlur = 1
        ctx.shadowOffsetX = 1
        ctx.shadowOffsetY = 1
        ctx.shadowColor = 'gray'
        break
      }
      case 'timeMarkText': {
        ctx.font = '12px Arial'
        ctx.textAlign = 'left'
        ctx.textBaseline = 'middle'
        break
      }
      case 'orderLink': {
        ctx.lineWidth = 1.5
        ctx.fillStyle = 'darkorange'
        ctx.strokeStyle = 'darkorange'
        break
      }
      case 'orderLine' : {
        ctx.lineWidth = 1
        ctx.strokeStyle = 'rgba(255,255,255,0.8)'
        break
      }
      case 'orderText': {
        ctx.fillStyle = 'white'
        ctx.font = '12px Arial bold'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.shadowBlur = 2
        ctx.shadowColor = 'black'
        break
      }
      case 'rushOrder': {
        ctx.lineWidth = 1
        ctx.strokeStyle = 'rgba(255, 165, 0, 0.6)'//'rgba(255, 140, 0, 0.2)'
        ctx.fillStyle = 'rgba(255, 165, 0, 0.2)'
        break
      }
      // case 'rushOrderText': {
      //   ctx.fillStyle = 'gray'
      //   ctx.font = '14px Arial bold'
      //   ctx.textAlign = 'center'
      //   ctx.textBaseline = 'middle'
      //   ctx.shadowBlur = 2
      //   ctx.shadowColor = 'black'
      //   break
      // }
      case 'isRush': {
        ctx.shadowBlur = 3
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
        ctx.shadowColor = 'gray'
        ctx.lineWidth = 1
        ctx.fillStyle = 'rgba(255, 255, 255, 1)'
        ctx.strokeStyle = 'white'
        break
      }

      case 'dragIndicate' : {
        ctx.shadowBlur = 2
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
        ctx.shadowColor = 'white'
        ctx.lineWidth = 1.3
        ctx.strokeStyle = 'OrangeRed'
        break
      }
      case 'dragIndicateText': {
        ctx.fillStyle = 'white'
        ctx.font = '12px Arial bold'
        ctx.textAlign = 'left'
        ctx.textBaseline = 'top'
        ctx.shadowBlur = 3
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
        ctx.shadowColor = 'black'
        break
      }
      case 'dragIndicateTextBack': {
        ctx.fillStyle = 'LightSalmon'
        ctx.font = '12px Arial bold'
        ctx.shadowBlur = 2
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
        ctx.shadowColor = 'white'
        ctx.lineWidth = 1.3
        ctx.strokeStyle = 'OrangeRed'
        break
      }

      case 'rushOrderText': {
        ctx.fillStyle = 'gray'
        ctx.font = '12px Arial bold'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.shadowBlur = 0
        // ctx.shadowColor = 'black'
        break
      }
      case 'rushIndicateText': {
        ctx.fillStyle = 'white'
        ctx.font = '12px Arial bold'
        ctx.textAlign = 'left'
        ctx.textBaseline = 'top'
        ctx.shadowBlur = 2
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
        ctx.shadowColor = 'gray'
        break
      }
      case 'rushIndicateTextBack': {
        ctx.fillStyle = 'orange'
        ctx.font = '12px Arial bold'
        ctx.shadowBlur = 2
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
        ctx.shadowColor = 'white'
        ctx.lineWidth = 1.3
        ctx.strokeStyle = 'darkorange'
        break
      }
      case 'rushIndicateBase' : {
        ctx.fillStyle = 'white'
        break
      }
      case 'rushIndicate' : {
        ctx.shadowBlur = 2
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
        ctx.shadowColor = 'white'
        ctx.lineWidth = 1.3
        ctx.strokeStyle = 'darkorange'
        break
      }
      case 'iconLine' :{
        ctx.lineWidth = 1.2
        ctx.strokeStyle = '#303133'
        ctx.lineCap = 'round'
        break
      }
      case 'stickArea' : {
        setStyle('standardLine')
        ctx.shadowBlur = 1
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 1
        ctx.shadowColor = 'rgb(200,200,200)'
        // ctx.fillStyle = 'white'
        break
      }
      case 'tabText': {
        ctx.fillStyle = 'black'
        ctx.font = '12px Arial'
        ctx.textAlign = 'left'
        ctx.textBaseline = 'middle'
        break
      }
      case 'yAxisText': {
        ctx.fillStyle = 'black'
        ctx.font = '14px Arial'
        ctx.textAlign = 'left'
        ctx.textBaseline = 'middle'
        break
      }
      case 'yAxisIcon': {
        ctx.lineWidth = 1.2
        ctx.strokeStyle = '#303133'
        ctx.fillStyle = 'black'
        break
      }
      case 'yItemText': {
        ctx.fillStyle = 'black'
        ctx.font = '14px Arial'
        ctx.textAlign = 'left'
        ctx.textBaseline = 'middle'
        break
      }
      case 'yHeaderText': {
        ctx.fillStyle = 'black'
        ctx.font = '12px Arial'
        ctx.textAlign = 'left'
        ctx.textBaseline = 'middle'
        break
      }
      case 'columnText': {
        ctx.fillStyle = 'black'
        ctx.font = '12px Arial'
        ctx.textAlign = 'left'
        ctx.textBaseline = 'middle'
        break
      }
      case 'crumbText': {
        ctx.fillStyle = 'black'
        ctx.font = '12px Arial'
        ctx.textAlign = 'left'
        ctx.textBaseline = 'middle'
        break
      }
      case 'crumbBurger': {
        ctx.strokeStyle = 'rgb(40,40,40)'
        ctx.lineCap = 'round'
        ctx.lineWidth = 1.5
        break
      }
      case 'subtleEffect' : {
        ctx.lineWidth = 2
        ctx.shadowBlur = 0
        ctx.strokeStyle = 'white'
        ctx.fillStyle = 'rgba(255,255,255,0.8)'
        break
      }
      case 'subtleSelect' : {
        ctx.shadowBlur = 2
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
        ctx.shadowColor = 'rgba(0,0,255,0.8)'
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 2
        break
      }
      case 'subtleOrder' : {
        // ctx.lineWidth = 1
        ctx.shadowBlur = 0
        ctx.strokeStyle = 'white'
        ctx.fillStyle = 'rgba(255,255,255,0.8)'
        break
      }
      case 'hoverOrder': {
        ctx.shadowBlur = 2
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
        ctx.shadowColor = 'gray'
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 2
        break
      }
      case 'selectOrder': {
        ctx.shadowBlur = 3
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
        ctx.shadowColor = 'blue'
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 2
        break
      }
      case 'hoverColumn': {
        setStyle('standardLine')
        ctx.fillStyle = colorHover
        break
      }
      case 'dragSelect': {
        ctx.lineWidth = 1
        ctx.strokeStyle = 'rgba(30,144,255,0.8)'
        ctx.fillStyle = 'rgba(30,144,255,0.1)'
        break
      }
      case 'selectArea': {
        ctx.lineWidth = 1
        ctx.strokeStyle = 'rgba(30,144,255,0)'
        ctx.fillStyle = 'rgba(30,144,255,0.1)'
        break
      }
      case 'widthResizer': {
        // ctx.shadowBlur = 1
        // ctx.shadowOffsetX = 1
        // ctx.shadowOffsetY = 0
        // ctx.shadowColor = 'rgb(200,200,200)'
        ctx.lineWidth = 1
        ctx.strokeStyle = 'rgb(200,200,200)'
        ctx.fillStyle = 'rgb(240,240,240)'
        break
      }
      case 'isSubtle': {
        ctx.globalAlpha = 0.2
        break
      }
      case 'unSubtle': {
        ctx.globalAlpha = 1
        break
      }
      //XAxis
      case 'upperLevelBack' : {
        setStyle('standardLine')
        ctx.fillStyle = '#d1d9e7'
        break
      }
      case 'baseLevelBack' : {
        setStyle('standardLine')
        ctx.fillStyle = '#eceff5'
        break
      }
      case 'xAxisNameText': {
        ctx.fillStyle = 'black'
        ctx.font = '12px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        break
      }
      case 'xAxisBaseText': {
        ctx.fillStyle = 'black'
        ctx.font = '12px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        break
      }
      case 'xAxisUpperText': {
        ctx.fillStyle = 'black'
        ctx.font = '12px Arial'
        ctx.textAlign = 'left'
        ctx.textBaseline = 'middle'
        break
      }
      case 'hoverUpperTimeBack' : {
        ctx.fillStyle = '#DCDFE6'//'rgba(100,100,100,0.1)'
        break
      }
      case 'hoverBaseTimeBack' : {
        ctx.fillStyle = 'rgba(255,255,255,0.8)'
        break
      }
      case 'hoverTimeEffect' : {
        // ctx.globalCompositeOperation = 'source-out'
        ctx.shadowBlur = 2
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
        ctx.shadowColor = 'rgb(200,200,200)'
        ctx.lineWidth = 1
        ctx.strokeStyle = 'rgb(200,200,200)'
        break
      }
    }
  }
  // 裁切矩形
  const clipRect = (x, y, width, height) => {
    const _x = Math.floor(x) + 0.5
    const _y = Math.floor(y) + 0.5
    const _width = Math.floor(width)
    const _height =  Math.floor(height)
    ctx.beginPath()
    ctx.rect(_x, _y, _width, _height)
    ctx.clip()
    }
  // 繪製矩形
  const drawRect = (x, y, width, height, type: DrawRect) => {
    const _x = Math.floor(x) + 0.5
    const _y = Math.floor(y) + 0.5
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
  // 繪製線條
  const drawLine = (x, y, width, height) => {
    const _x = Math.floor(x) + 0.5
    const _y = Math.floor(y) + 0.5
    const _width = Math.floor(width)
    const _height =  Math.floor(height)

    ctx.beginPath()
    ctx.moveTo(_x, _y)
    ctx.lineTo(_x + _width, _y + _height)
    ctx.stroke()
  }
  // 繪製搜尋圖示
  const drawSearch = (x:number, y:number, size:number) => {
    const circleX = x + size * 0.4
    const circleY = y + size * 0.4
    const circleR = size * 0.3
    const stickX = circleX + circleR * Math.cos((45 * Math.PI / 180))
    const sticky = circleY + circleR * Math.sin((45 * Math.PI / 180))

    ctx.save()
    setStyle('iconLine')
    drawCircle(circleX, circleY, circleR, 'stroke')
    drawLine(stickX, sticky, circleR, circleR)

    ctx.restore()

  }

  const drawAngle = (startX:number, centerY:number, width:number) => {
    const paths = [
      [ startX + width,  centerY - width / 2],
      [ startX, centerY],
      [ startX + width, centerY + width / 2]
    ]
    drawPath(paths, 'stroke')
  }
  // const drawLineAngle = (x, y, length, angle) => {
  //   const mathAngle = angle * Math.PI / 180
  //   const width = length * Math.cos(mathAngle)
  //   const height = length * Math.sin(mathAngle)

  //   const _x = Math.floor(x) + 0.5
  //   const _y = Math.floor(y) + 0.5
  //   const _width = width//Math.floor(width)
  //   const _height =  height//Math.floor(height)

  //   ctx.beginPath()
  //   ctx.moveTo(_x, _y)
  //   ctx.lineTo(_x + _width, _y + _height)
  //   ctx.stroke()
  // }

  // 繪製文字
  const drawText = (text, x, y) => {
    ctx.fillText(text, x, y)
  }
  // 繪製路徑陣列
  const drawPath = (coordinates, type) => {
    ctx.beginPath()
    coordinates.forEach(([x, y], index) => {
      if(index === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })

    switch(type) {
      case 'fill' : {
        ctx.closePath()
        ctx.fill()
        break
      }
      case 'stroke': {
        ctx.stroke()
        break
      }
    }
  }
  const drawDashPath = paths => {
    ctx.beginPath()
    const dashLength = 4
    const gapLength = 2

    let prevCoordinate
    paths.forEach(([x, y], index) => {
      if(index === 0) prevCoordinate = [x, y]
      else {
        const deltaX = x - prevCoordinate[0]
        const deltaY = y - prevCoordinate[1]
        const maxLength = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

        const angle = Math.atan2(deltaY, deltaX) //取得角度

        const cos = Math.cos(angle) // cos by angle
        const sin = Math.sin(angle) // sin by angle

        const xLength = dashLength * cos //線條的X長度
        const yLength = dashLength * sin //線條的Y長度
        const xGap = gapLength * cos //間隔的Y長度
        const yGap = gapLength * sin //間隔的X長度
        let tempX = prevCoordinate[0]
        let tempY = prevCoordinate[1]
        const isContinue = () => {
          // 持續到temp的絕對值 > delta 的絕對值
          const x = tempX - prevCoordinate[0]
          const y = tempY - prevCoordinate[1]
          const tempLength = Math.sqrt(x * x + y * y)
          return tempLength < maxLength
        }

        do {
          ctx.moveTo(tempX, tempY)
          tempX = tempX + xLength
          tempY = tempY + yLength
          ctx.lineTo(tempX, tempY)
          tempX = tempX + xGap
          tempY = tempY + yGap

        } while (isContinue())

        prevCoordinate = [x, y]
      }
    })

    ctx.stroke()
  }
  // 繪製圓形
  const drawCircle = (x, y, r, type) => {
    const _x = Math.floor(x) + 0.5
    const _y = Math.floor(y) + 0.5
    ctx.beginPath()
    ctx.arc(_x, _y, r, 0, 2 * Math.PI)
    switch(type) {
      case 'fill' : {
        ctx.fill()
        break
      }
      case 'stroke': {
        ctx.stroke()
        break
      }
    }
  }


  // yAxis
  const createYAxis = () => {
    // const initOrdinate = 1
    const initHeight = () => {
      // @canvasSize.hegiht
      return getCanvasSize().height - canvasPadding.bottom - canvasPadding.top //xAxisController.getSize().height
    }
    const setEffectColumnHeight = () => {
      // @columnScale
      // columnScale -> effectColumnHeight
      effectColumnHeight = baseColumnHeight * columnScale
      // effectColumnHeight ->
      // orderHeight, orderRectY, indicateTextY, indicateTextY, indicateHeight
      // iconArea.top, iconArea.bottom
      orderHeight = effectColumnHeight * 0.5
      orderRectY = effectColumnHeight * 0.4
      indicateTextY = effectColumnHeight * 0.1
      indicateHeight = effectColumnHeight * 0.3
      iconArea.top = effectColumnHeight * 0.3,
      iconArea.bottom = effectColumnHeight * 0.3 + iconSize

      yAxisController.init()
    }
    const setColumnScale = (value, type?) => {
      // @event:wheel
      const minScale = 1
      const maxScale = 2
      const nextScale = (() => {
        switch (type) {
          case 'add': return columnScale + value
          default: return  value
        }
      })()

      columnScale = getValueInRange(nextScale, minScale, maxScale)
      setEffectColumnHeight()
    }

    // Y軸欄位物件
    const yItems = []
    const flatYItems = []
    const flatYItemsOrders = []

    // rushOrders
    const rushOrders = []

    const scheduledOrders = ganttData.scheduledOrders
    const editingOrders = ganttData.editOrders
    const allTypeOrders = ganttData.resultOrders

    const isEditingOrder = order => {
      const { orderKey } = order
      // console.log(orderKey)
      return editingOrders.some(editingOrder => {
         return editingOrder.orderKey === orderKey
      })
    }



    // PARAMS
    const canvasX = canvasPadding.left
    const canvasY = canvasPadding.top
    let areaWidth = 150
    let areaHeight = initHeight()
    // const baseHeight = 36
    const baseColumnHeight = 30
    let columnScale = 1
    let effectColumnHeight = baseColumnHeight * columnScale
    let yScroll = 0 // 負數
    // let xScroll = 0
    let startIndex = 0
    // let totalHeight = 0
    let isDragging = false

    // Order Setting
    let orderHeight = effectColumnHeight * 0.5
    let orderRectY = effectColumnHeight * 0.4

    // Indicate Scetting
    const indicateRectY = 2
    const indicatePadding = 3
    let indicateTextY = effectColumnHeight * 0.1
    let indicateHeight = effectColumnHeight * 0.3

    const iconSize = 18
    const iconArea: Area = {
      left: 20,
      right: 20 + iconSize,
      top: effectColumnHeight * 0.3,
      bottom: effectColumnHeight * 0.3 + iconSize
    }

    //每個群組階級向右位移量
    const levelXTransfer = 25

    //Order最小寬度
    const minSize = 5

    const mode = 'view'

    const levelInfo = {
      isTemp: false,
      crumbs: [],
      curItem: ganttData.rootYItem,
      curLeaves: ganttData.rootYItem.children,
      curOrders: allTypeOrders
      // curItem: ganttData.yItems,
      // curLeaves: ganttData.yItems
    }
    const setLevelInfo = (type, value?) => {
      switch (type) {
        case 'root': {
          levelInfo.curItem = ganttData.rootYItem
          levelInfo.curLeaves = ganttData.rootYItem.children
          const effectFilter = ganttData.rootYItem.nextLevelFilters
          levelInfo.curOrders = applyLevelFilters(allTypeOrders, effectFilter)
          levelInfo.crumbs.splice(0)
          break
        }
        case 'index': {
          //value : index(number)
          levelInfo.curItem = levelInfo.crumbs[value]
          levelInfo.curLeaves = levelInfo.crumbs[value].children

          const effectFilter = levelInfo.curItem.prevLevelFilters.concat(levelInfo.curItem.nextLevelFilters)
          levelInfo.curOrders = applyLevelFilters(allTypeOrders, effectFilter)
          // levelInfo.curOrders = applyLevelFilters(allTypeOrders, levelInfo.curItem.prevLevelFilters)
          levelInfo.crumbs.splice(value + 1)
          break
        }
        case 'next': {
          // value : yItemGroup
          if(value) {
            levelInfo.curItem = value
          }
          else {
            if(levelInfo.curLeaves[0]) levelInfo.curItem = levelInfo.curLeaves[0]
            else {
              break
            }
          }

          levelInfo.curLeaves = levelInfo.curItem.children

          const effectFilter = [levelInfo.curItem.prevLevelFilters.at(-1)].concat(levelInfo.curItem.nextLevelFilters)
          levelInfo.curOrders = applyLevelFilters(allTypeOrders, effectFilter)
          // levelInfo.curOrders = applyLevelFilters(levelInfo.curOrders, [levelInfo.curItem.prevLevelFilters.at(-1)])
          levelInfo.crumbs.push(levelInfo.curItem )



          break
        }
        case 'temp': {
          levelInfo.curItem = ganttData.tempYItem
          levelInfo.curLeaves = ganttData.tempYItem.children
          levelInfo.curOrders = allTypeOrders
          break
        }
        case'prev' : {
          const levelLength = levelInfo.crumbs.length
          if (levelLength <= 1) {
            levelInfo.curItem = ganttData.rootYItem
            levelInfo.curLeaves = ganttData.rootYItem.children
            levelInfo.curOrders = allTypeOrders
            levelInfo.crumbs.splice(0)
          }
          else if (levelInfo.isTemp) {
            const curIndex = levelLength - 1
            levelInfo.curItem = levelInfo.crumbs[curIndex]
            levelInfo.curLeaves = levelInfo.crumbs[curIndex].children
            levelInfo.curOrders = applyLevelFilters(allTypeOrders, levelInfo.crumbs[curIndex].prevLevelFilters)
          }
          else if(levelLength > 1) {
            const prevIndex = levelLength - 2
            //cur: length-1, prev: length-2
            levelInfo.curItem = levelInfo.crumbs[prevIndex]
            levelInfo.curLeaves = levelInfo.curItem.children
            levelInfo.curOrders = applyLevelFilters(allTypeOrders, levelInfo.curItem.prevLevelFilters)
            levelInfo.crumbs.pop()
          }

          break
        }
        case 'reset' : {
          const namePaths = levelInfo.crumbs.map(crumb => crumb.name)
          levelInfo.crumbs.splice(0)
          // let curNode = ganttData.rootYItem
          const crumbs = [ganttData.rootYItem]
          namePaths.forEach((nextName, index) => {
            if(crumbs.length < index + 1) return
            const nextNode = crumbs[index].children.find(child => child.name === nextName)
            if(nextNode) {
              crumbs.push(nextNode)
              levelInfo.crumbs.push(nextNode)
            }
          })

          if(levelInfo.isTemp) {
            levelInfo.curOrders = allTypeOrders
          }
          else {
            levelInfo.curItem = crumbs.at(-1)
            levelInfo.curLeaves = levelInfo.curItem.children
            levelInfo.curOrders = applyLevelFilters(allTypeOrders, levelInfo.curItem.prevLevelFilters)
          }
          break
        }
      }

      if(type === 'temp') levelInfo.isTemp = true
      else if(type !== 'reset') levelInfo.isTemp = false

      yAxisHeader.setCrumbs()
      //更新Canvas外麵包屑
      objectController.ganttData.setLevelInfo(levelInfo)
      setYItems()
      if(type === 'reset') return
      const curTimeRange = getOrdersTimeRange(levelInfo.curOrders)
      xAxis.setAdjustTime(curTimeRange)
      yAxisStickArea.yItem.search.orders = levelInfo.curOrders
      yAxisStickArea.setCurItem()


      setOrderLink()
      yAxisController.setYScroll(0, 'assign')

    }




    // Children Object
    type yAxisHeaderArea = 'upper' | 'lower' | 'search' | 'prev' | null
    const yAxisHeader = {
      crumbGap: 18,
      crumbsInfo: [],
      hoverInfo: {
        type: null,
        data: null
      },
      draw () {
        const { left, top, right } = this.getArea()
        const { width, height } = this.getSize()
        const columns = getColumns()

        const headerX = left
        const upperY = top
        const halfHeight = height / 2
        const lowerY = upperY + halfHeight

        const drawBackground = () => {
          ctx.save()
          setStyle('standardLine')
          ctx.fillStyle = '#d1d9e7'
          drawRect(canvasX, canvasY, areaWidth, halfHeight, 'block')
          ctx.restore()
        }

        const drawCrumbs = () => {
          ctx.save()
          clipRect(headerX, upperY, width, halfHeight)
          if(levelInfo.isTemp || levelInfo.crumbs.length > 0) {
            ctx.save()
            setStyle('yAxisIcon')
            drawAngle(right - 24, upperY + halfHeight / 2, 10)

            ctx.restore()
          }

          ctx.save()
          setStyle('crumbText')

          const textY = top + halfHeight / 2 + 2
          const curTextX = left + 8 //+ columns.tab[1]

          // console.log(levelInfo.curItem)
          if(levelInfo.isTemp) {
            clipRect( headerX, upperY, areaWidth - 36, halfHeight)
            const param = levelInfo.curItem.nextLevelFilters[0].param
            const value = levelInfo.curItem.nextLevelFilters[0].values[0]
            const label = getLevelFilterLabel(levelInfo.curItem.nextLevelFilters[0])
            const text = filterColumnSetting[param].getLabel ? filterColumnSetting[param].getLabel(value) : value
            drawText(`${label} : ${text}`, curTextX, textY)

          }
          else {
            const lastCrumb = yAxisHeader.crumbsInfo.at(-1)
            if(lastCrumb) {
              clipRect( headerX, upperY, areaWidth - 36, halfHeight)
              const { text } = lastCrumb
              const label = getLevelFilterLabel(levelInfo.curItem.prevLevelFilters.at(-1))

              drawText(`${label} : ${text}`, curTextX, textY)
            }
            else {
              drawText(levelInfo.curItem.name, curTextX, textY)
            }
          }

          ctx.restore()
          // drawText(text, curTextX, textY)
          // yAxisHeader.crumbsInfo.forEach(crumb => {
          //   const { text, index, width } = crumb
          //   if(index > 0)  drawText('>', curTextX - 12, textY)
          //   drawText(text, curTextX, textY)
          //   curTextX = curTextX + width + yAxisHeader.crumbGap
          // })

          ctx.restore()
        }

        const drawColumns = () => {
          const xMove = headerX
          const textXMove = 8 + xMove
          const textY = lowerY + halfHeight / 2 + 2

          ctx.save() //DrawColumns Start
          setStyle('columnText')
          setStyle('standardLine')

          ctx.save()
          const [ operatorX ] = columns.operator
          switch (ganttData.mode) {
            case 'edit': {
              clipRect( xMove, lowerY, areaWidth, halfHeight)
              const text = objectController.i18n.getTranslate('gantt-machine-rushable') //'可分配機台編號'
              drawText(text, textXMove, textY)
              break
            }
            case 'view':
            case 'result': {

              // console.log(levelInfo)
              clipRect( xMove, lowerY, areaWidth - 36, halfHeight)
              const label = getLevelFilterLabel(levelInfo.curItem.nextLevelFilters[0])
              drawText(label, textXMove, textY)
              break
            }
          }

          ctx.restore()
          if(ganttData.mode !== 'edit') {
            ctx.save()
            // draw column:operator
            // drawLine(operatorX + xMove, lowerY, 0,  halfHeight)
            // ctx.fillStyle = '#d1d9e7'
            // drawRect(operatorX + xMove, lowerY, operatorWidth, halfHeight, 'fill')
            const iconY = lowerY + (halfHeight / 2) - (iconSize / 2)
            drawSearch(operatorX + xMove, iconY, iconSize)
            ctx.restore()

          }

          ctx.restore() //DrawColumns End



        }

        const drawTitle = () => {
          switch (ganttData.mode) {
            case 'view': drawCrumbs(); break
            case 'result': {
              drawCrumbs(); break
              // ctx.save()
              // setStyle('crumbText')
              // clipRect(headerX, upperY, width, halfHeight)
              // const textY = top + halfHeight / 2 + 2
              // const curTextX = left + 8 // + columns.tab[1]
              // drawText('已編輯機台', curTextX, textY)
              // ctx.restore()
              // break
            }
            case 'edit': {
              // ctx.save()
              // setStyle('crumbText')
              // clipRect(headerX, upperY, width, halfHeight)
              // const textY = top + halfHeight / 2 + 2
              // const curTextX = left + 8 // + columns.tab[1]
              // drawText(objectController.i18n.getTranslate('gantt-order-editing') /*'待編輯工單'*/, curTextX, textY)
              // ctx.restore()
              break
            }
          }
        }
        ctx.save()

        // drawGrids()
        clipRect(headerX, upperY, width, height)
        drawBackground()
        drawTitle()
        // drawUpperText()
        // drawUpperIcon()
        drawColumns()

        ctx.restore()
      },
      init () {
      },
      getArea (areaType?: yAxisHeaderArea): Area {
        switch (areaType) {
          case 'upper': {
            const { left, right, top } = yAxis.getArea()
            const bottom = top + xAxis.getSize().height / 2
            return { left, right, top, bottom }
          }
          case 'lower': {
            const { left, right } = yAxis.getArea()
            const { bottom } = xAxis.getArea()
            const top = bottom - xAxis.getSize().height / 2
            return { left, right, top, bottom }
          }
          case 'prev': {
            const { right, top } = yAxis.getArea()
            const left = right - iconSize * 2 + 4
            const bottom = top + xAxis.getSize().height / 2
            return { left, right: right - 4, top, bottom }
          }
          case 'search': {
            const { right } = yAxis.getArea()
            const { bottom } = xAxis.getArea()
            const top = bottom - xAxis.getSize().height / 2
            const left = right - iconSize * 2 + 4
            return { left, right: right - 4, top, bottom }
          }
          default : {
            const { left, right, top } = yAxis.getArea()
            const bottom = xAxis.getArea().bottom
            return { left, right, top, bottom }
          }
        }

      },
      getSize () {
        const width = yAxis.getSize().width
        const height = xAxis.getSize().height
        return { width, height}
      },
      setCrumbs () {
        ctx.save()
        setStyle('crumbText')
        yAxisHeader.crumbsInfo = levelInfo.crumbs.map((crumb, index) => {
          const text = crumb.name
          const width = ctx.measureText(text).width
          return { index, text, width }
        })
        ctx.restore()
      },
      check (event) {
        // const { offsetX, offsetY } = event
        if(!canvasInfo.isHover) return
        if(!isInArea(event, yAxisHeader.getArea())) return
        switch (event.type) {
          case 'click' : {
            const { type, data } =  yAxisHeader.hoverInfo
            switch (type) {
              case 'toPrev': {
                setLevelInfo('prev')
                break
              }
              case 'level': {
                setLevelInfo('index', data)
                yAxisHeader.hoverInfo = { type: null, data: null }
                break
              }
              case 'search': {
                // console.log(data)
                // console.log(levelInfo, data)
                // sideView.setNextView('groupSetting', data)

                const area = {
                  left: yAxisHeader.getArea('search').left + 20,
                  top: canvasRef.offsetTop +
                  yAxisHeader.getArea('search').top +
                  (yAxisHeader.getSize().height / 4)
                }

                const levelIndex = levelInfo.crumbs.length
                objectController.search.setDisplay(area, levelIndex, data)
                break
              }
            }
            break
          }
          case 'mousemove': {
            yAxisHeader.hoverInfo = { type: null, data: null }
            if(ganttData.mode === 'edit') return

            const setHoverInfo = (type, data?) => {
              yAxisHeader.hoverInfo = { type, data }
              switch (type) {
                case 'search':
                case 'level':
                case 'toPrev': cursorType.value = 'pointer'
              }
            }

            // const { left, top } = yAxisHeader.getArea()
            // const { left, right, top, bottom } = yAxisHeader.getArea()
            // const { height } =  yAxisHeader.getSize()
            // const burgerArea = {
            //   left: right - 30,
            //   right: right - 10,
            //   top: top +  8,
            //   bottom: top +  22
            // }
            const upperArea = yAxisHeader.getArea('upper')
            const lowerArea = yAxisHeader.getArea('lower')
            if(isInArea(event, this.getArea('prev')) ) {
              if(levelInfo.crumbs.length > 0) {
                setHoverInfo('toPrev', ganttData.rootYItem)
              }
              else if (levelInfo.isTemp) {
                setHoverInfo('toPrev', ganttData.rootYItem)
              }
              // setHoverInfo('menu', ganttData.yItems)
            }
            else if(isInArea(event, upperArea)) {
              // const crumbsArea = []
              // const initArea = {
              //   left: left,
              //   right: left + 46 - yAxisHeader.crumbGap,
              //   top: top +  8,
              //   bottom: top +  22
              // }

              // yAxisHeader.crumbsInfo.reduce(
              //   (prevArea, crumb) => {
              //     const { top, bottom } = prevArea
              //     const left = prevArea.right + yAxisHeader.crumbGap
              //     const right = left + crumb.width

              //     const curArea = { left,  right,  top, bottom }
              //     crumbsArea.push(curArea)
              //     return curArea
              //   },
              //   initArea
              // )

              // const crumbIndex = crumbsArea.findIndex(area =>
              //   isInArea(event, area)
              // )
              // if(crumbIndex >= 0) {
              //   setHoverInfo('level', crumbIndex)
              // }
            }
            else if(isInArea(event, lowerArea)) {
              // const relativeX = offsetX - lowerArea.left
              // const relativeY = offsetY - lowerArea.top
              // const inOperator = isInOperator(null, relativeX, relativeY)
              if(isInArea(event, this.getArea('search'))) {
                setHoverInfo('search', ganttData.rootYItem)
              }
            }
          }
        }
      }
    }
    const yAxisStickArea: YAxisStickArea = {
      display: false,
      clickInfo: {
        type: '',
        index: null,
        data: null
      },
      hoverInfo: {
        type: '',
        index: null,
        data: null
      },
      dragInfo: {
        isDragging: false,
        type: '',
        index: null,
        data: null
      },
      yItem: {
        search: ganttData.searchYItem,
        edit: {
          tab: '編輯',
          name: '待編輯工單',
          type: 'edit',
          depth: 0,
          // key: 'edit',
          orders: [],
          displayRush: false
        }
      },
      init () {},
      getArea () {
        const left = yAxis.getArea().left
        const right = ganttGrid.getArea().right
        const top  = yAxisHeader.getArea().bottom
        const bottom = top + (this.display ? effectColumnHeight : 0)
        return { left, right, top, bottom }
      },
      getSize () {
        const width = yAxis.getSize().width +  ganttGrid.getSize().width
        const height = this.display ? effectColumnHeight : 0
        return { width, height}
      },
      getOrders () {
        switch (ganttData.mode) {
          // case 'view':
          // case 'result': return getItemOrders(levelInfo.curItem)
          case 'edit': return this.yItem.edit.orders
        }
      },
      setEditOrders (type, value?) {
        switch(type) {
          case 'add': {
            const orders = value.map(order => {
              const { orderKey, isNew } = order
              if(!isNew) return order
              return ganttData.orders.find(order => order.orderKey === orderKey)
            })

            yAxisStickArea.yItem.edit.orders = [...new Set(yAxisStickArea.yItem.edit.orders.concat(orders))]
            break
          }
          case 'new': {
            yAxisStickArea.yItem.edit.orders = [...new Set(value)]
            break
          }
          case 'clear': {
            yAxisStickArea.yItem.edit.orders = []
            break
          }
        }

        // yAxisStickArea.yItem.edit.orders = newEditOrders
      },
      setCurItem () {
        switch(ganttData.mode) {
          case 'edit': {
            yAxisStickArea.display = true
            break
          }
          case 'result':
          case 'view': {
            yAxisStickArea.display = false
            // if(levelInfo.crumbs.length === 0) {
            //   yAxisStickArea.display = false
            // }
            // else {
            //   yAxisStickArea.display = true
            //   const searchItem = yAxisStickArea.yItem.search
            //   const curItem = levelInfo.curItem
            //   // yAxisStickArea.yItem.search = levelInfo.curItem
            //   searchItem.tab = curItem.tab
            //   searchItem.name = curItem.name
            //   searchItem.children = curItem.children
            //   // searchItem.orders = getItemOrders(curItem)
            //   // searchItem. = curItem.
            //   // searchItem. = curItem.
            //   // searchItem. = curItem.
            //   // searchItem. = curItem.
            // }
            break
          }
          // case 'result': {
          //   yAxisStickArea.display = false
          //   break
          // }
        }



      },
      draw () {
        if(!this.display) return
        // console.log(ganttData)
        const getYItem = () => {
          switch (ganttData.mode) {
            case 'result':
            case 'view': return this.yItem.search
            case 'edit': return this.yItem.edit
          }
        }
        const item = getYItem()
        const { left: x, top: y } = this.getArea()
        const { width, height } = this.getSize()

        const drawStickBorder = () => {
          ctx.save()
          setStyle('stickArea')
          drawRect(x, y, width, height, 'stroke')
          ctx.restore()
        }
        const drawOrders = () => {
          ctx.save()
          const drawItemOrders = (orderY, item) => {
            const orderHeight =  effectColumnHeight * 0.6
            const drawOrders = []
            const drawHoverOrders = []
            const drawSelectOrders = []

            const gridOrders = getGridOrders(item)
            gridOrders.forEach(order => {
              const startTimeX =  xAxis.computeXAxisCoordinate(order.startDate, 'string')
              const endTimeX =  xAxis.computeXAxisCoordinate(order.endDate, 'string')
              const timeWidth = (endTimeX - startTimeX) > minSize ? (endTimeX - startTimeX) : minSize

              const isEditing = isEditingOrder(order)
              const orderColor = getOrderColor(order)

              const drawOrderText = () => {
                const orderText = getOrderText(order)
                const orderTextX = (startTimeX + endTimeX) / 2
                const orderTextY = y + effectColumnHeight * 0.5 + 1
                ctx.save()

                if(isEditing && ganttData.mode === 'edit') setStyle('rushOrderText')
                else setStyle('orderText')

                const textWidth = ctx.measureText(orderText).width
                clipRect(startTimeX + 1, orderY, timeWidth - 1, orderHeight)

                if (timeWidth <= minSize ) drawText('.', orderTextX, orderTextY)
                else if ((timeWidth - 6) <= textWidth ) drawText('...', orderTextX, orderTextY)
                else drawText(orderText, orderTextX, orderTextY)

                ctx.restore()
              }



              const drawOrder = () => {
                switch (ganttData.mode) {
                  case 'view': {
                    // 一律正常繪製工單
                    ctx.fillStyle = orderColor
                    drawRect(startTimeX, orderY, timeWidth, orderHeight, 'block')
                    if(timeWidth > minSize) drawOrderText()
                    break
                  }
                  case 'edit':{
                    // 設定過則標示為全白
                    if(isEditing) {
                      ctx.save()
                      setStyle('isRush')
                      clipRect(startTimeX, orderY, timeWidth, orderHeight)
                      drawRect(startTimeX, orderY, timeWidth, orderHeight, 'block')
                      if(timeWidth > minSize) drawOrderText()
                      ctx.restore()
                    }
                    else {
                      ctx.fillStyle = orderColor
                      drawRect(startTimeX, orderY, timeWidth, orderHeight, 'block')
                      if(timeWidth > minSize) drawOrderText()
                    }
                    break
                  }
                  case 'result': {
                    // 設定過則不顯示
                    if(!isEditing) {
                      ctx.fillStyle = orderColor
                      drawRect(startTimeX, orderY, timeWidth, orderHeight, 'block')
                      if(timeWidth > minSize) drawOrderText()
                    }
                    break
                  }
                }
              }

              if(isHoverOrder(order)) {
                drawHoverOrders.push(drawOrder)
              }
              else if(isSelectOrder(order)) {
                drawSelectOrders.push(drawOrder)
              }
              else {
                drawOrders.push(drawOrder)
              }


            })

            ctx.save()
            setStyle('orderLine')
            drawOrders.forEach(draw => { draw() })
            ctx.restore()

            ctx.save()
            setStyle('selectOrder')
            const selectOrders = gridOrders.filter(order => isSelectOrder(order))
            if(selectOrders.length > 0) {
              const selectArea = combineOrders(selectOrders)
              const drawCombinedAreas = (combinedAreas, type:DrawRect) => {
                combinedAreas.forEach(combinedArea => {
                  const startTimeX =  xAxis.computeXAxisCoordinate(combinedArea.startDate, 'string')
                  const endTimeX =  xAxis.computeXAxisCoordinate(combinedArea.endDate, 'string')
                  const timeWidth = endTimeX - startTimeX
                  drawRect(startTimeX, orderY, timeWidth, orderHeight, type)
                })
              }
              drawCombinedAreas(selectArea, 'stroke')

            }
            ctx.restore()
            ctx.save()
            setStyle('orderLine')
            drawSelectOrders.forEach(draw => { draw() })
            ctx.restore()

            ctx.save()
            setStyle('hoverOrder')
            drawHoverOrders.forEach(draw => { draw() })
            ctx.restore()

          }
          clipRect(x + areaWidth, y, width - areaWidth, height)
          drawItemOrders(y + effectColumnHeight * 0.2, item)
          ctx.restore()
        }
        // const drawDragOrders = () => {
        //   if (!isDragging) return
        //   if (!(this.hoverInfo.index === 0)) return
        //   ctx.save()
        //   clipRect(x + areaWidth, y, width - areaWidth, height)
        //   const indicateTime = mouseInfo.time
        //   const indicateX =  xAxis.computeXAxisCoordinate(indicateTime, 'second')
        //   const indicateY = y

        //   setStyle('rushIndicate')
        //   drawLine(indicateX - 3, indicateY + 1, 6, 0)
        //   drawLine(indicateX, indicateY, 0, effectColumnHeight)
        //   drawLine(indicateX - 3, indicateY + effectColumnHeight - 1, 6, 0)


        //   // drawItemOrders(y + effectColumnHeight * 0.2, item)
        //   ctx.restore()
        // }


        const drawGrid = () => {
          const drawGridBackGround = () => {
            if (!isDragging) return
            const gridX = x + areaWidth
            const gridWidth = width - areaWidth
            drawRect(gridX, y, gridWidth, effectColumnHeight, 'fill')
          }
          ctx.save()
          setStyle('lightLine')
          ctx.fillStyle = 'rgba(0,0,0,0.1)'
          drawGridBackGround()
          ctx.restore()
        }
        const drawYAxis = () => {
          // 如果被Hover 欄位標示顏色
          if(ganttData.mode === 'edit') {
            ctx.save()
            ctx.fillStyle = '#d1d9e7'
            drawRect(x, y, areaWidth, height, 'fill')
            ctx.restore()
          }


          const drawHover = () => {
            if(this.hoverInfo.index === 0) {
              ctx.save()
              setStyle('hoverColumn')
              drawRect(x, y, areaWidth, height, 'fill')
              ctx.restore()
            }
          }
          // 繪製欄位圖示
          // const drawIcon = () => {
          //   switch(item.type) {
          //     case 'search' : {
          //       const { left, top } = iconArea
          //       const iconX = x + left
          //       const iconY = y + top

          //       const circleX = iconX + iconSize * 0.4
          //       const circleY = iconY + iconSize * 0.4
          //       const circleR = iconSize * 0.3
          //       const stickX = circleX + circleR * Math.cos((45 * Math.PI / 180))
          //       const sticky = circleY + circleR * Math.sin((45 * Math.PI / 180))
          //       // console.log(iconX, iconY)
          //       ctx.save()
          //       setStyle('iconLine')
          //       drawCircle(circleX, circleY, circleR, 'stroke')
          //       drawLine(stickX, sticky, circleR, circleR)
          //       // drawLine(circleX, circleY, circleR, circleR)

          //       ctx.restore()
          //       break
          //     }
          //   }
          // }
          // const drawLeftOperator = () => {

          // }
          // const drawLeftOperator = () => {
          //   switch(ganttData.mode) {
          //     case 'view' :
          //     case 'result' : {
          //       const { left, top } = iconArea
          //       const operatorX = x + left
          //       const operatorY = y + top

          //       ctx.save()
          //       setStyle('iconLine')
          //       const paths = [
          //         [operatorX - 5, operatorY + 5],
          //         [operatorX + 5, operatorY],
          //         [operatorX - 5, operatorY - 5]
          //       ]
          //       drawPath(paths, 'stroke')

          //       ctx.restore()
          //       break
          //     }
          //   }
          // }
          const drawRightOperator = () => {
            const operatorX = x + areaWidth - 30
            const operatorY = y + effectColumnHeight / 2

            switch(ganttData.mode) {
              case 'view' :
              case 'result' : {

                const circleX = operatorX + iconSize * 0.4
                const circleY = operatorY - iconSize * 0.1
                const circleR = iconSize * 0.3
                const stickX = circleX + circleR * Math.cos((45 * Math.PI / 180))
                const sticky = circleY + circleR * Math.sin((45 * Math.PI / 180))

                ctx.save()
                setStyle('iconLine')
                drawCircle(circleX, circleY, circleR, 'stroke')
                drawLine(stickX, sticky, circleR, circleR)

                ctx.restore()
                break
              }
              case 'edit': {
                const crossLength = iconSize * 0.5
                const crossX = operatorX + iconSize * 0.25
                const crossY = operatorY - iconSize * 0.25
                ctx.save()
                setStyle('iconLine')
                drawLine(crossX, crossY + crossLength, crossLength, -1 * crossLength)
                drawLine(crossX, crossY, crossLength, crossLength)

                ctx.restore()

              }
            }
          }

          // 繪製欄位文字
          const drawYAxisText = () => {
            ctx.save()
            setStyle('yItemText')
            clipRect(x, y, areaWidth - 36, effectColumnHeight)
            const iconX = 15 + levelXTransfer
            const textX = iconX  - 5
            const textY = y + effectColumnHeight * 0.5

            switch(ganttData.mode) {
              case 'result':
              case 'view' : {
                drawText(item.name + ` (${item?.children.length})`, textX, textY)
                break
              }
              case 'edit': {
                const text = objectController.i18n.getTranslate('gantt-order-editing')
                drawText(text, textX, textY)
                break
              }
            }
            ctx.restore()

            // if(item?.tab) {
            //   ctx.save()
            //   setStyle('tabText')
            //   const tabX = x + getColumns().tab[0]
            //   const tabWidth = getColumns().tab[1]
            //   clipRect(tabX, y, tabWidth, effectColumnHeight)

            //   drawText(item.tab, tabX + 8, textY)
            //   ctx.restore()
            // }
          }


          drawHover()
          // drawLeftOperator()
          drawRightOperator()
          drawYAxisText()
        }

        drawYAxis()
        drawOrders()
        // drawDragOrders()
        drawGrid()
        drawStickBorder()
      },
      check (event) {
        const stickArea = this.getArea()
        if(!isInArea(event, stickArea)) {
          this.hoverInfo = {
            type: '',
            index: null,
            data: null
          }
          return
        }

        const { offsetX, offsetY } = event
        const getYItem = () => {
          switch (ganttData.mode) {
            case 'result':
            case 'view': return this.yItem.search
            case 'edit': return this.yItem.edit
          }
        }
        const item = getYItem() //mode
        // console.log(this.yItem.search, this.yItem.edit)

        switch(event.type) {
          case 'click' : {
            const { type, data } = this.hoverInfo
            switch (type) {
              case 'reset': {
                this.setEditOrders('clear')
                yAxisReset('orderLink')
                break
              }
              case 'orders': {
                const clickOrder = data[0]
                if (!isSelectOrder(clickOrder)) {
                  setSelectOrders('click', clickOrder)
                }
                break
              }
              // case 'search' : {
              //   const searchOrders = getItemOrders(data)
              //   sideView.setNextView('searchSetting', {
              //     searchItem: data,
              //     searchOrders
              //   })
              //   break
              // }
              default: break
            }

            break
          }
          case 'dblclick': {
            const { type, data } = this.hoverInfo
            if(mode === 'view') {
              switch (type) {
                case 'orders' : {
                  sideView.setNextView('orderDetail',  data[0])
                  break
                }
                case 'yAxis' : {
                  // sideView.setNextView('itemSetting', data)
                  break
                }
                case 'grid': {
                  const itemOrders = getItemOrders(data)
                  setSelectOrders('orders', itemOrders)
                  break
                }
                default: break
              }
            }
            break
          }
          case 'mousemove' : {
            if(!canvasInfo.isHover) return
            const setHoverInfo = (type, data?) => {
              this.hoverInfo = {
                type: type,
                index: 0,
                data: data ?? item
              }

              switch (type) {
                case 'reset':
                case 'orders': {
                  cursorType.value = 'pointer'
                  break
                }
                case 'search' : {
                  cursorType.value = 'pointer'
                  break
                }
                // case 'yAxis': {
                //   if(ganttData.mode === 'view') {
                //     cursorType.value = 'pointer'
                //     // setMessage('clear')
                //   }
                //   break
                // }
                default : {
                  // setMessage('clear')
                }
              }
            }

            if (offsetX < stickArea.left + areaWidth) {
              // in YAxis
              const itemX = offsetX - stickArea.left
              const itemY = offsetY - stickArea.top
              switch (ganttData.mode) {
                case 'edit': {
                  const inOperator = isInOperator(item, itemX, itemY)
                  if(inOperator) setHoverInfo('reset')
                  else setHoverInfo('yAxis')
                  break
                }
                case 'result':
                case 'view':{
                  const inOperator = isInOperator(item, itemX, itemY)
                  if(inOperator) setHoverInfo('search')
                  else setHoverInfo('yAxis')
                  break
                }
                default: {
                  const inIcon = isInIcon(item, itemX, itemY)
                  if(inIcon) setHoverInfo('icon')
                  else setHoverInfo('yAxis')
                  break
                }
              }

            }
            else {
              // in grid
              const gridX = offsetX - ganttGrid.getArea().left
              const columnY = stickArea.top
              const orderYRange = {
                min: columnY + 0.2 * effectColumnHeight,
                max: columnY + 0.8 * effectColumnHeight
              }
              const inOrderYRange = isInRange(offsetY, orderYRange, 'value')
              const value = { item, x: gridX }
              const hoverOrders = computeOrder(value, 'itemX')
              const effectHoverOrders = (ganttData.mode === 'result') ? excludeRushOrders(hoverOrders) : hoverOrders

              if(effectHoverOrders.length > 0 && inOrderYRange) {
                setHoverInfo('orders', effectHoverOrders)
                const messageX = gridX + areaWidth
                const messageY = columnY - 4
                setMessage('orders', messageX, messageY, effectHoverOrders)
              }
              else setHoverInfo('grid', item)
            }
            break
          }
          case 'mousedown': {
            const  { type, index, data } = this.hoverInfo
            this.clickInfo = { type, index, data }
            break
          }
          case 'mouseup': {
            this.clickInfo = { type: '', index: null, data: null }
            this.dragInfo = { isDragging: false, type: '', index: null, data: null }
            break
          }
          case 'dragstart': {
            if(!useFunction.DragData) break
            const  { type, index, data } = this.clickInfo
            switch (type) {
              case 'orders': {
                isDragging = true
                const clickOrder = data[0]
                if (!isSelectOrder(clickOrder)) {
                  setSelectOrders('click', clickOrder)
                }

                const selectOrders = ganttData.selectOrders
                setDragItem('orders', selectOrders)
                this.dragInfo = { isDragging,  type, index, data: selectOrders }

                // modeController.setNextMode('edit')
                resetCanvas('yItems')
                // yAxisReset('stick')
                break
              }
            }

          }
        }
      }
    }
    const yAxisScrollArea = {
      loadingInfo: {
        isLoading: false, //是否需要loading
        mode: [], //需要loading的模式
        checkStop: null,
        startLoading (mode, stopFunc) {
          this.isLoading = true
          this.mode = [ ... mode]
          this.checkStop = stopFunc
          // 至少維持讀取 500 ms
          setTimeout(() => {
            this.checkLoadingStop(stopFunc)
          }, 500)
        },
        checkLoadingStop (repeatCheckStop) {
          if(repeatCheckStop === this.checkStop)  {
            // 檢查
            if(repeatCheckStop()) this.isLoading = false
            else {
              setTimeout(() => {
                this.checkLoadingStop(repeatCheckStop)
              }, 100)
            }
            // repeatCheckStop與checkStop不相等，代表觸發loading的原因有變
            // 原本運作中的checkLoading不再repeat
          }
        },
        get showLoading ()  {
          return this.isLoading && this.mode.includes(ganttData.mode)
        }
      },
      clickInfo: {
        type: '',
        index: null,
        data: null
      },
      hoverInfo: {
        type: '',
        index: null,
        data: null
      },
      dragInfo: {
        isDragging: false,
        type: '',
        index: null,
        data: null
      },
      drawOrderItems: [],
      // curItem: {},
      init () {
      },
      getArea () {
        const { left, right, bottom: top }  = yAxisStickArea.getArea()
        const  bottom  = yAxis.getArea().bottom

        return { left, right, top, bottom }
      },
      getSize () {
        const { left, right, top, bottom } = yAxisScrollArea.getArea()
        const width = right - left
        const height = bottom - top

        return { width, height}
      },
      // setDrawOrderItems (type) {
      //   const createOrders = (index) => {
      //     const gridOrders = getGridOrders(flatYItems[index])
      //     const orderItems = gridOrders.map(order => {
      //       const startTimeX =  xAxis.computeXAxisCoordinate(order.startTimeValue, 'second')
      //       const endTimeX =  xAxis.computeXAxisCoordinate(order.endTimeValue, 'second')
      //       const orderWidth = endTimeX - startTimeX
      //       const orderText = order.orderIds + '-' + order.moiIndex
      //       const orderTextWidth = ctx.measureText(orderText).width

      //       return  {
      //         startTimeX,
      //         endTimeX,
      //         orderWidth,
      //         orderText,
      //         orderTextWidth
      //       }
      //     })
      //     return orderItems
      //   }

      //   switch (type) {
      //     case 'reset' : {
      //       this.drawOrderItems.splice(0)
      //       const gridHeight =  yAxisScrollArea.getSize().height
      //       const endIndex = Math.round((gridHeight - yScroll) / effectColumnHeight)

      //       for (let i = startIndex; i <= endIndex ; i ++ ) {
      //         this.drawOrderItems.push({
      //           index: i,
      //           orders: createOrders(i)
      //         })

      //       }
      //       break
      //     }
      //     case 'yResize' : {
      //       const gridHeight =  yAxisScrollArea.getSize().height
      //       const endIndex = Math.round((gridHeight - yScroll) / effectColumnHeight)

      //       this.drawOrderItems = this.drawOrderItems.filter(item => {
      //         if(item.index < startIndex) return false
      //         else if (item.index > endIndex) return false
      //       })

      //       const unshiftEndIndex = this.drawOrderItems[0]?.index
      //       const pushStartIndex = this.drawOrderItems.at(-1).index + 1

      //       for(let index = startIndex; index < unshiftEndIndex; index++) {
      //         this.drawOrderItems.unshift({
      //           index,
      //           orders: createOrders(index)
      //         })
      //       }
      //       for(let index = pushStartIndex; index <= endIndex; index++) {
      //         this.drawOrderItems.push({
      //           index,
      //           orders: createOrders(index)
      //         })
      //       }

      //       break
      //     }
      //     case 'xResize': {
      //       // if orderEndTime < gridstratTime delete, until orderStartTime > gridstartTime
      //       // if orederStartTime > gridEndTime delete, until orderEndTime < gridEndTime



      //       break
      //     }
      //   }
      // },

      // 設置拖曳工單可放置的機台
      setRusablehMachine (orders) {
        // 判斷是否需要進入讀取模式
        const needLoading = objectController.ganttData.setRushableMachine(orders)
        if(needLoading) {
          const stopFunc = () => {
            const rushMachines = objectController.ganttData.getRushableMachine(orders)
            // 維持Loading直到所有order都查詢並設置完rushMachines
            if(rushMachines === null) return false
            // 重設Edit模式的YItem並取消Loading
            this.setEditYItems(orders)
            return true
          }

          this.loadingInfo.startLoading(['edit'], stopFunc)
        }
        else {
          // 重設Edit模式的YItem
          this.setEditYItems(orders)
        }
      },
      setEditYItems (orders) {
        // 重設Edit模式的YItem
        // 取得拖曳中orders的可插單機台列表
        const  rushableMachines = objectController.ganttData.getRushableMachine(orders)

        const rushableFilter = [
          {
            label: '可插單機台',
            tab: '機台',
            param: 'machineId',
            values: rushableMachines
          }
        ]
        ganttData.editYItems[0] = createYItemByFilters(scheduledOrders, null, rushableFilter)
        if(rushableMachines.length === 0) {
          ganttData.editYItems[0].children = []
        }
        setYItems()
      },
      computeItemIndex (value, type) {
        switch (type) {
          case 'itemY': {
            const index = Math.floor(value / effectColumnHeight)
            return index
          }
          case 'gridY': {
            const index = Math.floor((value + (yScroll * -1)) / effectColumnHeight)
            return index
          }
          case 'yCoordinate': {
            const startY = yAxisScrollArea.getArea().top
            const index = Math.floor((value - startY + (yScroll * -1)) / effectColumnHeight)
            return index
          }
        }
      },
      draw () {
        const startY = yAxisScrollArea.getArea().top
        const drawItems = []

        const gridX = ganttGrid.getArea().left
        const gridWidth = ganttGrid.getSize().width
        const gridHeight =  yAxisScrollArea.getSize().height

        const yCoordinate = yScroll + startY //位移後的起始座標

        const endIndex = Math.round((gridHeight - yScroll) / effectColumnHeight)

        const drawOperator = (x, y, item) => {
          switch(item.type) {
            case 'item' : {
              // drawCircle(x, y, 2, 'fill')
              break
            }
            case 'group' : {
              // icon: >
              const paths = [
                [x - 5, y + 5],
                [x + 5, y],
                [x - 5, y - 5]
              ]
              drawPath(paths, 'stroke')
              break
            }
          }
        }
        const drawGridBackGround = (y, item) => {
          if (!isDragging) return
          if (!computeRushable(item, 'yItem')) {
            drawRect(gridX, y, gridWidth, effectColumnHeight, 'block')
          }
        }

        let orderCount = 0

        type MarkInfo = {
          key: string
          color: string
        }
        type DrawOrderInfo = {
          x: number
          y: number
          width: number
          text: string
          type: string
        }
        const markOrdersMap = new Map()
        const addMarkOrder = (order: DrawOrderInfo, mark: MarkInfo) => {
          const { key } = mark
          if(markOrdersMap.has(key)) {
            const orders = markOrdersMap.get(key)
            orders.push(order)
          }
          else {
            const orders = [order]
            markOrdersMap.set(key, orders)
          }
        }

        for(let i = startIndex; i <= endIndex ; i++) {
          if (i >= flatYItems.length) break // 超出Y軸則停止繪製
          const item = flatYItems[i]
          const itemY = yCoordinate + effectColumnHeight * i

          const gridOrders = getGridOrders(i, 'index')
          const borderX = canvasX
          const borderY = itemY + effectColumnHeight
          const borderWidth = areaWidth
          const gridX = ganttGrid.getArea().left
          const gridWidth = ganttGrid.getSize().width
          const operatorX = areaWidth - 20
          // const iconX = 15 + levelXTransfer * (item.depth + 1)
          const textX = borderX + 8 // getColumns().name[0]
          // const textX = iconX + levelXTransfer - 5
          const textY = itemY + effectColumnHeight * 0.5
          const orderY = itemY + effectColumnHeight * 0.4

          const setDrawGridOrders = () => {
            const drawEditingOrders = []
            const drawOrders = []
            const drawHoverOrders = []
            const drawSelectOrders = []
            const drawEditIndicates = []
            const drawDragIndicates = []


            const setDragIndicates = () => {
              if(!isDragging) return
              if(dragItem.value.type !== 'orders') return
              if(mouseInfo.yIndex !== i) return


              let indicateTime = mouseInfo.time
              const dragOrders = dragItem.value.data
              dragOrders.forEach(order => {
                const { unixStartTime, unixEndTime } = order
                const duration = unixEndTime - unixStartTime
                const _indicateTime = useExpectTime ? indicateTime : order.startTimeValue
                const indicateX = xAxis.computeXAxisCoordinate(_indicateTime, 'second')
                const timeWidth = xAxis.computeTimeWidth(duration)
                const indicateWidth = Math.max(timeWidth, minSize)  - 2

                const text = getOrderText(order)
                const textWidth = ctx.measureText(text).width
                const textX = indicateX + indicatePadding
                const textY = itemY + indicateTextY

                const draw = () => {
                  // drawLine(indicateX - 3, itemY + 1, 6, 0)
                  drawLine(indicateX, itemY, 0, effectColumnHeight)
                  drawLine(indicateX - 3, itemY + effectColumnHeight - 1, 6, 0)

                  ctx.save()
                  setStyle('dragIndicateTextBack')
                  drawRect(indicateX, itemY + indicateRectY, indicateWidth, indicateHeight, 'block')
                  ctx.restore()
                  ctx.save()
                  setStyle('dragIndicateText')

                  clipRect(indicateX + 1, itemY + indicateRectY, indicateWidth, indicateHeight)

                  if (timeWidth <= minSize ) drawText('.', textX, textY - 4)
                  else if ((timeWidth - 6) <= textWidth ) drawText('...', textX, textY - 4)
                  else drawText(text, textX, textY)
                  ctx.restore()
                }

                //setNextOrder
                drawDragIndicates.push(draw)
                indicateTime = indicateTime + duration

              })
              return indicateTime

            }
            setDragIndicates()

            // const indicateStartTime = mouseInfo.time
            // const indicateEndTime = setDragIndicates()
            // const tempEditIndicateStartTimeX = new Map()
            // const setEditIndicateStartTimeX = () => {
            //   if(!isDragging) return null
            //   if(dragItem.value.type !== 'orders') return null
            //   if(this.hoverInfo.index !== i) return null

            //   const gridIndicates = gridOrders.filter(gridOrder => {
            //     if(!gridOrder.isNew) return false
            //     return !dragItem.value.data.some(dragOrder => dragOrder.orderKey === gridOrder.orderKey)
            //     // gridOrder.isNew
            //   })
            //   // 將與DragIndicate重疊EditIndicate的往前移
            //   // gridIndicates.reduceRight((curRange, indicate) => {
            //   //   const { startTimeValue, unixStartTime, unixEndTime } = indicate
            //   //   const [ curStartTime ] = curRange
            //   //   const duration = unixEndTime - unixStartTime
            //   //   const endTimeValue = startTimeValue + duration

            //   //   if (startTimeValue >= curStartTime) return curRange
            //   //   if (endTimeValue <= curStartTime) return curRange

            //   //   const timeShift = endTimeValue - curStartTime
            //   //   const newStartTimeValue = startTimeValue - timeShift
            //   //   const tempStartTimeX = xAxis.computeXAxisCoordinate(newStartTimeValue, 'second')
            //   //   tempEditIndicateStartTimeX.set(indicate.orderKey, tempStartTimeX)

            //   //   curRange[0] = newStartTimeValue

            //   //   return curRange
            //   // }, [indicateStartTime, indicateEndTime])
            //   // 將與DragIndicate重疊EditIndicate的往後移
            //   gridIndicates.reduce((curRange, indicate) => {
            //     const { startTimeValue, unixStartTime, unixEndTime } = indicate
            //     const [ curStartTime, curEndTime ] = curRange
            //     const duration = unixEndTime - unixStartTime
            //     const endTimeValue = startTimeValue + duration

            //     if (endTimeValue <= curStartTime) return curRange
            //     if (startTimeValue >= curEndTime) return curRange

            //     const timeShift = curEndTime - startTimeValue
            //     const newStartTimeValue = startTimeValue + timeShift
            //     const tempStartTimeX = xAxis.computeXAxisCoordinate(newStartTimeValue, 'second')
            //     tempEditIndicateStartTimeX.set(indicate.orderKey, tempStartTimeX)

            //     curRange[1] = newStartTimeValue + duration
            //     return curRange
            //   }, [indicateStartTime, indicateEndTime])
            // }
            // setEditIndicateStartTimeX()

            // set
            gridOrders.forEach(order => {
              orderCount++
              const startTimeX =  xAxis.computeXAxisCoordinate(order.startTimeValue, 'second')
              const endTimeX =  xAxis.computeXAxisCoordinate(order.endTimeValue, 'second')
              const timeWidth = (endTimeX - startTimeX) > minSize ? (endTimeX - startTimeX) : minSize

              const orderColor = getOrderColor(order)


              const isEditing = isEditingOrder(order)
              const isNew = !!order.isNew
              const isDragIndicate = () => {
                if(!isDragging) return false
                if(dragItem.value.type !== 'orders') return false
                const dragOrders = dragItem.value.data
                return dragOrders.some(dragOrder => dragOrder.orderKey === order.orderKey)

              }

              const orderType = (() => {
                if(isNew) return 'editIndicate'
                else if(isEditing && ganttData.mode === 'result') return 'editingOrder'
                else if(isEditing && ganttData.mode === 'edit') return 'ignore'
                else if(isHoverOrder(order)) return 'hoverOrder'
                else if(isSelectOrder(order)) return 'selectOrder'
                else return 'normalOrder'
              })()



              // const orderMark = getOrderMarkInfo(order)
              // const orderText = getOrderText(order)
              // const orderInfo = {
              //   x: startTimeX,
              //   y: itemY,
              //   width: timeWidth,
              //   type: orderType,
              //   text: orderText
              // }
              // addMarkOrder(orderInfo, orderMark)

              const drawBase = () => {
                // setStyle('unSubtle')
                ctx.fillStyle = 'white'
                drawRect(startTimeX, orderY, timeWidth, orderHeight, 'block')
              }
              const drawOrder = () => {
                drawBase()
                ctx.fillStyle = orderColor
                drawRect(startTimeX, orderY, timeWidth, orderHeight, 'block')
                if(order.wasRush) {
                  ctx.fillStyle = wasRush
                  drawRect(startTimeX, orderY + orderHeight - 1, timeWidth, 4, 'block')
                }
                if(timeWidth > minSize) drawOrderText()
              }
              const drawEditingOrder = () => {
                ctx.save()
                setStyle('isRush')
                clipRect(startTimeX, orderY, timeWidth, orderHeight)
                drawRect(startTimeX, orderY, timeWidth, orderHeight, 'block')

                if(timeWidth > minSize) drawOrderText()
                ctx.restore()
              }
              const drawEditIndicate = () => {
                const editIndicateX = (() => {
                  if(isTempIndicate(order)) {
                    const tempStartTimeValue = tempEditIndicatesInfo.tempStartTime.get(order.orderKey)
                    return xAxis.computeXAxisCoordinate(tempStartTimeValue, 'second')
                  }
                  return startTimeX
                })()//empEditIndicateStartTimeX.get(order.orderKey) ?? startTimeX
                //   return
                // }
                // const startTimeX =  xAxis.computeXAxisCoordinate(order.startTimeValue, 'second')
                drawLine(editIndicateX - 3, itemY + effectColumnHeight - 1, 6, 0)
                drawLine(editIndicateX, itemY, 0, effectColumnHeight)
                // console.log(order)
                const text = getOrderText(order)
                ctx.save()
                setStyle('rushIndicateTextBack')
                // const textHeight = ctx.measureText(text).height
                drawRect(editIndicateX, itemY + indicateRectY, timeWidth - 2, indicateHeight, 'block')
                ctx.restore()
                ctx.save()
                setStyle('rushIndicateText')
                const textWidth = ctx.measureText(text).width
                clipRect(editIndicateX + 1, itemY + indicateRectY, timeWidth - 3, indicateHeight)

                const textX = editIndicateX + indicatePadding
                const textY = itemY + indicateTextY
                if (timeWidth <= minSize ) drawText('.', textX, textY - 4)
                else if ((timeWidth - 6) <= textWidth ) drawText('...', textX, textY - 4)
                else drawText(text, textX, textY)
                ctx.restore()
              }
              const drawOrderText = () => {
                const orderText = getOrderText(order)
                const orderTextX = (startTimeX + endTimeX) / 2
                const orderTextY = orderY + orderHeight * 0.5 + 1
                ctx.save()
                if(isEditing && ganttData.mode === 'result') setStyle('rushOrderText')
                else setStyle('orderText')
                const textWidth = ctx.measureText(orderText).width
                clipRect(startTimeX + 1, orderY, timeWidth - 1, orderHeight)

                if (timeWidth <= minSize ) drawText('.', orderTextX, orderTextY)
                else if ((timeWidth - 6) <= textWidth ) drawText('...', orderTextX, orderTextY)
                else drawText(orderText, orderTextX, orderTextY)
                ctx.restore()
              }


              // drawOrdersBase.push(drawBase)]


              switch(orderType) {
                case 'editIndicate' : {
                  if(!isDragIndicate()) drawEditIndicates.push(drawEditIndicate)
                  break
                }
                 case 'editingOrder' : drawEditingOrders.push(drawEditingOrder); break
                case 'hoverOrder' : drawHoverOrders.push(drawOrder); break
                case 'selectOrder' : drawSelectOrders.push(drawOrder); break
                case 'normalOrder' : drawOrders.push(drawOrder); break
                default: break
              }
            })

            const drawCombinedAreas = (combinedAreas, type:DrawRect) => {
              combinedAreas.forEach(combinedArea => {
                const startTimeX =  xAxis.computeXAxisCoordinate(combinedArea.startDate, 'string')
                const endTimeX =  xAxis.computeXAxisCoordinate(combinedArea.endDate, 'string')
                const timeWidth = endTimeX - startTimeX
                drawRect(startTimeX, orderY, timeWidth, orderHeight, type)
              })
            }



            return {
              // gridOrdersBase: () => {
              //   drawOrdersBase.forEach(draw => { draw()})
              // },
              gridDragIndicates: () => {
                drawDragIndicates.forEach(draw => { draw()})
              },
              gridEditingOrders: () => {
                drawEditingOrders.forEach(draw => { draw()})
              },
              gridEditIndicates: () => {
                drawEditIndicates.forEach(draw => { draw()})
              },
              gridOrders: () => {
                drawOrders.forEach(draw => { draw()})
              },
              gridHoverOrders: () => {
                drawHoverOrders.forEach(draw => draw())
              },
              gridSelectOrders: () => {
                drawSelectOrders.forEach(draw => draw())
              },
              gridSelectEffect: () => {
                const selectOrders = gridOrders.filter(order => {
                  return isSelectOrder(order) && (!isEditingOrder(order) || ganttData.mode === 'view')
                })
                if(selectOrders.length === 0) return
                const selectArea = combineOrders(selectOrders)
                drawCombinedAreas(selectArea, 'stroke')
                // if(isSubtle) setStyle('subtleSelect')
              }
                // else  setStyle('selectOrder')
            }
          }
          // const setDrawRushOrders = () => {
          //   const isDisplay = () => {
          //     if (ganttData.mode === 'result') return true
          //     else if (ganttData.mode === 'edit') return true
          //     return false
          //   }
          //   if(!isDisplay()) {
          //     return {
          //       gridRushIndicate: () => {},
          //       gridRushOrder: () => {}
          //     }
          //   }

          //   const rushIndicateOrders = getItemRushs(item)
          //   const drawRushIndicates = []
          //   const drawRushOrders = []
          //   // const drawRushText = []


          //   rushIndicateOrders.forEach(order => {
          //     const startTimeX =  xAxis.computeXAxisCoordinate(order.data.startDate, 'string')


          //     drawRushIndicates.push(() => {
          //       // drawLine(startTimeX - 3, itemY + 1, 6, 0)
          //       drawLine(startTimeX - 3, itemY + effectColumnHeight - 1, 6, 0)
          //       drawLine(startTimeX, itemY, 0, effectColumnHeight)

          //       const text = getOrderText(order.data)
          //       ctx.save()
          //       setStyle('rushIndicateTextBack')
          //       const textWidth = ctx.measureText(text).width
          //       // const textHeight = ctx.measureText(text).height
          //       drawRect(startTimeX, itemY + indicateRectY, textWidth + indicatePadding * 2, indicateHeight, 'block')
          //       ctx.restore()
          //       ctx.save()
          //       setStyle('rushIndicateText')
          //       drawText(text, startTimeX + indicatePadding, itemY + indicateTextY)
          //       ctx.restore()
          //     })
          //   })

          //   const gridRushIndicate = () => {
          //     drawRushIndicates.forEach(draw => draw())
          //   }
          //   const gridRushOrder = () => {
          //     drawRushOrders.forEach(draw => draw())
          //   }

          //   return {
          //     gridRushIndicate,
          //     gridRushOrder
          //   }
          // }

          const drawItem = {
            yAxisBackground: () => {
              if(this.hoverInfo.index === i) {
                ctx.save()
                setStyle('hoverColumn')
                drawRect(borderX, itemY, areaWidth, effectColumnHeight, 'block')
                ctx.restore()
              }
            },
            yAxisText: () => {
              if(item.type === 'group') {
                ctx.save()
                clipRect( borderX, itemY, areaWidth - 36, effectColumnHeight)
                drawText(item.name, textX, textY)
                ctx.restore()
              }
              else {
                drawText(item.name, textX, textY)
              }

            },
            yAxisOperator: () => {
              drawOperator(operatorX, textY, item)
            },
            yAxisIcon: () => {
              // drawIcon(iconX, textY, item)
            },
            yAxisBorder: () => {
              drawLine(borderX, borderY, borderWidth, 0)
            },
            gridState: () => {
              drawGridBackGround(itemY, item)
            },
            gridRush: () => {
              if (ganttData.mode === 'result') {
                const itemProcessId =  getFilterValue(item, 'processId')
                const rushOrders = hasRushOrders(item)
                if(!rushOrders) return
                rushOrders.forEach(order => {
                  if(!itemProcessId || order.processId === itemProcessId) {
                    const startTime = order.data.startDate
                    const startTimeX =  xAxis.computeXAxisCoordinate(startTime, 'string')
                    drawLine(startTimeX, itemY, 0, effectColumnHeight)
                  }
                })
              }
              else if (item.displayRush) {
                const itemProcessId =  getFilterValue(item, 'processId')
                const rushOrders = hasRushOrders(item)
                if(!rushOrders) return
                rushOrders.forEach(order => {
                  if(!itemProcessId || order.processId === itemProcessId) {
                    const startTime = order.data.startDate
                    const startTimeX =  xAxis.computeXAxisCoordinate(startTime, 'string')
                    drawLine(startTimeX, itemY, 0, effectColumnHeight)
                  }
                })
              }
            },
            gridBorder: () => {
              drawLine(gridX, borderY, gridWidth, 0)
            },
            ...setDrawGridOrders()
            // ...setDrawRushOrders()
          }

          drawItems.push(drawItem)
        }


        // console.log(markOrdersMap)
        // console.timeEnd('compute')


        // 左側Y軸欄位
        const drawYAxis = () => {
          ctx.save()
          clipRect(canvasX, startY, areaWidth, areaHeight - startY)

          const drawBackGround = () => {
            ctx.save()
            setStyle('hoverColumn')
            drawItems.forEach(drawItem => {  drawItem.yAxisBackground() })
            ctx.restore()
          }
          const drawItem = () => {
            ctx.save()
            setStyle('yAxisText')
            drawItems.forEach(drawItem => { drawItem.yAxisText() })
            ctx.restore()

            ctx.save()
            setStyle('yAxisIcon')
            drawItems.forEach(drawItem => { drawItem.yAxisOperator() })
            ctx.restore()
            // ctx.save()
            // setStyle('yAxisIcon')
            // drawItems.forEach(drawItem => { drawItem.yAxisIcon() })
            // ctx.restore()
          }
          const drawBorder = () => {
            ctx.save()
            setStyle('standardLine')
            drawItems.forEach(drawItem => {  drawItem.yAxisBorder() })
            ctx.restore()
          }

          drawBackGround()
          drawItem()
          drawBorder()
          // drawGird()

          ctx.restore()
        
        }
        // 右側格線與工單
        const drawGrid = () => {
          ctx.save()
          clipRect(gridX, startY + 1, gridWidth, gridHeight - 1)

          // 背景狀態
          const drawState = () => {
            ctx.save()
            setStyle('lightLine')
            ctx.fillStyle = 'rgba(0,0,0,0.1)'
            drawItems.forEach(drawItem => {  drawItem.gridState() })
            ctx.restore()
          }
          const drawOrders = () => {
            ctx.save()
            setStyle('orderLine')
            drawItems.forEach(drawItem => {
              drawItem.gridOrders()
            })
            ctx.restore()
          }
          const drawHoverOrders = () => {
            ctx.save()
            setStyle('hoverOrder')
            drawItems.forEach(drawItem => {
              drawItem.gridHoverOrders()
            })
            ctx.restore()
            ctx.save()
            setStyle('orderLine')
            drawItems.forEach(drawItem => {  drawItem.gridHoverOrders() })
            ctx.restore()
          }
          const drawSelectOrders = () => {
            ctx.save()
            setStyle('selectOrder')
            drawItems.forEach(drawItem => {  drawItem.gridSelectEffect() })
            ctx.restore()
            ctx.save()
            setStyle('orderLine')
            drawItems.forEach(drawItem => {  drawItem.gridSelectOrders() })
            ctx.restore()
          }
          const drawEditingOrders = () => {
            ctx.save()
            setStyle('rushIndicateBase')
            drawItems.forEach(drawItem => {  drawItem.gridEditingOrders() })
            ctx.restore()

            ctx.save()
            setStyle('rushOrder')
            drawItems.forEach(drawItem => {
              drawItem.gridEditingOrders()
            })
            ctx.restore()
          }
          const drawEditIndicates = () => {
            ctx.save()
            setStyle('rushIndicate')
            drawItems.forEach(drawItem => {  drawItem.gridEditIndicates() })
            ctx.restore()
          }
          const drawDragIndicates = () => {
            ctx.save()
            setStyle('dragIndicate')
            drawItems.forEach(drawItem => {  drawItem.gridDragIndicates() })
            ctx.restore()
          }
          // drawOrdersBase()

          // drawRushOrder()
          drawEditingOrders()
          if (!(keyPress.Alt && ganttData.mode !== 'view')) {
            drawOrders()
            drawSelectOrders()
            drawHoverOrders()
          }
          // drawSubtleOrders()
          drawEditIndicates()
          drawDragIndicates()
          drawState()

          ctx.restore()
        }
        // const drawOrders = () => {
        //   const isType = type => order => order.type === type
        //   const createMarks = () => {
        //     const setType = (orders) => {
        //       const types = [
        //         'editIndicate',
        //         'editingOrder',
        //         'hoverOrder',
        //         'selectOrder',
        //         'normalOrder'
        //       ]
        //       const entries = types.map(type => {
        //         return [
        //           type,
        //           orders.filter(isType(type))
        //         ]
        //       })
        //       return Object.fromEntries(entries)
        //     }

        //     const marks = ganttData.marks.filter(mark => {
        //       return markOrdersMap.has(mark.key)
        //     }).map(mark => {
        //       const { key, color } = mark
        //       return {
        //         key,
        //         color,
        //         ...setType(markOrdersMap.get(key))
        //       }
        //     }).reverse()
        //     if(markOrdersMap.has('noMark')) {
        //       marks.unshift({
        //         key: 'noMark',
        //         color: colorNoMark,
        //         ...setType(markOrdersMap.get('noMark'))
        //       })
        //     }
        //     return marks
        //   }
        //   const markLayers = createMarks()

        //   // const drawWasRush
        //   const drawEditingOrders = () => {
        //     if(ganttData.mode !== 'result') return
        //     const type = 'editingOrder'
        //     //draw Base
        //     ctx.save()
        //     ctx.fillStyle = 'white'
        //     markLayers.forEach(markLayer => {
        //       const drawOrders = markLayer[type]
        //       drawOrders.forEach(order => {
        //         const orderY = order.y + effectColumnHeight * 0.4
        //         drawRect(order.x, orderY, order.width, orderHeight, 'block')
        //       })
        //     })
        //     ctx.restore()
        //     //draw Order
        //     ctx.save()
        //     setStyle('isRush')
        //     markLayers.forEach(markLayer => {
        //       const drawOrders = markLayer[type]
        //       drawOrders.forEach(order => {
        //         const orderY = order.y + effectColumnHeight * 0.4
        //         ctx.save()
        //         clipRect(order.x, orderY, order.width, orderHeight)
        //         drawRect(order.x, orderY, order.width, orderHeight, 'block')
        //         ctx.restore()
        //       })
        //     })
        //     ctx.restore()
        //     //draw Text
        //     ctx.save()
        //     setStyle('rushOrderText')
        //     markLayers.forEach(markLayer => {
        //       const drawOrders = markLayer[type]
        //       drawOrders.forEach(order => {
        //         const orderTextY = order.y + effectColumnHeight * 0.4 + orderHeight * 0.5 + 1
        //         const orderTextX = order.x + order.width / 2
        //         const textWidth = ctx.measureText(order.text).width

        //         if(order.width >= textWidth) drawText(order.text, orderTextX, orderTextY)
        //         else drawText('.', orderTextX, orderTextY)
        //       })
        //     })
        //     ctx.restore()
        //   }
        //   const drawNormalOrders = () => {
        //     const type = 'normalOrder'
        //     ctx.save()
        //     ctx.fillStyle = 'white'
        //     markLayers.forEach(markLayer => {
        //       const drawOrders = markLayer[type]
        //       drawOrders.forEach(order => {
        //         const orderY = order.y + effectColumnHeight * 0.4
        //         drawRect(order.x, orderY, order.width, orderHeight, 'block')
        //       })
        //     })
        //     ctx.restore()
        //     //draw Order
        //     ctx.save()
        //     setStyle('orderLine')
        //     markLayers.forEach(markLayer => {
        //       ctx.fillStyle = markLayer.color
        //       const drawOrders = markLayer[type]
        //       drawOrders.forEach(order => {
        //         const orderY = order.y + effectColumnHeight * 0.4
        //         // clipRect(order.x, orderY, order.width, orderHeight)
        //         drawRect(order.x, orderY, order.width, orderHeight, 'block')
        //       })
        //     })
        //     ctx.restore()
        //     //draw Text
        //     ctx.save()
        //     setStyle('orderText')
        //     markLayers.forEach(markLayer => {
        //       const drawOrders = markLayer[type]
        //       drawOrders.forEach(order => {
        //         const orderTextY = order.y + effectColumnHeight * 0.4 + orderHeight * 0.5 + 1
        //         const orderTextX = order.x + order.width / 2
        //         const textWidth = ctx.measureText(order.text).width

        //         if(order.width >= textWidth) drawText(order.text, orderTextX, orderTextY)
        //         else drawText('.', orderTextX, orderTextY)
        //       })
        //     })
        //     ctx.restore()
        //   }
        //   const drawSelectOrders = () => {
        //     const type = 'selectOrder'
        //     ctx.save()
        //     ctx.fillStyle = 'white'
        //     markLayers.forEach(markLayer => {
        //       const drawOrders = markLayer[type]
        //       drawOrders.forEach(order => {
        //         const orderY = order.y + effectColumnHeight * 0.4
        //         drawRect(order.x, orderY, order.width, orderHeight, 'block')
        //       })
        //     })
        //     ctx.restore()
        //     // draw effect
        //     ctx.save()
        //     setStyle('selectOrder')
        //     markLayers.forEach(markLayer => {
        //       ctx.fillStyle = markLayer.color
        //       const drawOrders = markLayer[type]
        //       drawOrders.forEach(order => {
        //         const orderY = order.y + effectColumnHeight * 0.4
        //         // clipRect(order.x, orderY, order.width, orderHeight)
        //         drawRect(order.x, orderY, order.width, orderHeight, 'block')
        //       })
        //     })
        //     ctx.restore()
        //     //draw Order
        //     ctx.save()
        //     setStyle('orderLine')
        //     markLayers.forEach(markLayer => {
        //       ctx.fillStyle = markLayer.color
        //       const drawOrders = markLayer[type]
        //       drawOrders.forEach(order => {
        //         const orderY = order.y + effectColumnHeight * 0.4
        //         drawRect(order.x, orderY, order.width, orderHeight, 'block')
        //       })
        //     })
        //     ctx.restore()
        //     //draw Text
        //     ctx.save()
        //     setStyle('orderText')
        //     markLayers.forEach(markLayer => {
        //       const drawOrders = markLayer[type]
        //       drawOrders.forEach(order => {
        //         const orderTextY = order.y + effectColumnHeight * 0.4 + orderHeight * 0.5 + 1
        //         const orderTextX = order.x + order.width / 2
        //         const textWidth = ctx.measureText(order.text).width

        //         if(order.width >= textWidth) drawText(order.text, orderTextX, orderTextY)
        //         else drawText('.', orderTextX, orderTextY)
        //       })
        //     })
        //     ctx.restore()
        //   }
        //   const drawHoverOrders = () => {
        //     const type = 'hoverOrder'
        //     ctx.save()
        //     ctx.fillStyle = 'white'
        //     markLayers.forEach(markLayer => {
        //       const drawOrders = markLayer[type]
        //       drawOrders.forEach(order => {
        //         const orderY = order.y + effectColumnHeight * 0.4
        //         drawRect(order.x, orderY, order.width, orderHeight, 'block')
        //       })
        //     })
        //     ctx.restore()
        //     // draw effect
        //     ctx.save()
        //     setStyle('hoverOrder')
        //     markLayers.forEach(markLayer => {
        //       ctx.fillStyle = markLayer.color
        //       const drawOrders = markLayer[type]
        //       drawOrders.forEach(order => {
        //         const orderY = order.y + effectColumnHeight * 0.4
        //         // clipRect(order.x, orderY, order.width, orderHeight)
        //         drawRect(order.x, orderY, order.width, orderHeight, 'block')
        //       })
        //     })
        //     ctx.restore()
        //     //draw Order
        //     ctx.save()
        //     setStyle('orderLine')
        //     markLayers.forEach(markLayer => {
        //       ctx.fillStyle = markLayer.color
        //       const drawOrders = markLayer[type]
        //       drawOrders.forEach(order => {
        //         const orderY = order.y + effectColumnHeight * 0.4
        //         drawRect(order.x, orderY, order.width, orderHeight, 'block')
        //       })
        //     })
        //     ctx.restore()
        //     //draw Text
        //     ctx.save()
        //     setStyle('orderText')
        //     markLayers.forEach(markLayer => {
        //       const drawOrders = markLayer[type]
        //       drawOrders.forEach(order => {
        //         const orderTextY = order.y + effectColumnHeight * 0.4 + orderHeight * 0.5 + 1
        //         const orderTextX = order.x + order.width / 2
        //         const textWidth = ctx.measureText(order.text).width

        //         if(order.width >= textWidth) drawText(order.text, orderTextX, orderTextY)
        //         else drawText('.', orderTextX, orderTextY)
        //       })
        //     })
        //     ctx.restore()
        //   }
        //   const drawEditIndicates = () => {
        //     const type = 'editIndicate'
        //     //draw FlagLine
        //     ctx.save()
        //     setStyle('rushIndicate')
        //     markLayers.forEach(markLayer => {
        //       const drawOrders = markLayer[type]
        //       drawOrders.forEach(order => {
        //         const { x, y } = order
        //         drawLine(x - 3, y + effectColumnHeight - 1, 6, 0)
        //         drawLine(x, y, 0, effectColumnHeight)
        //       })
        //     })
        //     ctx.restore()
        //     // drawBack
        //     ctx.save()
        //     setStyle('rushIndicateTextBack')
        //     markLayers.forEach(markLayer => {
        //       const drawOrders = markLayer[type]
        //       drawOrders.forEach(order => {
        //         const { x, y, text } = order
        //         const textWidth = ctx.measureText(text).width
        //         drawRect(x, y + indicateRectY, textWidth + indicatePadding * 2, indicateHeight, 'block')
        //       })
        //     })
        //     ctx.restore()
        //     // drawText
        //     ctx.save()
        //     setStyle('rushIndicateText')
        //     markLayers.forEach(markLayer => {
        //       const drawOrders = markLayer[type]
        //       drawOrders.forEach(order => {
        //         const { x, y, text } = order
        //         drawText(text, x + indicatePadding, y + indicateTextY)
        //       })
        //     })
        //     ctx.restore()
        //   }

        //   ctx.save()
        //   clipRect(gridX, startY + 1, gridWidth, gridHeight - 1)
        //   drawEditingOrders()
        //   drawNormalOrders()
        //   drawSelectOrders()
        //   drawHoverOrders()
        //   drawEditIndicates()
        //   ctx.restore()
        // }
        // console.timeEnd('compute')
        // console.log('====================')
        // console.log('Ordercount', orderCount)
        // console.time('drawY')


        if(this.loadingInfo.showLoading) {
          const { left, top, right, bottom } = this.getArea()
          const { width, height } = this.getSize()

          ctx.save()
          setStyle('loadingMask')
          drawRect(left, top, width, height, 'fill')


          const circleX = (left + right) / 2
          const circleY = (top + bottom) / 2
          const r = 20
          const milliSecond = dayjs().millisecond()

          const startPI = (milliSecond % 1000) / 500  // 0 ~ 2
          const endPI = (startPI + 0.4)
          ctx.beginPath()
          setStyle('loadingCircleBasic')
          ctx.arc(circleX, circleY, r, 0, 2 * Math.PI)
          ctx.stroke()

          ctx.beginPath()
          setStyle('loadingCircleRotate')
          ctx.arc(circleX, circleY, r, startPI * Math.PI, endPI * Math.PI)
          ctx.stroke()

          ctx.restore()
        }
        else {
          drawYAxis()
          drawGrid()
        }


        // drawOrders()
        // console.timeEnd('drawY')
      },
      check (event) {
        const scrollArea = this.getArea()
        const inArea = isInArea(event, scrollArea)
        const isCanvas = canvasInfo.isHover
        const inController = isInController(event)

        if (!inArea || !isCanvas || inController) {
          // Reset
          this.hoverInfo = {
            type: '',
            index: null,
            data: null
          }
          if(isCanvas) {
            if(isDragging) {
              switch ( dragItem.value.type) {
                case 'orders': {
                  const messageX = xAxis.computeXAxisCoordinate(mouseInfo.time, 'second')
                  const messageText = computeAddTime(limitStartTime, mouseInfo.time, 'second').format('YYYY-MM-DD HH:mm:ss')

                  setMessage('dragTimeLine', messageX, 0, {text: messageText})

                  break
                }
              }
            }

          }


          return
        }
        const { offsetX, offsetY } = event
        switch (event.type) {
          case 'mousemove': {
            const hoverIndex = this.computeItemIndex(offsetY, 'yCoordinate')
            const hoverItem = flatYItems[hoverIndex]

            const setHoverInfo = (type, data?) => {
              this.hoverInfo = {
                type: type,
                index: hoverIndex,
                data: data ?? hoverItem
              }

              switch (type) {
                case 'rushIndicate': {
                  cursorType.value = 'pointer'
                  break
                }
                case 'orders': {
                  cursorType.value = 'pointer'
                  break
                }
                case 'collapse' : {
                  cursorType.value = 'pointer'
                  break
                }
              }
            }
            if(!hoverItem) {
              setHoverInfo('')
              return
            }


            // in Grid
            if (offsetX > scrollArea.left + areaWidth) {
              const gridX = offsetX - ganttGrid.getArea().left

              const columnY = scrollArea.top + hoverIndex * effectColumnHeight + yScroll
              const orderYRange = {
                min: columnY + orderRectY,
                max: columnY + orderRectY + orderHeight
              }
              const indicateYRange = {
                min: columnY + indicateRectY,
                max: columnY + indicateRectY + indicateHeight
              }

              const inOrderYRange = isInRange(offsetY, orderYRange, 'value')
              const inIndicateYRange = isInRange(offsetY, indicateYRange, 'value')
              // const value = { item: hoverItem, x: gridX }
              // const hoverOrders = computeOrder(value, 'itemX')
              // const hoverOrders = getHoverOrders(hoverItem, gridX)

              if(inOrderYRange) {
                const hoverOrders = getHoverOrders(hoverItem, gridX).filter(order => !order.isNew)
                if(hoverOrders.length > 0) {
                  setHoverInfo('orders', hoverOrders)
                  const messageX = gridX + areaWidth
                  const messageY = columnY + orderRectY - 4
                  if(!this.dragInfo.isDragging) {
                    setMessage('orders', messageX, messageY, hoverOrders)
                  }
                }
                else {
                  setHoverInfo('grid')
                }
              }
              else if (inIndicateYRange) {
                const itemRushOrders = getItemEditIndicates(hoverItem)
                // ctx.save()
                // setStyle('rushIndicateTextBack')

                const hoverRushOrders = itemRushOrders.filter(rushOrder => {
                  const startTimeX =  xAxis.computeXAxisCoordinate(rushOrder.startTimeValue, 'second')
                  const textWidth = xAxis.computeTimeWidth(rushOrder.unixEndTime - rushOrder.unixStartTime) - 1
                  const indicateWidth = (textWidth > minSize) ? textWidth : minSize
                  // const textWidth = ctx.measureText(getOrderText(rushOrder)).width
                  const hoverRushOrder = {
                    left: startTimeX,
                    right: startTimeX + indicateWidth,
                    top: columnY + indicateRectY,
                    bottom: columnY + indicateRectY + indicateHeight
                  }

                  return isInArea(event, hoverRushOrder )

                })
                // console.log(hoverRushOrders)
                // ctx.restore()
                if(hoverRushOrders.length > 0) {
                  setHoverInfo('rushIndicate', hoverRushOrders)
                  const messageX = gridX + areaWidth
                  const messageY = columnY - 4
                  setMessage('rushIndicate', messageX, messageY, hoverRushOrders)
                }
                else {
                  setHoverInfo('grid')
                }


              }
              // if(hoverOrders.length > 0 && inOrderYRange) {
              //   setHoverInfo('orders', hoverOrders)
              //   const messageX = gridX + areaWidth
              //   const messageY = columnY + orderRectY - 4
              //   if(!this.dragInfo.isDragging) {
              //     setMessage('orders', messageX, messageY, hoverOrders)
              //   }
              // }
              // else {


              // }
            }
            // in YAxis
            else {
              if(hoverItem.type === 'group') {
                const itemX = offsetX - scrollArea.left
                const itemY = (offsetY - scrollArea.top - yScroll) % effectColumnHeight
                // const inIcon = isInIcon(hoverItem, itemX, itemY)
                const inOperator = isInOperator(hoverItem, itemX, itemY)
                if(inOperator) {setHoverInfo('collapse') }
                else setHoverInfo('yAxis')
              }
              else { setHoverInfo('yAxis') }
            }


            if(isDragging) {
              switch ( dragItem.value.type) {
                case 'orders': {
                  const messageX = xAxis.computeXAxisCoordinate(mouseInfo.time, 'second')
                  const messageText = computeAddTime(limitStartTime, mouseInfo.time, 'second').format('YYYY-MM-DD HH:mm:ss')
                  setMessage('dragTimeLine', messageX, 0, {text: messageText})


                  // if(!hoverItem) break
                  // if(!computeRushable(hoverItem, 'yItem')) {
                  //   const columnY = scrollArea.top + hoverIndex * effectColumnHeight + yScroll
                  //   const messageX = canvasX + areaWidth
                  //   const messageY = columnY
                  //   setMessage('rushableCause', messageX, messageY, hoverItem.rushableCause)
                  // }
                  break
                }
              }
            }

            // if(isDragging) {
            //   switch ( dragItem.value.type) {
            //     case 'orders': {
            //       if(!hoverItem) break
            //       if(!computeRushable(hoverItem, 'yItem')) {
            //         const columnY = scrollArea.top + hoverIndex * effectColumnHeight + yScroll
            //         const messageX = canvasX + areaWidth
            //         const messageY = columnY
            //         setMessage('rushableCause', messageX, messageY, hoverItem.rushableCause)
            //       }
            //       break
            //     }
            //   }
            // }

            break
          }
          case 'mousedown': {
            const  { type, index, data } = this.hoverInfo
            this.clickInfo = { type, index, data }
            break
          }
          case 'mouseup': {
            const { index } = this.hoverInfo
            const hoverYItem = flatYItems[index]
            if(isDragging) {
              // const { data, type } = dragItem.value
              switch ( dragItem.value.type) {
                case 'orders': {
                  if(!hoverYItem) break
                  if(computeRushable(hoverYItem, 'yItem')) {
                    addRushOrders(hoverYItem,  dragItem.value.data)
                  }
                  break
                }
              }
            }

            this.clickInfo = { type: '', index: null, data: null }
            this.dragInfo = { isDragging: false, type: '', index: null, data: null }
            break
          }
          case 'dragstart': {
            if(!useFunction.DragData) break
            const  { type, index, data } = this.clickInfo
            switch (type) {
              case 'orders': {
                isDragging = true
                const clickOrder = data[0]
                if (!isSelectOrder(clickOrder)) {
                  setSelectOrders('click', clickOrder)
                }

                const selectOrders = ganttData.selectOrders
                setDragItem('orders', selectOrders)
                this.dragInfo = { isDragging,  type, index, data: selectOrders }
                const messageX = xAxis.computeXAxisCoordinate(mouseInfo.time, 'second')
                setMessage('dragTimeLine', messageX, 0, {text: 'helloWorld'} )
                modeController.setNextMode('edit')
                break
              }
              case 'rushIndicate' : {
                isDragging = true
                const clickOrder = data[0]
                if (!isSelectOrder(clickOrder)) {
                  setSelectOrders('click', clickOrder)
                }

                const selectOrders = ganttData.selectOrders
                setDragItem('orders', selectOrders)
                this.dragInfo = { isDragging,  type, index, data: selectOrders }
                modeController.setNextMode('edit')
                break
              }
            }
            break
          }
          case 'click': {
            const { type, data } = this.hoverInfo
            switch (type) {
              case 'orders': {
                const clickOrder = data[0]
                if (!isSelectOrder(clickOrder)) {
                  setSelectOrders('click', clickOrder)
                }

                break
              }
              case 'rushIndicate': {
                const clickOrder = data[0]
                if (!isSelectOrder(clickOrder)) {
                  setSelectOrders('click', clickOrder)
                }
                break
              }
              case 'collapse' : {
                //SINGLEGROUP
                setLevelInfo('next', data)
                setYItems()
                const hoverIndex = this.computeItemIndex(offsetY, 'yCoordinate')
                const hoverItem = flatYItems[hoverIndex]

                if(!hoverItem) {
                  this.hoverInfo = {
                    type: '',
                    index: hoverIndex,
                    data: null
                  }
                   cursorType.value  = 'default'
                }
                else if(hoverItem.type === 'group') {
                  this.hoverInfo = {
                    type: 'collapse',
                    index: hoverIndex,
                    data: hoverItem
                  }
                }
                else {
                  this.hoverInfo = {
                    type: 'yAxis',
                    index: hoverIndex,
                    data: hoverItem
                  }
                   cursorType.value  = 'default'
                }

                // // drawCanvas()
                break
              }
              default: break
            }
            // setDrag
            break
          }
          case 'dblclick' : {
            const { type, data, index } = this.hoverInfo
            switch (type) {
              case 'orders' : {
                sideView.setNextView('orderDetail',  data[0])
                break
              }
              case 'yAxis' : {
                // if(ganttData.mode !== 'view') return
                // switch(data.type) {
                //   case 'item': sideView.setNextView('itemSetting', data); break
                //   case 'group': sideView.setNextView('groupSetting', data); break
                // }
                break
              }
              case 'grid': {
                const itemOrders =  flatYItemsOrders[index]//getItemOrders(data)
                setSelectOrders('orders', itemOrders)
                break
              }
              default: break
            }
            break
          }
        }
      }
    }

    const dragSelect = {
      dragInfo: {
        isDragging: false,
        type: '',
        start: { x: null, y: null, time: null },
        end: { x: null, y: null }
      },
      selectInfo: {
        hasSelect: false,
        type: '',
        area: {},
        orders: []
      },
      // yItems: [],
      orders: [],
      // yIndex: { min: null, max: null },
      // timeRange: { min: null, max: null },
      // startCoordinate: { x: null, y: null },
      // endCoordinate: { x: null, y: null },
      // scrollRecord: { x: null, y: null},
      draw () {
        const drawDragging = () => {
          const { isDragging, type, start, end } = this.dragInfo
          if(!isDragging) return
          ctx.save()
          setStyle('dragSelect')
          switch (type) {
            case 'stick': {
              const stickArea = yAxisStickArea.getArea()
              const stickSize = yAxisStickArea.getSize()
              const gridX = stickArea.left + areaWidth
              const gridY = stickArea.top

              clipRect(
                gridX,
                gridY,
                stickSize.width - areaWidth,
                stickSize.height
              )

              const startX = xAxis.computeXAxisCoordinate(start.time, 'second') //start.x +  gridX//- xScroll
              const startY = start.y + gridY //+ yScroll
              const width =  (end.x + gridX) - startX
              const height = end.y - start.y

              drawRect(startX, startY, width, height, 'block')
              break
            }
            case 'scroll': {
              const scollArea = yAxisScrollArea.getArea()
              const scollSize = yAxisScrollArea.getSize()
              const gridX = scollArea.left + areaWidth
              const gridY = scollArea.top

              clipRect(
                gridX,
                gridY,
                scollSize.width - areaWidth,
                scollSize.height
              )


              const startX = xAxis.computeXAxisCoordinate(start.time, 'second') //start.x +  gridX//- xScroll
              const startY = start.y + gridY + yScroll
              const width =  (end.x + gridX) - startX
              const height = end.y - start.y - yScroll

              drawRect(startX, startY, width, height, 'block')
            }
          }
          ctx.restore()
        }
        // const drawSelect = () => {

        // }
        drawDragging()
      },
      dragStart (event) {
        const { offsetX, offsetY } = event
        const stickArea = yAxisStickArea.getArea()
        const scrollArea = yAxisScrollArea.getArea()

        if(isInArea(event, stickArea)) {
          this.reset()
          const gridX = offsetX - stickArea.left - areaWidth
          const gridY = offsetY - stickArea.top
          const startTime = xAxis.computeTimeValue(gridX, 'gridX')
          this.dragInfo = {
            isDragging: true,
            type: 'stick',
            start: { x: gridX, y: gridY, time: startTime },
            end: { x: gridX, y: gridY }
          }

        }
        else if (isInArea(event, scrollArea) && !isInController(event)) {
          this.reset()
          const gridX = offsetX - scrollArea.left - areaWidth
          const gridY = (offsetY - scrollArea.top) - yScroll
          const startTime = xAxis.computeTimeValue(gridX, 'gridX')
          this.dragInfo = {
            isDragging: true,
            type: 'scroll',
            start: { x: gridX, y: gridY, time: startTime },
            end: { x: gridX, y: gridY }
          }
        }
      },
      dragMove (event) {
        const { isDragging, type } = this.dragInfo
        if(isDragging) {
          switch (type) {
            case 'stick': {
              const { offsetX, offsetY } = event
              const { left, top } = yAxisStickArea.getArea()
              const stickSize = yAxisStickArea.getSize()
              const minX = 0
              const maxX = stickSize.width - areaWidth
              const minY = 0
              const maxY = stickSize.height

              const x = getValueInRange(offsetX - left - areaWidth, minX, maxX)
              const y = getValueInRange(offsetY - top, minY, maxY)
              this.dragInfo.end = { x, y }
              break
            }
            case 'scroll': {
              const { offsetX, offsetY } = event
              const { left, top } = yAxisScrollArea.getArea()
              const scrollSize = yAxisScrollArea.getSize()
              const minX = 0
              const maxX = scrollSize.width - areaWidth
              const minY = 0
              const maxY = scrollSize.height

              const x = getValueInRange(offsetX - left - areaWidth, minX, maxX)
              const y = getValueInRange(offsetY - top, minY, maxY)
              this.dragInfo.end = { x, y }

              break
            }
          }
        }
      },
      dragEnd () {
        const { isDragging, type, start, end } = this.dragInfo
        if(isDragging) {
          const getTimeRange = () => {
            const time1 = start.time
            const time2 = xAxis.computeTimeValue(end.x, 'gridX')
            if (time1 < time2) return [time1, time2]
            else return [time2, time1]
          }

          switch (type) {
            case 'stick': {
              const timeRange = getTimeRange()
              const rangeStartTime = timeRange[0]
              const rangeEndTime = timeRange[1]

              const yItemOrders = yAxisStickArea.getOrders()
              const effectYItemOrders = (ganttData.mode === 'result') ? excludeRushOrders(yItemOrders) : yItemOrders
              // console.log(yItemOrders)
              const ordersInRange = effectYItemOrders.filter(order => {

                const orderStartTime = xAxis.computeTimeValue(order.startDate, 'string')
                const orderEndTime = xAxis.computeTimeValue(order.endDate, 'string')

                return orderStartTime <= rangeEndTime && orderEndTime >= rangeStartTime
              })

              setSelectOrders('area', ordersInRange)
              break
            }
            case 'scroll': {
              const getYItems = () => {
                const index1 = yAxisScrollArea.computeItemIndex(start.y, 'itemY')
                const index2 = yAxisScrollArea.computeItemIndex(end.y, 'gridY')

                const startIndex = (index1 < index2) ? index1 : index2
                const endIndex = (index1 < index2) ? index2 : index1

                const yItems = []
                for (let i = startIndex; i <= endIndex ; i ++ ) {
                  yItems.push(flatYItems[i])
                }
                return yItems
              }

              const timeRange = getTimeRange()
              const yItemList = getYItems()
              const rangeStartTime = timeRange[0]
              const rangeEndTime = timeRange[1]

              const yItemOrders = [ ... new Set(yItemList.map(yItem => getItemOrders(yItem)).flat())]
              const ordersInRange = yItemOrders.filter(order => {

                const isEditing = isEditingOrder(order)
                if(isEditing && ganttData.mode !== 'view') return false

                const orderStartTime = xAxis.computeTimeValue(order.startDate, 'string')
                const orderEndTime = xAxis.computeTimeValue(order.endDate, 'string')

                return orderStartTime <= rangeEndTime && orderEndTime >= rangeStartTime
              })


              setSelectOrders('area', ordersInRange)
            }

          }

        }

        this.dragInfo = {
          isDragging: false,
          type: '',
          start: { x: null, y: null, time: null },
          end: { x: null, y: null }
        }
      },
      reset () {
        this.dragInfo = {
          isDragging: false,
          type: '',
          start: { x: null, y: null, time: null },
          end: { x: null, y: null }
        }

        this.selectInfo = {
          hasSelect: false,
          type: '',
          area: {},
          orders: []
        }
        this.orders.splice(0)
        // this.startCoordinate = { x: null, y: null }
        // this.endCoordinate = { x: null, y: null }
      },
      check (event) {
        switch (event.type) {
          case 'dragstart': {
            if(!useFunction.DragData) break
            if(!canvasInfo.isHover) break
            const { offsetX } = event
            const { left } =  ganttGrid.getArea()
            const x = offsetX - left
            // 有正在拖曳的物件，或點擊在Y軸則 break
            if (dragItem.value?.data || x < 0) break
            dragSelect.dragStart(event)
            break
          }
          case 'mousedown' : {
            dragSelect.reset()
            break
          }
          case 'mousemove' : {
            dragSelect.dragMove(event)
            break
          }
          case 'mouseup' : {
            dragSelect.dragEnd()
            break
          }
        }
      }
    }

    const widthResizer = {
      width: 6,
      isDragging: false,
      recordX: null,
      hover: false,
      setWidth(newWidth) {
        const minWidth = this.width
        const maxWidth = xAxis.getArea().right - getArea().left - this.width
        areaWidth = getValueInRange(newWidth, minWidth, maxWidth)
        resetCanvas('size')
      },
      dragStart(event) {
        this.isDragging = true
        this.recordX = (areaWidth + canvasX) - event.clientX
      },
      dragMove(event) {
        if(!this.isDragging) return
        cursorType.value  = 'ew-resize'
        const nextWidth = this.recordX + event.clientX
        this.setWidth(nextWidth)
      },
      dragEnd() {
        this.isDragging = false
        this.recordX = null
      },
      check(event) {
        switch (event.type) {
          case 'dblclick': {
            if(this.hover) {
              ctx.save()
              setStyle('yItemText')
              const minWidth = this.width
              const nextWidth = flatYItems.reduce((minWidth, item) => {
                const textWidth = ctx.measureText(item.name).width
                const operatorWidth = (item.type === 'group' ) ? 24 : 0
                const curWidth = textWidth + operatorWidth
                return (curWidth > minWidth) ? curWidth : minWidth
              }, minWidth)
              ctx.restore()
              this.setWidth(nextWidth + 20)
              // areaWidth = getValueInRange(nextWidth + 20, minWidth, maxWidth)
            }
            break
          }
          case 'mousedown': {
            if(!canvasInfo.isHover) break
            if(this.hover) this.dragStart(event)
            break
          }
          case 'mousemove': {
            const area = {
              left: areaWidth + canvasX - this.width,
              right: areaWidth + canvasX,
              top: canvasY,
              bottom: canvasY + areaHeight
            }
            if(isInArea(event, area)) {
              cursorType.value  = 'ew-resize'
              this.hover = true
            }
            else {
              this.hover = false
            }
            this.dragMove(event)

            break
          }
          case 'mouseup': {
            this.dragEnd()
          }
        }
      },
      draw() {
        ctx.save()
        setStyle('widthResizer')
        const startX = canvasX + areaWidth - this.width
        const startY = canvasY
        const width = this.width
        const height = areaHeight
        drawRect(startX, startY, width, height, 'block')
        ctx.restore()
      }
    }

    const tempEditIndicatesInfo = {
      active: false,
      tempStartTime: new Map()

    }
    const setTempEditIndicateInfo = () => {
      tempEditIndicatesInfo.tempStartTime.clear()
      const cancle = () => {
        if(!useExpectTime) return true

        if(mouseInfo.yIndex === null) return true
        if(mouseInfo.yIndex < 0) return true
        if(mouseInfo.yIndex >= flatYItemsOrders.length) return true
        if(!isDragging) return true
        if(dragItem.value.type === 'orders') return false
        return true
      }
      if(cancle()) {
        tempEditIndicatesInfo.active = false
        return
      }

      tempEditIndicatesInfo.active = true
      const dragOrders = dragItem.value.data

      const itemIndicates = flatYItemsOrders[mouseInfo.yIndex].filter(order => {
        if(!order.isNew) return false
        return !dragItem.value.data.some(dragOrder => dragOrder.orderKey === order.orderKey)
      })
      const indicateStartTime = mouseInfo.time
      const indicateEndTime = dragOrders.reduce((endTime, order) => {
        const { unixStartTime, unixEndTime } = order
        const duration = unixEndTime - unixStartTime
        return endTime + duration
      }, indicateStartTime)

      const timeRange = [indicateStartTime, indicateEndTime]
      itemIndicates.reduce((curRange, indicate) => {
        const { startTimeValue, unixStartTime, unixEndTime, orderKey } = indicate
        const [ curStartTime, curEndTime ] = curRange
        const duration = unixEndTime - unixStartTime
        const endTimeValue = startTimeValue + duration

        if (endTimeValue <= curStartTime) return curRange
        if (startTimeValue >= curEndTime) return curRange

        const timeShift = curEndTime - startTimeValue
        const tempStartTimeValue = startTimeValue + timeShift
        // const tempStartTimeX = xAxis.computeXAxisCoordinate(tempStartTimeValue, 'second')
        tempEditIndicatesInfo.tempStartTime.set(orderKey,  tempStartTimeValue)

        curRange[1] = tempStartTimeValue + duration
        return curRange
      }, timeRange)

    }



    type OrderLink = {
      from:{
        area: 'stick' | 'scroll'
        index: number
        data
      }
      to:{
        area: 'stick' | 'scroll'
        index: number
        data
      }
    }
    const orderLinks: Array<OrderLink> = []

    const modeController = {
      nextMode: ganttData.mode,
      setNextMode (value?) { this.nextMode = value ??  ganttData.mode },
      setMode() {
        if(!useFunction.ModeTab) return
        // 新舊模式相同則不切換
        if(ganttData.mode === this.nextMode) return
        ganttData.mode = this.nextMode
        switch (this.nextMode) {
          case 'view': {
            // ganttData.mode = this.nextMode
            break
          }
          case 'edit': {
            // ganttData.mode = this.nextMode
            // yAxisStickArea.setEditOrders('add', ganttData.selectOrders)
            resetCanvas('yItems')
            yAxisReset('stick')
            break
          }
          // case 'result': {
          //   yAxisStickArea.display = false
          //   yAxisReset('size')
          //   yAxisReset('rush')
          //   yAxisReset('stick')
          //   resetCanvas('yItems')
          //   break
          // }
        }
        setAdjustTime()
        yAxisReset('orderLink')
        // console.log('changeMode')
      }
    }

    // Set Value
    const init = () => {
      yAxisReset('size')
      yAxisReset('scroll')
      yAxisReset('rush')
      yAxisReset('stick')
      yAxisReset('orderLink')
    }
    const yAxisReset = type => {
      switch(type) {
        case 'size': {
          areaHeight = initHeight()
          // xScroll = xAxisController.getScrollTime()
          break
        }
        case 'rush': {
          rushOrders.splice(0)
          editingOrders.forEach(order => rushOrders.push(order))

          yAxisReset('orderLink')
          break
        }
        case 'stick': {
          yAxisStickArea.setCurItem()
          break
        }
        case 'orderLink': {
          setOrderLink()
          break
        }
        case 'scroll': {
          yScroll = yAxisController.getScrollRate() * (getAllItemsHeight() + xAxisController.getSize().height) * -1
          startIndex = Math.floor((yScroll * -1) / effectColumnHeight)
          break
        }
      }
    }


    const getSize = () => {
      return {
        width: areaWidth,
        height: areaHeight
      }
    }
    const getArea = () => {
      return {
        left: canvasX,
        right: canvasX + areaWidth,
        top: canvasY,
        bottom: canvasY + areaHeight
      }
    }
    const getParams = type => {
      switch (type) {
        case 'effectColumnHeight': return effectColumnHeight
        case 'orderHeight': return orderHeight
      }
    }

    const getItemEditIndicates = item => {
      const itemIndex = flatYItems.findIndex(yItem => yItem === item)
      if(itemIndex < 0) return []
      return flatYItemsOrders[itemIndex].filter(order => order.isNew)
    }
    // 取得YItem的Orders
    const getItemOrders = item => {
      switch (item?.type) {
        case 'search': {
          const childrenOrders = item.children
          .map(child => getItemOrders(child))
          .flat()

          return noRepeatArray(childrenOrders)
        }
        case 'group': {
          const childrenOrders = item.children
          .map(child => getItemOrders(child))
          .flat()

          return noRepeatArray(childrenOrders)
          // return applyLevelFilters(levelInfo.curOrders, [item.prevLevelFilters.at(-1)])
        }
        case 'edit': {
          // 編輯後新增的Order不可顯示、選取
          return item.orders.filter(order => !order.isNew)
        }
        case 'item': {
          // 編輯後新增的Order不可顯示、選取
          return item.orders.filter(order => !order.isNew)
        }
        default : return []
      }
    }

    // const getItemDisplayOrders = (item) => {
    //   const displayOrders = []
    //   return displayOrders.filter(displayOrder => {
    //     const itemFilter = item.prevFilter.at(-1)
    //     if (!itemFilter) return true
    //     const filterParam = item.param
    //     return itemFilter.values.some(value =>
    //       displayOrder[filterParam] === value)
    //   })
    // }


    // 取得YItem的時間範圍
    const getOrdersTimeRange = orders => {
      if(isEmpty(orders)) return {
        startTime: limitStartTime,
        endTime: limitEndTime
      }
      return orders.reduce((timerange, order, index) => {
        //初始化設定
        if(index === 0) {
          return {
            startTime: order.startDate,
            endTime: order.endDate
          }
        }
        const startTime = dayjs(order.startDate).isBefore(dayjs(timerange.startTime)) ? order.startDate : timerange.startTime
        const endTime = dayjs(order.endDate).isAfter(dayjs(timerange.endTime)) ? order.endDate : timerange.endTime
        return {
          startTime,
          endTime
        }
      }, {})

    }
    // 取得顯示中的Orders
    const getGridOrders = (value, type?) => {

      const orders = (() => {
        switch(type) {
          case 'index': return flatYItemsOrders[value]
          case 'item':
          default: return (value.type === 'search') ? value.orders : getItemOrders(value)
        }
      })()


      return orders.filter(order => {
        const {
          gridStartTime,
          gridEndTime
        } = xAxis.getGridTime('value')


        if(order.startTimeValue > gridEndTime) return false
        else if (order.endTimeValue < gridStartTime) return false
        else return true
      })
    }
    // 取得Order顯示的文字
    const getOrderText = order => {
      const { orderIds, moiIndex } = order
      return  `${orderIds}-${moiIndex}`
    }

    //
    const setOrderLink = () => {
      // console.log('setOrderLink')
      orderLinks.splice(0)

      switch(ganttData.mode) {
        case 'edit':{
          const fromEditOrders = yAxisStickArea.yItem.edit.orders.filter(order => {
            const isEditing = isEditingOrder(order)//rushOrders.find(rushOrder => rushOrder === order)
            return isEditing
          })
          const editIndicates = flatYItems.map(item => {
            return getItemEditIndicates(item)
          })

          fromEditOrders.forEach(order => {
            editIndicates.forEach((indicates, index) => {
              // console.log(order, indicates[0], (order === indicates[0].data))
              const toIndicate = indicates.find(indicate => order.orderKey === indicate.orderKey)

              if(toIndicate) {
                orderLinks.push({
                  from: {
                    area: 'stick',
                    index: 0,
                    data: order
                  },
                  to: {
                    area: 'scroll',
                    index: index,
                    data: toIndicate
                  }
                })
              }
            })
          })


          // console.log(orderLinks)

          break
        }
        case 'result':{
          const fromEditItems = flatYItems.map(item => {
            const orders = getItemOrders(item)
            const editOrders = orders.filter(order => isEditingOrder(order))  //isRushOrder(order))
            return editOrders
          })

          const editIndicates = flatYItems.map(item => {
            return getItemEditIndicates(item)
          })


          fromEditItems.forEach((editOrders, fromIndex) => {
            // console.log(editOrders)
            // Each FlatYItem
            editOrders.forEach((order) => {
              editIndicates.forEach((indicates, toIndex) => {
              // console.log(order, indicates[0], (order === indicates[0].data))
              const toIndicate = indicates.find(indicate => order.orderKey === indicate.orderKey)
              if(toIndicate) {
                orderLinks.push({
                  from: {
                    area: 'scroll',
                    index: fromIndex,
                    data: order
                  },
                  to: {
                    area: 'scroll',
                    index: toIndex,
                    data: toIndicate
                  }
                })
              }
            })
            })
          })

          break
        }
      }
    }


    // 取得工單的標籤顏色
    const getOrderMarkInfo = order => {
      const noMark = {
        key: 'noMark',
        color: colorNoMark
      }

      if(!order?.marks) return noMark
      else if(order.marks.length > 0) {
        const mark = order.marks.find(mark => mark.isActive)
        if(mark) {
          const { key, color } = mark
          return { key, color }
        }
        else return noMark
      }
      else return noMark
    }


    const getOrderColor = order => {
      if(!order?.marks) return colorNoMark
      else if(order.marks.length > 0) {
        const mark = order.marks.find(mark => mark.isActive)
        if(mark) return mark.color
        else return colorNoMark
      }
      else return colorNoMark
    }
    // 取得FlatYItems的總高度
    const getAllItemsHeight = () => {
      return flatYItems.length * effectColumnHeight
    }

    //
    const getColumns = () => {
      return {
        tab: [ 0, 40 ],
        name: [ 40, (areaWidth - 30) - 30],
        operator: [ areaWidth - 30, 30]
      }
    }

    const isInOperator = (item, x, y) => {
      const { top, bottom } =  iconArea
      const area = {
        left: areaWidth - 30,
        right: areaWidth - 10,
        top,
        bottom
      }
      return isInRange({x, y}, area, 'area')
    }
    const isInIcon = (item, x, y) => {
      const { left, right, top, bottom} =  iconArea
      const area = {
        left: levelXTransfer * (item.depth) + left,
        right: levelXTransfer * (item.depth) + right,
        top,
        bottom
      }
      return isInRange({x, y}, area, 'area')
    }

    const isTempIndicate = indicate => {
      if(!indicate.isNew) return false
      if(!tempEditIndicatesInfo.active) return false
      return tempEditIndicatesInfo.tempStartTime.has(indicate.orderKey)
    }
    const isHoverOrder = order => {
      if (yAxisScrollArea.hoverInfo.type === 'orders') {
        return yAxisScrollArea.hoverInfo.data[0] === order
      }
      else if (yAxisStickArea.hoverInfo.type === 'orders') {
        return yAxisStickArea.hoverInfo.data[0] === order
      }
      else return false
    }
    const isSelectOrder = order => {
      return ganttData.selectOrders.find(selectOrder => order === selectOrder)
    }

    // 計算出對應的YITEM
    const computeItem = (value, type) => {
      switch(type) {
        case 'yCoordinate' : {
          const count = Math.ceil((value + (yScroll * -1)) / effectColumnHeight)
          // console.log('Height', value , 'count', count)
          return computeItem(count, 'count')
        }
        case 'count' : {
          let curCount = 0

          const targetCount = value
          const searchCount = items => {
            for (let i = 0; i < items.length; i++) {
              const item = items[i]
              curCount ++
              if(curCount === targetCount) return item
              switch (item.type) {
                case 'group': {
                  if(item.isOpen) {
                    const targetItem = searchCount(item.children)
                    if(targetItem) return targetItem
                  }
                }
              }


            }
            return null
          }

          return searchCount(yItems)
        }
      }
    }
    // 計算出對應的Orders
    const getHoverOrders = (item, x) => {
      const itemIndex = flatYItems.findIndex(yItem => yItem === item)
      const itemOrders = flatYItemsOrders[itemIndex]

      const timeValue = xAxis.computeTimeValue(x, 'xCoordinate')
      const time = computeAddTime(limitStartTime, timeValue, 'second')
      if(isEmpty(itemOrders)) return []
      if(x < 0) return [] // item.orders //
      const orders = itemOrders.filter(order => {
        //排除Indicate
        if(order.isNew) return false

        const {
          startDate: startTime,
          endDate: endTime
        } = order
        // 判斷是否處於最小寬度
        const _timeValue = xAxis.computeTimeValue( x - minSize, 'xCoordinate')
        const _time = computeAddTime(limitStartTime, _timeValue, 'second')

        return isInRange(time, { startTime, endTime }, 'time') ||
          isInRange(startTime, {startTime: _time, endTime: time }, 'time')
      })
      // console.log(orders)
      return orders

    }


    const computeOrder = (value, type) => {
      switch (type) {
        case 'coordinate' : {
          const { x, y } = value
          const item = computeItem(y, 'yCoordinate')
          return computeOrder({item, x }, 'itemX')
        }
        case 'itemX' : {
          const { item, x }  = value
          if(!item) return [] //無
          switch(item.type) {
            case 'group': {
              if(isEmpty(item.children)) return []
              else {
                const childrenOrders = item.children.map(child => {
                  return computeOrder({item: child, x}, 'itemX')
                })

                return childrenOrders.flat()
              }
            }
            case 'edit':
            case 'search':
            case 'item': {
              const timeValue = xAxis.computeTimeValue(x, 'xCoordinate')
              const time = computeAddTime(limitStartTime, timeValue, 'second')
              if(isEmpty(item.orders)) return []
              if(x < 0) return [] // item.orders //
              const orders = item.orders.filter(order => {
                const {
                  startDate: startTime,
                  endDate: endTime
                } = order
                // 判斷是否處於最小寬度
                const _timeValue = xAxis.computeTimeValue( x - minSize, 'xCoordinate')
                const _time = computeAddTime(limitStartTime, _timeValue, 'second')

                return isInRange(time, { startTime, endTime }, 'time') ||
                  isInRange(startTime, {startTime: _time, endTime: time }, 'time')
              })
              return orders
            }
          }
          return []
        }
      }
    }

    // 計算目標是否可以被拖曳中的工單插單
    const computeRushable = (value, type) => {
      switch (type) {
        case 'yItem': {
          // 預設無法插單直接回傳
          if(!value.isRushable) return false
          else {
            // 確認拖曳中的資料是否為工單
            // dragItem:Ref({type,data})
            if(dragItem.value.type !== 'orders') return false

            const dragOrders = dragItem.value.data
            const itemMachineId = findObjectInArray(value.orderFilters, 'machineId', 'param')['value']
            return !dragOrders.some(dragOrder => {
              const { orderKey } = dragOrder
              const rushableMachineIds =  ganttData.rushableMachines.get(orderKey)
              return !rushableMachineIds.some(rushableMachineId => {
                return itemMachineId === rushableMachineId
              })
            })
          }
        }
      }
    }
    // 將時間有重疊的供單合併
    const combineOrders = (orders:Array<any>) => {

      const minTimeValue = xAxis.computeTimeValue(minSize, 'width')

      const sortedOrders = orders.sort((a, b) => {
        const diff = dayjs(a.startDate).diff(b.startDate)
        return (diff >= 0) ? 1 : -1
      })

      const createCombined = order => {
        const minEnd = computeAddTime(dayjs(order.startDate), minTimeValue, 'seconds')
        const diff = dayjs(order.endDate).diff(minEnd)

        return {
          startDate: order.startDate,
          endDate: (diff > 0) ? order.endDate : minEnd.format('YYYY-MM-DD HH:mm:ss'),
          orders: [order]
        }
      }

      // // console.time('COMBINE')
      const result =  sortedOrders.reduce((combinedList, order, index ) => {
        if(index === 0) {
          combinedList.push(createCombined(order))
        }
        else {
          const lastCombined = combinedList.at(-1)
          const diff = dayjs(order.startDate).diff(lastCombined.endDate)
          if(diff <= 0) {
            const minEnd = computeAddTime(dayjs(order.startDate), minTimeValue, 'seconds')
            const diff = dayjs(order.endDate).diff(minEnd)
            const endDate = (diff > 0) ? order.endDate : minEnd.format('YYYY-MM-DD HH:mm:ss')

            if(dayjs(endDate).diff(lastCombined.endDate) > 0) {
              lastCombined.endDate = endDate
            }

            lastCombined.orders.push(order)
          }
          else combinedList.push(createCombined(order))
        }

        return combinedList
      }, [])
      // // console.timeEnd('COMBINE')

      return result
    }

    // 設置ScrollArea的yItems
    const setYItems = (item? : any) => {
      const getItems = () => {
        const { editYItems, /*resultYItems,*/  mode } = ganttData
        switch (mode) {
          case 'result': {
            return levelInfo.curLeaves
            // return resultYItems
          }  //return yItems
          case 'view': {
            return levelInfo.curLeaves.filter(leave => !leave.isNew)
          }
          case 'edit': {
            return editYItems[0].children
          }
        }
      }
      const items = item ?? getItems()
      // const items =  levelInfo.curLeaves
      // 設置YItems
      yItems.splice(0)
      items.forEach(item => yItems.push(item))

      //攤平YItems
      setFlatYItems()
    }
    // 設置ScrollArea攤平的yItems
    const setFlatYItems = () => {
      // console.time('SETFLATYITEM')
      const flatItems = items => {
        const depthItems = items.map(item => {
          switch (item.type) {
            case 'group': {
              if(item.isOpen) return [item].concat(flatItems(item.children))
              return item
            }
            case 'item': return item
          }
        })
        return depthItems.flat()
      }
      flatYItems.splice(0)
      flatYItemsOrders.splice(0)
      const flatYItemArray = flatItems(yItems)
      // console.time('APPLYFilter')

      const effectOrders = (() => {
        switch (ganttData.mode) {
          case 'edit': {
            const effectOrders = allTypeOrders.filter(order => {
              if(isEditingOrder(order)) return order.isNew
              return true
            })
            return effectOrders
          }
          case 'result': {
            const effectOrders = Array.from(levelInfo.curOrders)
            return effectOrders
          }
          case 'view': {
            const effectOrders =  levelInfo.curOrders.filter(order => !order.isNew)
            return effectOrders
          }
        }
      })()




      // console.log(flatYItemArray)
      flatYItemArray.reduce((remainOrder, item) => {
        flatYItems.push(item)
        const { param, value } = item.prevLevelFilters.at(-1)
        const filterOrders = remainOrder.filter(order => order[param] === value)
        const newRemainOrders = remainOrder.filter(order => !filterOrders.includes(order))
        flatYItemsOrders.push(filterOrders)
        return newRemainOrders
      }, effectOrders)



      // console.timeEnd('APPLYFilter')
      // console.log(flatYItemsOrders)

      const overViewOrders = flatYItemsOrders
      .map(
        (orders, yIndex) => {
          return orders
            .filter(order => {
              const isNew =  order.isNew
              const isEditing = isEditingOrder(order)
              switch(ganttData.mode) {
                case 'view': {
                  return !isNew
                }
                case 'edit': {
                  // 非編輯中一律正常顯示
                  if(!isEditing) return true
                  return isNew
                }
                case 'result': {
                  if(!isEditing) return true
                  return isNew
                }
                default: return true
              }

            })
            .map(order => {
              const { startTimeValue, endTimeValue } = order
              // const startTimeValue = xAxis.computeTimeValue(order.startDate, 'string')
              // const endTimeValue = xAxis.computeTimeValue(order.endDate, 'string')
              const orderMark = order.marks.find(mark => mark.isActive)
              const markIndex = ganttData.marks.findIndex(mark => orderMark === mark)
              // console.log( order.marks)
              const markColor = (orderMark) ? orderMark.color : colorNoMark

              const isNew = order.isNew
              // const isEditing = isEditingOrder(order)
              const wasRush = order.wasRush
              // console.log(order.marks, [markIndex, markColor])

              return {
                yIndex,
                startTimeValue,
                endTimeValue,
                markIndex,
                markColor,
                // isEditing,
                isNew,
                wasRush
              }
            })
        }
      )


      // console.time('setOrders')
      objectController.overView.setOrders(overViewOrders)
      // console.timeEnd('setOrders')
      yAxisController.init()

      // console.timeEnd('SETFLATYITEM')

    }
    // 設置選擇中的工單
    const setSelectOrders = (type, data?) => {
      // if !ctrl
      if(!keyPress.Control) ganttData.selectOrders = []
      switch(type) {
        // case 'clear': ganttData.selectOrders = []; break
        case 'click': ganttData.selectOrders.push(data); break
        case 'orders':
        case 'area': ganttData.selectOrders = ganttData.selectOrders.concat(data)
      }
      // console.log('SELECT')
    }

    // Check YAxis
    const checkEvent = event => {
      switch (event.type) {
        case 'mouseup': setSelectOrders('clear'); break
        case 'mousemove': setTempEditIndicateInfo() ; break
      }

      messageController.setNextMessage()
      modeController.setNextMode()
      yAxisHeader.check(event)
      yAxisStickArea.check(event) //置頂區域
      yAxisScrollArea.check(event) //可捲動區域
      widthResizer.check(event) //調整Y軸寬度
      dragSelect.check(event) //範圍選取
      switch (event.type) {
        case 'dragstart' : {
          break
        }
        case 'mousedown' : {
          break
        }
        case 'mousemove' : {
          break
        }
        case 'mouseup' : {
          setDragItem('clear')
          isDragging = false
          break
        }
      }

      messageController.setMessage()
      modeController.setMode()

      // drawCanvas()
    }

    const addRushOrders = async (item, orders) => {
      const expectStartTime = mouseInfo.time
      const machineId = getFilterValue(item, 'machineId')

      const itemIndex = flatYItems.findIndex(yItem => yItem === item)
      const itemIndicates = flatYItemsOrders[itemIndex].filter(order => {
        if(!order.isNew) return false
        return !dragItem.value.data.some(dragOrder => dragOrder.orderKey === order.orderKey)
      })


      if(useExpectTime) {
        const timeRange = orders.reduce((curRange, order) => {
          const { unixStartTime, unixEndTime } = order
          const duration = unixEndTime - unixStartTime
          curRange[1] = curRange[1] + duration
          return curRange
        }, [expectStartTime, expectStartTime])

        itemIndicates.reduce((curRange, indicate) => {
          const { startTimeValue, unixStartTime, unixEndTime } = indicate
          const [ curStartTime, curEndTime ] = curRange
          const duration = unixEndTime - unixStartTime
          const endTimeValue = startTimeValue + duration

          if (endTimeValue <= curStartTime) return curRange
          if (startTimeValue >= curEndTime) return curRange

          const timeShift = curEndTime - startTimeValue
          const newStartTimeValue = startTimeValue + timeShift

          orders.push(indicate)
          indicate.startTimeValue = newStartTimeValue

          curRange[1] = newStartTimeValue + duration
          return curRange
        }, timeRange)
      }


      rushManagement.addRushOrders(orders, machineId, expectStartTime, limitStartTime)
      objectController.ganttData.setEditOrder()
      levelInfo.curOrders = allTypeOrders
      resetYItemByFilters(ganttData.rootYItemList, allTypeOrders)

      setLevelInfo('reset')
      yAxisReset('rush')

    }
    const hasRushOrders = item => {
      const itemMachineId = getFilterValue(item, 'machineId')
      const machineRushOrders = ganttData.rushMachinesMap.get(itemMachineId) ?? []
      const effectRushOrders = machineRushOrders.filter(order => order.type === 'new')

      const filterRushOrders = effectRushOrders.filter(rushOrder => {
        return !item.orderFilters.some(filter => {
          const { param, value } = filter
          switch(param) {
            case 'machineId': return value !== rushOrder.machineId
            default : return value !== rushOrder.data[param]
          }
        })
      })

      return filterRushOrders
    }

    const isRushOrder = order => {
      if(editingOrders.some(newOrder => newOrder === order)) return true
      if(order.isNew) return true

      return rushOrders.some(rushOrder => rushOrder === order)
    }
    const excludeRushOrders = orders => {
      return orders.filter(order => {
        return !isRushOrder(order) // 保留非rush的Order
      })
    }

    const getLevelFilterLabel = levelFilter => {
      // Get Name By LeveFilter's param. ex:orderIds, processId......
      // console.log(filterColumnSetting[levelFilter.param])
      if(!levelFilter) return '查無相符工單'
      const i18nKey = filterColumnSetting[levelFilter.param].i18nLabel
      return objectController.i18n.getTranslate(i18nKey)
    }

    const getGridY = () => {
      const yCoordinate = yScroll + yAxisScrollArea.getArea().top
      const gridHeight = yAxisScrollArea.getSize().height
      const endIndex = Math.round((gridHeight - yScroll) / effectColumnHeight)
      const gridY = []
      for(let i = startIndex; i <= endIndex ; i++) {
        const itemY = yCoordinate + effectColumnHeight * i
        gridY.push(itemY)
      }
      return gridY
    }

    const getFlatYItemsTimeRange = () => {
      const allYItemsOrders = [ ... new Set(flatYItemsOrders.flat())]
      const flatYItemsTimeRange = getOrdersTimeRange(allYItemsOrders)
      return flatYItemsTimeRange
    }
    const getMouseYIndex = event => {
      const hoverIndex = yAxisScrollArea.computeItemIndex(event.offsetY, 'yCoordinate')
      return hoverIndex
    }

    // Draw YAxis
    const drawArea = () => {
      const drawBorder = () => {
        ctx.save()
        setStyle('standardLine')
        drawRect(canvasX, canvasY, areaWidth, areaHeight, 'stroke')
        ctx.fillStyle = '#eceff5'

        drawRect(canvasX, canvasY, areaWidth, xAxis.getSize().height, 'block')
        ctx.restore()
      }

      drawBorder()
      yAxisHeader.draw() // V
      yAxisScrollArea.draw()
      yAxisStickArea.draw() // ?
      widthResizer.draw()
      dragSelect.draw()



      const drawOrderLinks = () => {
        ctx.save()
        const { left: gridLeft, top: gridTop } = ganttGrid.getArea()
        const { width: gridWidth, height: gridHeight} = ganttGrid.getSize()

        clipRect(gridLeft, gridTop, gridWidth, gridHeight)
        setStyle('orderLink')


        orderLinks.forEach(link => {
          const { from, to } = link
          const isHide = (() => {
            if(dragItem.value) {
              if(dragItem.value.type === 'orders') {
                // console.log(to.data, dragItem.value.data)

                if(dragItem.value.data.some(order => order.orderKey === to.data.orderKey)) return true
              }
            }

            if (from.area !== to.area) return false
            else if (from.index === to.index) return true
            return false
          })()
          if(isHide) return

          const linkPath = (() => {
            const fromCoordinate = (() => {
              switch(from.area) {
                case 'stick' : {
                  const x =  xAxis.computeXAxisCoordinate(from.data.startTimeValue, 'second')
                  const y = yAxisStickArea.getArea().top + effectColumnHeight * 0.5 //0.8
                  return [x, y]
                }
                case 'scroll': {
                  if(from.index >= to.index) {
                    const x =  xAxis.computeXAxisCoordinate(from.data.startTimeValue, 'second')
                    const y = yAxisScrollArea.getArea().top + yScroll + effectColumnHeight * from.index + orderRectY + (orderHeight / 2)
                    return [x, y]
                  }
                  else {
                    const x =  xAxis.computeXAxisCoordinate(from.data.startTimeValue, 'second')
                    const y = yAxisScrollArea.getArea().top + yScroll + effectColumnHeight * from.index + orderRectY + (orderHeight / 2)
                    return [x, y]
                  }

                }
              }
            })()
            const toCoordinate = (() => {
              if(from.area === 'stick' || from.index <= to.index) {
                if(isTempIndicate(to.data)) {
                  const x =  xAxis.computeXAxisCoordinate(tempEditIndicatesInfo.tempStartTime.get(to.data.orderKey), 'second')
                  const y = yAxisScrollArea.getArea().top + yScroll + effectColumnHeight * to.index + indicateRectY
                  return [x, y]
                }
                else {
                  const x =  xAxis.computeXAxisCoordinate(to.data.startTimeValue, 'second')
                  const y = yAxisScrollArea.getArea().top + yScroll + effectColumnHeight * to.index + indicateRectY
                  return [x, y]
                }



              }
              else {
                if(isTempIndicate(to.data)) {
                  const x =  xAxis.computeXAxisCoordinate(tempEditIndicatesInfo.tempStartTime.get(to.data.orderKey), 'second')
                  const y = yAxisScrollArea.getArea().top + yScroll + effectColumnHeight * to.index + indicateRectY + (indicateHeight)
                  return [x, y]
                }
                else {
                  const x =  xAxis.computeXAxisCoordinate(to.data.startTimeValue, 'second')
                  const y = yAxisScrollArea.getArea().top + yScroll + effectColumnHeight * to.index + indicateRectY + (indicateHeight)
                  return [x, y]
                }




              }
            })()
            return [
              fromCoordinate,
              toCoordinate
            ]
          })()



          // const linkPath = [
          //   [fromCoordinate.x - 3, fromCoordinate.y],
          //   [fromCoordinate.x - 3, fromCoordinate.y2],
          //   [toCoordinate.x - 3, fromCoordinate.y2],
          //   [toCoordinate.x - 3, toCoordinate.y]
          // ]
          
          // drawPath(linkPath, 'stroke')
          drawDashPath(linkPath)

          // drawLine(fromCoordinate.x - 3, fromCoordinate.y, 0, effectColumnHeight / 2)
          // drawLine(fromCoordinate.x - 3, fromCoordinate.y, 0, toCoordinate.y - fromCoordinate.y)
          // drawLine(fromCoordinate.x - xAdjust, toCoordinate.y, xAdjust + (toCoordinate.x - fromCoordinate.x) - 5, 0)

          // const arrowPath = [
          //   [ fromCoordinate.x - 10, toCoordinate.y - 4],
          //   [ fromCoordinate.x - 5, toCoordinate.y ],
          //   [ fromCoordinate.x - 10, toCoordinate.y + 4]
          // ]

          // drawPath(arrowPath, 'fill')

          // console.log(link, fromCoordinate, '=>', toCoordinate)

        })


        // console.log(orderLinks)
        ctx.restore()
      }
      drawOrderLinks()
    }
    // return YAxis
    return {
      checkEvent,
      drawArea,
      getSize,
      getArea,
      getParams,
      getAllItemsHeight,
      getFlatYItemsTimeRange,
      getGridY,
      init,
      reset: yAxisReset,
      setYItems,
      setLevelInfo,
      setColumnScale,
      setRusablehMachine: orders => { yAxisScrollArea.setRusablehMachine(orders)},
      setEditOrders: yAxisStickArea.setEditOrders,
      setEditYItems: yAxisScrollArea.setEditYItems,
      getScrollArea: yAxisScrollArea.getArea,
      getScrollSize: yAxisScrollArea.getSize,
      getMouseYIndex
    }
  }
  // xAxisItem
  const createXAxis = () => {
    const initcanvasX = () => yAxis.getArea().right
    const initHeight = () => {
      const newHeight = levelHeight * (upperLevelIndexs.value.length + 1)
      const minHeight = levelHeight * 2
      areaHeight = (newHeight > minHeight) ? newHeight : minHeight
    }
    const initWidth = () => Math.ceil(getCanvasSize().width - canvasX - (canvasPadding.right))

    const hasUpperTime = timeLevelIndex => {
      return upperLevelIndexs.value.some(index => index > timeLevelIndex)
    }

    const createTimeGroup = () => {
      const getDayText = dayjs => {
        const day = dayjs.day()
        const i18nKey = 'datetime-abbr-day-' + day
        return objectController.i18n.getTranslate(i18nKey)
        // switch (day) {
        //   case 0: return '日'
        //   case 1: return '一'
        //   case 2: return '二'
        //   case 3: return '三'
        //   case 4: return '四'
        //   case 5: return '五'
        //   case 6: return '六'
        // }
      }
      const getMonthText = dayjs => {
        const month = dayjs.month() + 1 // index:0~11 -> month:1~12
        const i18nKey = 'datetime-abbr-month-' + month
        return objectController.i18n.getTranslate(i18nKey)
      }
      const getQuarterText = dayjs => {
        const month = dayjs.month()
        const quarter = Math.floor(month / 3) + 1 // index:0~3 -> quarter:1~4
        const i18nKey = 'datetime-abbr-quarter-' + quarter
        return objectController.i18n.getTranslate(i18nKey)
      }
      const getYearHalfText = dayjs => {
        const month = dayjs.month()
        const yearhalf =  Math.floor(month / 6) + 1 // index:0~1 -> yearhalf:1~2
        const i18nKey = 'datetime-abbr-yearhalf-' + yearhalf
        return objectController.i18n.getTranslate(i18nKey)
      }
      const getYearText = dayjs => {
        return dayjs.format('YYYY')
      }
      // 計算區間總秒數
      const computeTimeRange = (year, month, day, hour, min) => {
        const timeScale = [
          [year ?? 0, 12],
          [month ?? 0, 30],
          [day ?? 0, 24],
          [hour ?? 0, 60],
          [min ?? 0, 60]
        ]
        return timeScale.reduce((total, scale) => {
          return (total + scale[0]) * scale[1]
        }, 0)
      }


      return [
        // level 0 每小時
        {
          get name () { return objectController.i18n.getTranslate('datetime-abbr-hour')},
          groupLevel: 0,
          timeRange: computeTimeRange(0, 0, 0, 1, 0),
          timeAdjustment: 0,
          baseWidth: 20,
          secondWidth: 20 / computeTimeRange(0, 0, 0, 1, 0),
          getStartTime (timeValue) {
            const startDayjs =  computeAddTime(limitStartTime, timeValue, 'seconds').startOf('hour')
            const startTime = startDayjs.diff(limitStartTime, 'second')
            return startTime
          },
          getDuration () {
            return this.timeRange
          },
          // upperText () {},
          baseText (timeValue) {
            const startTime = computeAddTime(limitStartTime, timeValue, 'seconds')
            const scaleBaseWidth = computeScaleWidth(this.baseWidth)
            if(scaleBaseWidth > 35) return startTime.format('HH:mm') //01:00
            return startTime.format('HH') //01
          },
          setTimeAdjustment () {
            const baseTime = dayjs(limitStartTime).startOf('hour')
            this.timeAdjustment = dayjs(baseTime).diff(limitStartTime, 'second')
          }
        },
        // level 1 每天
        {
          get name () { return objectController.i18n.getTranslate('datetime-abbr-day')},
          groupLevel: 1,
          timeRange: computeTimeRange(0, 0, 1, 0, 0),
          timeAdjustment: 0,
          baseWidth: 40,
          secondWidth: 40 / computeTimeRange(0, 0, 1, 0, 0),
          getStartTime (timeValue) {
            const startDayjs = computeAddTime(limitStartTime, timeValue, 'seconds').startOf('day')
            const startTime = startDayjs.diff(limitStartTime, 'second')
            return startTime
          },
          getDuration () {
            return this.timeRange
          },
          baseText (timeValue) {
            const startDayjs = computeAddTime(limitStartTime, timeValue, 'seconds')

            const scaleBaseWidth = computeScaleWidth(this.baseWidth)
            if(scaleBaseWidth > 60) return `${startDayjs.format('MM.DD')} (${getDayText(startDayjs)})` //01.31 (一)
            return `${startDayjs.format('MM.DD')}` // 01.31
            // return `${getDayText(startDayjs)}`
          },
          upperText (timeValue) {
            const startDayjs = computeAddTime(limitStartTime, timeValue, 'seconds')

            const yearText = startDayjs.format('YYYY')
            const rangeText = `${startDayjs.format('MM.DD')} (${getDayText(startDayjs)})`
            if(hasUpperTime(1)) return rangeText
            return  `${yearText} ${rangeText}`


            // return startDayjs.format('MM.DD') + ' ' + getDayText(startDayjs)
          },
          setTimeAdjustment () {
            const baseTime = dayjs(limitStartTime).startOf('day')
            this.timeAdjustment = dayjs(baseTime).diff(limitStartTime, 'second')
          }
        },
        // level 2 每周
        {
          get name () { return objectController.i18n.getTranslate('datetime-abbr-week')},
          groupLevel: 2,
          timeRange: computeTimeRange(0, 0, 7, 0, 0),
          timeAdjustment: 0,
          baseWidth: 40,
          secondWidth: 40 / computeTimeRange(0, 0, 7, 0, 0),
          getStartTime (timeValue) {
            const startDayjs =  computeAddTime(limitStartTime, timeValue, 'seconds').startOf('week')
            const startTime = startDayjs.diff(limitStartTime, 'second')
            return startTime
          },
          getDuration () {
            return this.timeRange
          },
          baseText (startTime) {
            const start = computeAddTime(limitStartTime, startTime, 'seconds')
            const end = computeAddTime(limitStartTime, startTime + (this.getDuration() - 1), 'seconds')

            const scaleBaseWidth = computeScaleWidth(this.baseWidth)
            if(scaleBaseWidth > 100) return `W${getWeekOfYear(start)} ${start.format('MM.DD')} ~ ${end.format('MM.DD')}`
            else if(scaleBaseWidth > 70)  return `W${getWeekOfYear(start)} ${start.format('MM.DD')} ~`
            else return `W${getWeekOfYear(start)}`
          },
          upperText (startTime) {
            const start = computeAddTime(limitStartTime, startTime, 'seconds')
            const end = computeAddTime(limitStartTime, startTime + (this.getDuration() - 1), 'seconds')
            const yearText = getYearText(start)
            const rangeText = `W${getWeekOfYear(start)} ${start.format('MM.DD')} ~ ${end.format('MM.DD')}`
            if(hasUpperTime(2)) return rangeText
            return  `${yearText} ${rangeText}`
          },
          setTimeAdjustment () {
            const baseTime = dayjs(limitStartTime).startOf('week')
            this.timeAdjustment = dayjs(baseTime).diff(limitStartTime, 'second')
          }
        },
        // level 3 每月
        {
          get name () { return objectController.i18n.getTranslate('datetime-abbr-month')},
          groupLevel: 3,
          timeRange: computeTimeRange(0, 1, 0, 0, 0),
          timeAdjustment: 0,
          baseWidth: 40,
          secondWidth: 40 / computeTimeRange(0, 1, 0, 0, 0),
          getStartTime (timeValue) {
            const startDayjs =  computeAddTime(limitStartTime, timeValue, 'seconds').startOf('month')
            const startTime = startDayjs.diff(limitStartTime, 'second')
            return startTime
          },
          getDuration (time) {
            const dayjs =  computeAddTime(limitStartTime, time, 'seconds')
            const startDayjs = dayjs.startOf('month')
            const endDayjs = dayjs.endOf('month')
            return endDayjs.diff(startDayjs, 'seconds') + 1 // endjs diff完結果會與完整天數差1秒
          },
          baseText (startTime) {
            const dayjs = computeAddTime(limitStartTime, startTime + 1, 'seconds')
            // return  dayjs.format('YYYY.MM')
            const yearText = getYearText(dayjs)
            const rangeText = getMonthText(dayjs) //.format('M') + '月'
            if(hasUpperTime(3)) return rangeText

            const scaleBaseWidth = computeScaleWidth(this.baseWidth)
            if(scaleBaseWidth > 60) return `${yearText} ${rangeText}`
            return `${rangeText}`
          },
          upperText (startTime) {
            const dayjs = computeAddTime(limitStartTime, startTime + 1, 'seconds')
            // return  dayjs.format('YYYY.MM')
            const yearText = getYearText(dayjs)
            const rangeText = getMonthText(dayjs)
            if(hasUpperTime(3)) return rangeText
            return  `${yearText} ${rangeText}`
          },
          setTimeAdjustment () {
            const baseTime = dayjs(limitStartTime).startOf('month')
            this.timeAdjustment = dayjs(baseTime).diff(limitStartTime, 'second')
          }
        },
        // level 4 每季
        {
          get name () { return objectController.i18n.getTranslate('datetime-abbr-quarter')},
          groupLevel: 4,
          timeRange: computeTimeRange(0, 3, 0, 0, 0),
          timeAdjustment: 0,
          baseWidth: 50,
          secondWidth: 50 / computeTimeRange(0, 3, 0, 0, 0),
          getStartTime (timeValue) {
            const startDayjs = computeAddTime(limitStartTime, timeValue, 'seconds')
            const month = startDayjs.month()
            const quarter = Math.floor(month / 3)
            const startMonth = quarter * 3
            const startQuarterDayjs =  startDayjs.month(startMonth).startOf('month')

            const startTime = startQuarterDayjs.diff(limitStartTime, 'second')
            return startTime
          },
          getDuration (time) {
            const dayjs =  computeAddTime(limitStartTime, time, 'seconds')

            const month = dayjs.month()
            const quarter = Math.floor(month / 3)
            const startMonth = quarter * 3
            const startQuarterDayjs =  dayjs.month(startMonth).startOf('month')
            const endMonth = startMonth + 2
            const endQuarterDayjs =  dayjs.month(endMonth).endOf('month')

            return endQuarterDayjs.diff(startQuarterDayjs, 'seconds') + 1 // endjs diff完結果會與完整天數差1秒
          },
          baseText (startTime) {
            const dayjs = computeAddTime(limitStartTime, startTime, 'seconds')

            const yearText = getYearText(dayjs)
            const rangeText = getQuarterText(dayjs)

            if(hasUpperTime(4)) return rangeText

            const scaleBaseWidth = computeScaleWidth(this.baseWidth)
            if(scaleBaseWidth > 60) return `${yearText} ${rangeText}`
            return `${rangeText}`
            // const end = computeAddTime(limitStartTime, startTime + (this.getDuration(startTime) - 1), 'seconds')
            // return  `${start.format('YYYY.MM')} ~ ${end.format('MM')}`
          },
          upperText (startTime) {
            const dayjs = computeAddTime(limitStartTime, startTime, 'seconds')
            const yearText = getYearText(dayjs)
            const rangeText = getQuarterText(dayjs)

            if(hasUpperTime(4)) return rangeText
            return  `${yearText} ${rangeText}`
          },
          setTimeAdjustment () {
            const startDayjs = dayjs(limitStartTime)
            const month = startDayjs.month()
            const quarter = Math.floor(month / 3)
            const startMonth = quarter * 3
            const startQuarterDayjs =  startDayjs.month(startMonth).startOf('month')

            this.timeAdjustment = dayjs(startQuarterDayjs).diff(limitStartTime, 'second')
          }
        },
        // level 5 半年
        {
          get name () { return objectController.i18n.getTranslate('datetime-abbr-yearhalf')},
          groupLevel: 5,
          timeRange: computeTimeRange(0, 6, 0, 0, 0),
          timeAdjustment: 0,
          baseWidth: 50,
          secondWidth: 50 / computeTimeRange(0, 6, 0, 0, 0),
          getStartTime (timeValue) {
            const startDayjs = computeAddTime(limitStartTime, timeValue, 'seconds')
            const month = startDayjs.month()
            const quarter = Math.floor(month / 6)
            const startMonth = quarter * 6
            const startQuarterDayjs =  startDayjs.month(startMonth).startOf('month')

            const startTime = startQuarterDayjs.diff(limitStartTime, 'second')
            return startTime
          },
          getDuration (time) {
            const dayjs =  computeAddTime(limitStartTime, time, 'seconds')

            const month = dayjs.month()
            const quarter = Math.floor(month / 6)
            const startMonth = quarter * 6
            const startQuarterDayjs =  dayjs.month(startMonth).startOf('month')
            const endMonth = startMonth + 5
            const endQuarterDayjs =  dayjs.month(endMonth).endOf('month')

            return endQuarterDayjs.diff(startQuarterDayjs, 'seconds') + 1 // endjs diff完結果會與完整天數差1秒
          },
          baseText (startTime) {
            const dayjs = computeAddTime(limitStartTime, startTime, 'seconds')
            const yearText = getYearText(dayjs)
            const rangeText = getYearHalfText(dayjs)

            if(hasUpperTime(5)) return rangeText
            const scaleBaseWidth = computeScaleWidth(this.baseWidth)
            if(scaleBaseWidth > 60) return `${yearText} ${rangeText}`
            return `${rangeText}`
          },
          upperText (startTime) {
            const dayjs = computeAddTime(limitStartTime, startTime, 'seconds')
            const yearText = getYearText(dayjs)
            const rangeText = getYearHalfText(dayjs)

            if(hasUpperTime(5)) return rangeText
            return  `${yearText} ${rangeText}`
          },
          setTimeAdjustment () {
            const startDayjs = dayjs(limitStartTime)
            const month = startDayjs.month()
            const quarter = Math.floor(month / 6)
            const startMonth = quarter * 6
            const startQuarterDayjs =  startDayjs.month(startMonth).startOf('month')

            this.timeAdjustment = dayjs(startQuarterDayjs).diff(limitStartTime, 'second')
          }
        },
        // level 6 每年
        {
          get name () { return objectController.i18n.getTranslate('datetime-abbr-year')},
          groupLevel: 6,
          timeRange: computeTimeRange(1, 0, 0, 0, 0),
          timeAdjustment: 0,
          baseWidth: 60,
          secondWidth: 60 / computeTimeRange(1, 0, 0, 0, 0),
          getStartTime (timeValue) {
            const startDayjs =  computeAddTime(limitStartTime, timeValue, 'seconds').startOf('year')
            const startTime = startDayjs.diff(limitStartTime, 'second')
            return startTime
          },
          getDuration (time) {
            const dayjs =  computeAddTime(limitStartTime, time, 'seconds')
            const startDayjs = dayjs.startOf('year')
            const endDayjs = dayjs.endOf('year')
            return endDayjs.diff(startDayjs, 'seconds') + 1
          },
          baseText (startTime) {
            const dayjs = computeAddTime(limitStartTime, startTime, 'seconds')
            const yearText = getYearText(dayjs)
            return  yearText
          },
          upperText (startTime) {
            const dayjs = computeAddTime(limitStartTime, startTime, 'seconds')
            const yearText = getYearText(dayjs)
            return  yearText
          },
          setTimeAdjustment () {
            const baseTime = dayjs(limitStartTime).startOf('year')
            this.timeAdjustment = dayjs(baseTime).diff(limitStartTime, 'second')
          }
        }

      ]
    }

    let canvasX = initcanvasX()
    const canvasY = canvasPadding.top


    const baseLevelIndex = computed({
      get: () => ganttData.baseLevelIndex,
      set: index =>  ganttData.baseLevelIndex = index
    })
    const upperLevelIndexs = computed(() => {
      return ganttData.activeLevelIndexs.filter(
        leveIndex => leveIndex > ganttData.baseLevelIndex
      )
    })


    let gridStartTime = 0
    const levelHeight = 25
    const levelNameWidth = 25

    let areaHeight = 50
    let areaWidth = initWidth()
    initHeight()

    const widthScale = computed({
      get: () => {
        return minWidthScale + ganttData.zoomRate * (maxWidthScale - minWidthScale)
      },
      set: value => {
        const newRate =  (value - minWidthScale) / (maxWidthScale - minWidthScale)
        objectController.zoomView.setZoomRate(newRate)
      }
    })

    // let widthScale = 1
    const maxWidthScale = 50
    const minWidthScale = 1

    let scrollStartTime
    let scrollEndTime

    // let gridEndTime = 0
    const timeGroups = createTimeGroup() // 時間區間層級

    const hoverInfo = {
      type: '', // upper or base
      data: null //timevalue(seconds)
    }


    // 取得Grid顯示中的最晚時間點(seconds)
    const getGridEndTime = () => {
      const timeLevel = timeGroups[baseLevelIndex.value]
      return gridStartTime + (areaWidth / computeScaleWidth(timeLevel.secondWidth))
    }

    // Compute Value
    const computeScaleWidth = value => {
      return widthScale.value * value
    }
    // 相對於limitStartTime的時間長度
    type ComputeTimeValue = 'string' | 'width' | 'gridX' | 'xCoordinate' | 'scrollRate' | 'timeRange'
    const computeTimeValue = (value, type:ComputeTimeValue) => {
      const timeLevel = timeGroups[baseLevelIndex.value]
      switch (type) {
        case 'string' : {
          const timeValue = dayjs(value).diff(limitStartTime, 'second')
          return timeValue
        }
        case 'width': {
          return value / computeScaleWidth(timeLevel.secondWidth)
        }
        case 'gridX':
        case 'xCoordinate' : {
          // value = width
          return value / computeScaleWidth(timeLevel.secondWidth) + gridStartTime
        }
        case 'scrollRate' : {
          const startTime = scrollStartTime ?? limitStartTime
          const endTime = scrollEndTime ?? limitEndTime
          const startTimeValue = dayjs(startTime).diff(limitStartTime, 'second')

          return startTimeValue + dayjs(endTime).diff(startTime, 'second') * value
        }
        case 'timeRange': {
          const { startTime, endTime } = value
          const timeValue = dayjs(endTime).diff(startTime, 'second')
          return timeValue
        }
      }

    }
    // 計算時間區段的開始時間
    const computeRangeStartTime = (value, type, level?) => {
      const timeLevel = level ? timeGroups[level] : timeGroups[baseLevelIndex.value]
      switch (type) {
        case 'timeValue': return timeLevel.getStartTime(value) //.floor(value / timeLevel.timeRange) * timeLevel.timeRange
        case 'xCoordinate': {
          const timeValue = computeTimeValue(value, 'xCoordinate')
          return computeRangeStartTime(timeValue, 'timeValue', timeLevel)//Math.floor(timeValue / timeLevel.timeRange) * timeLevel.timeRange
        }
      }
    }
    // 計算時間在grid的X座標
    const computeXAxisCoordinate = (value, type) => {
      switch (type) {
        case 'string' : {
          const timeValue = (dayjs(value).diff(limitStartTime, 'second') - gridStartTime)
          const timeWidth = computeTimeWidth(timeValue)

          return canvasX + timeWidth
        }
        case 'second': {
          const timeValue = value - gridStartTime
          const timeWidth = computeTimeWidth(timeValue)
          return canvasX + timeWidth
        }
      }

    }
    // 計算時間在grid的寬度
    const computeTimeWidth = (second:number) => {
      const timeLevel = timeGroups[baseLevelIndex.value]
      const timeWidth = second * timeLevel.secondWidth
      return computeScaleWidth(timeWidth)
    }

    const computeAllTimeWidth = (time:number) => {
      return timeGroups.map(timeLevel => {
        const timeWidth = time * timeLevel.secondWidth
        return timeWidth
      })
    }

    const isHoverTimeRange = (item, levelIndex) => {
      const { startTime, duration } = item

      switch (hoverInfo.type) {
        case 'time':
        case 'timeUnit': {
          if(levelIndex !== hoverInfo.data.levelIndex) return false

          const range = { min: startTime, max: startTime + duration }
          return isInRange(hoverInfo.data.timeValue, range, 'value')
        }
        default: return false
      }

    }

    const setHoverInfo = (type, value?) => {
      switch (type) {
        case 'clear' : {
          hoverInfo.type = ''
          hoverInfo.data = 0
          break
        }
        case 'timeUnit':
        case 'time': {
          hoverInfo.type = type
          hoverInfo.data = value
          break
        }
        case 'upper':
        case 'base': {
          hoverInfo.type = type
          hoverInfo.data = value
          break
        }
      }
    }

    const init = () => {
      canvasX = initcanvasX()
      areaWidth = initWidth()
      initHeight()
      gridStartTime = xAxisController.getScrollTime()
      // console.log('scrollTime', xAxisController.getScrollTime())
      timeGroups.forEach(level => {
        level.setTimeAdjustment()
      })
    }


    const xAxisReset = (type:string) => {
      switch (type) {
        case 'size': {
          canvasX = initcanvasX()
          areaWidth = initWidth()
          initHeight()
          break
        }
        case 'scroll': {
          gridStartTime = xAxisController.getScrollTime()
          break
        }
      }
    }






    const checkEvent = (event:MouseEvent) => {
      setHoverInfo('clear')
      const getTimeLevelY = () => {
        const { offsetY } = event
        const levelY = getRangeFloor(offsetY - canvasY, levelHeight) + canvasY
        // console.log(levelY)
        return levelY
      }
      const getTimeLevelIndex = () => {
        const { offsetY } = event
        // const relativeX = offsetX - canvasX
        const effectUpperLevelIndexs = upperLevelIndexs.value
        const effectUpperLevelCount = effectUpperLevelIndexs.length

        const relativeY = offsetY - canvasY
        const levelCount =  Math.floor(relativeY / levelHeight)
        if(levelCount >= effectUpperLevelCount) return baseLevelIndex.value

        const upperIndex = upperLevelIndexs.value[effectUpperLevelCount - levelCount - 1]
        return upperIndex
      }

      switch(event.type) {
        case 'click': {
          if(!canvasInfo.isHover) break
          if(!isInArea(event, getArea())) break
          if(isInArea(event, getArea('levelNames'))) {
            // const levelIndex  = getTimeLevelIndex()
            // const levelY = getTimeLevelY()

            // const timeLevel = timeGroups[levelIndex]
            // const messageX = getArea('levelNames').left
            // // console.log(event.offsetX, messageX)
            // const messageY = levelY + levelHeight / 4
            // setMessage('editTimeLevel', messageX, messageY, timeLevel)
          }
          break
        }
        case 'dblclick': {
          if(!canvasInfo.isHover) break
          if (!isInArea(event, getArea())) break

          const { offsetX, offsetY } = event
          const curTimeValue = computeTimeValue(offsetX - canvasX, 'xCoordinate')
          const levelIndex  = getTimeLevelIndex()
          const nextLevelIndex =  getValueInRange(levelIndex, 0, timeGroups.length - 2)

          if (nextLevelIndex === baseLevelIndex.value) {
            const nextStartTime = computeRangeStartTime(curTimeValue, 'timeValue', baseLevelIndex.value)
            setBaseLevel(nextLevelIndex, nextStartTime)
          }
          else {
          // else if(nextLevelIndex !== baseLevelIndex.value) {
            const computeNextStartTime = () => {
              if (nextLevelIndex > baseLevelIndex.value) {
                  const upperStartTime = computeRangeStartTime(curTimeValue, 'timeValue', nextLevelIndex)
                  return upperStartTime
                  // const nextUpperStartTime = computeRangeStartTime(upperStartTime, 'timeValue', nextLevelIndex + 1)
                  // return nextUpperStartTime
               }
               else {
                  const baseStartTime = computeRangeStartTime(curTimeValue, 'timeValue', baseLevelIndex.value)
                  return baseStartTime
               }
            }
            const nextStartTime = computeNextStartTime()
            // console.log(nextLevelIndex, nextStartTime)
            setBaseLevel(nextLevelIndex, nextStartTime)
          }

          break
        }
        case 'mousemove': {
          const { offsetX, offsetY } = event
          if(!canvasInfo.isHover) break
          if (isInArea(event, getArea('timeUnits'))) {
            const nextLevel =  baseLevelIndex.value + ((offsetY - canvasY) > 30 ? -1 : 1)
            if(nextLevel >= 0 && nextLevel < timeGroups.length - 1) {
              cursorType.value = 'pointer'
            }

            const timeValue = computeTimeValue(offsetX - canvasX, 'xCoordinate')
            const levelIndex = getTimeLevelIndex()

            setHoverInfo('timeUnit', { levelIndex, timeValue})
          }
          else {
            const timeValue = computeTimeValue(offsetX - canvasX, 'xCoordinate')
            const levelIndex = baseLevelIndex.value
            setHoverInfo('time', { levelIndex, timeValue})
          }

          break
        }
      }

    }


    //DrawXAxis
    const drawArea = () => {
        // Draw Border
        const borderX = canvasX
        const borderY = canvasY
        const bottom = canvasY + areaHeight

        ctx.save()
        setStyle('upperLevelBack')
        drawRect(borderX, borderY, areaWidth, areaHeight, 'block')
        const upperLevelCount = upperLevelIndexs.value.length
        for (let i = 1; i < upperLevelCount ; i++ ) {
          const lineY = borderY + i * levelHeight
          drawLine(borderX, lineY, areaWidth, 0)
        }
        setStyle('baseLevelBack')
        drawRect(borderX, bottom - levelHeight, areaWidth, levelHeight, 'block')

        ctx.restore()
        // Draw Level
        ctx.save()
        setStyle('standardLine')

        const gridHeight = ganttGrid.getSize().height
        clipRect(borderX, borderY, areaWidth, areaHeight + gridHeight)


        const baseLevel = timeGroups[baseLevelIndex.value]
        // const upperLevel = timeGroups[baseLevelIndex + 1]
        const upperLevels = upperLevelIndexs.value.map(index => timeGroups[index])

        const gridTimeRange = areaWidth / baseLevel.secondWidth
        const gridEndTime = gridStartTime + gridTimeRange

        const setBaseItems = () => {
          const startTime = baseLevel.getStartTime(gridStartTime)
          const baseItems = []
          let itemStartTime = startTime //number
          let itemStartX = computeXAxisCoordinate(startTime, 'second')

          do {
            const itemDuration = baseLevel.getDuration(itemStartTime)
            const itemWidth = computeScaleWidth(baseLevel.secondWidth) * itemDuration
            baseItems.push ({
              startTime: itemStartTime,
              startX: itemStartX,
              duration: itemDuration,
              width: itemWidth
            })
            // set NextItem
            itemStartTime = itemStartTime + itemDuration
            itemStartX = itemStartX + itemWidth
          } while (itemStartTime < gridEndTime)

            return baseItems
        }
        const setUpperItems = (upperLevel) => {
          // console.log('UPPER', upperLevel)
          const startTime = upperLevel.getStartTime(gridStartTime)
          const upperItems = []
          let itemStartTime = startTime //number
          let itemStartX = computeXAxisCoordinate(startTime, 'second')

          // console.log('STARTX', itemStartX)
          do {
            const itemDuration = upperLevel.getDuration(itemStartTime)
            // const durationScale = itemDuration / baseLevel.getDuration(itemStartTime)
            // console.log(durationScale)
            const itemWidth = computeScaleWidth(baseLevel.secondWidth) * itemDuration

            upperItems.push ({
              startTime: itemStartTime,
              startX: itemStartX,
              duration: itemDuration,
              width: itemWidth
            })
            // set NextItem
            itemStartTime = itemStartTime + itemDuration
            itemStartX = itemStartX + itemWidth
          } while (itemStartTime < gridEndTime)
          return upperItems
        }
        const upperLevelsItems = upperLevels.map(upperLevel => setUpperItems(upperLevel))
        const baseItems = setBaseItems()

        const drawUpperItems = () => {
          ctx.save()
          setStyle('xAxisUpperText')
          setStyle('standardLine')

          upperLevelsItems.forEach((levelItem, index) => {
            const startY = bottom - levelHeight * (index + 2)
            levelItem.forEach(item => {
              const { startTime, startX, width } = item
              const lineX = startX
              const lineY = startY
              const lineWidth = 0
              const lineHeight = levelHeight
               //text
              const padding = 15
              const levelIndex = upperLevels[index].groupLevel
              const text = upperLevels[index].upperText(startTime)
              const textX = padding + ((startX < canvasX) ? canvasX : startX)
              const textY = startY + lineHeight / 2 + 1

              if(isHoverTimeRange(item, levelIndex)) {
                ctx.save()
                clipRect(startX, startY, width, levelHeight)
                setStyle('hoverUpperTimeBack')
                drawRect(startX, startY, width, levelHeight, 'fill')
                setStyle('hoverTimeEffect')
                drawRect(startX, startY, width, levelHeight, 'stroke')
                ctx.restore()
              }

              drawLine(lineX, lineY, lineWidth, lineHeight)
              ctx.save()
              clipRect(startX, startY, width, levelHeight)
              drawText(text, textX, textY)
              ctx.restore()
            })
          })


          // upperItems.forEach(item => {
          //   const { startTime, startX, width } = item
          //   const lineX = startX
          //   const lineY = startY
          //   const lineWidth = 0
          //   const lineHeight = levelHeight
          //    //text
          //   const padding = 15
          //   const text = upperLevel.upperText(startTime)
          //   const textX = padding + ((startX < canvasX) ? canvasX : startX)
          //   const textY = startY + lineHeight / 2 + 1

          //   if(isHoverTimeRange(item, 'upper')) {
          //     ctx.save()
          //     clipRect(startX, startY, width, levelHeight)
          //     setStyle('hoverUpperTimeBack')
          //     drawRect(startX, startY, width, levelHeight, 'fill')
          //     setStyle('hoverTimeEffect')
          //     drawRect(startX, startY, width, levelHeight, 'stroke')
          //     ctx.restore()
          //   }


          //   drawLine(lineX, lineY, lineWidth, lineHeight)
          //   ctx.save()
          //   clipRect(startX, startY, width, levelHeight)
          //   drawText(text, textX, textY)
          //   ctx.restore()
          // })
          ctx.restore()
        }
        const drawBaseItems = () => {
          ctx.save()
          setStyle('xAxisBaseText')
          const startY = bottom - levelHeight
          baseItems.forEach(item => {
            const { startTime, startX, width } = item
            // line
            const lineX = startX
            const lineY = startY
            const lineWidth = 0
            const lineHeight = levelHeight
             // text
            const text = baseLevel.baseText(startTime)
            const textX = startX + width / 2
            const textY = startY + lineHeight / 2 + 1

            if(isHoverTimeRange(item, baseLevelIndex.value)) {
              ctx.save()
              clipRect(startX, startY, width, levelHeight)
              setStyle('hoverBaseTimeBack')
              drawRect(startX, startY, width, levelHeight, 'fill')
              setStyle('hoverTimeEffect')
              drawRect(startX, startY, width, levelHeight, 'stroke')
              ctx.restore()
            }
            setStyle('standardLine')
            drawLine(lineX, lineY, lineWidth, lineHeight)
            drawText(text, textX, textY)

            // setStyle('lightLine')
            // drawLine(lineX, lineY + lineHeight, lineWidth, gridHeight)


          })
          ctx.restore()
        }
        const drawLevelName = () => {
          const lineX = borderX + areaWidth - (levelNameWidth)
          const nameX = borderX + areaWidth - (levelNameWidth / 2)

          drawLine(lineX, borderY, 0, areaHeight)

          ctx.save()
          setStyle('xAxisNameText')
          drawText(timeGroups[baseLevelIndex.value].name, nameX, bottom - ( 0.5) * levelHeight)
          const effecUpperLevelIndexs = upperLevelIndexs.value
          const effecUpperLevelCount = effecUpperLevelIndexs.length

          for (let i = 0; i < effecUpperLevelCount ; i++ ) {
            const nameY = bottom - ( i + 1.5) * levelHeight
            const upperLevelIndex = effecUpperLevelIndexs[i]
            drawText(timeGroups[upperLevelIndex].name, nameX, nameY)
            // console.log(nameX, nameY,  )
          }
          ctx.restore()
        }


        drawLevelName()
        clipRect(borderX, borderY, areaWidth - levelNameWidth, areaHeight + gridHeight)
        drawUpperItems()
        drawBaseItems()

        ctx.restore()

        const drawGridIndicate = () => {
          if(!dragItem.value) return
          if(dragItem.value.type !== 'orders') return

          const indicateTime = useExpectTime ? mouseInfo.time : dragItem.value.data[0].startTimeValue
          const indicateX =  computeXAxisCoordinate(indicateTime, 'second')
          const indicateY = canvasY
          const path = [
            [indicateX, indicateY],
            [indicateX, indicateY + areaHeight + gridHeight]
          ]
          drawDashPath(path)
        }

        // draw TimeMark
        ctx.save()
        clipRect(borderX, borderY, areaWidth - levelNameWidth, areaHeight + gridHeight)

        setStyle('timeMarkLine')
        setStyle('timeMarkText')
        // setStyle('timeMarkBack')
        ganttData.timeMarks.forEach(timeMark => {
          if(!timeMark.display) return
          const { displayHeader, timeValue, color, label } = timeMark
          const markX = computeXAxisCoordinate(timeValue, 'string')
          ctx.strokeStyle = color
          drawLine(markX, borderY, 0, areaHeight + gridHeight)

          if (displayHeader) {
            const textWidth = ctx.measureText(label).width
            ctx.fillStyle = color
            drawRect(markX, borderY + levelHeight * 0.1, textWidth + 10, levelHeight * 0.8, 'fill')
            // ctx.fillStyle = 'rgba(255,255,255, 0.9)'
            // drawRect(markX, borderY + levelHeight * 0.1, textWidth + 10, levelHeight * 0.8, 'block')
            ctx.fillStyle = 'white'
            drawText(label, markX + 5, borderY + levelHeight * 0.5)
          }
          // levelHeight
        })

        setStyle('dragIndicate')
        drawGridIndicate()
        ctx.restore()
    }
    // set params
    const setBaseLevel = (nextLevelIndex, nextStartTime) => {
      const baseIndex = baseLevelIndex.value
      gridStartTime = nextStartTime
      if(baseIndex !== nextLevelIndex) {
        baseLevelIndex.value = nextLevelIndex
        widthScale.value = 1
        const upperTimeLevel = timeGroups[nextLevelIndex + 1]
        const upprtTimeRange = upperTimeLevel.getDuration(nextStartTime)
        const upperTimeWidth = computeTimeWidth(upprtTimeRange)
        const nextWidthScale = areaWidth / upperTimeWidth
        widthScale.value = getValueInRange(nextWidthScale, minWidthScale, maxWidthScale)
      }

      // const rate = computeTimeWidth(nextStartTime) / getScrollTimeWidth()

      resetCanvas('size')
      xAxisController.setXScroll(nextStartTime, 'timeValue')

    }
    const setGridStartTime = (newTime:number) => {
      gridStartTime = newTime
    }

    const setWidthScale = value => {
      const nextWidthScale = widthScale.value + value
      if(nextWidthScale > maxWidthScale) widthScale.value = maxWidthScale
      else if (nextWidthScale < minWidthScale) widthScale.value = minWidthScale
      else  widthScale.value = nextWidthScale

      // console.log(widthScale)

      xAxisController.init()
      // xAxisReset()

      // drawCanvas()
    }
    const setScrollTimeRange = (newStartTime, newEndTime) => {
      scrollStartTime = newStartTime
      scrollEndTime = newEndTime

      objectController.overView.setScrollTimeRange([
        computeTimeValue(scrollStartTime, 'string'),
        computeTimeValue(scrollEndTime, 'string')
      ])
    }

    // 切換階層或模式時調整時間範圍
    const setAdjustTime = timeRange => {
      const timeSeconds = computeTimeValue(timeRange, 'timeRange')
      const levelsBaseWidth = computeAllTimeWidth(timeSeconds)

      const applyWidth = (() => {
        const value = ganttGrid.getSize().width - 20
        if(value < 0) return 20
        else return value
      })() // * 0.9
      const paddingWidth =  10 //ganttGrid.getSize().width * 0.05

      // console.log(applyWidth, levelsBaseWidth)
      const getLevelIndex = () => {
        const levelIndex = levelsBaseWidth.findIndex( baseWidth => {
          return baseWidth < applyWidth
        })

        if(levelIndex < 0) return timeGroups.length - 2 //避免upperLevel找不到
        else if (levelIndex >= levelsBaseWidth.length - 1)  return timeGroups.length - 2
        else return levelIndex
      }
      const levelIndex = getLevelIndex()

      const getApplyScale = () => {
        const scale = applyWidth / levelsBaseWidth[levelIndex]
        if(scale > maxWidthScale) return maxWidthScale
        else if(scale < minWidthScale) return minWidthScale
        return scale
      }
      const applyScale = getApplyScale()
      // console.log('--------------------')
      // console.log(levelIndex, applyScale)

      baseLevelIndex.value = levelIndex
      widthScale.value = applyScale

      const startTimeValue = computeTimeValue(timeRange.startTime, 'string')
      const paddingTimeValue = computeTimeValue(paddingWidth, 'width')
      const nextGridStartTime = startTimeValue - paddingTimeValue
      // console.log(startTimeValue, paddingTimeValue)
      // console.log(startTimeValue, paddingTimeValue)

      gridStartTime = nextGridStartTime > 0 ? nextGridStartTime : 0



      switch (ganttData.mode) {
        case 'result':
        case 'view': {
          const newScrollStartTime = computeAddTime(limitStartTime, gridStartTime,  'second').format('YYYY-MM-DD HH:mm:ss')
          const newScrollEndTime = computeAddTime(timeRange.endTime, paddingTimeValue,  'second').format('YYYY-MM-DD HH:mm:ss')
          setScrollTimeRange(newScrollStartTime, newScrollEndTime)
          break
        }
        case 'edit': {
          setScrollTimeRange(limitStartTime, limitEndTime)
          break
        }
      }


      // console.log(timeRange, [limitStartTime, limitEndTime])
      // console.log(computeAddTime(limitStartTime, gridStartTime, 'seconds').format('YYYY-MM-DD HH:mm:ss'))

      // xAxisController.setXScroll(gridStartTime, 'timeValue')
      initHeight()
      resetCanvas('size')

    }

    type XAxisArea = 'levelNames' | 'timeUnits' | null
    const getArea = (areaType?:XAxisArea) => {
      switch (areaType) {
        case 'levelNames': return {
          left: canvasX + areaWidth - levelNameWidth,
          right: canvasX + areaWidth,
          top: canvasY,
          bottom: canvasY + areaHeight
        }
        case 'timeUnits': return {
          left: canvasX,
          right: canvasX + areaWidth - levelNameWidth,
          top: canvasY,
          bottom: canvasY + areaHeight
        }
        case null: return {
          left: canvasX,
          right: canvasX + areaWidth,
          top: canvasY,
          bottom: canvasY + areaHeight
        }
        default: return {
          left: canvasX,
          right: canvasX + areaWidth,
          top: canvasY,
          bottom: canvasY + areaHeight
        }
      }

    }
    const getSize = () => {
      return {
        width: areaWidth,
        height: areaHeight
      }
    }
    const getGridTime = type => {
      const gridEndTime = getGridEndTime()
      switch(type) {
        case 'dayjs' : return {
          gridStartTime: dayjs(limitStartTime).add(gridStartTime, 'second'),
          gridEndTime: dayjs(limitStartTime).add(gridEndTime, 'second')
        }
        case 'value': return {
          gridStartTime,
          gridEndTime
        }
      }
    }
    const getGridTimeValues = () => {
      const baseLevel = timeGroups[baseLevelIndex.value]
      const startTime = scrollStartTime ?? limitStartTime
      const endTime = scrollEndTime ?? limitEndTime
      const startTimeValue = computeTimeValue(startTime, 'string')
      let unitStartTimeValue =  baseLevel.getStartTime(startTimeValue)
      const endTimeValue = computeTimeValue(endTime, 'string')

      const gridTimeValue = []
      // let itemStartX = computeXAxisCoordinate(startTime, 'second')
      do {
        const unitDuration = baseLevel.getDuration(unitStartTimeValue)
        gridTimeValue.push(unitStartTimeValue)
        // set NextItem
        unitStartTimeValue = unitStartTimeValue + unitDuration
      } while (unitStartTimeValue < endTimeValue)

      return gridTimeValue
    }

    const getParams = type => {
      switch (type) {
        case 'gridStartTime': return gridStartTime
        case 'scrollTimeValue': {
          const startTimeValue =  dayjs(scrollStartTime ?? limitStartTime).diff(limitStartTime, 'second')
          const endTimeValue =  dayjs(scrollEndTime ?? limitEndTime).diff(limitStartTime, 'second')
          return [startTimeValue, endTimeValue]
        }
        case 'baseTimeWidth': {
          const timeLevel = timeGroups[baseLevelIndex.value]
          const timeWidth = timeLevel.baseWidth
          return computeScaleWidth(timeWidth)
        }
        // case 'baseTimeWidth': return computeScaleWidth(timeWidth)
      }
    }
    const getScrollTimeWidth = () => {
      const timeLevel = timeGroups[baseLevelIndex.value]

      const startTime = scrollStartTime ?? limitStartTime
      const endTime = scrollEndTime ?? limitEndTime

      const scrollTime = dayjs(endTime).diff(startTime, 'second')
      const scrollTimeWidth = scrollTime * computeScaleWidth(timeLevel.secondWidth)
      return scrollTimeWidth
    }
    const getGridX = () => {
      const baseLevel = timeGroups[baseLevelIndex.value]
      const gridTimeRange = areaWidth / baseLevel.secondWidth
      const gridEndTime = gridStartTime + gridTimeRange
      const startTime = baseLevel.getStartTime(gridStartTime)
      const gridX = []
      let itemStartTime = startTime //number
      let itemStartX = computeXAxisCoordinate(startTime, 'second')
      do {
        const itemDuration = baseLevel.getDuration(itemStartTime)
        const itemWidth = computeScaleWidth(baseLevel.secondWidth) * itemDuration
        gridX.push (itemStartX)
        // set NextItem
        itemStartTime = itemStartTime + itemDuration
        itemStartX = itemStartX + itemWidth
      } while (itemStartTime < gridEndTime)

      return gridX
    }
    const getMouseTime = event => {
      // if(!isInArea(event, getArea())) return null
      return computeTimeValue(event.offsetX - canvasX, 'xCoordinate')
    }
    type FocusType = 'mouse' | 'center'
    const getFocusTime = (type:FocusType) => {
      switch(type) {
        case 'center': {
          const baseLevel = timeGroups[baseLevelIndex.value]
          const centerTime = gridStartTime + (areaWidth / 2) / computeScaleWidth(baseLevel.secondWidth)
          return centerTime
        }
        case 'mouse':
        default: return mouseInfo.time
      }
    }
    const getFocusX = (focusTime:Number) => {
      const focusX = computeXAxisCoordinate(focusTime, 'second')
      // console.log([gridStartTime, focusTime, focusX])
      return focusX
    }

    return {
      checkEvent,
      drawArea,
      init,
      reset: xAxisReset,
      setBaseLevel,
      setGridStartTime,
      setWidthScale,
      setAdjustTime,
      getArea,
      getSize,
      getParams,
      getGridTime,
      getGridTimeValues,
      getGridX,
      getScrollTimeWidth,
      computeXAxisCoordinate,
      computeTimeValue,
      computeTimeWidth,
      getMouseTime,
      getFocusX,
      getFocusTime
    }
  }
  //xAxisController
  const createXAxisController = () => {
    const initcanvasX = () => yAxis.getArea().right
    const initcanvasY = () => yAxis.getArea().bottom - areaHeight
    const initWidth = () => xAxis.getSize().width
    const initScrollWidth = () => areaWidth - buttonWidth * 2
    const initBarWidth = () => {
      const xAxisScale = xAxis.getSize().width / xAxis.getScrollTimeWidth()
      return  (xAxisScale >= 1 ) ? scrollWidth : scrollWidth * xAxisScale
    }
    const initScrollMax = () => {
      return scrollWidth - barWidth
    }


    const areaHeight = 15
    const buttonWidth = 15
    let areaWidth = initWidth()
    let canvasX = initcanvasX()
    let canvasY = initcanvasY()
    let scrollWidth = initScrollWidth()
    let barWidth
    const scrollMin = 0
    let scrollMax
    let scrollValue = 0

    let isPressing = false

    let isDragging = false
    let dragAdjustment


    const setXScroll = async (value, type) => {
      switch (type) {
        case 'rate': {
          const nextScroll = value * scrollWidth
          scrollValue = getValueInRange(nextScroll, scrollMin, scrollMax )
          break
        }
        case 'drag': {
          if(!isDragging) return
          const nextScroll = value
          scrollValue = getValueInRange(nextScroll, scrollMin, scrollMax )
          break
        }
        case 'add': {
          if(!isPressing) return
          if (scrollValue >= scrollMax) return
          const nextScroll = scrollValue + value
          scrollValue = getValueInRange(nextScroll, scrollMin, scrollMax )

          setTimeout(() => {
            setXScroll(value, 'add')
          }, 100)
          break
        }
        case 'sub': {
          if(!isPressing) return
          if (scrollValue <= scrollMin) return
          const nextScroll = scrollValue - value
          scrollValue = getValueInRange(nextScroll, scrollMin, scrollMax )

          setTimeout(() => {
            setXScroll(value, 'sub')
          }, 100)
          break
        }
        case 'scroll': {
          const event = value
          const { width } = xAxisController.getSize()
          // console.log([width * 0.2, xAxis.getScrollTimeWidth()])

          const scroll = scrollWidth * (width * 0.1 ) / xAxis.getScrollTimeWidth()
          // const scroll = scrollWidth * (xAxis.getParams('baseTimeWidth') as number) / xAxis.getScrollTimeWidth()
          const nextScroll = scrollValue + scroll * ((event.deltaY > 0) ? 1 : -1)

          scrollValue = getValueInRange(nextScroll, scrollMin, scrollMax )
          break
        }
        case 'timeValue' : {
          // 取不到value則以0計算
          const scrollRate = (()=> {
            if(!value) return 0
            const [ startTimeValue, endTimeValue ] = xAxis.getParams('scrollTimeValue') as Array<number>
            return (value - startTimeValue) / (endTimeValue - startTimeValue)
          })()
          const nextScroll =  scrollRate * scrollWidth
          scrollValue = getValueInRange(nextScroll, scrollMin, scrollMax )

          break
        }
        case 'timeString' : {
          const timeValue = xAxis.computeTimeValue(value, 'string')
          // console.log(value, timeValue)
          setXScroll(timeValue, 'timeValue')
          return
        }
        case 'xShift' : {
          // const gridStartTime = xAxis.getParams('gridStartTime') as number
          // const timeShift = xAxis.computeTimeValue(value, 'width')

          const timeValue = xAxis.computeTimeValue(value, 'xCoordinate')

          setXScroll(timeValue, 'timeValue')

          return
        }
      }

      xAxis.reset('scroll')

      //setOverView
      const { gridStartTime, gridEndTime } = xAxis.getGridTime('value')
      const displayTimeInfo = {
        displayStartTime: gridStartTime,
        displayTimeDuration: (gridEndTime as number) - (gridStartTime as number)
      }
      objectController.overView.setDisplayTime(displayTimeInfo)

    }

    // const setScrollTimeRange = (timeRange) => {
    //   scrollMin = timeRange[0]
    //   scrollMax = timeRange[1]
    // }

    const getArea = () => {
      return {
        left: canvasX,
        right: canvasX + areaWidth,
        top: canvasY,
        bottom: canvasY + areaHeight
      }
    }

    const getScrollTime = () => {
      // return scrollValue
      const scrollRate = scrollValue / scrollWidth
      return xAxis.computeTimeValue(scrollRate, 'scrollRate') ?? 0
    }
    const getScroll = () => {
      return scrollValue
    }


    const drawArea = () => {
      // if (scrollWidth === barWidth) return
      //Draw Border
      setStyle('standardLine')
      ctx.fillStyle = 'white'
      drawRect(canvasX, canvasY, areaWidth, areaHeight, 'block')

      ctx.fillStyle = 'gray'
      //Draw Button
      const startButtonCoordinate = [
        [canvasX + 5, canvasY + 8],
        [canvasX + 12, canvasY + 4],
        [canvasX + 12, canvasY + 12]
      ]
      const endButtonCoordinate = [
        [canvasX + areaWidth - 5, canvasY + 8],
        [canvasX + areaWidth - 12, canvasY + 4],
        [canvasX + areaWidth - 12, canvasY + 12]
      ]
      drawPath(startButtonCoordinate, 'fill')
      drawPath(endButtonCoordinate, 'fill')
      //Draw Bar
      const barX = canvasX + buttonWidth + scrollValue
      const barY = canvasY + 5
      // const barWidth
      const barHeight = 6
      drawRect(barX, barY, barWidth, barHeight, 'block')
    }

    // const xAxisControllerReset = (type) => {
    //   switch (type) {
    //     case 'size' : {
    //       areaWidth = initWidth()
    //       canvasX = initcanvasX()
    //       canvasY = initcanvasY()
    //       scrollWidth = initScrollWidth()
    //       barWidth = initBarWidth()
    //       scrollMax = initScrollMax()
    //       break
    //     }
    //   }
    // }

    return {
      checkEvent: event => {
        const { offsetX, clientX } = event
        const mouseX = offsetX - canvasX
        const recordX = clientX - canvasX
        switch (event.type) {
          case 'mousedown': {
            if (!canvasInfo.isHover) return
            if (!isInArea(event, getArea())) return
            isPressing = true

            // 左側方向鍵
            if(mouseX <= buttonWidth) {
              setXScroll(3, 'sub')
            }
            // 右側方向鍵
            else if(areaWidth >= mouseX && mouseX >= (areaWidth - buttonWidth)) {
              setXScroll(3, 'add')
            }
            // 拖拉桿
            else if(mouseX >= scrollValue + buttonWidth &&  mouseX <= (scrollValue + barWidth + buttonWidth)) {
              // console.log('Start Drag')
              isDragging = true
              dragAdjustment = scrollValue - recordX
            }


            break
          }
          case 'mouseup': {
            isPressing = false
            isDragging = false

            break
          }
          case 'mousemove': {
            //超出範圍則結束按壓
            if (!isInArea(event, getArea())) {
              isPressing = false
            }
            if (isDragging) {
              const nextValue = recordX + dragAdjustment
              setXScroll(nextValue, 'drag')
            }

            break
          }
          default : return
        }
      },
      drawArea,
      init: () => {
        areaWidth = initWidth()
        canvasX = initcanvasX()
        canvasY = initcanvasY()
        scrollWidth = initScrollWidth()
        barWidth = initBarWidth()
        scrollMax = initScrollMax()

        setXScroll(xAxis.getParams('gridStartTime'), 'timeValue')
      },
      getArea,
      getSize: () => {
        return {
          width: areaWidth,
          height: areaHeight
        }
      },
      setXScroll,
      getScrollTime,
      getScroll
    }
  }
  const createGanttGrid = () => {
    const initcanvasX = () => yAxis.getArea().right
    const initcanvasY = () => xAxis.getArea().bottom
    const initWidth = () => xAxis.getSize().width
    const initHeight = () => xAxisController.getArea().top - xAxis.getArea().bottom

    let canvasX = initcanvasX()
    let canvasY = initcanvasY()
    let areaWidth = initWidth()
    let areaHeight = initHeight()


    const drawArea = () => {
      // Draw Border
      ctx.save()
      setStyle('standardLine')
      drawRect(canvasX, canvasY, areaWidth, areaHeight, 'stroke')
      ctx.restore()
      // Draw Grid
      ctx.save()
      clipRect(canvasX, canvasY, areaWidth, areaHeight)

      const drawGridY = () => {
        const gridYs = yAxis.getGridY()
        gridYs.forEach(gridY => {
          drawLine(canvasX, gridY, areaWidth, 0)
        })
      }
      const drawGridX = () => {
        const gridXs = xAxis.getGridX()
        gridXs.forEach(gridX => {
          drawLine(gridX, canvasY, 0, areaHeight)
        })
      }

      setStyle('lightLine')
      drawGridY()
      drawGridX()

      ctx.restore()
    }


    return {
      checkEvent: () => {},
      drawArea,
      init: () => {
        canvasX = initcanvasX()
        canvasY = initcanvasY()
        areaWidth = initWidth()
        areaHeight = initHeight()
      },
      getSize: () => {
        return {
          width: areaWidth,
          height: areaHeight
        }
      },
      getArea: () => {
        return {
          left: canvasX,
          right: canvasX + areaWidth,
          top: canvasY,
          bottom: canvasY + areaHeight
        }
      }
    }
  }
  // YAXISCONTROLLER
  const createYAxisController = () => {
    const initcanvasX = () => xAxis.getArea().right - areaWidth
    const initcanvasY = () => yAxis.getScrollArea().top
    const initHeight = () => yAxis.getScrollSize().height - xAxisController.getSize().height
    const initScrollHeight = () => areaHeight - buttonHeight * 2
    const initBarHeight = () => {
      const yAxisScale = yAxis.getScrollSize().height / (yAxis.getAllItemsHeight()  + xAxisController.getSize().height)
      return  (yAxisScale >= 1 ) ? scrollHeight : scrollHeight * yAxisScale
    }
    const initScrollMax = () => {
      return scrollHeight - barHeight
    }

    const areaWidth = 15
    const buttonHeight = 15

    let canvasX = initcanvasX()
    let canvasY = initcanvasY()
    let areaHeight = initHeight()
    let scrollHeight = initScrollHeight()
    let barHeight
    const scrollMin = 0
    let scrollMax
    let scrollValue = 0

    let isPressing = false

    let isDragging = false
    let dragAdjustment


    const getArea = () => {
      return {
        left: canvasX,
        right: canvasX + areaWidth,
        top: canvasY,
        bottom: canvasY + areaHeight
      }
    }

    const setYScroll = async (value, type) => {
      switch (type) {
        case 'assign': {
          const nextScroll = value
          if (nextScroll > scrollMax) scrollValue = scrollMax
          else if (nextScroll < scrollMin) scrollValue = scrollMin
          else scrollValue = nextScroll
          break
        }
        case 'drag': {
          if(!isDragging) return
          const nextScroll = value
          if (nextScroll > scrollMax) scrollValue = scrollMax
          else if (nextScroll < scrollMin) scrollValue = scrollMin
          else scrollValue = nextScroll
          break
        }
        case 'add': {
          if(!isPressing) return
          if (scrollValue >= scrollMax) return
          const nextScroll = scrollValue + value
          if (nextScroll > scrollMax) scrollValue = scrollMax
          else scrollValue = nextScroll

          setTimeout(() => {
            setYScroll(value, 'add')
          }, 100)
          break
        }
        case 'sub': {
          if(!isPressing) return
          if (scrollValue <= scrollMin) return
          const nextScroll = scrollValue - value
          if (nextScroll < scrollMin) scrollValue = scrollMin
          else scrollValue = nextScroll

          setTimeout(() => {
            setYScroll(value, 'sub')
          }, 100)
          break
        }
        case 'scroll': {
           const event = value

          const scroll = scrollHeight * yAxis.getParams('effectColumnHeight') / yAxis.getAllItemsHeight()
          const nextScroll = scrollValue + scroll * ((event.deltaY > 0) ? 1 : -1)

          scrollValue = getValueInRange(nextScroll, scrollMin, scrollMax)
          break
        }
        case 'check' : {
          setYScroll(scrollValue, 'assign')
          return
        }
        case 'rate': {
          const newScrollValue = value * scrollHeight
          setYScroll(newScrollValue, 'assign')
          return
        }
      }

      // const Start
      const rateInfo = {
        displayYStartRate: getScrollRate(),
        displayYHeightRate: barHeight / scrollHeight
      }
      objectController.overView.setDisplayYRate(rateInfo)

      yAxis.reset('scroll')
      // yAxis.init()
      // drawCanvas()

    }

    const getScrollRate = () => {
      const scrollRate = (scrollValue ?? 0) / scrollHeight
      return scrollRate
    }
    const getScroll = () => {
      return scrollValue
    }


    const init = () => {
      canvasX = initcanvasX()
      canvasY = initcanvasY()
      areaHeight = initHeight()

      scrollHeight = initScrollHeight()
      barHeight = initBarHeight()
      scrollMax = initScrollMax()


      setYScroll(0, 'check')

      yAxis.reset('scroll')
    }
    //DRAW YAXISCONTOLLER
    const drawArea = () => {
        //Draw Border
      if(barHeight >= scrollHeight) return
      setStyle('standardLine')
      ctx.fillStyle = 'white'
      drawRect(canvasX, canvasY, areaWidth, areaHeight, 'block')

      const scrollX = canvasX
      const scrollY = canvasY

      ctx.fillStyle = 'gray'
      //Draw Button
      const startButtonCoordinate = [
        [scrollX + 8, scrollY + 5],
        [scrollX + 4, scrollY + 12],
        [scrollX + 12, scrollY + 12]
      ]
      const endButtonCoordinate = [
        [scrollX + 8, scrollY + scrollHeight + 12 + buttonHeight],
        [scrollX + 4, scrollY + scrollHeight + 5 + buttonHeight],
        [scrollX + 12, scrollY + scrollHeight + 5 + buttonHeight]
      ]

      drawPath(startButtonCoordinate, 'fill')
      drawPath(endButtonCoordinate, 'fill')

      const barX = canvasX + 5
      const barY = scrollY + buttonHeight + scrollValue
      const barWidth = 6
      drawRect(barX, barY, barWidth, barHeight, 'block')

    }

    //CHECK YAXISCONTROLLER
    const checkEvent = event => {
      const { offsetY, clientY } = event
      const scrollY = offsetY - (canvasY + buttonHeight)
      const recordY = clientY - (canvasY + buttonHeight)
      // const { offsetX, offsetY } = event
      // const mouseX = offsetX - canvasX

      switch (event.type) {
        case 'mousedown': {
          // console.log(event)
          if (!canvasInfo.isHover) return
          if (!isInArea(event, getArea())) return
          isPressing = true
          // console.log('YC is CLICK')

          // 上方方向鍵
          if(scrollY >= buttonHeight * -1 && scrollY <= 0) {
            setYScroll(3, 'sub')
          }
          // 下方方向鍵
          else if(scrollY >= scrollHeight && scrollY <= scrollHeight + buttonHeight) {
            setYScroll(3, 'add')
          }
          // 拖拉桿
          else if(scrollY >= scrollValue  &&  scrollY <= (scrollValue + barHeight)) {
            // console.log('Start Drag')
            isDragging = true
            dragAdjustment = scrollValue - recordY
          }


          break
        }
        case 'mouseup': {
          isPressing = false
          isDragging = false

          break
        }
        case 'mousemove': {
          //超出範圍則結束按壓
          if (!isInArea(event, getArea())) {
            isPressing = false
            // isDragging = false
          }
          if (isDragging) {
            const nextValue = recordY + dragAdjustment
            setYScroll(nextValue, 'drag')
          }

          break
        }
        default : return
      }
    }



    return {
      checkEvent,
      drawArea,
      getArea,
      init,
      getScrollRate,
      setYScroll,
      getScroll
    }
  }

  // create Children Object
  const yAxis = createYAxis()
  const xAxis = createXAxis()
  const xAxisController = createXAxisController()
  const ganttGrid = createGanttGrid()
  const yAxisController = createYAxisController()

  const childern = {
    yAxis,
    xAxis,
    xAxisController,
    ganttGrid,
    yAxisController
    // rushOrderManager: createRushOrderManager()
  }
  const childrenList = Object.values(childern)

  const keyPress = {
    Control: false,
    Alt: false,
    Shift: false
  }

  const checkEvent = event => {
    switch (event.type) {
      case 'mousedown': {
        mousedownCoordinate.x = event.offsetX
        mousedownCoordinate.y = event.offsetY
        break
      }
      case 'keydown': {
        keyPress[event.key] = true
        // console.log('DOWn', event.key)
        return
      }
      case 'keyup': {
        keyPress[event.key] = false
        // console.log('UP', keyPress)
        return
      }
      case 'wheel': {
        if(keyPress.Control) {
          // 縮放x軸比例
          if(isInArea(event, ganttGrid.getArea())) {
            if(event.deltaY > 0)  xAxis.setWidthScale(-0.5)
            else xAxis.setWidthScale(0.5)
          }
          else if(isInArea(event, yAxis.getArea())) {
            if(event.deltaY > 0)  yAxis.setColumnScale(-0.1, 'add')
            else yAxis.setColumnScale(0.1, 'add')
          }
        }
        else if(keyPress.Shift) {
          // 捲動x軸
          if(isInArea(event, xAxisController.getArea(), 'xRange')) {
            xAxisController.setXScroll(event, 'scroll')
          }
        }
        else {
          // 捲動y軸
          if(isInArea(event, yAxis.getArea(), 'yRange')) {
            yAxisController.setYScroll(event, 'scroll')
          }
        }
        break
      }
      case 'mouseup': {
        // console.log('UP')
        break
      }
      case 'mousemove': {
        cursorType.value  = 'default'
        setMouseInfo(event)
        break
      }
      case 'dragstart': {
        // const dragItem = yAxis.checkEvent(event)
        // if(dragItem) return dragItem
      }
    }

    // // console.time('check')
    childrenList.forEach(child => child.checkEvent(event))
    //處理完事件後重新繪製
    // resetCanvas('init')
    // // console.timeEnd('check')
    // drawCanvas()

  }


  const drawCanvas = () => {
    objectController.canvasResize()
    // console.log(canvasRef.clientWidth, canvasRef.height)
  //   const tempWidth =   ganttCanvas.value.width = canvasContainer.value.clientWidth

    // console.time('Draw')
  // ganttCanvas.value.height = canvasContainer.value.clientHeight
    drawFrame()
    // setTimeout(drawCanvas, 17)
    requestAnimationFrame(drawCanvas) // Draw  frame
    // console.timeEnd('Draw')
  }
  // draw a frame
  const drawFrame = () => {
    // console.log('Draw')
    // objectController.canvasResize()
    ctx.clearRect(0, 0, canvasRef.width, canvasRef.height)
    // ctx.setTransform(1, 0, 0, 1, 0, 0)
    // grid => yAxis(columns & orders) => xAxis(timeLevel & timeFlag)
    ganttGrid.drawArea() // V
    yAxis.drawArea() // ?
    xAxis.drawArea() // V
    xAxisController.drawArea() // V
    yAxisController.drawArea() // V
  }

  // expoose
  const setLevelInfo = (type, data?) => {
    // console.log(ganttData.tempYItem)
    yAxis.setLevelInfo(type, data)

  }
  const setAdjustTime = () => {
    const timeRange = yAxis.getFlatYItemsTimeRange()
    xAxis.setAdjustTime(timeRange)
  }
  const getXAxisGrids = () => {
    return xAxis.getGridTimeValues()
  }

  const getFocusX = time => {
    return xAxis.getFocusX(time)
  }
  const getFocusTime = type => {
    return xAxis.getFocusTime(type)
  }

  return {
    checkEvent,
    drawArea: drawCanvas,
    drawFrame: drawFrame,
    init: initCanvas,
    reset: resetCanvas,
    setLevelInfo: setLevelInfo,
    setXScroll: xAxisController.setXScroll,
    setYScroll: yAxisController.setYScroll,
    getXAxisGrids,
    getFocusX,
    getFocusTime,
    setAdjustTime
  }
}

// type RushMachine = {
//   id: string
//   orders: RushOrder[]
// }
// type RushOrder = {
//   erpNo: string,
//   processId: string,
//   // memo?
//   // updateBy: string
// }

// 甘特圖用工具
// 判定點擊是否位於指定區域
const isInArea = (event, area, type?) => {
  const {
    offsetX,
    offsetY
  } = event
  const {
    left,
    right,
    top,
    bottom
  } = area

  const inX = left <= offsetX && offsetX <= right
  const inY = top <= offsetY && offsetY <= bottom

  switch (type) {
    case 'yRange': return inY
    case 'xRange': return inX
    default:  return inX && inY

  }

}
// 判斷目標值是否在指定區間內
const isInRange = (target, range, type?) => {
  switch (type) {
    case 'time': {
      const { startTime, endTime } = range
      const isBefore = dayjs(target).isBefore(endTime, 'second')
      const isAfter = dayjs(target).isAfter(startTime, 'second')
      // console.log(target, range, [isBefore, isAfter] )
      return isBefore && isAfter
    }
    case 'dayjsTimeRange': {
      const isAfter = dayjs(target.endTime).isAfter(range.startTime)
      const isBefore = dayjs(target.startTime).isBefore(range.endTime)
      return isBefore && isAfter
    }
    case 'area': {
      const { left, right, top, bottom } = range
      const { x, y } = target

      const inX = left <= x && x <= right
      const inY = top <= y && y <= bottom
      // console.log(inX, inY, inX && inY)
      return inX && inY
    }
    case 'value': {
      const { min, max } = range
      return target >= min && target <= max
    }
    // case 'valueRange': {
    //   const isAfter = dayjs(target.endTime).isAfter(range.startTime)
    // }
  }

}

const getRangeFloor = (value, range) => {
  return Math.floor(value / range) * range
}



const getValueInRange = (value, min, max) => {
  if (isNaN(value)) return min
  else if(value < min) return min
  else if (value > max) return max
  else return value
}

// 加算時間
const computeAddTime = (initTime, addTime, type) => {
  return dayjs(initTime).add(addTime, type)
}
// 加總陣列
// const sumArray = (arr) => {
//   const sum = arr.reduce((sumValue, newValue) => sumValue + newValue, 0)
//   return sum
// }

const findObjectInArray = (arr:Array<Object>, value:any, param: string) => {
  return arr.find(data => data[param] === value)
}

const concatArrays = (arrs: Array<Array<any>>) => {
  const concatAll = arrs.reduce((all, cur) => {
    return all.concat(cur)
  }, [])

  return concatAll
}
const noRepeatArray = (arr: Array<any>) => {
  return [...new Set(arr)]
}
// const cloneArray = (target: Array<any>, value: Array<any>) => {
//   console.log(target, value)
//   target.splice(0)
//   value.forEach(data => { target.push(data) })
// }

// type TimeGroup = {
//   groupLevel: number,
//   timeRange: () => number
//   timeAdjustment: number
//   baseWidth: number

//   secondWidth: number
//   baseText?: (startTime:number) =>  string
//   upperText: (startTime:number) =>  string
// }



// setStyle('crumbBurger')
// drawLine(left + 10, top + 7, 20, 0)
// drawLine(left + 10, top + 13, 20, 0)
// drawLine(left + 10, top + 19, 20, 0)
