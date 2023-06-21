<script setup lang="ts">
import { PropType, reactive, ref } from 'vue'
import type { Hook } from '@/declare/hook'
import { inject } from 'vue'
import throttle from '@/lib/throttle'
// import PlanItem from './PlanItem.vue'

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

const scheduleContainer = ref(null)

const refMap = new Map()

// 暫時的工時分配
const tempPlanTime = reactive({
  start: '00:00',
  startSecond: 0,
  end: '00:00',
  endSecond: 0
})
const tempPlanStyle = reactive({
  left: '0px',
  top: '0px',
  height: '0px',
  display: 'none'
})

// 總秒數 換算成 hh:mm
const secondToTime = (second: number) => {
  const resHour = Math.floor(second / oneHourSecond)
  const resMinutes = Math.floor((second - (resHour * oneHourSecond)) / 60)
  return `${resHour}`.padStart(2, '0') + ':' + `${resMinutes}`.padStart(2, '0')
}

// 用距離的比例算時間
const getStartSecond = (top: number, clientY: number, hour: number) => {
  // 比例 = 滑鼠上邊界 - 區塊上邊界
  const percentage = ((_percentage) => {
    if (_percentage < 0) return 0
    if (_percentage > 100) return 100
    return _percentage
  })((clientY - top) / oneHourHeight)

  // 總秒數 = 區塊前面的總小時(秒數) + 當前區塊的秒數
  return (hour * oneHourSecond) + oneHourSecond * percentage
}

const getTempPlanHeight = ($event: MouseEvent, top: number) => {
  const { clientY } = $event
  const tempPlanTopHeight = (clientY - top) < 0 ? 0 : clientY - top

  return tempPlanTopHeight
}

const setDefaultTempPlanEnd = (startSecond: number) => {
  tempPlanStyle.height = '40px'
  tempPlanTime.endSecond = startSecond + oneHourSecond
  tempPlanTime.end = secondToTime(tempPlanTime.endSecond)
}

const createTempPlan = ($event: MouseEvent, dayId: number, hour: number) => {
  const { clientY } = $event

  // 表格
  const containerEl = scheduleContainer.value
  // 日期 + 小時 對應的格子
  const blockEl = refMap.get(`${dayId}-${hour}`)

  if (containerEl && blockEl) {
    const { top: containerTop, left: containerLeft } = containerEl.getBoundingClientRect()
    // 滑鼠上邊界 - 表格上邊界
    const tempPlanTop = clientY - containerTop - 2
    tempPlanStyle.top = `${tempPlanTop}px`

    // 區塊左邊界 - 表格左邊界
    const { top: blockTop, left: blockLeft } = blockEl.getBoundingClientRect()
    tempPlanStyle.left = `${blockLeft - containerLeft + 1}px`

    // 用距離占比算 開始時間
    const currentSecond = getStartSecond(blockTop, clientY, hour)
    tempPlanTime.startSecond = currentSecond
    tempPlanTime.start = secondToTime(currentSecond)

    // 初始化 高度 + 結束時間
    setDefaultTempPlanEnd(tempPlanTime.startSecond)

    scheduleContainer.value.addEventListener('mousemove', throttle(function ($event: MouseEvent) {
      // 改變 高度
      const tempPlanTopHeight = getTempPlanHeight($event, tempPlanTop + containerTop)
      tempPlanStyle.height = `${tempPlanTopHeight}px`

      // 改變 結束時間
      // 變化的高度比
      const percentage = tempPlanTopHeight / oneHourHeight
      // 結束時間 = 開始時間 + 變化的秒數
      tempPlanTime.endSecond = tempPlanTime.startSecond + oneHourSecond * percentage
      tempPlanTime.end = secondToTime(tempPlanTime.endSecond)
    }, 30))

    // 顯示暫時的工時分配
    tempPlanStyle.display = 'block'
  }
}

const renderKey = ref(1)
const removeEvent = () => {
  // 從新渲染 代替 removeEventListener
  renderKey.value++
  // 隱藏暫時的工時分配
  // tempPlanStyle.display = 'none'
}

</script>

<template>
  <div class="schedule-wrapper">
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
        :key="renderKey"
        @mouseup="removeEvent"
        @mouseleave="removeEvent"
      >
        <div class="schedule-temp-plan" :style="tempPlanStyle">
          {{ `${tempPlanTime.start} - ${tempPlanTime.end}` }}
        </div>

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
    padding: 4px;
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
    background-color: #eeeeee;
    border: 1px solid #dddddd;
    text-align: center;
    user-select: none;
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
  &-block {
    border-right: 1px solid #dddddd;
    display: flex;
    flex-direction: column;
    transition-duration: 0.2s;
    transition-property: background-color;
    transition-delay: 1s;

    &:hover {
      background-color: #eaf6ff97;
      transition-delay: 0s;
    }
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