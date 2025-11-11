<script setup lang="ts">
import { onMounted, ref, inject, nextTick } from 'vue'
import { storeToRefs } from 'pinia'

import type { UseHook } from '@/types/types_hook' // 全域功能類型
import { isEmpty, getProxyData, getUuid, awaitTime } from '@/lib/lib_utils' // 工具
import { defaultModuleType } from '@/declare/declare_i18n'
import { useWeekScheduleStore } from '@/stores/stores_components/useWeekScheduleStore'

import type { Types, Props, Expose } from './WeekScheduleInfo'
import { version, props as weekScheduleProps } from './WeekScheduleInfo'
import {
  tableHeight,
  timeToSecond,
  secondToTime,
  oneHourSecond,
  maxSecond
} from './planUtils'
import PlanDay from './Components/PlanDay.vue'
import CustomIcon from '@/components/feature/CustomIcon/CustomIcon.vue'

const scopedId = getUuid(version)

const useHook = inject('useHook') as UseHook
const { i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

const bodyHeight = `${tableHeight}px`

const props = defineProps(weekScheduleProps)

const dayList: Array<{
  id: number
  label: string
  i18nLabel: string
}> = [
  { id: 1, label: 'monday', i18nLabel: 'datetime-monday' },
  { id: 2, label: 'tuesday', i18nLabel: 'datetime-tuesday' },
  { id: 3, label: 'wednesday', i18nLabel: 'datetime-wednesday' },
  { id: 4, label: 'thursday', i18nLabel: 'datetime-thursday' },
  { id: 5, label: 'friday', i18nLabel: 'datetime-friday' },
  { id: 6, label: 'saturday', i18nLabel: 'datetime-saturday' },
  { id: 7, label: 'sunday', i18nLabel: 'datetime-sunday' }
]

const isLoading = ref(true)

const scheduleContainer = ref(null)

// 跨天處理資料
const weekScheduleStore = useWeekScheduleStore()
const {
  checkTimeIsExist,
  insertData,
  setPlanDayRef,
  initPlanDay,
  getPlanDayData
} = weekScheduleStore
const { planData, focusedId } = storeToRefs(weekScheduleStore)

// 對應小時 新增一周資料
const insertHourToWeek = (hour: number) => {
  dayList.forEach(async dayItem => {
    const insertDayId = `${dayItem.id}`

    const startSecond = hour * oneHourSecond
    const start = secondToTime(startSecond)

    const endSecond = Math.min(maxSecond, (startSecond + oneHourSecond))
    const end = secondToTime(endSecond)

    const { isTimeExist } = await checkTimeIsExist(insertDayId, {
      startSecond,
      endSecond
    })
    if (!isTimeExist) {
      insertData(insertDayId, {
        start,
        startSecond,
        end,
        endSecond,
        uuid: getUuid('new'),
        status: 'new'
      })
    }
  })
}

// 移除一天的所有分配
const removeDay = (dayId: number) => {
  initPlanDay(`${dayId}`, [])
}

/**
 * 更新 分配畫面
 * 從新渲染 代替 removeEventListener
 */
const renderKey = ref(1)

// 初始化
const init: Expose['init'] = async (scheduleList: Props['scheduleList']) => {
  isLoading.value = true
  await nextTick()
  // 清除資料
  for (const dayId in planData.value) {
    planData.value[dayId].splice(0)
  }

  // 設定原始資料
  scheduleList.forEach(scheduleItem => {
    const { id, dayId, status, start, end } = scheduleItem

    if (
      typeof dayId === 'number' &&
      typeof start === 'string' &&
      typeof end === 'string'
    ) {
      // 新增分配資料
      planData.value[dayId].push({
        uuid: getUuid('old'),
        id: `${id}`,
        dayId,
        status,
        start,
        startSecond: timeToSecond(start),
        end,
        endSecond: timeToSecond(end)
      })
    }
  })

  // 原始資料設定在每天中
  await awaitTime(80)
  for (const dayId in planData.value) {
    const planList: Types['planTime'][] = getProxyData(planData.value[dayId])
    initPlanDay(dayId, planList)
    // if (planDayMapRef[dayId]) {
    //   planDayMapRef[dayId].init(planList)
    // }
  }

  await nextTick()
  setTimeout(() => {
    isLoading.value = false
  }, 300)
}

onMounted(() => {
  init(props.scheduleList)
})

// 取資料
const getData: Expose['getData'] = async () => {
  await nextTick()

  const createList = []
  const updateList = []
  const removeList = []
  const oldList = []
  const allList = []

  for (const dayId in planData.value) {
    // 在各天整理後的資料
    const {
      create = [],
      update = [],
      remove = [],
      old = [],
      all = []
    } = await getPlanDayData(dayId)

    createList.push(...create)
    updateList.push(...update)
    removeList.push(...remove)
    oldList.push(...old)
    allList.push(...all)
  }

  return {
    create: createList,
    update: updateList,
    remove: removeList,
    old: oldList,
    all: allList
  }
}

defineExpose({ init, getData })

</script>

<template>
  <div v-loading="isLoading" class="schedule" :class="scopedId">
    <!-- 類型 -->
    <div class="schedule-type">
      <slot name="title">
        <h3 v-if="!isEmpty(props.title)">{{ props.title }}</h3>
      </slot>
      <div v-if="!isEmpty(props.options)" class="schedule-type-list">
        <div
          v-for="typeItem in props.options"
          :key="`schedule-${typeItem.value}`"
          class="schedule-type-itme"
        >
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
    <div class="schedule-wrapper">
      <!-- 左邊: 時間 -->
      <div class="schedule-time">
        <div class="schedule-time-zero">{{ '00:00' }}</div>
        <ul class="schedule-time-list">
          <li
            v-for="hour in 24"
            :key="`hour-${hour}`"
            class="schedule-time-item"
            @click="insertHourToWeek(hour - 1)"
          >
            <div class="insert text-primary">
              <CustomIcon name="right-long" />
            </div>
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
            :key="`day-${dayItem.id}`"
            class="schedule-day-item"
            :class="[6, 7].includes(dayItem.id) ? 'text-danger' : ''"
          >
            {{ i18nTranslate(dayItem.i18nLabel) }}

            <div
              class="remove-day
              text-danger"
              @click="removeDay(dayItem.id)"
            >
              <CustomIcon name="xmark" />
            </div>
          </li>
        </ul>
        <!-- 表格 -->
        <div
          ref="scheduleContainer"
          class="schedule-container"
          :key="renderKey"
          @click="() => {
            focusedId = '' // 清空聚焦
          }"
          @mouseleave="() => {
            focusedId = '' // 清空聚焦
          }"
        >
          <!-- 每日分配結果 -->
          <PlanDay
            v-for="dayItem in dayList"
            :key="`PlanDay-${dayItem.id}`"
            :ref="(el: InstanceType<typeof PlanDay>) => {
              if (el) {
                setPlanDayRef(`${dayItem.id}`, el)
                // planDayMapRef[`${dayItem.id}`] = el
              }
              return el
            }"
            :dayId="dayItem.id"
            :planList="planData[dayItem.id]"
            :scheduleContainer="scheduleContainer"
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
    width: clamp(720px, 100%, 100%);
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
    &-max {
      width: 100%;
      height: $header-height;
      transform: translateY(-8px);
    }
    &-list {
      width: 100%;
      height: $body-height;
      display: grid;
      grid-template-rows: repeat(24, 1fr);
    }
    &-item {
      position: relative;
      cursor: pointer;
      color: var(--el-text-color-primary);

      .insert {
        width: fit-content;
        position: absolute;
        right: 0;
        z-index: 5;
        display: none;
        transform: translateX(100%);
        font-size: 1.5em;
      }
      &:hover {
        .insert {
          display: block;
        }
      }

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
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: var(--el-text-color-primary);
      position: relative;

      .remove-day {
        position: absolute;
        display: none;
        cursor: pointer;
        right: 0;
        padding: 4px;
      }
      &:hover {
        .remove-day {
          display: block;
        }
      }
    }
  }

  &-container {
    width: 100%;
    height: $body-height;
    position: relative;
    border-top: 1px solid var(--el-color-info-light-5);
    border-left: 1px solid var(--el-color-info-light-5);
    display: flex;
  }
}
</style>
