<script setup lang="ts">
import type { PropType } from 'vue'
import { nextTick, reactive, ref, inject, computed } from 'vue'

import type { UseHook } from '@/declare/hook'
import throttle from '@/lib/lib_throttle'
import { awaitTime, getType, getUuid } from '@/lib/lib_utils'
import { defaultModuleType } from '@/i18n/i18n_setting'

import { CustomPopover, CustomButton, FormTimePicker } from '@/components'

import type {
  DataPlanTime,
  // DataPlanStyle,
  TempPlanTime,
  TempPlanStyle,
  PlanData,
  Origin
} from './planType'

import {
  FPS,
  tableHeight,
  maxSecond,
  // oneHourHeight,
  oneHourSecond,
  twentyFourHourSecond,
  // 限制 00:00 ~ 23:59 區間
  secondFormat,
  topFormat,
  // 轉換用
  secondToTop,
  topToSecond,
  secondToTime,
  timeToSecond
} from './planUtils'
// import PlanItem from './PlanItem.vue'

export type option = {
  label: string
  value: any
  color: string
}

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

const bodyHeight = computed(() => {
  return `${tableHeight}px`
})

const props = defineProps({
  title: {
    type: String as PropType<string>,
    required: false,
    default: ''
  },
  options: {
    type: Array as PropType<option[]>,
    required: false,
    default() {
      return []
    }
  },
  itemList: {
    type: Array as PropType<any[]>,
    required: false
  }
})

const _FPS = 1000 / FPS

const dayList = [
  { id: 0, label: 'sunday' },
  { id: 1, label: 'monday' },
  { id: 2, label: 'tuesday' },
  { id: 3, label: 'wednesday' },
  { id: 4, label: 'thursday' },
  { id: 5, label: 'friday' },
  { id: 6, label: 'saturday' }
]

const scheduleContainer = ref(null)

const refMap = new Map()

// 暫時的工時分配
const tempPlanTime = reactive<TempPlanTime>({
  start: '00:00',
  startSecond: 0,
  end: '00:00',
  endSecond: 0
})
const tempPlanStyle = reactive<TempPlanStyle>({
  left: 0,
  top: 0,
  height: 0,
  display: 'none'
})

const currentDayId = ref(0)

// 工時分配資料
const planRenderKey = reactive({
  0: '0',
  1: '1',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6'
})
// const planData: Record<string, (DataPlanTime & DataPlanStyle)[]> = {
const planData: Record<number, PlanData[]> = {
  0: [],
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
  6: []
}

// 確認工時 是否存在
const checkTimeIsExist = (
  dayId: number,
  startSecond: number,
  endSecond: number,
  filterId: Array<string> | string | null = null
): boolean => {
  let planList = []
  const filterIdType = getType(filterId)

  switch (filterIdType) {
    case 'Array':
      planList = planData[dayId].filter(plan => !filterId.includes(plan.time.id))
      break
    case 'String':
      planList = planData[dayId].filter(plan => plan.time.id !== filterId)
      break
    case 'Null':
    default:
      planList = planData[dayId]
      break
  }

  // 全部都不包含
  return !planList.every(plan => {
    // 開始和結束都 <= 開始
    // 開始和結束都 >= 結束
    const { startSecond: _startSecond, endSecond: _endSecond } = plan.time
    return (
      (startSecond <= _startSecond && endSecond <= _startSecond) ||
      (startSecond >= _endSecond && endSecond >= _endSecond)
    )
  })
}

// 修改工時分配
const originPlanMap = new Map<string, Origin>()
// 移動到原來的位置
const moveOrigin = (dayId: number, plan: PlanData) => {
  const planStyle = plan.style
  const planTime = plan.time

  const originPlan = originPlanMap.get(planTime.id)
  const { originStartSecond, originEndSecond, originTop, originHeight } = originPlan

  planTime.startSecond = originStartSecond
  planTime.start = secondToTime(originStartSecond)
  planTime.endSecond = originEndSecond
  planTime.end = secondToTime(originEndSecond)

  planStyle.top = originTop
  planStyle.height = originHeight

  planRenderKey[dayId] += `${dayId}`
}

// 建立工時分配
const createDataPlan = (dayId: number, dataTime: DataPlanTime) => {
  const { id: uuid, startSecond, endSecond } = dataTime
  const isExist = checkTimeIsExist(dayId, startSecond, endSecond)

  if (!isExist) {
    const _top = secondToTop(startSecond)
    const _height = secondToTop(endSecond - startSecond)

    planData[dayId].push({
      time: dataTime,
      style: { top: _top, height: _height }
    })

    originPlanMap.set(uuid, {
      // 原始樣式
      originTop: _top,
      originHeight: _height,
      // 原始開始與結束時間
      originStartSecond: startSecond,
      originEndSecond: endSecond
    })
  }
}

// 最後一次更新的分配
const lastUpdatePlan = ref<{ dayId: number | null; uuid: string | null }>({
  dayId: null,
  uuid: null
})
// 設置 最後一次更新的分配
const setLastUpdatePlan = (dayId: number, uuid: string) => {
  lastUpdatePlan.value = { dayId, uuid }
}

// 設置上一次分配結果
// 如果已存在 分配回到原位
const setOriginPlan = (dayId: number, plan: PlanData): void => {
  const planStyle = plan.style
  const { top, height } = planStyle

  const planTime = plan.time
  const { id: uuid, startSecond, endSecond } = planTime

  const isExist = checkTimeIsExist(dayId, startSecond, endSecond, uuid)
  // 如果已經存在 移到原位
  if (isExist) {
    moveOrigin(dayId, plan)
  } else {
    // 將原來的位置 更新成現在的位置
    originPlanMap.set(uuid, {
      // 原始樣式
      originTop: top,
      originHeight: height,
      // 原始開始與結束時間
      originStartSecond: startSecond,
      originEndSecond: endSecond
    })
  }
}

// 改開始 時間 + 位置
const setStartPlan = ($event: MouseEvent, dayId: number, plan: PlanData) => {
  const { time: planTime, style: planStyle } = plan
  const { id: uuid } = planTime

  setLastUpdatePlan(dayId, uuid)
  setOriginPlan(dayId, plan)

  if (originPlanMap.has(uuid)) {
    const { clientY: mouseDownY } = $event

    const originPlan = originPlanMap.get(uuid)
    const { originTop, originEndSecond } = originPlan

    // 滑鼠移動時執行
    scheduleContainer.value.addEventListener(
      'mousemove',
      throttle(
        function ($event: MouseEvent) {
          if (isCheck) return

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

          planRenderKey[dayId] += `${dayId}`
        },
        _FPS,
        { isNoLeading: true }
      )
    )
  }
}
// 改結束 時間 + 位置
const setEndPlan = ($event: MouseEvent, dayId: number, plan: PlanData) => {
  const { time: planTime, style: planStyle } = plan
  const { id: uuid } = planTime

  setLastUpdatePlan(dayId, uuid)
  setOriginPlan(dayId, plan)

  if (originPlanMap.has(uuid)) {
    const { clientY: mouseDownY } = $event

    const originPlan = originPlanMap.get(uuid)
    const { originTop, originHeight, originStartSecond } = originPlan

    // 滑鼠移動時執行
    scheduleContainer.value.addEventListener(
      'mousemove',
      throttle(
        function ($event: MouseEvent) {
          if (isCheck) return

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

          planRenderKey[dayId] += `${dayId}`
        },
        _FPS,
        { isNoLeading: true }
      )
    )
  }
}
// 改分配 時間 + 位置
const moveDataPlan = ($event: MouseEvent, dayId: number, plan: PlanData) => {
  const { time: planTime, style: planStyle } = plan
  const { id: uuid } = planTime

  setLastUpdatePlan(dayId, uuid)
  setOriginPlan(dayId, plan)

  if (originPlanMap.has(uuid)) {
    const { clientY: mouseDownY } = $event

    const originPlan = originPlanMap.get(uuid)
    const { originTop, originHeight, originStartSecond, originEndSecond } = originPlan

    // 滑鼠移動時執行
    scheduleContainer.value.addEventListener(
      'mousemove',
      throttle(
        function ($event: MouseEvent) {
          if (isCheck) return

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

          planRenderKey[dayId] += `${dayId}`
        },
        _FPS,
        { isNoLeading: true }
      )
    )
  }
}

let isCheck = false
// 如果最後更新的分配有重複 移到原位
// 如果確認中 無法對 分配進行修改
const checkLastUpdatePlan = async () => {
  const { dayId, uuid } = lastUpdatePlan.value

  if (![dayId, uuid].includes(null)) {
    isCheck = true

    const plan = planData[dayId].find(plan => plan.time.id === uuid)
    delete plan.style.cursor
    delete plan.style.zIndex

    const { startSecond, endSecond } = plan.time

    const isExist = checkTimeIsExist(dayId, startSecond, endSecond, uuid)
    if (isExist) {
      moveOrigin(dayId, plan)
    }

    planRenderKey[dayId] += `${dayId}`
    await nextTick()

    lastUpdatePlan.value = { dayId: null, uuid: null }
    setTimeout(() => {
      isCheck = false
    }, _FPS * 10)
  }
}

// 建立暫時的工時分配
const createTempPlan = ($event: MouseEvent, dayId: number, hour: number) => {
  closeUpdate()
  const { clientY: mouseDownY } = $event

  // 表格
  const containerEl = scheduleContainer.value
  // 日期 + 小時 對應的格子
  const blockEl = refMap.get(`${dayId}-${hour}`)
  currentDayId.value = dayId

  if (containerEl && blockEl) {
    const { top: containerTop, left: containerLeft } = containerEl.getBoundingClientRect()
    // 暫時工時分配: 開始
    const _startSecond = topToSecond(mouseDownY - containerTop)
    tempPlanTime.startSecond = secondFormat(_startSecond)
    tempPlanTime.start = secondToTime(_startSecond)

    // 暫時工時分配: 結束
    const _endSecond = _startSecond + oneHourSecond
    tempPlanTime.endSecond = secondFormat(_endSecond)
    tempPlanTime.end = secondToTime(_endSecond)

    // 暫時工時分配 top = 滑鼠上邊界 - 表格上邊界
    const tempPlanTop = mouseDownY - containerTop
    tempPlanStyle.top = topFormat(tempPlanTop)

    // 暫時工時分配 height = secondToTop(結束秒數 - 開始秒數)
    tempPlanStyle.height = secondToTop(tempPlanTime.endSecond - tempPlanTime.startSecond)

    // 區塊左邊界 - 表格左邊界 + (空出一點距離)
    const { left: blockLeft } = blockEl.getBoundingClientRect()
    tempPlanStyle.left = blockLeft - containerLeft + 1

    scheduleContainer.value.addEventListener(
      'mousemove',
      throttle(
        function ($event: MouseEvent) {
          const { clientY: mouseMoveY } = $event

          // 變化高度
          const _moveY = mouseMoveY - mouseDownY
          const _change = _moveY < 0 ? 0 : _moveY
          const _changeEndSecond = topToSecond(tempPlanTop + _change)
          tempPlanTime.endSecond = _changeEndSecond
          tempPlanTime.end = secondToTime(_changeEndSecond)

          tempPlanStyle.height = _change
        },
        _FPS,
        { isNoLeading: true }
      )
    )

    // 顯示暫時的工時分配
    tempPlanStyle.display = 'block'
  }
}

const containerRenderKey = ref(1)
/**
 * 更新 分配畫面
 * 如果有暫時的工時分配 新增
 * checkLastUpdatePlan()
 * removeEvent()
 */
const updateSchedule = async () => {
  console.log('updateSchedule')
  // 有暫時的工時分配
  if (tempPlanStyle.display === 'block') {
    const { start, startSecond, end, endSecond } = tempPlanTime
    const uuid = getUuid()
    createDataPlan(currentDayId.value, {
      id: uuid,
      status: 'new',
      start,
      startSecond,
      end,
      endSecond
    })
    // 隱藏暫時的工時分配
    tempPlanStyle.display = 'none'

    setLastUpdatePlan(currentDayId.value, uuid)
  }
  checkLastUpdatePlan()
  removeEvent()
}

const removeEvent = () => {
  // 從新渲染 代替 removeEventListener
  containerRenderKey.value++
}

// 編輯單個工時安排
const updateInfo = reactive<{
  isShow: boolean
  left: number
  top: number
  plan: PlanData
  dayId: number

  // 決定是否顯示用
  mousedownLeft: number
  mousedownTop: number
  mouseupLeft: number
  mouseupTop: number
}>({
  isShow: false,
  left: 0,
  top: 0,
  plan: null,
  dayId: -1,

  mousedownLeft: -1,
  mousedownTop: -1,
  mouseupLeft: -1,
  mouseupTop: -1
})

const formTimeValue = computed<any>({
  get() {
    let res = []
    if ([null, undefined].includes(updateInfo.plan)) {
      res = ['00:00', '00:00']
    } else {
      const [start, end] = [updateInfo.plan.time.start, updateInfo.plan.time.end]
      res = [`${start}`, `${end}`]
    }
    console.log('get', res)
    return res
  },
  set(v: [string, string]) {
    console.log('set', v)
    const [_start, _end] = v
    updateInfo.plan.time.start = _start
    updateInfo.plan.time.end = _end
  }
})

const closeUpdate = () => {
  updateInfo.isShow = false
}
const openUpdate = async (
  $event: MouseEvent,
  dayId: number,
  plan: PlanData,
  mouseEvent: string
) => {
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
      updateInfo.plan = plan
      updateInfo.dayId = dayId
      updateInfo.isShow = true
    }

    await nextTick()
    // 更新畫面 + 確認重複 + 移除 mouse event
    updateSchedule()
  }
}
/**
 * 編輯時間
 * 時間(HH:mm) => 秒數
 * 秒數 => top
 */
const onTimePickerChange = async (time: string) => {
  const [startTime, endTime] = time

  const [startSecond, endSecond] = [timeToSecond(startTime), timeToSecond(endTime)]

  console.log(lastUpdatePlan.value)
  const { dayId, plan } = updateInfo

  const { time: planTime, style: planStyle } = plan
  const { id: uuid } = planTime
  setLastUpdatePlan(dayId, uuid)
  setOriginPlan(dayId, plan)

  planTime.startSecond = startSecond
  planTime.start = secondToTime(startSecond)

  planTime.endSecond = endSecond
  planTime.end = secondToTime(endSecond)

  planStyle.top = secondToTop(planTime.startSecond)
  planStyle.height = secondToTop(planTime.endSecond - planTime.startSecond)
  // updateInfo.isShow = false

  await nextTick()
  await awaitTime(120)
  updateSchedule()
}
</script>

<template>
  <div class="schedule">
    <!-- 類型 -->
    <div class="schedule-type">
      <slot name="title">
        <h3>{{ props.title }}</h3>
      </slot>
      <div class="schedule-type-list">
        <div v-for="typeItem in props.options" :key="typeItem.value" class="schedule-type-itme">
          <div class="schedule-type-color" :style="{ backgroundColor: typeItem.color }"></div>
          <div class="schedule-type-label">
            <slot
              name="options"
              :key="typeItem.value"
              :label="typeItem.label"
              :color="typeItem.color"
            >
              {{ typeItem.label }}
            </slot>
          </div>
        </div>
      </div>
    </div>

    <!-- 工時安排 -->
    <div class="schedule-wrapper" @mouseup="updateSchedule" @mouseleave="updateSchedule">
      <!-- 左邊: 時間 -->
      <div class="schedule-time">
        <div class="schedule-time-zero">{{ '00:00' }}</div>
        <ul class="schedule-time-list">
          <li v-for="hour in 24" :key="hour" class="schedule-time-item">
            <div class="text">{{ `${hour}:00`.padStart(5, '0') }}</div>
          </li>
        </ul>
      </div>

      <!-- 右邊: 一周 + 表格 -->
      <div class="schedule-week">
        <!-- 星期 -->
        <ul class="schedule-day-list">
          <li
            v-for="dayItem in dayList"
            :ref="`day-${dayItem.id}`"
            :key="dayItem.id"
            class="schedule-day-item"
          >
            {{ i18nTranslate(dayItem.label) }}
          </li>
        </ul>
        <!-- 表格 -->
        <div ref="scheduleContainer" class="schedule-container" :key="containerRenderKey">
          <!-- 暫時分配 -->
          <div
            class="schedule-temp-plan"
            :style="{
              display: tempPlanStyle.display,
              left: `${tempPlanStyle.left}px`,
              top: `${tempPlanStyle.top - 1}px`,
              height: `${tempPlanStyle.height}px`
            }"
          >
            <span>{{ `${tempPlanTime.start}` }}</span>
            <span> - </span>
            <span>{{ `${tempPlanTime.end}` }}</span>
          </div>

          <!-- 實際分配結果 -->
          <div class="schedule-list">
            <div v-for="(column, dayId) in 7" :key="planRenderKey[dayId]" class="schedule-item">
              <!-- 單一分配結果 -->
              <div
                v-for="plan in planData[dayId]"
                :key="plan.time.id"
                class="schedule-data-plan"
                :style="{
                  ...plan.style,
                  top: `${plan.style.top - 1}px`,
                  height: `${plan.style.height}px`
                }"
                @mousedown.stop="openUpdate($event, dayId, plan, 'mousedown')"
                @mouseup.stop="openUpdate($event, dayId, plan, 'mouseup')"
              >
                <div
                  class="schedule-data-plan-before"
                  @mousedown="setStartPlan($event, dayId, plan)"
                ></div>
                <div class="schedule-data-plan-text" @mousedown="moveDataPlan($event, dayId, plan)">
                  <span>{{ `${plan.time.start}` }}</span>
                  <span> - </span>
                  <span>{{ `${plan.time.end}` }}</span>
                </div>
                <div
                  class="schedule-data-plan-after"
                  @mousedown="setEndPlan($event, dayId, plan)"
                ></div>
              </div>
            </div>
          </div>

          <!-- 背景表格 -->
          <template v-for="(row, hour) in 24" :key="hour">
            <div
              v-for="(column, dayId) in 7"
              :key="column"
              :ref="
                el => {
                  refMap.set(`${dayId}-${hour}`, el)
                  return `${dayId}-${hour}`
                }
              "
              class="schedule-block"
              @mousedown="createTempPlan($event, dayId, hour)"
            >
              <div class="first-block"></div>
              <div class="second-block"></div>
            </div>
          </template>
        </div>
      </div>
    </div>

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
$header-height: 30px;
$body-height: v-bind(bodyHeight);

.schedule {
  // 類型
  &-type {
    display: flex;
    align-items: center;

    &-list {
      display: flex;
    }
    &-itme {
      padding: 6px;
      gap: 6px;
      @extend %flex-center;
    }
    &-color {
      width: 24px;
      height: 24px;
      border-radius: 6px;
    }
    &-label {
      font-weight: 600;
      line-height: 30px;
    }
  }

  // 工時安排
  &-wrapper {
    width: 100%;
    min-width: 560px;
    height: fit-content;
    display: flex;
    padding: 24px 12px 56px;
    user-select: none;
    position: relative;
  }

  &-time {
    width: 48px;
    &-zero {
      width: 100%;
      height: $header-height;
      transform: translateY(22px);
    }
    &-list {
      width: 100%;
      height: $body-height;
      display: grid;
      grid-template-rows: repeat(24, 1fr);
    }
    &-item {
      color: #4d4d4d;
      .text {
        transform: translateY(32px);
      }
    }
  }
  &-week {
    flex: 1;
  }

  &-day {
    &-list {
      width: 100%;
      height: $header-height;
      display: grid;
      grid-template-rows: 1fr;
      grid-template-columns: repeat(7, 1fr);
    }
    &-item {
      @extend %flex-center;
      color: #4d4d4d;
    }
  }

  &-temp-plan {
    width: calc(100% / 7 - 5px);
    position: absolute;
    top: 0;
    left: 2px;
    border-radius: 4px;
    min-height: 12px;
    background-color: #eeeeee80;
    border: 1px solid #dddddd;
    text-align: center;
    padding-top: 2px;
  }
  &-container {
    width: 100%;
    height: $body-height;
    position: relative;
    border-top: 1px solid #dddddd;
    border-left: 1px solid #dddddd;
    display: grid;
    grid-template-rows: repeat(24, 1fr);
    grid-template-columns: repeat(7, 1fr);
  }
  &-list {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 0;
    display: flex;
  }
  &-item {
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-right: 1px solid #dddddd00;
  }
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

  &-block {
    border-right: 1px solid #dddddd;
    display: flex;
    flex-direction: column;
    // transition-duration: 0.2s;
    // transition-property: background-color;
    // transition-delay: 0.2s;

    // &:hover {
    //   background-color: #d6e6f397;
    //   transition-delay: 0s;
    // }
    .first-block {
      flex: 1;
      border-bottom: 1px solid #eeeeee;
    }
    .second-block {
      flex: 1;
      border-bottom: 1px solid #dddddd;
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
