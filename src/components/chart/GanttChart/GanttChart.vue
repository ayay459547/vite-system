<script lang="ts">
import * as echarts from 'echarts'
import type { PropType } from 'vue'
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import type { ResizeObserverCallback } from '@/lib/lib_throttle'
import throttle from '@/lib/lib_throttle'
import debounce from '@/lib/lib_debounce'
import { isEmpty, getUuid } from '@/lib/lib_utils'
import { datetimeFormat } from '@/lib/lib_day'

export default defineComponent({
  name: 'CanttChart',
  props: {
    domKey: {
      type: String as PropType<string>,
      default: '_gantt'
    },
    left: {
      type: Number as PropType<number>,
      default: 150,
      description: '給左邊 type 的空間'
    },
    dataZoomX: {
      type: Number as PropType<number>,
      default: 100,
      description: 'x軸預設百分比'
    },
    dateFormatX: {
      type: String as PropType<string>,
      default: 'YYYY-MM-DD',
      description: '決定 x 軸上方的日期顯示'
    },
    intervalX: {
      type: Number as PropType<number>,
      default () {
        return 1000 * 60 * 60 * 24
      },
      description: 'x軸 時間增加毫秒'
    },
    minX: {
      type: String as PropType<string>,
      default: null,
      description: 'x軸 最小時間 YYYY-MM-DD hh:mm'
    },
    maxX: {
      type: String as PropType<string>,
      default: null,
      description: 'x軸 最大時間 YYYY-MM-DD hh:mm'
    },
    ganttData: {
      type: Array as PropType<{ type: string; list: [number, number, string, string][] }[]>,
      default () {
        return [
          {
            type: 'type1',
            list: [
              [1496902000000, 1496912000000, 'title1', 'MEF-N1237551'],
              [1496922000000, 1496925000000, 'title2', 'MEF-N1237552'],
              [1496930000000, 1496934000000, 'title3', 'MEF-N1237553']
            ]
          },
          {
            type: 'type2',
            list: [
              [1496925100000, 1496936000000, 'title11', 'MEF-N1237551'],
              [1496937000000, 1496938000000, 'title12', 'MEF-N1237552'],
              [1496939000000, 1496942000000, 'title13', 'MEF-N1237553']
            ]
          },
          {
            type: 'type3',
            list: [
              [1496926100000, 1496936100000, 'title31', 'MEF-N1237551'],
              [1496938100000, 1496939500000, 'title32', 'MEF-N1237552'],
              [1496940100000, 1496942000000, 'title33', 'MEF-N1237553']
            ]
          }
        ]
      }
    },
    barTextCallback: {
      type: Function,
      default: (value: any, title: string) => {
        return title
      },
      description: '自訂甘特圖的條狀 顯示的文字 有給value值 標題'
    },
    barColorCallback: {
      type: Function,
      default: (value: any) => {
        return '#3073ac'
      },
      description: '自訂甘特圖的條狀 顯示的顏色 有給value值'
    },
    tooltipCallback: {
      type: Function,
      default: (value: any, start: number, end: number, title: string) => {
        return `<div 
                  class="gantt-tooltip" 
                  style="display: flex; flex-direction: column; gap: 8px;"
              >
                  <div style="font-size: 1.2em;">${title}</div>
                  <div>${start}</div>
                  <div>${end}</div>
              </div>`
      },
      description: `自訂滑鼠移入時 顯示的東西
          有給 value 值 開始時間 結束時間 標題
      `
    },
    tooltipPositionCallback: {
      type: Function,
      default: (x: number, y: number) => {
        return { x, y}
      },
      description: '自訂滑鼠移入時 顯示的位置'
    }
  },
  emits: ['typeClick', 'itemClick'],
  setup (props, context) {
    // 監聽外框大小變化
    const ROcallback = throttle((entries: ResizeObserverEntry[]) => {
      entries.forEach((entry) => {
        init()
      })
    }, 300) as ResizeObserverCallback
    const RO = new ResizeObserver(ROcallback)
    const ganttContainer = ref(null)

    onMounted(() => {
      if (ganttContainer.value !== null) {
        setTimeout(() => {
          RO.observe(ganttContainer.value)
        }, 100)
      }
    })
    onUnmounted(() => {
      RO.disconnect()
    })

    // 甘特圖設定
    const option = ref()
    let myChart: any

    const GANTT_TYPE_INDEX = 0
    const GANTT_START_TIME_INDEX = 1
    const GANTT_COMPLETE_TIME_INDEX = 2
    const GANTT_TITLE_INDEX = 3
    const GANTT_VALUE_INDEX = 4

    let _yEnd = 100
    let _ganttData = []
    let _typeData = []

    const debounceClickCallback = debounce(function (params: any) {
      // console.log(params)
      // if (params.seriesId === 'typeData') {
      //     context.emit('typeClick', params.value)
      // }
      if (params.targetType === 'axisLabel') {
        const [type, length] = params.value.split(',')
        context.emit('typeClick', [params.yAxisIndex, type])
      }
      if (params.seriesId === 'ganttData') {
        context.emit('itemClick', params.value)
      }
    }, 200)

    const scopedId = getUuid()
    const init = () => {
      _typeData.splice(0)
      _ganttData.splice(0)

      props.ganttData.forEach((item, itemIndex) => {
        _typeData.push([item.type, item.list.length])

        const tempList = item.list.map((barItem) => {
          const [_startTime, _endTime, _title, _value] = barItem

          return [itemIndex, _startTime, _endTime, _title, JSON.stringify(_value)]
        })
        _ganttData.push(...tempList)
      })

      const chartDom = document.getElementsByClassName(`${props.domKey}-chart__${scopedId}`)[0]

      if (isEmpty(myChart)) {
        myChart = echarts.init(chartDom as HTMLElement)
      }

      _yEnd = getYScrollStart(_typeData.length, 15)

      option.value = makeOption()
      myChart.clear()
      myChart.setOption(option.value, true)

      myChart.on('click', debounceClickCallback)
      myChart.resize()
    }

    // const debounceInit = debounce(init)

    function getYScrollStart (typeLangth = 0, showCount = 20) {
      const percentage = (showCount / typeLangth) * 100

      if (percentage >= 100) return 100

      // if (percentage <= 5) return 5
      return Math.ceil(percentage)
    }

    function makeOption () {
      return {
        animation: false,
        title: {},
        toolbox: {
          feature: {
            saveAsImage: {
              title: '',
              name: 'gantt-charts'
            }
          }
        },
        dataZoom: [
          // x軸上的滾輪
          {
            type: 'slider',
            xAxisIndex: 0,
            filterMode: 'weakFilter',
            height: 20,
            bottom: 20,
            start: 0,
            end: props.dataZoomX,
            handleIcon:
              'path://M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            showDetail: false
          },
          // x軸 移動
          {
            type: 'inside',
            id: 'insideX',
            xAxisIndex: 0,
            filterMode: 'weakFilter',
            start: 0,
            end: props.dataZoomX,
            zoomOnMouseWheel: false,
            moveOnMouseMove: true
          },
          // y軸上的滾輪
          {
            type: 'slider',
            yAxisIndex: 0,
            // zoomLock: true,
            width: 10,
            top: 30,
            bottom: 20,
            start: 0,
            end: _yEnd,
            handleSize: 0,
            showDetail: false
          },
          // y軸 移動
          {
            type: 'inside',
            id: 'insideY',
            yAxisIndex: 0,
            start: 0,
            end: _yEnd,
            zoomOnMouseWheel: false,
            moveOnMouseMove: true,
            moveOnMouseWheel: true
          }
        ],
        tooltip: {
          // trigger: 'axis'
        },
        grid: {
          show: true,
          top: 30,
          bottom: 40,
          left: props.left,
          right: 20,
          backgroundColor: '#fff',
          borderWidth: 0
        },
        xAxis: {
          type: 'time',
          position: 'top',
          // interval: 1000 * 60 * 60 * 24 * 14,
          // max: `2023-01-06 00:00`,
          // min: `2023-01-08 23:59`,
          interval: props.intervalX,
          min: props.minX,
          max: props.maxX,
          splitLine: {
            show: true,
            lineStyle: { color: '#E9EDFF' }
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false,
            lineStyle: { color: '#929ABA' }
          },
          axisLabel: {
            color: '#929ABA',
            inside: false,
            align: 'center',
            formatter: function (value: any, index: number) {
              return datetimeFormat(value, props.dateFormatX)
            }
          }
        },
        yAxis: {
          seriesId: 'typeData',
          inverse: true,
          triggerEvent: true,
          axisTick: { show: false },
          splitLine: { show: true },
          axisLine: { show: false },
          // min: -1,
          min: 0,
          max: _typeData.length - 1,
          data: _typeData,
          axisLabel: {
            show: true,
            color: '#3073ac',
            formatter: function (value: any, index: number) {
              const [type, length] = value.split(',')
              return `${type} (${parseInt(length).toLocaleString()})`
            }
          },
          tooltip: {}
        },
        series: [
          {
            id: 'ganttData',
            type: 'custom',
            renderItem: renderGanttItem,
            encode: {
              x: [GANTT_START_TIME_INDEX, GANTT_COMPLETE_TIME_INDEX],
              y: GANTT_TYPE_INDEX
            },
            data: _ganttData,
            labelLayout: {
              hideOverlap: true
            },
            tooltip: {
              position: function (pos: [x: number, y: number]) {
                const [ x, y ] = pos
                const { x: resX, y: resY } = props.tooltipPositionCallback(x, y)

                return [resX, resY]
              },
              formatter: function (params: any, api) {
                const start = datetimeFormat(
                  params.value[GANTT_START_TIME_INDEX],
                  'YYYY-MM-DD hh:mm:ss'
                )
                const end = datetimeFormat(
                  params.value[GANTT_COMPLETE_TIME_INDEX],
                  'YYYY-MM-DD hh:mm:ss'
                )

                const title = params.value[GANTT_TITLE_INDEX]
                const tempValue = params.value[GANTT_VALUE_INDEX]
                const value = JSON.parse(tempValue)

                const show = props.tooltipCallback(value, start, end, title)

                return show
              }
            }
          }
        ]
      }
    }
    function renderGanttItem (params: any, api: any) {
      const categoryIndex = api.value(GANTT_TYPE_INDEX)
      const timeStart = api.coord([api.value(GANTT_START_TIME_INDEX), categoryIndex])
      const timeEnd = api.coord([api.value(GANTT_COMPLETE_TIME_INDEX), categoryIndex])
      const barHeight = api.size([0, 1])[1] * 0.6

      const x = timeStart[0]
      const y = timeStart[1] - barHeight / 2

      const tempValue = api.value(GANTT_VALUE_INDEX)
      const value = JSON.parse(tempValue)

      const barLength = timeEnd[0] - timeStart[0]
      const title = api.value(GANTT_TITLE_INDEX)
      const tempText = props.barTextCallback(value, title)
      const valueWidth = echarts.format.getTextRect(tempText).width

      const text = barLength > valueWidth + 40 && x + barLength >= 270 ? tempText : ''
      const fillColor = props.barColorCallback(value)

      const rectText = clipRectByRect(params, {
        x: x,
        y: y,
        width: timeEnd[0] - timeStart[0],
        height: barHeight
      })

      return {
        type: 'group',
        children: [
          {
            type: 'rect',
            ignore: !rectText,
            shape: rectText,
            // stroke: api.visual('color')
            style: {
              fill: fillColor,
              stroke: 'transparent',
              text: text,
              textFill: '#fff'
            }
          }
        ]
      }
    }
    function clipRectByRect (params, rect) {
      return echarts.graphic.clipRectByRect(rect, {
        x: params.coordSys.x,
        y: params.coordSys.y,
        width: params.coordSys.width,
        height: params.coordSys.height
      })
    }

    context.expose({ init })

    return {
      ganttContainer,
      init,
      option,
      scopedId,
      showGanttData: _ganttData
    }
  }
})
</script>

<template>
  <div class="gantt-container" ref="ganttContainer">
    <div class="gantt-main" :class="`${domKey}-chart__${scopedId}`"></div>
  </div>
</template>

<style lang="scss" scoped>
.gantt {
  &-container {
    height: 100%;
    width: 100%;
  }

  &-main {
    height: inherit;
    width: inherit;
  }
}
</style>
