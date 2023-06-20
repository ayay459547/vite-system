<script setup lang="ts">
import { PropType, reactive, ref } from 'vue'
import type { Hook } from '@/declare/hook'
import { inject } from 'vue'
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

const scheduleContainer = ref(null)

const refMap = new Map()

const getTime = (top: number, hour: number, clientY: number) => {
  // 用距離的比例算時間
  const _second = 1 * 60 * 60
  // 比例 = 滑鼠上邊界 - 區塊上邊界
  const percentage = (clientY - top) / oneHourHeight
  // 總秒數 = 區塊前面的總小時(秒數) + 當前區塊的秒數
  const second = (hour * 60 * 60) + _second * percentage

  // 換算成 hh:mm
  const resHour = Math.floor(second / 3600)
  const resMinutes = Math.floor((second - (resHour * 3600)) / 60)
  return `${resHour}`.padStart(2, '0') + ':' + `${resMinutes}`.padStart(2, '0')
}

const tempPlanStyle = reactive({
  time: '00:00',
  left: '0px',
  top: '0px'
})

const createTempPlan = ($event: MouseEvent, dayId: number, hour: number) => {
  const { clientY } = $event

  const containerEl = scheduleContainer.value
  const blockEl = refMap.get(`${dayId}-${hour}`)

  if (containerEl && blockEl) {
    const { top: containerTop, left: containerLeft } = containerEl.getBoundingClientRect()
    // 滑鼠上邊界 - 表格上邊界
    tempPlanStyle.top = `${clientY - containerTop - 2}px`

    const { top: blockTop, left: blockLeft } = blockEl.getBoundingClientRect()
    tempPlanStyle.left = `${blockLeft - containerLeft + 1}px`

    const currentTime = getTime(blockTop, hour, clientY)
    tempPlanStyle.time = currentTime
  }

  // scheduleContainer.value.addEventListener('mousemove')
}


</script>

<template>
  <div class="schedule-wrapper">
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

    <div class="schedule-week">
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
      <div ref="scheduleContainer" class="schedule-container">
        <div
          class="schedule-temp-plan"
          :style="{
            left: tempPlanStyle.left,
            top: tempPlanStyle.top
          }"
        >
          {{ tempPlanStyle.time }}
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
    width: calc(100% / 7 - 4px);
    position: absolute;
    top: 0;
    left: 2px;
    border-radius: 4px;
    min-height: 10px;
    background-color: #cccccc;
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
  &-block {
    border-right: 1px solid #dddddd;
    display: flex;
    flex-direction: column;
    transition-duration: 0.2s;
    transition-property: background-color;
    transition-delay: 1s;

    &:hover {
      background-color: #eeeeee;
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