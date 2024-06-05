<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, nextTick, reactive, onMounted } from 'vue'

import { getType, isEmpty } from '@/lib/lib_utils'

import type { DataPlanTime, PlanList, PlanItem, Origin } from '../planType'

import {
  FPS,
  // 轉換用
  secondToTop,
  secondToTime
} from '../planUtils'

import PlanItemView from './PlanItem.vue'
import PlanTemp from './PlanTemp.vue'

const props = defineProps({
  dayId: {
    type: Number as PropType<number>,
    required: true
  },
  planList: {
    type: Object as PropType<PlanItem[]>,
    required: true
  },
  scheduleContainer: {
    type: [Object, null] as PropType<any>,
    required: true
  }
})

const emit = defineEmits([
  'addDataPlan',
  'updateSchedule',
  'removeEvent'
])

const renderKey =  ref(0)

const _FPS = 1000 / FPS

const isCheck = ref(false)

// 最後一次更新的分配
const lastUpdatePlan = ref<string | null>(null)

// 設置上一次分配結果
// 如果已存在 分配回到原位
const setOriginPlan = (plan: PlanItem): void => {
  const planStyle = plan.style
  const { top, height } = planStyle

  const planTime = plan.time
  const { id: uuid, startSecond, endSecond } = planTime

  // 將原來的位置 更新成現在的位置
  originPlanMap.set(uuid, {
    // 原始樣式
    originTop: top,
    originHeight: height,
    // 原始開始與結束時間
    originStartSecond: startSecond,
    originEndSecond: endSecond
  })
}

// 當分配被點擊
const onPlanItemClick = (uuid: string, planItem: PlanItem) => {
  console.log('onPlanItemClick', planItem)
  lastUpdatePlan.value = uuid
  setOriginPlan(planItem)
}

const tempPlanList = reactive([])

// 確認工時 是否存在
const checkTimeIsExist = (
  startSecond: number,
  endSecond: number,
  filterId: Array<string> | string | null = null
): boolean => {
  let _planList = []
  const filterIdType = getType(filterId)

  switch (filterIdType) {
    case 'Array':
      _planList = tempPlanList.filter(plan => !filterId.includes(plan.time.id))
      break
    case 'String':
      _planList = tempPlanList.filter(plan => plan.time.id !== filterId)
      break
    case 'Null':
    default:
      _planList = tempPlanList
      break
  }

  // 全部都不包含
  return !_planList.every(plan => {
    // 開始和結束都 <= 開始
    // 開始和結束都 >= 結束
    const { startSecond: _startSecond, endSecond: _endSecond } = plan.time
    return (
      (startSecond <= _startSecond && endSecond <= _startSecond) ||
      (startSecond >= _endSecond && endSecond >= _endSecond)
    )
  })
}

// 如果最後更新的分配有重複 移到原位
// 如果確認中 無法對 分配進行修改
const checkLastUpdatePlan = async () => {
  const uuid = lastUpdatePlan.value

  if (!isEmpty(uuid)) {
    isCheck.value = true

    const plan = tempPlanList.find(plan => plan.time.id === uuid)
    if (isEmpty(plan)) return
    delete plan.style?.cursor
    delete plan.style?.zIndex

    const { startSecond, endSecond } = plan.time

    const isExist = checkTimeIsExist(startSecond, endSecond, uuid)
    if (isExist) {
      moveOrigin(plan)
    }

    updatePlanRenderKey()
    // emit('removeEvent')
    await nextTick()

    lastUpdatePlan.value = null
    setTimeout(() => {
      isCheck.value = false
    }, _FPS * 10)
  }
}

// 修改工時分配
const originPlanMap = new Map<string, Origin>()
// 移動到原來的位置
const moveOrigin = (plan: PlanItem) => {
  const planStyle = plan.style
  const planTime = plan.time

  const originPlan = originPlanMap.get(planTime.id)
  const { originStartSecond, originEndSecond, originTop, originHeight } = originPlan

  planTime.startSecond = originStartSecond
  planTime.start = secondToTime(originStartSecond)
  planTime.endSecond = originEndSecond
  planTime.end = secondToTime(originEndSecond)

  planStyle.top = originTop
  planStyle.height = originHeight

  updatePlanRenderKey()
  // emit('removeEvent')
}


// 建立工時分配
const createDataPlan = (dataTime: DataPlanTime) => {
  const { id: uuid, startSecond, endSecond } = dataTime
  const isExist = checkTimeIsExist(startSecond, endSecond)

  if (!isExist) {
    const _top = secondToTop(startSecond)
    const _height = secondToTop(endSecond - startSecond)

    emit('addDataPlan', props.dayId, {
      time: dataTime,
      style: { top: _top, height: _height }
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

const planTempRef = ref()
const createTempPlan = ($event: MouseEvent, hour: number) => {
  if (planTempRef.value) {
    planTempRef.value.createTempPlan($event, hour)
  }
}

const hourMapRef = reactive({})

/**
 * 更新 分配畫面
 * 如果有暫時的工時分配 新增
 * checkLastUpdatePlan()
 * removeEvent()
 */
 const updateSchedule = async () => {
  console.log('PlanDay => updateSchedule')
  await nextTick()

  if (planTempRef.value) {
    const newUuid = planTempRef.value.checkCreateDataPlan()
    if (typeof newUuid === 'string') {
      lastUpdatePlan.value = newUuid
    }
  }

  checkLastUpdatePlan()
  // emit('removeEvent')
}

const updatePlanRenderKey = () => {
  renderKey.value++
}
// 初始化
const init = (planList: PlanList) => {
  tempPlanList.splice(0)

  planList.forEach(planItem => {
    tempPlanList.push(planItem)
  })
}

onMounted(() => {
  init(props.planList)
})

defineExpose({
  init
})

</script>

<template>
  <div
    class="schedule-day"
    :key="`schedule-day-${props.dayId}-${renderKey}`"
    @mouseup="updateSchedule"
  >
    <!-- 暫時分配 -->
    <PlanTemp
      ref="planTempRef"
      :hourMapRef="hourMapRef"
      :scheduleContainer="props.scheduleContainer"
      @createDataPlan="createDataPlan"
    />

    <!-- 單一分配結果 -->
    <PlanItemView
      v-for="planItem in tempPlanList"
      :key="`PlanItem-${planItem.time.id}`"
      :planItem="planItem"
      @update:planItem="(v: PlanItem) => console.log(v)"
      :scheduleContainer="props.scheduleContainer"
      :isCheck="isCheck"
      :originPlanMap="originPlanMap"
      @mousedown="onPlanItemClick(planItem.time.id, planItem)"
      @mouseup.stop
      @updatePlanRenderKey="updatePlanRenderKey"
      @updateSchedule="updateSchedule"
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
