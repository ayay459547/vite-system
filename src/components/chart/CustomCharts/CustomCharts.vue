<script lang="ts">
import * as echarts from 'echarts'
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'

import { debounce, throttle } from '@/lib/lib_lodash'
import { isEmpty, getUuid } from '@/lib/lib_utils' // 工具
import { useLayoutStore } from '@/stores/useLayoutStore'

import type { Types, Emits, Expose } from './CustomChartsInfo'
import { version, props as customChartsProps } from './CustomChartsInfo'

export default defineComponent({
  name: 'CustomCharts',
  props: customChartsProps,
  emits: ['click'],
  setup(props, context) {
    const scopedId = getUuid(version)

    // 監聽外框大小變化
    const ROcallback = throttle<ResizeObserverCallback>((entries: ResizeObserverEntry[]) => {
      entries.forEach(() => {
        init()
      })
    }, 300)
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

    const debounceClickCallback: Emits['click'] = debounce(function (params: any) {
      context.emit('click', params)
    }, 200)

    // 色調
    const layoutStore = useLayoutStore()
    const { isDark } = storeToRefs(layoutStore)

    const setOption = (option: Types['buildOptions']) => {
      myChart.setOption(option)
    }

    const init: Expose['init'] = () => {
      const chartDom = document.getElementsByClassName(`chart-dom-${scopedId}`)[0]
      if (isEmpty(props.options) || isEmpty(chartDom)) return

      if (isEmpty(myChart) && chartDom.clientWidth > 0 && chartDom.clientHeight > 0) {
        myChart = echarts.init(chartDom as HTMLElement, isDark.value ? 'dark' : '')
      }

      let _options = null
      if (typeof props.options === 'function') {
        _options = props.options()
      } else if (typeof props.options === 'object') {
        _options = props.options
      }

      if (!isEmpty(myChart) && !isEmpty(_options)) {
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
      scopedId,
      setOption
    }
  }
})
</script>

<template>
  <div ref="charts" class="charts-container" :class="scopedId">
    <div class="charts-main" :class="`chart-dom-${scopedId}`"></div>
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
