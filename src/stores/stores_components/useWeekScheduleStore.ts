import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'

import type { Types } from '@/components/chart/WeekSchedule/WeekScheduleInfo'
import PlanDay from '@/components/chart/WeekSchedule/Components/PlanDay.vue'

import { isEmpty } from '@/lib/lib_utils' // 工具

export const useWeekScheduleStore = defineStore('WeekSchedule', () => {
  // 工時分配資料
  const planData = ref<Record<number, Types['planTime'][]>>({
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: []
  })

  // 跨天處理資料
  const planDayMapRef = reactive<Record<string, InstanceType<typeof PlanDay>>>({})
  const setPlanDayRef = (dayId: string, el: InstanceType<typeof PlanDay>) => {
    planDayMapRef[dayId] = el
  }

  /**
   * @description 跨天初始化資料
   * @param {String} dayId 天
   * @param {Array} planList 初始化分配資料
   */
  const initPlanDay = (dayId: string, planList: Types['planTime'][]) => {
    if (planDayMapRef[dayId]) {
      return planDayMapRef[dayId].init(planList)
    }
  }

  /**
   * @description 跨天取得分配資訊
   * @param {String} dayId 天
   */
  const getPlanDayData = async (dayId: string) => {
    if (planDayMapRef[dayId]) {
      return await planDayMapRef[dayId].getData()
    }
    return {
      create: [],
      update: [],
      remove: [],
      old: [],
      all: []
    }
  }

  /**
   * @description 跨天檢查時間是否已存在
   * @param {String} dayId 天
   * @param {Object} options 選項
   *                 startSecond 開始時間
   *                 endSecond 結束時間
   *                 filterId 過濾不檢查的Id
   */
  const checkTimeIsExist = async (dayId: string, options: Types['checkTimeIsExistOptions']) => {
    if (planDayMapRef[dayId]) {
      return await planDayMapRef[dayId].checkTimeIsExist(options)
    }
    return {
      sameIdList: [],
      existIdList: [],
      isTimeExist: false
    }
  }

  /**
   * @description 跨天新增分配(包含 checkTimeIsExist)
   * @param {String} dayId 天
   * @param {Object} planTime 分配資訊
   */
  const insertData = (dayId: string, planTime: Types['planTime']) => {
    if (planDayMapRef[dayId]) {
      planDayMapRef[dayId].insertData(planTime)
    }
  }

  /**
   * @description 跨天刪除分配(包含 checkTimeIsExist)
   * @param {String} dayId 天
   * @param {Object} planTime 分配資訊
   */
  const removeData = (dayId: string, planTime: Types['planTime']) => {
    if (planDayMapRef[dayId]) {
      planDayMapRef[dayId].removeData(planTime)
    }
  }

  // 當前聚焦的分配
  const focusedId = ref('')
  const isHasFocusedPlan = computed(() => {
    return !isEmpty(focusedId.value)
  })

  return {
    planData,
    planDayMapRef,
    setPlanDayRef,
    // PlanDay
    initPlanDay,
    getPlanDayData,
    checkTimeIsExist,
    insertData,
    removeData,
    // PlanDayItem
    focusedId,
    isHasFocusedPlan
  }
})
