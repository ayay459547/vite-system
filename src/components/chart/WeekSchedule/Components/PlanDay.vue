<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, nextTick, reactive, onMounted } from 'vue'

import { getType, getUuid, isEmpty, getProxyData, hasOwnProperty } from '@/lib/lib_utils.ts'
import { object_filter, object_every } from '@/lib/lib_object.ts'

import type { Custom } from '../WeekScheduleInfo'

import PlanItemView from './PlanItem.vue'
import PlanTemp from './PlanTemp.vue'

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
    type: Object as PropType<Custom.PlanTime[]>,
    required: true
  },
  scheduleContainer: {
    type: [Object, null] as PropType<any>,
    required: true
  }
})
const emit = defineEmits(['copyPlan'])

const renderKey =  ref(0)

// 最後一個更新的區塊
const lastChangePlan = ref('')
// 當分配被點擊 設定原始位置
const setOriginPlan = (uuid: string, planTime: Custom.PlanTime) => {
  const { start, startSecond, end, endSecond } = planTime

  // 將原來的位置 更新成現在的位置
  originPlanMap[uuid] = {
    // 原始開始與結束時間
    originStart: start,
    originStartSecond: startSecond,
    originEnd: end,
    originEndSecond: endSecond
  }
}

const planTimeMap: Record<string, Custom.PlanTime> = reactive({})

// 確認工時 是否存在
const checkTimeIsExist: Custom.CheckTimeIsExist = (startSecond, endSecond, filterId) => {
  let _planTimeMap = {}
  const filterIdType = getType(filterId)

  switch (filterIdType) {
    case 'Array':
      _planTimeMap = object_filter(planTimeMap, (plan: Custom.PlanTime) => !filterId.includes(plan.uuid))
      break
    case 'String':
      _planTimeMap = object_filter(planTimeMap, (plan: Custom.PlanTime) => plan.uuid !== filterId)
      break
    case 'Null':
    default:
      _planTimeMap = getProxyData(planTimeMap)
      break
  }

  return !object_every(_planTimeMap, (plan: Custom.PlanTime) => {
    // 開始和結束都 <= 開始
    // 開始和結束都 >= 結束
    const { startSecond: _startSecond, endSecond: _endSecond, status } = plan
    return (
      (startSecond <= _startSecond && endSecond <= _startSecond) ||
      (startSecond >= _endSecond && endSecond >= _endSecond)
    ) || (status === 'delete')
  })
}

// 當分配被點擊時
const onPlanMouseDown = (uuid: string, planTime: Custom.PlanTime) => {
  setOriginPlan(uuid, planTime)
  lastChangePlan.value = uuid
}

// 修改工時分配
const originPlanMap: Record<string, Custom.Origin> = reactive({})

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
  if (props.disabled) return

  await nextTick()
  // 如果存在 => 變回原值
  if (!isEmpty(lastChangePlan.value) && planItemViewRef[`PlanItem-${lastChangePlan.value}`]) {
    const { isExist, uuid, planTime } = planItemViewRef[`PlanItem-${lastChangePlan.value}`].checkUpdatePlan(checkTimeIsExist)
    if (isExist) {
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
    lastChangePlan.value = uuid
  }

  // 如果不存在 => 新增
  if (planTempRef.value) {
    const { isExist, newUuid, planTime } = planTempRef.value.checkCreatePlan(checkTimeIsExist)
    if (!isExist && !isEmpty(newUuid)) {
      planTimeMap[newUuid] = planTime
      setOriginPlan(newUuid, planTime)
      lastChangePlan.value = newUuid
    }
  }
}

// 初始化
const init = async (planList: Custom.PlanTime[]) => {
  for (let uuid in planTimeMap) {
    delete planTimeMap[uuid]
  }
  await nextTick()

  planList.forEach(planItem => {
    const { uuid } = planItem
    setOriginPlan(uuid, planItem)
    planTimeMap[uuid] = planItem
  })
}

// 複製到其他天
const copyPlan = async (planTime: Custom.PlanTime) => {
  await nextTick()
  emit('copyPlan', planTime)
}

// 接收複製後 插入資料
const insertData = (planTime: Custom.PlanTime) => {
  const { startSecond, endSecond } = planTime
  const isExist = checkTimeIsExist(startSecond, endSecond)

  if (!isExist) {
    const uuid = getUuid('new')
    const _planTime: Custom.PlanTime = {
      ...planTime,
      uuid,
      id: uuid,
      status: 'new'
    }
    planTimeMap[uuid] = _planTime
    setOriginPlan(uuid, _planTime)
  }
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

  for (let uuid in planTimeMap) {
    const planTime = getProxyData<Custom.PlanTime>(planTimeMap[uuid])
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

defineExpose({
  init,
  insertData,
  getData
})

// 小時的格子ref
const hourMapRef = reactive({})

</script>

<template>
  <div
    class="schedule-day"
    :class="props.disabled ? 'is-disabled' : ''"
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
          planItemViewRef[`PlanItem-${uuid}`] = el
          return `PlanItem-${uuid}`
        }
      "
      :planTime="planTime"
      @update:planTime="(v: Custom.PlanTime) => { planTimeMap[uuid] = v }"
      :uuid="uuid"
      :scheduleContainer="props.scheduleContainer"
      :originPlanMap="originPlanMap"
      :isEdit="uuid === lastChangePlan"
      @mousedown="onPlanMouseDown(uuid, planTime)"
      @copyPlan="copyPlan(planTime)"
      @removePlan="removePlan(uuid)"
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
