<script setup lang="ts">
import type { PropType } from 'vue'
import { nextTick, reactive, computed } from 'vue'

import throttle from '@/lib/lib_throttle'
import { awaitTime, getType, isEmpty } from '@/lib/lib_utils'

import { CustomPopover, CustomButton, FormTimePicker } from '@/components'

import type {
  PlanData,
  Origin
} from './planType'

import {
  FPS,
  maxSecond,
  twentyFourHourSecond,
  // 轉換用
  secondToTop,
  topToSecond,
  secondToTime,
  timeToSecond
} from './planUtils'

const props = defineProps({
  planData: {
    type: Object as PropType<PlanData>,
    required: true
  },
  scheduleContainer: {
    type: [Object, null] as PropType<any>,
    required: true
  },
  isCheck: {
    type: Boolean as PropType<boolean>,
    required: true
  },
  dayId: {
    type: Number as PropType<number>,
    required: true
  },
  originPlanMap: {
    type: Object as PropType<Map<string, Origin>>,
    required: true
  }
})

const _FPS = 1000 / FPS

const emit = defineEmits([
  'updatePlanData',
  'setLastUpdatePlan',
  'setOriginPlan',
  'updatePlanRenderKey',
  'updateSchedule'
])

const plan = computed<PlanData>({
  get() {
    return props.planData
  },
  set (v: PlanData) {
    emit('updatePlanData')
  }
})

// 改分配 時間 + 位置
const moveDataPlan = ($event: MouseEvent) => {
  const { time: planTime, style: planStyle } = plan.value
  const { id: uuid } = planTime

  emit('setLastUpdatePlan', props.dayId, uuid)
  emit('setOriginPlan', props.dayId, plan.value)

  if (props.originPlanMap.has(uuid)) {
    const { clientY: mouseDownY } = $event

    const originPlan = props.originPlanMap.get(uuid)
    const { originTop, originHeight, originStartSecond, originEndSecond } = originPlan

    console.log('scheduleContainer => ',  props.scheduleContainer)
    if (isEmpty(props.scheduleContainer)) return
    // 滑鼠移動時執行
    props.scheduleContainer.addEventListener(
      'mousemove',
      throttle(function ($event: MouseEvent) {
        if (props.isCheck) return

        const { clientY: mouseMoveY } = $event
        planStyle.cursor = 'move'
        planStyle.zIndex = 9

        // 變化高度
        const _moveY = mouseMoveY - mouseDownY

        const _startSecond = topToSecond(originTop + _moveY)
        const _endSecond = topToSecond(originTop + originHeight + _moveY)

        planTime.endSecond =
          _startSecond <= 0 // 如果開始 <= 0
            ? _startSecond + (originEndSecond - originStartSecond) // 結束 = 開始 + 本身的秒數
            : _endSecond // 變化後 結束的秒數
        planTime.end = secondToTime(planTime.endSecond)
        if (planTime.endSecond === maxSecond) return

        planTime.startSecond =
          _endSecond >= twentyFourHourSecond // 如果結束 >= 24
            ? _endSecond - (originEndSecond - originStartSecond) // 開始 = 結束 - 本身的秒數
            : _startSecond // 變化後 開始的秒數
        planTime.start = secondToTime(planTime.startSecond)

        planStyle.top = secondToTop(planTime.startSecond)
        planStyle.height = secondToTop(planTime.endSecond - planTime.startSecond)

        emit('updatePlanRenderKey', props.dayId)
      }, _FPS, { isNoLeading: true })
    )
  }
}
// 改開始 時間 + 位置
const setStartPlan = ($event: MouseEvent) => {
  const { time: planTime, style: planStyle } = plan.value
  const { id: uuid } = planTime

  emit('setLastUpdatePlan', props.dayId, uuid)
  emit('setOriginPlan', props.dayId, plan.value)

  if (props.originPlanMap.has(uuid)) {
    const { clientY: mouseDownY } = $event

    const originPlan = props.originPlanMap.get(uuid)
    const { originTop, originEndSecond } = originPlan

    if (isEmpty(props.scheduleContainer)) return
    // 滑鼠移動時執行
    props.scheduleContainer.addEventListener(
      'mousemove',
      throttle(function ($event: MouseEvent) {
        if (props.isCheck) return

        const { clientY: mouseMoveY } = $event
        planStyle.zIndex = 9

        // 變化高度
        const _moveY = mouseMoveY - mouseDownY

        const _startSecond = topToSecond(originTop + _moveY)
        planTime.startSecond =
          originEndSecond - _startSecond <= 0 // 時間 <= 0
            ? originEndSecond
            : _startSecond // 變化後 開始的秒數

        planTime.start = secondToTime(planTime.startSecond)
        planStyle.top = secondToTop(planTime.startSecond)
        planStyle.height = secondToTop(originEndSecond - planTime.startSecond)

        emit('updatePlanRenderKey', props.dayId)
      }, _FPS, { isNoLeading: true })
    )
  }
}
// 改結束 時間 + 位置
const setEndPlan = ($event: MouseEvent) => {
  const { time: planTime, style: planStyle } = plan.value
  const { id: uuid } = planTime

  emit('setLastUpdatePlan', props.dayId, uuid)
  emit('setOriginPlan', props.dayId, plan.value)

  if (props.originPlanMap.has(uuid)) {
    const { clientY: mouseDownY } = $event

    const originPlan = props.originPlanMap.get(uuid)
    const { originTop, originHeight, originStartSecond } = originPlan

    if (isEmpty(props.scheduleContainer)) return
    // 滑鼠移動時執行
    props.scheduleContainer.addEventListener(
      'mousemove',
      throttle(function ($event: MouseEvent) {
        if (props.isCheck) return

        const { clientY: mouseMoveY } = $event
        planStyle.cursor = 'move'
        planStyle.zIndex = 9

        // 變化高度
        const _moveY = mouseMoveY - mouseDownY

        const _endSecond = topToSecond(originTop + originHeight + _moveY)

        planTime.endSecond =
          _endSecond - originStartSecond <= 0 // 時間 <= 0
            ? originStartSecond
            : _endSecond // 變化後 結束的秒數

        planTime.end = secondToTime(planTime.endSecond)
        planStyle.height = secondToTop(planTime.endSecond - originStartSecond)

        emit('updatePlanRenderKey', props.dayId)
      }, _FPS, { isNoLeading: true })
    )
  }
}

// 編輯單個工時安排
const updateInfo = reactive<{
  isShow: boolean
  left: number
  top: number

  // 決定是否顯示用
  mousedownLeft: number
  mousedownTop: number
  mouseupLeft: number
  mouseupTop: number
}>({
  isShow: false,
  left: 0,
  top: 0,

  mousedownLeft: -1,
  mousedownTop: -1,
  mouseupLeft: -1,
  mouseupTop: -1
})


const openUpdate = async ($event: MouseEvent, mouseEvent: string) => {
  const { clientX, clientY } = $event

  if (mouseEvent === 'mousedown') {
    updateInfo.isShow = false

    updateInfo.mousedownLeft = clientX
    updateInfo.mousedownTop = clientY

    // updateInfo.mouseupLeft = -1
    // updateInfo.mouseupTop = -1
  } else if (mouseEvent === 'mouseup') {
    await nextTick()
    console.log('updateInfo =>', updateInfo)
    updateInfo.mouseupLeft = clientX
    updateInfo.mouseupTop = clientY

    // 位置位移不超過3 => click
    if (
      Math.abs(updateInfo.mousedownLeft - updateInfo.mouseupLeft) < 3 &&
      Math.abs(updateInfo.mousedownTop - updateInfo.mouseupTop) < 3
    ) {
      updateInfo.left = clientX
      updateInfo.top = clientY
      updateInfo.isShow = true
    }

    await nextTick()

    // 更新畫面 + 確認重複 + 移除 mouse event
    emit('updateSchedule')
  }
}

const formTimeValue = computed<any>({
  get () {
    let res = []
    if ([null, undefined].includes(plan.value)) {
      res = ['00:00', '00:00']
    } else {
      const [start, end] = [
        plan.value.time.start,
        plan.value.time.end
      ]
      res = [`${start}`, `${end}`]
    }
    // console.log('get', res)
    return res
  },
  set (v: [string, string]) {
    // console.log('set', v)
    const [_start, _end] = v
    plan.value.time.start = _start
    plan.value.time.end = _end
  }
})

const closeUpdate = () => {
  updateInfo.isShow = false
}

/**
 * 編輯時間
 * 時間(HH:mm) => 秒數
 * 秒數 => top
 */
 const onTimePickerChange = async (time: string) => {
  const [startTime, endTime] = time

  const [startSecond, endSecond] = [
    timeToSecond(startTime),
    timeToSecond(endTime)
  ]

  const { time: planTime, style: planStyle } = plan.value
  const { id: uuid } = planTime
  emit('setLastUpdatePlan', props.dayId, uuid)
  emit('setOriginPlan', props.dayId, plan.value)

  planTime.startSecond = startSecond
  planTime.start = secondToTime(startSecond)

  planTime.endSecond = endSecond
  planTime.end = secondToTime(endSecond)

  planStyle.top = secondToTop(planTime.startSecond)
  planStyle.height = secondToTop(planTime.endSecond - planTime.startSecond)
  // updateInfo.isShow = false

  await nextTick()
  await awaitTime(120)
  emit('updateSchedule')
}

</script>

<template>
  <div
    class="schedule-data-plan"
    :style="{
      ...plan.style,
      top: `${plan.style.top - 1}px`,
      height: `${plan.style.height}px`
    }"
    @mousedown.stop="openUpdate($event, 'mousedown')"
    @mouseup.stop="openUpdate($event, 'mouseup')"
  >
    <div
      class="schedule-data-plan-before"
      @mousedown="setStartPlan($event)"
    ></div>
    <div
      class="schedule-data-plan-text"
      @mousedown="moveDataPlan($event)"
    >
      <span>{{ `${plan.time.start}` }}</span>
      <span> - </span>
      <span>{{ `${plan.time.end}` }}</span>
    </div>
    <div
      class="schedule-data-plan-after"
      @mousedown="setEndPlan($event)"
    ></div>

    <!-- 編輯 -->
    <div
      class="schedule-update"
      :style="{
        top: `${updateInfo.top}px`,
        left: `${updateInfo.left}px`
      }"
    >
      <CustomPopover
        :visible="updateInfo.isShow"
        :width="320"
        placement="right"
        :show-arrow="false"
      >
        <template #reference>
          <div></div>
        </template>
        <div class="schedule-update-container">
          <div class="schedule-update-header">
            <span class="update-label">編輯時間區段</span>
            <CustomButton icon-name="close" text @click="closeUpdate" />
          </div>
          <div class="schedule-update-body">
            <FormTimePicker
              v-model="formTimeValue"
              is-range
              format="HH:mm"
              @change="onTimePickerChange($event)"
            />
          </div>
          <div class="schedule-update-footer">
            <CustomButton label="刪除此區間" type="danger" icon-name="close" icon-move="scale" />
            <CustomButton label="同步至整周" type="primary" icon-name="copy" icon-move="scale" />
          </div>
        </div>
      </CustomPopover>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.schedule {
  &-data-plan {
    position: absolute;
    width: calc(100% - 5px);
    min-height: 12px;
    border-radius: 4px;
    border: 1px solid #337ecc;
    background-color: #a0cfffc0;
    cursor: pointer;

    display: flex;
    flex-direction: column;
    align-items: center;
    &-before,
    &-after {
      width: 100%;
      cursor: s-resize;
      min-height: 4px;
      position: relative;
    }
    &-before {
      transform: translateY(-2px);
    }
    &-after {
      transform: translateY(2px);
    }
    &-text {
      height: calc(100% - 8px);
      transform: translateY(-2px);
      width: 100%;
      text-align: center;
      overflow: visible;
    }
  }

  // 編輯
  &-update {
    position: fixed;

    &-container {
      width: 100%;
    }

    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .update-label {
        font-size: 2em;
        font-weight: 600;
      }
    }
    &-body {
      // border: 2px solid skyblue;
      height: fit-content;
      min-height: 100px;
      padding: 24px 0;
    }
    &-footer {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 12px;
    }
  }
}
</style>
