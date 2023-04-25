<script setup>
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'

const myChart = ref(null)
const baseDate = `${new Date().getFullYear()}-${
        new Date().getMonth() + 1
      }-${new Date().getDate()}`

const yData = ['会议室一', '会议室二', '会议室三', '会议室四']
const ganttData = [
      {
        value: [
          {
            index: 1,
            roomName: '会议室二',
            RoomId: '123',
            id: '333',
            startTime: `${baseDate} 8:28`,
            endTime: `${baseDate} 9:28`,
            status: '1',
            content: '睡觉'
          }
        ]
      },
      {
        value: [
          {
            index: 0,
            roomName: '会议室一',
            RoomId: '2234',
            id: '444',
            startTime: `${baseDate} 10:28`,
            endTime: `${baseDate} 12:28`,
            status: '0',
            content: '吃饭'
          }
        ]
      }
    ]

const option = {
        color: '#0A8BFF',
        backgroundColor: '#fff',
        title: {},
        tooltip: {
          // enterable: true,
          trigger: 'item',
          show: true,
          // axisPointer: { // 坐标轴指示器，坐标轴触发有效
          //   type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          // },
          // alwaysShowContent: true,
          hideDelay: 100,
          backgroundColor: 'rgba(255,255,255,1)', // 背景颜色（此时为默认色）
          borderRadius: 5, // 边框圆角
          textStyle: {
            color: '#000'
          },
          formatter: function (params) {
            const item = params.data.value[0]
            return (
              item.content +
              '<br/>' +
              (item.status === '1'
                ? '<span style="color:#4dc394;">已完成</span>'
                : '<span style="color:#e5835b;">进行中</span>') +
              '<br/>' +
              item.startTime +
              ' - ' +
              item.endTime
            )
          }
        },
        legend: {
          // left: '90px',
          top: '1%',
          itemWidth: 16,
          itemHeight: 16,
          show: true,
          // selectedMode: false, // 图例设为不可点击
          textStyle: {
            color: 'rgba(0, 0, 0, 0.45)',
            fontSize: 14
          }
        },
        grid: {
          // 绘图网格
          left: '2%',
          right: '3%',
          top: '10%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'time',
          position: 'top',
          interval: 3600 * 1000, // 以一个小时递增
          // max:`${baseDate} 24:00`,
          max: `${baseDate} 19:00`, // 设置最大时间为18点
          // min:`${baseDate} 00:00`, //将data里最小时间的整点时间设为min,否则min会以data里面的min为开始进行整点递增
          min: `${baseDate} 08:00`, // 将data里最小时间的整点时间设为min,否则min会以data里面的min为开始进行整点递增
          axisLabel: {
            formatter: function (value, index) {
              console.log(index)
              var data = new Date(value)
              var hours = data.getHours()
              return hours + ':00'
            },
            textStyle: {
              color: 'rgba(0,0,0,0.65)', // 更改坐标轴文字颜色
              fontSize: 14 // 更改坐标轴文字大小
            }
          },
          axisLine: {
            lineStyle: {
              color: '#e5e5e5'
            },
            onZero: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        // dataZoom: [
        //   // 给x轴设置滚动条
        //   {
        //     type: 'slider',
        //     show: true,
        //     yAxisIndex: [0, 1],
        //     left: '96%',
        //     start: 1,
        //     end: 100,
        //     fiterMode: 'filter'
        //   },
        //   {
        //     type: 'inside',
        //     fiterMode: 'filter',
        //     yAxisIndex: [0, 1],
        //     start: 1,
        //     end: 100
        //   }
        // ],
        yAxis: {
          inverse: true, // 是否反转
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#e5e5e5'
            }
          },
          data: yData,
          axisLabel: {
            textStyle: {
              color: 'rgba(0, 0, 0, 0.65)', // 刻度颜色
              fontSize: 14 // 刻度大小
            }
          }
        },
        series: [
          {
            type: 'custom',
            clickable: false,
            renderItem: function (params, api) {
              // 开发者自定义的图形元素渲染逻辑，是通过书写 renderItem 函数实现的
              console.log(api.value(0))
              var categoryIndex = api.value(0).index // 这里使用 api.value(0) 取出当前 dataItem 中第一个维度的数值。
              var start = api.coord([api.value(0).startTime, categoryIndex]) // 这里使用 api.coord(...) 将数值在当前坐标系中转换成为屏幕上的点的像素值。
              console.log(start, 11)
              var end = api.coord([api.value(0).endTime, categoryIndex])
              // var HEIGHT_RATIO = 0.6
              // var barHeight = Math.abs(
              //   myChart.convertToPixel('grid', [0, 0])[1] - myChart.convertToPixel('grid', [0, 1])[1]
              // ) * HEIGHT_RATIO
              // var height = api.size([0, 1])[1] * HEIGHT_RATIO

              var height = 40
              return {
                type: 'rect', // 表示这个图形元素是矩形。还可以是 'circle', 'sector', 'polygon' 等等。
                shape: echarts.graphic.clipRectByRect(
                  {
                    // 矩形的位置和大小。
                    x: start[0],
                    y: start[1] - height / 2,
                    width: end[0] - start[0],
                    height: 40
                  },
                  {
                    // 当前坐标系的包围盒。
                    x: params.coordSys.x,
                    y: params.coordSys.y,
                    width: params.coordSys.width,
                    height: params.coordSys.height
                  }
                ),
                style: api.style()
              }
            },
            label: {
              normal: {
                show: true,
                position: 'insideBottom',
                formatter: function (params) {
                  return params.value[0].content
                },
                textStyle: {
                  align: 'center',
                  fontSize: 14,
                  fontWeight: '400',
                  lineHeight: '30'
                }
              }
            },
            encode: {
              x: 1, // data 中『维度1』对应到 X 轴
              y: 0 // 把"维度0"映射到 Y 轴。
            },

            itemStyle: {
              normal: {
                color: function (params) {
                  if (params.value[0].status === '1') return '#4dc394'
                  else return '#e5835b'
                }
              }
            },
            // dataZoom: [
            //   {
            //     show: true,
            //     realtime: true,
            //     start: 0,
            //     end: 50
            //   }
            // ],
            data: ganttData
          }
        ]
      }

onMounted(() => {

  var chartDom = document.getElementsByClassName('gannt-chart')[0]
  myChart.value = echarts.init(chartDom)
  myChart.value.setOption(option)
})


</script>

<template>
  <div class="gannt-container">
    <div class="gannt-chart"></div>
  </div>
</template>

<style lang="scss" scoped>
.gannt {
  &-container {
    border: 1px solid gray;
  }
  &-chart {
    min-width: 500px;
    width: 100%;
    min-height: 500px;
    height: fit-content;
  }
}
</style>
