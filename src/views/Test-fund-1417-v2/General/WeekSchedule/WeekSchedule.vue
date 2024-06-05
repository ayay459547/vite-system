<script setup lang="ts">
import type { PropType } from 'vue'
import { onMounted, reactive, ref, inject, nextTick } from 'vue'

import type { UseHook } from '@/declare/hook'
import { isEmpty, awaitTime } from '@/lib/lib_utils'
import { defaultModuleType } from '@/i18n/i18n_setting'

import type { PlanList } from './planType'
import { tableHeight, secondToTop, timeToSecond } from './planUtils'

import PlanDay from './Components/PlanDay.vue'

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

const bodyHeight = `${tableHeight}px`

type option = {
  label: string
  value: any
  color: string
}
type ScheduleItem = {
  id?: string
  day: number
  status?: 'new' | 'update' | 'old'
  start: string
  end: string
}
type ScheduleList = Array<ScheduleItem>

const props = defineProps({
  title: {
    type: String as PropType<string>,
    required: false,
    default: ''
  },
  options: {
    type: Array as PropType<option[]>,
    required: false,
    default () {
      return []
    }
  },
  scheduleList: {
    type: Array as PropType<ScheduleList>,
    required: false,
    default () {
      return []
    }
  }
})

const dayList = [
  { id: 0, label: 'sunday' },
  { id: 1, label: 'monday' },
  { id: 2, label: 'tuesday' },
  { id: 3, label: 'wednesday' },
  { id: 4, label: 'thursday' },
  { id: 5, label: 'friday' },
  { id: 6, label: 'saturday' }
]

const isLoading = ref(true)

const scheduleContainer = ref(null)
const planDayMapRef = reactive({})

// 工時分配資料
const planData: Record<number, PlanList> = reactive({
  0: [],
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
  6: []
})

/**
 * 更新 分配畫面
 * 從新渲染 代替 removeEventListener
 */
const renderKey = ref(1)

// 初始化
const init = async (scheduleList: ScheduleList) => {
  console.log('scheduleList => ', scheduleList)

  isLoading.value = true
  await nextTick()
  scheduleList.forEach(scheduleItem => {
    const { id, day, status, start, end } = scheduleItem

    const startSecond = timeToSecond(start)
    const endSecond = timeToSecond(end)
    // 新增分配資料
    planData[day].push({
      time: {
        id,
        status,
        start,
        startSecond,
        end,
        endSecond
      },
      style: {
        top: secondToTop(startSecond),
        height: secondToTop(endSecond - startSecond)
      }
    })
  })

  await awaitTime(80)
  for (let dayId in planData) {
    const planList = planData[dayId]
    if (planDayMapRef[dayId]) {
      planDayMapRef[dayId].init(planList)
    }
  }

  await nextTick()
  setTimeout(() => {
    isLoading.value = false
  }, 300)
}

onMounted(() => {
  init(props.scheduleList)
})

defineExpose({
  init
})

const removeEvent = (n: number) => {
  console.log('removeEvent', n)
}

</script>

<template>
  <div class="schedule">
    <!-- 類型 -->
    <div class="schedule-type">
      <slot name="title">
        <h3 v-if="!isEmpty(props.title)">{{ props.title }}</h3>
      </slot>
      <div v-if="!isEmpty(props.options)" class="schedule-type-list">
        <div v-for="typeItem in props.options" :key="typeItem.value" class="schedule-type-itme">
          <div class="schedule-type-color" :style="{ backgroundColor: typeItem.color }"></div>
          <div class="schedule-type-label">
            <slot name="options" :key="typeItem.value" :label="typeItem.label" :color="typeItem.color">
              {{ typeItem.label }}
            </slot>
          </div>
        </div>
      </div>
    </div>

    <!-- 工時安排 -->
    <div class="schedule-wrapper" @mouseleave="renderKey++">
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
        <div ref="scheduleContainer" class="schedule-container" :key="renderKey">
          <!-- 每日分配結果 -->
          <PlanDay
            v-for="(column, dayId) in 7"
            :key="dayId"
            :ref="
              el => {
                planDayMapRef[`${dayId}`] = el
                return `${dayId}`
              }
            "
            :dayId="dayId"
            :planList="planData[dayId]"
            :scheduleContainer="scheduleContainer"
            @removeEvent="removeEvent(777)"
          />
        </div>
      </div>
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
    padding: 12px 12px 56px;
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

  &-container {
    width: 100%;
    height: $body-height;
    position: relative;
    border-top: 1px solid #dddddd;
    border-left: 1px solid #dddddd;
    display: flex;
  }
}
</style>
