<script setup lang="ts">
import type { PropType } from 'vue'
import { reactive } from 'vue'

import { throttle } from '@/lib/lib_lodash'
import { isEmpty } from '@/lib/lib_utils' // 工具

import type { Types } from '../WeekScheduleInfo'

import {
  FPS,
  oneHourSecond,
  // 轉換用
  secondFormat,
  secondToTop,
  topToSecond,
  secondToTime
} from '../planUtils'

const props = defineProps({
  hourMapRef: {
    type: Object as PropType<Record<string, any>>,
    required: true
  },
  scheduleContainer: {
    type: [Object, null] as PropType<any>,
    required: true
  }
})

// 暫時的工時分配
const tempPlanTime = reactive<Types['planTime']>({
  start: '00:00',
  startSecond: 0,
  end: '00:00',
  endSecond: 0
})
const tempPlanStyle = reactive<Types['planStyle']>({
  top: 0,
  height: 0,
  display: 'none'
})

let mousemoveEvent = ($event: MouseEvent) => {
  console.log($event)
}

// 開啟 暫時的工時分配
const openTempPlan = ($event: MouseEvent, hour: number) => {
  const { clientY: mouseDownY } = $event

  // 表格
  if (isEmpty(props.scheduleContainer)) return
  const containerEl = props.scheduleContainer
  // 小時 對應的格子
  const blockEl = props.hourMapRef[`${hour}`]

  if (containerEl && blockEl) {
    const { top: containerTop } = containerEl.getBoundingClientRect()
    // 暫時工時分配: 開始
    const _tempY = mouseDownY - containerTop
    const _startSecond = topToSecond(_tempY)
    tempPlanTime.startSecond = secondFormat(_startSecond)
    tempPlanTime.start = secondToTime(tempPlanTime.startSecond)

    // 暫時工時分配: 結束
    const _endSecond = _startSecond + oneHourSecond
    tempPlanTime.endSecond = secondFormat(_endSecond)
    tempPlanTime.end = secondToTime(tempPlanTime.endSecond)

    // 暫時工時分配 top = secondToTop(開始秒數)
    tempPlanStyle.top = secondToTop(tempPlanTime.startSecond)
    // 暫時工時分配 height = secondToTop(結束秒數 - 開始秒數)
    tempPlanStyle.height = secondToTop(tempPlanTime.endSecond - tempPlanTime.startSecond)

    // 移動時變動 暫時的工時分配
    const throttleMousemoveEvent = throttle<typeof mousemoveEvent>(function ($event: MouseEvent) {
      const { clientY: mouseMoveY } = $event

      // 變化高度
      const _moveY = mouseMoveY - mouseDownY
      const _change = _moveY < 0 ? 0 : _moveY
      const _changeEndSecond = topToSecond(_tempY + _change)
      tempPlanTime.endSecond = _changeEndSecond
      tempPlanTime.end = secondToTime(_changeEndSecond)

      tempPlanStyle.height = _change
    }, FPS, { leading: false, trailing: false })

    mousemoveEvent = throttleMousemoveEvent
    props.scheduleContainer.addEventListener('mousemove', mousemoveEvent)

    // 顯示暫時的工時分配
    tempPlanStyle.display = 'block'
  }
}

// 關閉 暫時的工時分配
const closeTempPlan = () => {
  // 移除 EventListener
  props.scheduleContainer.removeEventListener('mousemove', mousemoveEvent)

  tempPlanStyle.display = 'none'
}

// 取得 暫時的工時分配 資訊
const getTempPlanInfo = () => {
  const { start, startSecond = 0, end, endSecond = 0 } = tempPlanTime

  return {
    isTempPlanExist: tempPlanStyle.display === 'block',
    start,
    startSecond,
    end,
    endSecond
  }
}

defineExpose({
  openTempPlan,
  closeTempPlan,
  getTempPlanInfo
})

</script>

<template>
  <div
    class="schedule-temp-plan"
    :style="{
      display: tempPlanStyle.display,
      top: `${(tempPlanStyle?.top ?? 0) - 1}px`,
      height: `${(tempPlanStyle?.height ?? 0)}px`
    }"
  >
    <div class="schedule-temp-text">
      <span>{{ `${tempPlanTime.start}` }}</span>
      <span> - </span>
      <span>{{ `${tempPlanTime.end}` }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.schedule-temp {
  &-plan {
    width: calc(100% - 2px);
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 4px;
    min-height: 12px;
    background-color: #dddddd70;
    border-top: 1px solid var(--el-color-info-light-5);
    text-align: center;
    padding: 2px 0;
  }
  &-text {
    width: 100%;
  }
}
</style>
