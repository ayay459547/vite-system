<script setup lang="ts">
import type { PropType } from 'vue'
import { nextTick, reactive, computed, ref, shallowRef, inject } from 'vue'
import { storeToRefs } from 'pinia'

import type { UseHook } from '@/types/types_hook' // 全域功能類型
import { defaultModuleType } from '@/declare/declare_i18n'
import { throttle } from '@/lib/lib_lodash'
import { isEmpty, getProxyData, hasOwnProperty, getUuid } from '@/lib/lib_utils' // 工具
import { useMouseInElement, onKeyStroke } from '@/lib/lib_hook'
import { CustomPopover, CustomButton, CustomIcon } from '@/components/feature' // 系統組件
import { FormTimePicker } from '@/components/input' // 系統組件
import { useWeekScheduleStore } from '@/stores/stores_components/useWeekScheduleStore'

import type { Types } from '../WeekScheduleInfo'

import {
  FPS,
  // 轉換用
  secondToTop,
  topToSecond,
  secondToTime,
  timeToSecond,
  oneHourSecond,
  oneMinuteSecond,
  maxSecond
} from '../planUtils'

const props = defineProps({
  dayId: {
    type: Number as PropType<number>,
    required: true
  },
  uuid: {
    type: String as PropType<string>,
    required: true
  },
  planTime: {
    type: Object as PropType<Types['planTime']>,
    required: true
  },
  scheduleContainer: {
    type: [Object, null] as PropType<any>,
    required: true
  },
  // originPlan: {
  //   type: [Object, undefined] as PropType<Types['origin'] | undefined>,
  //   required: true
  // }
  originPlanMap: {
    type: [Object, undefined] as PropType<Record<string, Types['origin']>>,
    required: true
  }
})

const useHook = inject('useHook') as UseHook
const { i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

const emit = defineEmits([
  'update:planTime',
  'removePlan',
  'change'
])

const plan = computed<Types['planTime']>({
  get: () => props.planTime,
  set: (v: Types['planTime']) => {
    const _planTime = props.planTime as Types['planTime']
    const status = _planTime.status === 'new' ? 'new' : v.status
    emit('update:planTime', { ..._planTime, ...v, status })
  }
})

// 設定聚焦元素
const isFocused = computed(() => {
  return focusedId.value === props.uuid
})

// 原來的位置 Types.Origin
const origin = computed(() => {
  // const _originPlan = props.originPlan
  const _originPlan = props.originPlanMap[props.uuid]

  const {
    originStart,
    originStartSecond = 0,
    originEnd,
    originEndSecond = 0
  } = _originPlan ?? {
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

// 分配顯示位置
const planStyle = computed<Types['planStyle']>(() => {
  const startSecond = plan.value.startSecond ?? 0
  const endSecond = plan.value.endSecond ?? 0

  return {
    top: secondToTop(startSecond),
    height: secondToTop(endSecond - startSecond)
  }
})

// 改分配 時間 + 位置
const isMove = ref(false)
let moveEvent = ($event: MouseEvent) => {
  console.log($event)
}
const moveDataPlan = ($event: MouseEvent) => {
  if (isMove.value || isEmpty(props.scheduleContainer)) return
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
  }, FPS, { leading: false, trailing: false })

  moveEvent = throttleMousemoveEvent
  props.scheduleContainer.addEventListener('mousemove', moveEvent)
}
// 改開始 時間 + 位置
let setStartEvent = ($event: MouseEvent) => {
  console.log($event)
}
const setStartPlan = ($event: MouseEvent) => {
  if (isMove.value || isEmpty(props.scheduleContainer)) return
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
  }, FPS, { leading: false, trailing: false })

  setStartEvent = throttleMousemoveEvent
  props.scheduleContainer.addEventListener('mousemove', setStartEvent)
}
// 改結束 時間 + 位置
let setEndEvent = ($event: MouseEvent) => {
  console.log($event)
}
const setEndPlan = ($event: MouseEvent) => {
  if (isMove.value || isEmpty(props.scheduleContainer)) return
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
  }, FPS, { leading: false, trailing: false })

  setEndEvent = throttleMousemoveEvent
  props.scheduleContainer.addEventListener('mousemove', setEndEvent)
}

// 編輯單個工時安排
const updateInfo = reactive<{
  isShow: boolean

  // 決定是否顯示用
  mousedownLeft: number
  mousedownTop: number
  mouseupLeft: number
  mouseupTop: number
}>({
  isShow: false,

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
      // 位置位移不超過3 => 打開編輯
      updateInfo.isShow = true
    }
  }
}

const formTimeValue = computed<any>({
  get: () => {
    let res = []
    if (plan.value === null || plan.value === undefined) {
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
  set: (v: [string, string]) => {
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

// 跨天處理資料
const weekScheduleStore = useWeekScheduleStore()
const {
  checkTimeIsExist,
  insertData,
  removeData
} = weekScheduleStore
const {
  planData,
  focusedId,
  isHasFocusedPlan
} = storeToRefs(weekScheduleStore)

// 關閉編輯
const closeUpdate = async () => {
  await nextTick()
  setTimeout(() => {
    updateInfo.isShow = false
    focusedId.value = ''
  }, 0)
}

// 刪除分配
const removePlan = async () => {
  await nextTick()
  if (plan.value.status !== 'new') {
    plan.value = {
      status: 'delete'
    }
  } else {
    emit('removePlan')
  }
}

const targetRef = shallowRef<HTMLDivElement>()
// 滑鼠是否在元素中
const { isOutside } = useMouseInElement(targetRef)

/**
 * 使用方向鍵 移動
 *
 * 上下移動 移動單位
 * Ctrl ? 小時 : 分鐘
 *
 * 左右移動 移動單位
 * Ctrl ? 2天 : 1天
 *
 * 加上 Shift 只移動開始時間
 * 加上 Alt 只移動結束時間
 *
 * Esc 可清空聚焦
 */
onKeyStroke(async (event: KeyboardEvent) => {
  // 有聚焦時只移動一個 且移動會檢查
  const isSingleMove = isHasFocusedPlan.value
  if (isSingleMove && !isFocused.value) return

  if (isFocused.value && event.key === 'Escape') {
    focusedId.value = '' // 清空聚焦
  }

  switch (event.key) {
    case 'ArrowUp': // 向上移動
    case 'ArrowDown': { // 向下移動
      const isUp = event.key === 'ArrowUp'

      // 移動單位 = Ctrl ? 小時 : 分鐘
      const moveSecond = event.ctrlKey ? oneHourSecond : oneMinuteSecond

      const isOnlyUp = event.shiftKey // 只移動開始時間
      const isOnlyDown = event.altKey // 只移動結束時間

      const newStartSecond = isOnlyDown ? plan.value.startSecond : (
        isUp ?
        Math.max(plan.value.startSecond - moveSecond, 0) :
        Math.max(plan.value.startSecond + moveSecond, 0)
      )

      const newEndSecond = isOnlyUp ? plan.value.endSecond : (
        isUp ?
        Math.min(plan.value.endSecond - moveSecond, maxSecond) :
        Math.min(plan.value.endSecond + moveSecond, maxSecond)
      )

      plan.value = {
        start: secondToTime(newStartSecond),
        startSecond: newStartSecond,
        end: secondToTime(newEndSecond),
        endSecond: newEndSecond,
        status: 'update'
      }
      emit('change')
      event.preventDefault()
      break
    }
    case 'ArrowRight': // 向右移動
    case 'ArrowLeft': { // 向左移動
      const isRight = event.key === 'ArrowRight'
      const moveDay = event.ctrlKey ? 2 : 1

      // 插入位置
      const insertPosition = {
        '-1': '6',
        '0': '7',
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5',
        '6': '6',
        '7': '7',
        '8': '1',
        '9': '2'
      }
      const __insertDayId__ = isRight ? props.dayId + moveDay : props.dayId - moveDay
      const insertDayId = insertPosition[__insertDayId__]

      if (!hasOwnProperty(planData.value, insertDayId)) return

      const { isTimeExist } = await checkTimeIsExist(insertDayId, {
        startSecond: props.planTime.startSecond,
        endSecond: props.planTime.endSecond
      })
      // 所有一起移動不檢查
      if (!isSingleMove || !isTimeExist) {
        const movePlanTime = {
          ...props.planTime,
          uuid: props.uuid
        }
        // 移動不用將 status => delete
        // 直接複製到下一個區塊
        emit('removePlan')
        await nextTick()
        insertData(insertDayId, movePlanTime)
      }
      emit('change')
      event.preventDefault()
      break
    }
  }
})

// 複製一周
const copyPlanWeek = async () => {
  await nextTick()
  for (const dayId in planData.value) {
    const { isTimeExist } = await checkTimeIsExist(dayId, {
      startSecond: props.planTime.startSecond,
      endSecond: props.planTime.endSecond
    })
    if (!isTimeExist) {
      insertData(dayId, {
        ...props.planTime,
        uuid: getUuid('new'),
        status: 'new'
      })
    }
  }
}
// 刪除一周
const removePlanWeek = async () => {
  await nextTick()
  for (const dayId in planData.value) {
    removeData(dayId, props.planTime)
  }
}

const getPlanInfo = async () => {
  await nextTick()
  const planTime = getProxyData<Types['planTime']>(plan.value)
  return { uuid: props.uuid, planTime }
}
const removeEvent = async () => {
  await nextTick()
  // 移除 EventListener
  props.scheduleContainer.removeEventListener('mousemove', moveEvent)
  props.scheduleContainer.removeEventListener('mousemove', setStartEvent)
  props.scheduleContainer.removeEventListener('mousemove', setEndEvent)
  isMove.value = false
}

defineExpose({
  getPlanInfo,
  removeEvent
})

</script>

<template>
  <div
    class="schedule-data-plan"
    :class="[
      isMove ? 'schedule-is-move' : '',
      isFocused ? 'schedule-is-focused' : '',
      `schedule-status-${plan.status}`
    ]"
    :style="{
      top: `${(planStyle?.top ?? 0) - 1}px`,
      height: `${(planStyle?.height ?? 0)}px`
    }"
    @mousedown.stop="openUpdate($event, 'mousedown')"
    @mouseup="openUpdate($event, 'mouseup')"
  >
    <!-- 向上延伸 -->
    <div class="schedule-data-plan-before" @mousedown="setStartPlan($event)"></div>

    <!-- 移動 -->
    <div
      ref="targetRef"
      tabindex="-1"
      class="schedule-data-plan-content"
      @mousedown.self="moveDataPlan($event)"
    >
      <div class="schedule-data-plan-text">
        <!-- 開始時間 -->
        <span>{{ `${plan.start}` }}</span>
        <span> - </span>
        <!-- 結束時間 -->
        <span>{{ `${plan.end}` }}</span>

        <!-- 狀態 debug 使用 -->
        <!-- <div class="i-my-sm text-danger">
          <div>{{ props.uuid }}</div>
          <div>{{ plan?.status ?? 'none' }}</div>
          <div>{{ `isFocused: ${isFocused}` }}</div>
          <div>{{ `isShow: ${updateInfo.isShow}` }}</div>
        </div> -->

      </div>

      <!-- 刪除區塊 -->
      <div
        v-show="!isOutside"
        class="schedule-data-plan-remove"
        @click.stop="removePlan()"
      >
        <CustomIcon name="close" />
      </div>

      <!-- 編輯 Popver -->
      <CustomPopover
        :visible="updateInfo.isShow && isFocused"
        :width="360"
        :offset="4"
        placement="right-start"
        :show-arrow="false"
        :teleported="false"
        :virtual-ref="targetRef"
        virtual-triggering
      >
        <template #reference>
          <div></div>
        </template>
        <div class="schedule-update-container" tabindex="-1">
          <div class="schedule-update-header">
            <span class="update-label">{{ i18nTranslate('edit-time-range') }}</span>
            <CustomButton
              icon-name="close"
              text
              @click.stop="closeUpdate"
            />
          </div>
          <div class="schedule-update-body">
            <!-- 編輯區塊 -->
            <FormTimePicker
              v-model="formTimeValue"
              is-range
              format="HH:mm"
              value-format="HH:mm"
              :teleported="false"
              @change="() => emit('change')"
            />
          </div>
          <div class="schedule-update-footer">
            <div class="flex-row i-ga-xs">
              <!-- 複製一周 -->
              <CustomButton
                :label="i18nTranslate('sync-week')"
                type="primary"
                plain
                icon-name="copy"
                icon-move="scale"
                @click.stop="copyPlanWeek"
              />
              <!-- 刪除一周 -->
              <CustomButton
                :label="i18nTranslate('remove-week')"
                type="danger"
                plain
                icon-type="far"
                icon-name="trash-can"
                icon-move="scale"
                @click.stop="removePlanWeek"
              />
            </div>
            <!-- 刪除區塊 -->
            <CustomButton
              :label="i18nTranslate('confirm-yes')"
              type="success"
              icon-name="check"
              @click.stop="closeUpdate"
            />
          </div>
        </div>
      </CustomPopover>
    </div>

    <!-- 向下延伸 -->
    <div class="schedule-data-plan-after" @mousedown="setEndPlan($event)"></div>
  </div>
</template>

<style lang="scss" scoped>
.schedule {
  &-is-move {
    cursor: move !important;
    z-index: 9;
  }
  &-is-focused {
    box-shadow: 0px 0px 6px 1px #337ecc;
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
    background-color: #a0cfff84;
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

    &-content {
      width: 100%;
      height: calc(100% - 8px);
      display: flex;
      align-items: start;
    }
    &-text {
      width: 100%;
      text-align: center;
      overflow: visible;
      pointer-events: none;
    }
    &-remove {
      position: absolute;
      right: 0;
      top: 0;
      cursor: pointer;
      padding: 4px 6px;
      transition-duration: 0.2s;
      color: var(--el-color-danger);
      &:hover {
        color: var(--el-color-danger-light-3);
      }
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
      min-height: 80px;
      padding: 24px 0;
    }
    &-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }
  }
}
</style>
