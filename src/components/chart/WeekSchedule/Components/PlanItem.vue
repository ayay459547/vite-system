<script setup lang="ts">
import type { PropType } from 'vue'
import { nextTick, reactive, computed, ref } from 'vue'

import throttle from '@/lib/lib_throttle'
import { isEmpty, getProxyData } from '@/lib/lib_utils'
import { CustomPopover, CustomButton, FormTimePicker } from '@/components'

import type { Custom } from '../WeekScheduleInfo'

import {
  FPS,
  // 轉換用
  secondToTop,
  topToSecond,
  secondToTime,
  timeToSecond
} from '../planUtils'

const props = defineProps({
  uuid: {
    type: String as PropType<string>,
    required: true
  },
  planTime: {
    type: Object as PropType<Custom.PlanTime>,
    required: true
  },
  scheduleContainer: {
    type: [Object, null] as PropType<any>,
    required: true
  },
  // originPlan: {
  //   type: [Object, undefined] as PropType<Custom.Origin | undefined>,
  //   required: true
  // }
  originPlanMap: {
    type: [Object, undefined] as PropType<Record<string, Custom.Origin>>,
    required: true
  },
  isEdit: {
    type: Boolean as PropType<boolean>,
    required: true
  }
})

const emit = defineEmits(['update:planTime', 'copyPlan', 'removePlan'])

const plan = computed<Custom.PlanTime>({
  get() {
    return props.planTime
  },
  set (v: Custom.PlanTime) {
    const _planTime = props.planTime as Custom.PlanTime
    const status = _planTime.status === 'new' ? 'new' : v.status
    emit('update:planTime', { ..._planTime, ...v, status })
  }
})

// 原來的位置 Custom.Origin
const origin = computed(() => {
  // const _originPlan = props.originPlan
  const _originPlan = props.originPlanMap[props.uuid]

  const { originStart, originStartSecond, originEnd, originEndSecond } = _originPlan ?? {
    originStart: '00:00',
    originStartSecond: 0,
    originEnd: '00:00',
    originEndSecond: 0
  }

  const originTop = secondToTop(originStartSecond)
  const originHeight = secondToTop(originEndSecond - originStartSecond)
  return {
    originStart,
    originStartSecond,
    originEnd,
    originEndSecond,

    originTop,
    originHeight
  }
})

const planStyle = computed<Custom.PlanStyle>(() => {
  const startSecond = plan.value.startSecond
  const endSecond = plan.value.endSecond

  return {
    top: secondToTop(startSecond),
    height: secondToTop(endSecond - startSecond)
  }
})

const isCheck = ref(false)

// 改分配 時間 + 位置
const isMove = ref(false)
let moveEvent = ($event: MouseEvent) => {
  console.log($event)
}
const moveDataPlan = ($event: MouseEvent) => {
  if (isMove.value || isCheck.value || isEmpty(props.scheduleContainer)) return
  const { originTop, originHeight } = origin.value
  const { clientY: mouseDownY } = $event

  // 滑鼠移動時執行
  const throttleMousemoveEvent = throttle<typeof moveEvent>(function ($event: MouseEvent) {
    isMove.value = true
    const { clientY: mouseMoveY } = $event

    // 變化高度
    const _moveY = mouseMoveY - mouseDownY
    const startSecond = topToSecond(originTop + _moveY)
    const endSecond = topToSecond(originTop + originHeight + _moveY)

    // 設定新的資料
    plan.value = {
      start: secondToTime(startSecond),
      startSecond,
      end: secondToTime(endSecond),
      endSecond,
      status: 'update'
    }

    // 移動編輯區
    if (updateInfo.isShow) {
      updateInfo.top = mouseMoveY
    }
  }, FPS, { isNoLeading: true, isNoTrailing: true })

  moveEvent = throttleMousemoveEvent
  props.scheduleContainer.addEventListener('mousemove', moveEvent)
}
// 改開始 時間 + 位置
let setStartEvent = ($event: MouseEvent) => {
  console.log($event)
}
const setStartPlan = ($event: MouseEvent) => {
  if (isMove.value || isCheck.value || isEmpty(props.scheduleContainer)) return
  const { originTop } = origin.value
  const { clientY: mouseDownY } = $event

  // 滑鼠移動時執行
  const throttleMousemoveEvent = throttle<typeof setStartEvent>(function ($event: MouseEvent) {
    isMove.value = true
    const { clientY: mouseMoveY } = $event

    // 變化高度
    const _moveY = mouseMoveY - mouseDownY
    const startSecond = topToSecond(originTop + _moveY)

    // 設定新的資料
    plan.value = {
      start: secondToTime(startSecond),
      startSecond,
      status: 'update'
    }
  }, FPS, { isNoLeading: true, isNoTrailing: true })

  setStartEvent = throttleMousemoveEvent
  props.scheduleContainer.addEventListener('mousemove', setStartEvent)
}
// 改結束 時間 + 位置
let setEndEvent = ($event: MouseEvent) => {
  console.log($event)
}
const setEndPlan = ($event: MouseEvent) => {
  if (isMove.value || isCheck.value || isEmpty(props.scheduleContainer)) return
  const { originTop, originHeight } = origin.value
  const { clientY: mouseDownY } = $event

  // 滑鼠移動時執行
  const throttleMousemoveEvent = throttle<typeof setEndEvent>(function ($event: MouseEvent) {
    isMove.value = true
    const { clientY: mouseMoveY } = $event

    // 變化高度
    const _moveY = mouseMoveY - mouseDownY
    const endSecond = topToSecond(originTop + originHeight + _moveY)

    // 設定新的資料
    plan.value = {
      end: secondToTime(endSecond),
      endSecond,
      status: 'update'
    }
  }, FPS, { isNoLeading: true, isNoTrailing: true })

  setEndEvent = throttleMousemoveEvent
  props.scheduleContainer.addEventListener('mousemove', setEndEvent)
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
    updateInfo.mousedownLeft = clientX
    updateInfo.mousedownTop = clientY

  } else if (mouseEvent === 'mouseup') {
    await nextTick()
    updateInfo.mouseupLeft = clientX
    updateInfo.mouseupTop = clientY

    if (
      Math.abs(updateInfo.mousedownLeft - updateInfo.mouseupLeft) < 3 &&
      Math.abs(updateInfo.mousedownTop - updateInfo.mouseupTop) < 3
    ) {
      // 位置位移不超過3 => click 打開編輯
      updateInfo.left = clientX
      updateInfo.top = clientY
      updateInfo.isShow = true
    }
  }
}

const formTimeValue = computed<any>({
  get () {
    let res = []
    if ([null, undefined].includes(plan.value)) {
      res = ['00:00', '00:00']
    } else {
      const [start, end] = [
        plan.value.start,
        plan.value.end
      ]
      res = [`${start}`, `${end}`]
    }
    return res
  },
  set (v: [string, string]) {
    const [start, end] = v
    plan.value = {
      start,
      startSecond: timeToSecond(start),
      end,
      endSecond: timeToSecond(end),
      status: 'update'
    }
  }
})

// 關閉編輯
const closeUpdate = () => {
  updateInfo.isShow = false
}

// 刪除分配
const removePlan = async () => {
  closeUpdate()

  await nextTick()
  if (plan.value.status !== 'new') {
    plan.value = {
      status: 'delete'
    }
  } else {
    emit('removePlan')
  }
}

// 複製分配
const copyPlan = async () => {
  closeUpdate()

  await nextTick()
  emit('copyPlan')
}

/**
 * 編輯時間
 * 時間(HH:mm) => 秒數
 * 秒數 => top
 */
 const onTimePickerChange = async (time: string) => {
  console.log(time)
  isCheck.value = false
}

const checkUpdatePlan = (checkTimeIsExist: Custom.CheckTimeIsExist) => {
  isCheck.value = true

  // 移除 EventListener
  props.scheduleContainer.removeEventListener('mousemove', moveEvent)
  props.scheduleContainer.removeEventListener('mousemove', setStartEvent)
  props.scheduleContainer.removeEventListener('mousemove', setEndEvent)
  isMove.value = false

  const planTime = getProxyData<Custom.PlanTime>(plan.value)
  const { startSecond, endSecond } = planTime
  const isExist = checkTimeIsExist(startSecond, endSecond, props.uuid)

  isCheck.value = false
  return {
    isExist,
    uuid: props.uuid,
    planTime
  }
}

defineExpose({
  checkUpdatePlan
})

</script>

<template>
  <div
    class="schedule-data-plan"
    :class="[
      isMove ? 'schedule-is-move' : '',
      `schedule-status-${plan.status}`
    ]"
    :style="{
      top: `${planStyle.top - 1}px`,
      height: `${planStyle.height}px`
    }"
    @mousedown.stop="openUpdate($event, 'mousedown')"
    @mouseup="openUpdate($event, 'mouseup')"
  >
    <div
      class="schedule-data-plan-before"
      @mousedown="setStartPlan($event)"
      @mouseup="isCheck = true"
    ></div>
    <!-- 移動 -->
    <div
      class="schedule-data-plan-text"
      @mousedown="moveDataPlan($event)"
      @mouseup="isCheck = true"
    >
      <!-- 開始時間 -->
      <span>{{ `${plan.start}` }}</span>
      <span> - </span>
      <!-- 結束時間 -->
      <span>{{ `${plan.end}` }}</span>
      <!-- 狀態 -->
      <!-- <span> {{ plan?.status ?? 'none' }} </span> -->
    </div>
    <div
      class="schedule-data-plan-after"
      @mousedown="setEndPlan($event)"
      @mouseup="isCheck = true"
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
        :visible="updateInfo.isShow && isEdit"
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
            <CustomButton
              label="刪除此區間"
              type="danger"
              icon-name="close"
              icon-move="scale"
              @click="removePlan"
            />
            <CustomButton
              label="同步至整周"
              type="primary"
              icon-name="copy"
              icon-move="scale"
              @click="copyPlan"
            />
          </div>
        </div>
      </CustomPopover>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.schedule {
  &-is-move {
    cursor: move !important;
    z-index: 9;
  }
  &-status-delete {
    display: none !important;
  }

  &-data-plan {
    position: absolute;
    width: calc(100% - 2px);
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
