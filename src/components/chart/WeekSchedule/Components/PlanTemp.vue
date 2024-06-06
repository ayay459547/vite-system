<script setup lang="ts">
import type { PropType } from 'vue'
import { reactive } from 'vue'

import throttle from '@/lib/lib_throttle'
import { getUuid, isEmpty } from '@/lib/lib_utils'

import type { PlanTime, PlanStyle, CheckTimeIsExist } from '../planType'

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
const tempPlanTime = reactive<PlanTime>({
  start: '00:00',
  startSecond: 0,
  end: '00:00',
  endSecond: 0
})
const tempPlanStyle = reactive<PlanStyle>({
  top: 0,
  height: 0,
  display: 'none'
})

let mousemoveEvent = ($event: MouseEvent) => {
  console.log($event)
}

// 建立暫時的工時分配
const createTempPlan = ($event: MouseEvent, hour: number) => {
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
    }, FPS, { isNoLeading: true })

    mousemoveEvent = throttleMousemoveEvent
    props.scheduleContainer.addEventListener('mousemove', mousemoveEvent)

    // 顯示暫時的工時分配
    tempPlanStyle.display = 'block'
  }
}

// 確認有暫時分配 新增
const checkCreatePlan = (checkTimeIsExist: CheckTimeIsExist) => {
  // 移除 EventListener
  props.scheduleContainer.removeEventListener('mousemove', mousemoveEvent)

  // 有暫時的工時分配
  if (tempPlanStyle.display === 'block') {
    const { start, startSecond, end, endSecond } = tempPlanTime

    const isExist = checkTimeIsExist(startSecond, endSecond)

    // 隱藏暫時的工時分配
    tempPlanStyle.display = 'none'

    const uuid = getUuid()
    return {
      isExist,
      newUuid: uuid,
      planTime: {
        id: uuid,
        status: 'new',
        start,
        startSecond,
        end,
        endSecond
      }
    }
  }

  return {
    isExist: true,
    newUuid: null,
    planTime: null
  }
}

defineExpose({
  createTempPlan,
  checkCreatePlan
})

</script>

<template>
  <div
    class="schedule-temp-plan"
    :style="{
      display: tempPlanStyle.display,
      top: `${tempPlanStyle.top - 1}px`,
      height: `${tempPlanStyle.height}px`
    }"
  >
    <span>{{ `${tempPlanTime.start}` }}</span>
    <span> - </span>
    <span>{{ `${tempPlanTime.end}` }}</span>
  </div>
</template>

<style lang="scss" scoped>
.schedule {
  &-temp-plan {
    width: calc(100% - 2px);
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 4px;
    min-height: 12px;
    background-color: #eeeeee80;
    border: 1px solid #dddddd;
    text-align: center;
    padding-top: 2px;
  }
}
</style>
