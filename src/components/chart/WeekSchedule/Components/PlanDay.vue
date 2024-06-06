<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, nextTick, reactive, onMounted } from 'vue'

import { getType, isEmpty, getProxyData } from '@/lib/lib_utils'
import { object_filter, object_every } from '@/lib/lib_object'

import type { PlanTime, Origin, CheckTimeIsExist } from '../planType'

// import {
//   FPS,
//   // 轉換用
//   secondToTop,
//   secondToTime
// } from '../planUtils'

import PlanItemView from './PlanItem.vue'
import PlanTemp from './PlanTemp.vue'

const props = defineProps({
  dayId: {
    type: Number as PropType<number>,
    required: true
  },
  planList: {
    type: Object as PropType<PlanTime[]>,
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
const setOriginPlan = (uuid: string, planTime: PlanTime) => {
  const { start, startSecond, end, endSecond } = planTime

  lastChangePlan.value = uuid
  // 將原來的位置 更新成現在的位置
  originPlanMap[uuid] = {
    // 原始開始與結束時間
    originStart: start,
    originStartSecond: startSecond,
    originEnd: end,
    originEndSecond: endSecond
  }
}

const planTimeMap: Record<string, PlanTime> = reactive({})

// 確認工時 是否存在
const checkTimeIsExist: CheckTimeIsExist = (startSecond, endSecond, filterId) => {
  let _planTimeMap = {}
  const filterIdType = getType(filterId)

  switch (filterIdType) {
    case 'Array':
      _planTimeMap = object_filter(planTimeMap, (plan: PlanTime) => !filterId.includes(plan.id))
      break
    case 'String':
      _planTimeMap = object_filter(planTimeMap, (plan: PlanTime) => plan.id !== filterId)
      break
    case 'Null':
    default:
      _planTimeMap = getProxyData(planTimeMap)
      break
  }

  return !object_every(_planTimeMap, (plan: PlanTime) => {
    // 開始和結束都 <= 開始
    // 開始和結束都 >= 結束
    const { startSecond: _startSecond, endSecond: _endSecond } = plan
    return (
      (startSecond <= _startSecond && endSecond <= _startSecond) ||
      (startSecond >= _endSecond && endSecond >= _endSecond)
    )
  })
}

// 修改工時分配
const originPlanMap: Record<string, Origin> = reactive({})

const planTempRef = ref()
const createTempPlan = ($event: MouseEvent, hour: number) => {
  if (planTempRef.value) {
    planTempRef.value.createTempPlan($event, hour)
  }
}

// 分配的 PlanItemView ref
const planItemViewRef = reactive({})

/**
 * 更新 分配畫面
 */
const updateSchedule = async () => {
  await nextTick()
  // 如果不存在 => 新增
  if (planTempRef.value) {
    const { isExist, newUuid, planTime } = planTempRef.value.checkCreatePlan(checkTimeIsExist)
    if (!isExist && !isEmpty(newUuid)) {
      planTimeMap[newUuid] = planTime
      setOriginPlan(newUuid, planTime)
    }
  }
  // 如果存在 => 變回原值
  if (!isEmpty(lastChangePlan.value) && planItemViewRef[lastChangePlan.value]) {
    const { isExist, uuid, planTime } =
      planItemViewRef[lastChangePlan.value].checkUpdatePlan(checkTimeIsExist)
    if (isExist) {
      const { originStart, originStartSecond, originEnd, originEndSecond } = originPlanMap[uuid]

      planTimeMap[uuid] = {
        start: originStart,
        startSecond: originStartSecond,
        end: originEnd,
        endSecond: originEndSecond
      }
    } else {
      setOriginPlan(uuid, planTime)
    }
    lastChangePlan.value = null
  }
}

// 初始化
const init = async (planList: PlanTime[]) => {
  for (let uuid in planTimeMap) {
    delete planTimeMap[uuid]
  }
  await nextTick()

  planList.forEach(planItem => {
    const { id: uuid } = planItem
    planTimeMap[uuid] = planItem
  })
}

onMounted(() => {
  init(props.planList)
})

defineExpose({
  init
})

// 小時的格子ref
const hourMapRef = reactive({})
</script>

<template>
  <div
    class="schedule-day"
    :key="`schedule-day-${props.dayId}-${renderKey}`"
    @mouseup="updateSchedule"
    @mouseleave="updateSchedule"
  >
    <!-- 暫時分配 -->
    <PlanTemp
      ref="planTempRef"
      :hourMapRef="hourMapRef"
      :scheduleContainer="props.scheduleContainer"
    />

    <!-- 單一分配結果 -->
    <PlanItemView
      v-for="(planTime, uuid) in planTimeMap"
      :key="`PlanItem-${uuid}`"
      :ref="
        el => {
          planItemViewRef[`${uuid}`] = el
          return `${uuid}`
        }
      "
      :planTime="planTime"
      @update:planTime="(v: PlanTime) => { planTimeMap[uuid] = v }"
      :uuid="uuid"
      :scheduleContainer="props.scheduleContainer"
      :originPlanMap="originPlanMap"
      @mousedown="lastChangePlan = uuid"
    />

    <!-- 背景表格 -->
    <div
      v-for="(row, hour) in 24"
      :key="hour"
      :ref="
        el => {
          hourMapRef[`${hour}`] = el
          return `${hour}`
        }
      "
      class="schedule-block"
      @mousedown="createTempPlan($event, hour)"
    >
      <div class="first-block"></div>
      <div class="second-block"></div>
    </div>
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
