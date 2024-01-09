<script lang="ts">
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts/types/dist/shared'
import type { PropType } from 'vue'
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import type { ResizeObserverCallback } from '@/lib/lib_throttle'
import throttle from '@/lib/lib_throttle'
import debounce from '@/lib/lib_debounce'
import { isEmpty, getUuid } from '@/lib/lib_utils'

export default defineComponent({
  name: 'CustomCharts',
  props: {
    domKey: {
      type: String as PropType<string>,
      default: '_charts'
    },
    options: {
      type: Function as PropType<() => (EChartsOption | any)>,
      required: true
    }
  },
  emits: ['click'],
  setup (props, context) {
    // 監聽外框大小變化
    const ROcallback = throttle((entries: ResizeObserverEntry[]) => {
      entries.forEach(() => {
        init()
      })
    }, 300) as ResizeObserverCallback
    const RO = new ResizeObserver(ROcallback)
    const charts = ref<HTMLElement | null>(null)

    onMounted(() => {
      setTimeout(() => {
        if (charts.value !== null) {
          RO.observe(charts.value)
        }
      }, 100)
    })
    onUnmounted(() => {
      RO.disconnect()
    })

    let myChart: any

    const debounceClickCallback = debounce(function (params: any) {
      context.emit('click', params)
    }, 200)

    const scopedId = getUuid('charts')
    const init = () => {
      const chartDom = document.getElementsByClassName(`${props.domKey}-charts__${scopedId}`)[0]
      if (isEmpty(props.options) || isEmpty(chartDom)) return

      if (isEmpty(myChart)) {
        myChart = echarts.init(chartDom as HTMLElement)
      }

      const _options = props.options()
      if (!isEmpty(_options)) {
        myChart.clear()
        myChart.setOption(_options, true)

        myChart.on('click', debounceClickCallback)
        myChart.resize()
      }
    }

    context.expose({ init })

    return {
      charts,
      init,
      scopedId
    }
  }
})
</script>

<template>
  <div class="charts-container" ref="charts">
    <div class="charts-main" :class="`${domKey}-charts__${scopedId}`">Charts</div>
  </div>
</template>

<style lang="scss" scoped>
.charts {
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
