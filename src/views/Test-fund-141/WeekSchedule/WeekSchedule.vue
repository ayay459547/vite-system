<script setup lang="ts">
import type { PropType } from 'vue'
import { onMounted, reactive, ref, inject, computed } from 'vue'

import type { UseHook } from '@/declare/hook'
import { isEmpty, getUuid } from '@/lib/lib_utils'
import { defaultModuleType } from '@/i18n/i18n_setting'

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
  // oneHourHeight,
  oneHourSecond,
  // 限制 00:00 ~ 23:59 區間
  secondFormat,
  topFormat,
  // 轉換用
  secondToTop,
  topToSecond,
  secondToTime
} from './planUtils'

import PlanDay from './Components/PlanDay.vue'

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
    default () {
      return []
    }
  },
  itemList: {
    type: Array as PropType<any[]>,
    required: false
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

const scheduleContainer = ref(null)

// 工時分配資料
const planData: Record<number, PlanData[]> = reactive({
  0: [],
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
  6: []
})

const containerRenderKey = ref(1)

const addDataPlan = (dayId: number, newPlanData: PlanData) => {
  planData[dayId].push(newPlanData)
}

/**
 * 更新 分配畫面
 * 如果有暫時的工時分配 新增
 * checkLastUpdatePlan()
 * removeEvent()
 */
const updateSchedule = async () => {
  removeEvent()
}

const removeEvent = () => {

  // 從新渲染 代替 removeEventListener
  containerRenderKey.value++
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
          <!-- 實際分配結果 -->
          <div class="schedule-detail">
            <!-- 每日分配結果 -->
            <PlanDay
              v-for="(column, dayId) in 7"
              :key="dayId"
              :dayId="dayId"
              :planData="planData[dayId]"
              :scheduleContainer="scheduleContainer"
              @addDataPlan="addDataPlan"
              @removeEvent="removeEvent"
            />
          </div>
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
    border: 1px solid #dddddd;
    display: grid;
    grid-template-rows: repeat(24, 1fr);
    grid-template-columns: repeat(7, 1fr);
  }
  &-detail {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    display: flex;
  }
}
</style>
