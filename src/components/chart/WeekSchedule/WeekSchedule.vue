<script setup lang="ts">
import { PropType, reactive, ref } from 'vue'
import type { Hook } from '@/declare/hook'
import { inject } from 'vue'
import throttle from '@/lib/throttle'

import type {
  DataPlanTime,
  // DataPlanStyle,
  TempPlanTime,
  TempPlanStyle,
  PlanData,
  Origin
} from './planType'
// import PlanItem from './PlanItem.vue'

import { v4 as uuidv4 } from 'uuid'

export type TypeItem = {
  key: string
  label: string
  color: string
}

const hook: Hook = inject('hook')
const { i18nTranslate } = hook()

const props = defineProps({
  typeList: {
    type: Array as PropType<TypeItem[]>,
    required: false
  },
  itemList: {
    type: Array as PropType<any[]>,
    required: false
  }
})

console.log(props)

const dayList = [
  { id: 0, label: 'sunday' },
  { id: 1, label: 'monday' },
  { id: 2, label: 'tuesday' },
  { id: 3, label: 'wednesday' },
  { id: 4, label: 'thursday' },
  { id: 5, label: 'friday' },
  { id: 6, label: 'saturday' }
]

const oneHourHeight = 40
const oneHourSecond = 1 * 60 * 60
const twentyFourHourSecond = 24 * 60 * 60

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
  left: '0px',
  top: '0px',
  height: '0px',
  display: 'none'
})
const currentDayId = ref(0)

// 工時分配資料
const planRenderKey = reactive({
  0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6'
})
// const planData: Record<string, (DataPlanTime & DataPlanStyle)[]> = {
const planData: Record<number, PlanData[]> = {
  0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []
}

// 總秒數 換算成 hh:mm
const secondToTime = (second: number) => {
  const tempSecond = ((_second) => {
    if (_second < 0) return 0
    if (_second > twentyFourHourSecond) return twentyFourHourSecond
    return _second
  })(second)

  const resHour = Math.floor(tempSecond / oneHourSecond)
  const resMinutes = Math.floor((tempSecond - (resHour * oneHourSecond)) / 60)
  return `${resHour}`.padStart(2, '0') + ':' + `${resMinutes}`.padStart(2, '0')
}

// 用距離的比例算時間
const getStartSecond = (height: number, hour: number) => {
  // 比例 = 滑鼠上邊界 - 區塊上邊界
  const percentage = ((_percentage) => {
    if (_percentage < 0) return 0
    if (_percentage > 100) return 100
    return _percentage
  })(height / oneHourHeight)

  // 總秒數 = 區塊前面的總小時(秒數) + 當前區塊的秒數
  return (hour * oneHourSecond) + oneHourSecond * percentage
}

const setDefaultTempPlanEnd = (startSecond: number) => {
  // 如果小時 > 23
  if (startSecond > twentyFourHourSecond - oneHourSecond) {
    // 時間變化比
    const percentage = (startSecond - (twentyFourHourSecond - oneHourSecond)) / oneHourSecond

    // 剩下的時間高度 = (100% - 時間變化比) * 一小時的高度
    tempPlanStyle.height = `${(1 - percentage) * oneHourHeight}px`
    tempPlanTime.endSecond = twentyFourHourSecond
    tempPlanTime.end = secondToTime(twentyFourHourSecond)
  } else {
    tempPlanStyle.height = '40px'
    tempPlanTime.endSecond = startSecond + oneHourSecond
    tempPlanTime.end = secondToTime(tempPlanTime.endSecond)
  }
}

// 確認工時 是否存在
const checkTimeIsExist = (
  dayId: number,
  startSecond: number,
  endSecond: number,
  filterId: string | null = null
): boolean => {
  let planList = []

  if (filterId === null) {
    planList = planData[dayId]
  } else {
    planList = planData[dayId].filter(plan => plan.time.id !== filterId)
  }
  // 全部都不包含
  return !planList.every(plan => {
    // 開始和結束都 < 開始
    // 開始和結束都 > 結束
    const { startSecond: _startSecond, endSecond: _endSecond } = plan.time
    return (
      startSecond < _startSecond &&
      endSecond < _startSecond
    ) || (
      startSecond > _endSecond &&
      endSecond > _endSecond
    )
  })
}

// 修改工時分配
const originPlanMap = new Map<string, Origin>()
const isUpdateOrigin = ref(false)

// 建立工時分配
const createDataPlan = (dayId: number, dataTime: DataPlanTime) => {
  const { id: uuid, startSecond, endSecond } = dataTime
  const isExist = checkTimeIsExist(dayId, startSecond, endSecond)

  const _top = (startSecond / oneHourSecond) * oneHourHeight - 2
  const _height = (endSecond - startSecond) / oneHourSecond * oneHourHeight

  if (!isExist) {
    planData[dayId].push({
      time: dataTime,
      style: {
        top: `${_top}px`,
        height: `${_height}px`
      }
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

/**
 * 當工時有重疊時 移到原本的位置
 * @param dayId
 * @param uuid
 */
const moveOriginDataPlan = (plan: PlanData, dayId: number, uuid: string) => {
  const planStyle = plan.style

  if (originPlanMap.has(uuid)) {
    const originPlan = originPlanMap.get(uuid)
    const { originTop, originHeight, originStartSecond, originEndSecond } = originPlan

    planStyle.top = `${originTop}px`
    planStyle.height = `${originHeight}px`

    const planTime = plan.time
    planTime.startSecond = originStartSecond
    planTime.start = secondToTime(originStartSecond)
    planTime.endSecond = originEndSecond
    planTime.end = secondToTime(originEndSecond)

    planRenderKey[dayId] += `${dayId}`
  }
}

// 當滑鼠按下時執行
const moveDataPlan = ($event: MouseEvent, dayId: number, uuid: string) => {
  const plan = planData[dayId].find(plan => plan.time.id === uuid)
  const planTime = plan.time
  const planStyle = plan.style

  // 如果滑鼠到外面 就會沒有設置 最後一次的 origin
  if (!isUpdateOrigin.value) {
    const { top, height } = planStyle
    const { startSecond, endSecond } = planTime
    originPlanMap.set(uuid, {
      // 原始樣式
      originTop: parseInt(top.split('px')[0]),
      originHeight: parseInt(height.split('px')[0]),
      // 原始開始與結束時間
      originStartSecond: startSecond,
      originEndSecond: endSecond
    })

    isUpdateOrigin.value = true
  }

  if (originPlanMap.has(uuid)) {
    const { clientY: mouseDownY } = $event

    const originPlan = originPlanMap.get(uuid)
    const { originTop, originHeight, originStartSecond, originEndSecond } = originPlan

    // 滑鼠移動時執行
    scheduleContainer.value.addEventListener('mousemove', throttle(function ($event: MouseEvent) {
      const { clientY: mouseMoveY } = $event
      planStyle.cursor = 'move'
      planStyle.zIndex = 9
      isUpdateOrigin.value = false

      // 新的top = 原來top + 滑鼠變化量
      const _height = mouseMoveY - mouseDownY
      const _top = originTop + _height
      if ((originHeight + _top) < (960 - 2)) {
        planStyle.top = `${_top < -2 ? -2 : _top}px`
      } else {
        planStyle.top = `${960 - 2 - originHeight}px`
      }

      // 滑鼠變化比例 算 時間變化
      const percentage = _height / oneHourHeight
      const _second = oneHourSecond * percentage

      // 如果結束 === 24
      // 開始 = 24 - (原始的結束 - 原始的開始)
      if (planTime.endSecond === twentyFourHourSecond) {
        planTime.startSecond = twentyFourHourSecond - (originEndSecond - originStartSecond)
      } else {
        // 最小是0
        planTime.startSecond = originStartSecond + (
          _second < -originStartSecond ? -originStartSecond : _second
        )
      }
      planTime.start = secondToTime(planTime.startSecond)

      // 如果開始 === 0
      // 結束 = 原始的結束 - 原始的開始
      if (planTime.startSecond === 0) {
        planTime.endSecond = originEndSecond - originStartSecond
      } else {
        const afterEndSecond = originEndSecond + _second
        planTime.endSecond = afterEndSecond > twentyFourHourSecond ? twentyFourHourSecond : afterEndSecond
      }
      planTime.end = secondToTime(planTime.endSecond)

      planRenderKey[dayId] += `${dayId}`
    }, 10))
  }
}

// 滑鼠放開後執行
const afterMoveDataPlan = ($event: MouseEvent, dayId: number, uuid: string) => {
  containerRenderKey.value++

  const plan = planData[dayId].find(plan => plan.time.id === uuid)
  const { startSecond, endSecond } = plan.time
  delete plan.style.cursor
  delete plan.style.zIndex

  const isExist = checkTimeIsExist(dayId, startSecond, endSecond, uuid)
  if (isExist) {
    moveOriginDataPlan(plan, dayId, uuid)
  }
  const { top, height } = plan.style

  originPlanMap.set(uuid, {
    // 原始樣式
    originTop: parseInt(top.split('px')[0]),
    originHeight: parseInt(height.split('px')[0]),
    // 原始開始與結束時間
    originStartSecond: startSecond,
    originEndSecond: endSecond
  })

  isUpdateOrigin.value = true
}

// 建立暫時的工時分配
const createTempPlan = ($event: MouseEvent, dayId: number, hour: number) => {
  const { clientY: mouseDownY } = $event

  // 表格
  const containerEl = scheduleContainer.value
  // 日期 + 小時 對應的格子
  const blockEl = refMap.get(`${dayId}-${hour}`)
  currentDayId.value = dayId

  if (containerEl && blockEl) {
    const { top: containerTop, left: containerLeft } = containerEl.getBoundingClientRect()
    // 滑鼠上邊界 - 表格上邊界
    const tempPlanTop = mouseDownY - containerTop - 2
    tempPlanStyle.top = `${tempPlanTop}px`

    // 區塊左邊界 - 表格左邊界
    const { top: blockTop, left: blockLeft } = blockEl.getBoundingClientRect()
    tempPlanStyle.left = `${blockLeft - containerLeft + 1}px`

    // 用距離占比 算 開始時間
    const currentSecond = getStartSecond(mouseDownY - blockTop, hour)
    tempPlanTime.startSecond = currentSecond
    tempPlanTime.start = secondToTime(currentSecond)

    // 初始化 高度 + 結束時間
    setDefaultTempPlanEnd(tempPlanTime.startSecond)

    scheduleContainer.value.addEventListener('mousemove', throttle(function ($event: MouseEvent) {
      const { clientY: mouseMoveY } = $event

      // 改變 高度
      const _top = tempPlanTop + containerTop
      const tempPlanTopHeight = (mouseMoveY - _top) < 0 ? 0 : mouseMoveY - _top
      tempPlanStyle.height = `${tempPlanTopHeight}px`

      // 改變 結束時間
      // 變化的高度比
      const percentage = tempPlanTopHeight / oneHourHeight
      // 結束時間 = 開始時間 + 變化的秒數
      tempPlanTime.endSecond = tempPlanTime.startSecond + oneHourSecond * percentage
      tempPlanTime.end = secondToTime(tempPlanTime.endSecond)
    }, 10))

    // 顯示暫時的工時分配
    tempPlanStyle.display = 'block'
  }
}

const containerRenderKey = ref(1)
const removeEvent = () => {
  // 有暫時的工時分配
  if (tempPlanStyle.display === 'block') {
    const { start, startSecond, end, endSecond } = tempPlanTime
    createDataPlan(currentDayId.value, {
      id: uuidv4(),
      status: 'new',
      start,
      startSecond,
      end,
      endSecond
    })
    // 隱藏暫時的工時分配
    tempPlanStyle.display = 'none'
  }
  // 從新渲染 代替 removeEventListener
  containerRenderKey.value++
}

</script>

<template>
  <div class="schedule-wrapper" @mouseup="removeEvent" @mouseleave="removeEvent">
    <!-- 左邊: 時間 -->
    <div class="schedule-time">
      <div class="schedule-time-zero">{{ '00:00' }}</div>
      <ul class="schedule-time-list">
        <li
          v-for="hour in 24"
          :key="hour"
          class="schedule-time-item"
        >
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
      <div
        ref="scheduleContainer"
        class="schedule-container"
        :key="containerRenderKey"
      >
        <!-- 暫時分配 -->
        <div class="schedule-temp-plan" :style="tempPlanStyle">
          <span>{{ `${tempPlanTime.start}` }}</span>
          <span> - </span>
          <span>{{ `${tempPlanTime.end}` }}</span>
        </div>

        <!-- 實際分配結果 -->
        <div class="schedule-list">
          <div v-for="(column, dayId) in 7" :key="planRenderKey[dayId]" class="schedule-item">
            <div
              v-for="plan in planData[dayId]"
              class="schedule-data-plan"
              :key="plan.time.id"
              :style="plan.style"
              @mousedown="moveDataPlan($event, dayId, plan.time.id)"
              @mouseup="afterMoveDataPlan($event, dayId, plan.time.id)"
            >
              <span>{{ `${plan.time.start}` }}</span>
              <span> - </span>
              <span>{{ `${plan.time.end}` }}</span>
            </div>
          </div>
        </div>

        <!-- 背景表格 -->
        <template v-for="(row, hour) in 24" :key="hour">
          <div
            v-for="(column, dayId) in 7"
            :key="column"
            :ref="(el) => {
              refMap.set(`${dayId}-${hour}`, el)
              return `${dayId}-${hour}`
            }"
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
</template>

<style lang="scss" scoped>
$header-height: 30px;
$body-height: 960px;
.schedule {
  &-wrapper {
    width: 100%;
    min-width: 560px;
    height: fit-content;
    display: flex;
    padding: 24px 12px 56px;
    user-select: none;
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
    min-height: 6px;
    background-color: #eeeeee80;
    border: 1px solid #dddddd;
    text-align: center;
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
    min-height: 6px;
    border-radius: 4px;
    text-align: center;
    border: 1px solid #337ecc;
    background-color: #a0cfff80;
    cursor: pointer;
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
}
</style>