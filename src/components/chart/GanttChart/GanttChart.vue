<script lang="ts">
import * as echarts from 'echarts'
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'

import type { ResizeObserverCallback } from '@/lib/lib_throttle'
import throttle from '@/lib/lib_throttle'
import debounce from '@/lib/lib_debounce'
import { isEmpty, getUuid } from '@/lib/lib_utils' // 工具
import { numberFormat, formatDatetime } from '@/lib/lib_format'
import { useLayoutStore } from '@/stores/stores_layout'

import type { Expose } from './GanttChartInfo'
import { version, props as ganttChartProps } from './GanttChartInfo'

export default defineComponent({
  name: 'GanttChart',
  props: ganttChartProps,
  emits: ['typeClick', 'itemClick'],
  setup(props, context) {
    const scopedId = getUuid(version)

    // 監聽外框大小變化
    const ROcallback = throttle((entries: ResizeObserverEntry[]) => {
      entries.forEach(() => {
        init()
      })
    }, 300) as ResizeObserverCallback
    const RO = new ResizeObserver(ROcallback)
    const ganttContainer = ref(null)

    onMounted(() => {
      setTimeout(() => {
        if (ganttContainer.value !== null) {
          RO.observe(ganttContainer.value)
        }
      }, 300)
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [type, length] = params.value.split(',')
        context.emit('typeClick', [params.yAxisIndex, type])
      }
      if (params.seriesId === 'ganttData') {
        context.emit('itemClick', params.value)
      }
    }, 200)

    const init: Expose.Init = () => {
      _typeData.splice(0)
      _ganttData.splice(0)

      props.ganttData.forEach((item, itemIndex) => {
        _typeData.push([item.type, item.list.length])

        const tempList = item.list.map(barItem => {
          const [_startTime, _endTime, _title, _value] = barItem

          return [itemIndex, _startTime, _endTime, _title, JSON.stringify(_value)]
        })
        _ganttData.push(...tempList)
      })

      const chartDom = document.getElementsByClassName(`main-${scopedId}`)[0]

      // 色調
      const layoutStore = useLayoutStore()
      const { isDark } = storeToRefs(layoutStore)

      const showCount = 15
      if (isEmpty(myChart)) {
        myChart = echarts.init(chartDom as HTMLElement, isDark.value ? 'dark' : '')
      }
      _yEnd = getYScrollStart(_typeData.length, showCount)

      option.value = makeOption()
      myChart.clear()
      myChart.setOption(option.value, true)

      myChart.on('click', debounceClickCallback)
      myChart.resize()
    }

    // const debounceInit = debounce(init)

    function getYScrollStart(typeLangth = 0, showCount: number) {
      const percentage = (showCount / typeLangth) * 100

      if (percentage >= 100) return 100

      // if (percentage <= 5) return 5
      return Math.ceil(percentage)
    }

    function makeOption() {
      return {
        animation: false,
        title: {},
        toolbox: {
          feature: {
            dataZoom: {
              title: '',
              yAxisIndex: false
            },
            // brush: {
            //   title: '',
            //   type: ['lineX', 'clear']
            // },
            saveAsImage: {
              title: '',
              name: 'gantt-charts'
            }
          }
        },
        dataZoom: [
          // x軸
          {
            type: 'slider',
            xAxisIndex: [0, 1, 2],
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
            xAxisIndex: [0, 1, 2],
            filterMode: 'weakFilter',
            start: 0,
            end: props.dataZoomX,
            zoomOnMouseWheel: false,
            moveOnMouseMove: true
          },
          // y軸
          {
            type: 'slider',
            yAxisIndex: 0,
            // zoomLock: true,
            width: 10,
            top: 60,
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
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#ff0000',
              opacity: 0.7
            }
          }
        },
        grid: {
          show: true,
          top: 60,
          bottom: 40,
          left: props.left,
          right: 35,
          // backgroundColor: '#fff',
          borderWidth: 0
        },
        xAxis: [
          {
            type: 'time',
            position: 'top',
            offset: 40,
            interval: 1000 * 60 * 60 * 24 * 7, // 周
            min: props.minX,
            max: props.maxX,
            splitLine: { show: true, lineStyle: { color: '#E9EDFF' } },
            axisLine: { show: false },
            axisTick: { show: false, lineStyle: { color: '#929ABA' } },
            axisLabel: {
              color: '#929ABA',
              inside: false,
              align: 'center',
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              formatter: function (value: string, index: number) {
                return formatDatetime(value, 'YYYY-MM')
              }
            },
            axisPointer: {
              label: {
                formatter: function (value: any) {
                  const { value: time } = value
                  return formatDatetime(time, 'YYYY-MM')
                }
              }
            }
          },
          {
            type: 'time',
            position: 'top',
            offset: 20,
            interval: 1000 * 60 * 60 * 24, // 日
            min: props.minX,
            max: props.maxX,
            splitLine: { show: true, lineStyle: { color: '#E9EDFF' } },
            axisLine: { show: false },
            axisTick: { show: false, lineStyle: { color: '#929ABA' } },
            axisLabel: {
              color: '#929ABA',
              inside: false,
              align: 'center',
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              formatter: function (value: string, index: number) {
                return formatDatetime(value, 'MM-DD')
              }
            },
            axisPointer: {
              label: {
                formatter: function (value: any) {
                  const { value: time } = value
                  return formatDatetime(time, 'MM-DD')
                }
              }
            }
          },
          {
            type: 'time',
            position: 'top',
            offset: 0,
            interval: 1000 * 60 * 60 * 24, // 天
            min: props.minX,
            max: props.maxX,
            splitLine: { show: true, lineStyle: { color: '#E9EDFF' } },
            axisLine: { show: false },
            axisTick: { show: false, lineStyle: { color: '#929ABA' } },
            axisLabel: {
              color: '#929ABA',
              inside: false,
              align: 'center',
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              formatter: function (value: string, index: number) {
                return formatDatetime(value, 'dddd')
              }
            },
            axisPointer: {
              label: {
                formatter: function (value: any) {
                  const { value: time } = value
                  return formatDatetime(time, 'dddd')
                }
              }
            }
          }
        ],
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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            formatter: function (value: any, index: number) {
              const [type, length] = value.split(',')
              return `${type} (${numberFormat(parseInt(length), {
                isToLocaleString: true,
                type: 'none'
              })})`
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
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              position: function (point: any, params: any, dom: any, rect: any, size: any) {
                const [x, y] = point

                const { x: resX, y: resY } = props.tooltipPositionCallback(x, y)

                return [resX, resY]
              },
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              extraCssText: 'width: 300px;',
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              formatter: function (params: any, api: any) {
                const start = formatDatetime(
                  params.value[GANTT_START_TIME_INDEX],
                  'YYYY/MM/DD HH:mm:ss'
                )
                const end = formatDatetime(
                  params.value[GANTT_COMPLETE_TIME_INDEX],
                  'YYYY/MM/DD HH:mm:ss'
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
    function renderGanttItem(params: any, api: any) {
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
    function clipRectByRect(params: any, rect: any) {
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
  <div class="__gantt-wrapper" :class="scopedId" ref="ganttContainer">
    <div class="__gantt-main" :class="`main-${scopedId}`"></div>
  </div>
</template>

<style lang="scss" scoped>
.__gantt {
  &-wrapper {
    height: 100%;
    width: 100%;
  }

  &-main {
    height: inherit;
    width: inherit;
  }
}
</style>
