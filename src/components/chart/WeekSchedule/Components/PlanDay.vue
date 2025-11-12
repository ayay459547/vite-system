<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, nextTick, reactive, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import { getUuid, isEmpty, getProxyData, hasOwnProperty } from '@/lib/lib_utils' // 工具
import { object_filter, object_reduce } from '@/lib/lib_object'
import { useWeekScheduleStore } from '@/stores/stores_components/useWeekScheduleStore'

import type { Types } from '../WeekScheduleInfo'
import { secondToTime } from '../planUtils'
import PlanDayItem from './PlanItem.vue'
import PlanDayTemp from './PlanTemp.vue'

const props = defineProps({
  dayId: {
    type: Number as PropType<number>,
    required: true
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '不可點擊 尚未對外開放'
  },
  planList: {
    type: Object as PropType<Types['planTime'][]>,
    required: true
  },
  scheduleContainer: {
    type: [Object, null] as PropType<any>,
    required: true
  }
})
const renderKey = ref(0)

// 最後一個更新的區塊
const lastChangePlan = ref('')
// 當分配被點擊 設定原始位置
const setOriginPlan = async (uuid: string, planTime: Types['planTime']) => {
  const { start, startSecond, end, endSecond } = planTime

  const { isTimeExist } = await checkTimeIsExist({
    startSecond: planTime.startSecond,
    endSecond: planTime.endSecond,
    filterId: uuid
  })
  // 不存在 才可更新
  if (isTimeExist) return

  // 將原來的位置 更新成現在的位置
  originPlanMap[uuid] = {
    // 原始開始與結束時間
    originStart: start,
    originStartSecond: startSecond,
    originEnd: end,
    originEndSecond: endSecond
  }
}

const planTimeMap: Record<string, Types['planTime']> = reactive({})

/**
 * @description 確認工時 是否存在
 * @param startSecond 開始時間
 * @param endSecond 結束時間
 * @param filterId 過濾不檢查id(自己不檢查)
 */
const checkTimeIsExist: Types['checkTimeIsExist'] = async ({ startSecond, endSecond, filterId }) => {
  await nextTick()
  let _planTimeMap = {}

  if (Array.isArray(filterId)) {
    _planTimeMap = object_filter(planTimeMap, (plan: Types['planTime']) => !filterId.includes(plan?.uuid ?? ''))
  } else if (typeof filterId === 'string') {
    _planTimeMap = object_filter(planTimeMap, (plan: Types['planTime']) => plan.uuid !== filterId)
  } else {
    _planTimeMap = getProxyData(planTimeMap)
  }


  const { sameIdList, existIdList, isTimeExist } = object_reduce<Types['checkTimeIsExistReturn']>(
    _planTimeMap,
    (
      res: Types['checkTimeIsExistReturn'],
      plan: Types['planTime'],
      uuid: string
    ) => {
    const {
      start,
      end,
      startSecond: _startSecond = 0,
      endSecond: _endSecond = 0,
      status
    } = plan
    // 特殊重複: 不允許相同時間
    if (secondToTime(startSecond) === start && secondToTime(endSecond) === end) {
      res.sameIdList.push(uuid)
      res.existIdList.push(uuid)
      res.isTimeExist = true
      return res
    }

    // 非重複
    if (
      // 開始和結束都 <= 開始
      // 開始和結束都 >= 結束
      (startSecond <= _startSecond && endSecond <= _startSecond) ||
      (startSecond >= _endSecond && endSecond >= _endSecond) ||
      // 刪除
      (status === 'delete')
    ) return res

    // 重複
    res.existIdList.push(uuid)
    res.isTimeExist = true
    return res
  }, {
    sameIdList: [],
    existIdList: [],
    isTimeExist: false
  })

  return {
    sameIdList,
    existIdList,
    isTimeExist
  }
}

// 跨天處理資料
const weekScheduleStore = useWeekScheduleStore()
const { focusedId } = storeToRefs(weekScheduleStore)
// 設定 最後一次的分配, 更新 focusedId
const setLastChangePlan = async (uuid: string, planTime: Types['planTime']) => {
  await nextTick()
  focusedId.value = uuid
  lastChangePlan.value = uuid
  setOriginPlan(uuid, planTime)
}
// 重置 最後一次的分配, 清空 focusedId
const resetLastChangePlan = async () => {
  await nextTick()
  lastChangePlan.value = null
}

// 修改工時分配
const originPlanMap: Record<string, Types['origin']> = reactive({})

const PlanDayTempRef = ref<InstanceType<typeof PlanDayTemp>>()
const openTempPlan = ($event: MouseEvent, hour: number) => {
  if (PlanDayTempRef.value) {
    PlanDayTempRef.value.openTempPlan($event, hour)
  }
}

// 分配的 PlanDayItem ref
const planDayItemRef = reactive<Record<string, InstanceType<typeof PlanDayItem>>>({})

// 更新 分配畫面
const updateSchedule = async (lastChangeId?: string) => {
  if (props.disabled) return

  await nextTick()
  // 檢查 最後編輯的資料, 不能設定重疊的工時
  const checkId = lastChangePlan.value ?? lastChangeId
  if (!isEmpty(checkId) && planDayItemRef[`PlanItem-${checkId}`]) {
    const { uuid, planTime } = await planDayItemRef[`PlanItem-${checkId}`].getPlanInfo()
    await planDayItemRef[`PlanItem-${checkId}`].removeEvent()
    const { isTimeExist } = await checkTimeIsExist({
      startSecond: planTime.startSecond,
      endSecond: planTime.endSecond,
      filterId: uuid
    })
    // 如果存在 => 變回原位置
    if (isTimeExist) {
      const { originStart, originStartSecond, originEnd, originEndSecond } = originPlanMap[uuid]
      planTimeMap[uuid] = {
        ...planTime,
        start: originStart,
        startSecond: originStartSecond,
        end: originEnd,
        endSecond: originEndSecond
      }
    } else {
      setOriginPlan(uuid, planTime)
    }
    // 檢查後清空最後一筆更新的id
    resetLastChangePlan()
  }

  // 暫時分配: 新增
  if (PlanDayTempRef.value) {
    const {
      isTempPlanExist,
      start,
      startSecond,
      end,
      endSecond
    } = PlanDayTempRef.value.getTempPlanInfo()
    const { isTimeExist } = await checkTimeIsExist({ startSecond, endSecond })

    // 如果不存在重複 => 新增
    if (isTempPlanExist && !isTimeExist) {
      const newUuid = getUuid('new')
      const newPlanTime = {
        uuid: newUuid,
        id: newUuid,
        status: 'new',
        start,
        startSecond,
        end,
        endSecond
      }
      planTimeMap[newUuid] = newPlanTime
      setLastChangePlan(newUuid, newPlanTime)
    }
    PlanDayTempRef.value.closeTempPlan()
  }
}

// 初始化
const init = async (planList: Types['planTime'][]) => {
  for (const uuid in planTimeMap) {
    delete planTimeMap[uuid]
  }
  resetLastChangePlan()
  await nextTick()

  planList.forEach(planItem => {
    const { uuid = '' } = planItem
    setOriginPlan(uuid, planItem)
    planTimeMap[uuid] = {
      status: 'old',
      ...planItem
    }
  })
}

/**
 * 刪除分配
 * new 直接移除
 * old 不移除 status => delete
 */
const removePlan = (uuid: string) => {
  if (hasOwnProperty(planTimeMap, uuid)) {
    delete planTimeMap[uuid]
  }
}

// 取資料
const getData = async () => {
  await nextTick()

  const createList = []
  const updateList = []
  const removeList = []
  const oldList = []
  const allList = []

  for (const uuid in planTimeMap) {
    const planTime = getProxyData<Types['planTime']>(planTimeMap[uuid])
    const { status } = planTime

    const _planTime = {
      ...planTime,
      uuid,
      dayId: props.dayId
    }
    switch (status) {
      case 'new':
        createList.push(_planTime)
        break
      case 'update':
        updateList.push(_planTime)
        break
      case 'delete':
        removeList.push(_planTime)
        break
      case 'old':
        oldList.push(_planTime)
        break
    }
    allList.push(_planTime)
  }

  return {
    create: createList,
    update: updateList,
    remove: removeList,
    old: oldList,
    all: allList
  }
}

onMounted(() => {
  init(props.planList)
})

// 複製一周 copyPlanWeek
const insertData = async (planTime: Types['planTime']) => {
  // const { startSecond = 0, endSecond = 0 } = planTime
  // const { isTimeExist } = await checkTimeIsExist({ startSecond, endSecond })

  const uuid = getUuid('new')
  const _planTime: Types['planTime'] = {
    uuid,
    id: uuid,
    status: 'new',
    ...planTime
  }
  planTimeMap[_planTime.uuid] = _planTime
  setOriginPlan(_planTime.uuid, _planTime)
}
// 刪除一周 removePlanWeek
const removeData = async (planTime: Types['planTime']) => {
  const { startSecond = 0, endSecond = 0 } = planTime
  const { sameIdList, isTimeExist } = await checkTimeIsExist({ startSecond, endSecond })

  if (isTimeExist) {
    sameIdList.forEach(removeId => {
      delete planTimeMap[removeId]
      delete originPlanMap[removeId]
    })
  }
}

defineExpose({
  init,
  getData,
  checkTimeIsExist,
  insertData,
  removeData
})

// 小時的格子ref
const hourMapRef = reactive<any>({})
</script>

<template>
  <div
    class="schedule-day"
    :class="[
      `schedule-day-${props.dayId}`,
      props.disabled ? 'is-disabled' : ''
    ]"
    :key="`schedule-day-${props.dayId}-${renderKey}`"
    @mouseup.stop="updateSchedule()"
    @mouseleave="updateSchedule()"
    @click.stop
  >
    <!-- 背景表格 -->
    <div
      v-for="(row, hour) in 24"
      :key="`hour-${hour}`"
      :ref="(el: HTMLDivElement) => {
        if (el) { hourMapRef[`${hour}`] = el }
        return el
      }"
      class="schedule-block"
      @mousedown="openTempPlan($event, hour)"
    >
      <div class="first-block"></div>
      <div class="second-block"></div>
    </div>

    <!-- 暫時分配 -->
    <PlanDayTemp
      ref="PlanDayTempRef"
      :hourMapRef="hourMapRef"
      :scheduleContainer="props.scheduleContainer"
    />

    <!-- 單一分配結果 -->
    <PlanDayItem
      v-for="(planTime, uuid) in planTimeMap"
      :key="`PlanItem-${uuid}`"
      :ref="(el: InstanceType<typeof PlanDayItem>) => {
        if (el) { planDayItemRef[`PlanItem-${uuid}`] = el }
        return el
      }"
      :dayId="dayId"
      :planTime="planTime"
      @update:planTime="(v: Types['planTime']) => {
        planTimeMap[uuid] = v
      }"
      :uuid="uuid"
      :scheduleContainer="props.scheduleContainer"
      :originPlanMap="originPlanMap"
      @mousedown="setLastChangePlan(uuid, planTime)"
      @removePlan="removePlan(uuid)"
      @change="updateSchedule(uuid)"
    />
  </div>
</template>

<style lang="scss" scoped>
.schedule {
  &-day {
    flex: 1;
    position: relative;
    border-right: 1px solid #dddddd00;
    display: grid;
    grid-template-rows: repeat(24, 1fr);
    grid-template-columns: 1fr;

    background-color: var(--el-bg-color);
    &.is-disabled {
      background-color: var(--el-color-info-light-8);
    }
  }

  &-block {
    border-right: 1px solid var(--el-color-info-light-5);
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
      border-bottom: 1px solid var(--el-color-info-light-7);
    }
    .second-block {
      flex: 1;
      border-bottom: 1px solid var(--el-color-info-light-5);
    }
  }
}
</style>
