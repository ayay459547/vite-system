<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, nextTick, reactive, computed } from 'vue'

import throttle from '@/lib/lib_throttle'
import { getUuid, awaitTime, getType, isEmpty } from '@/lib/lib_utils'

import type {
  DataPlanTime,
  // DataPlanStyle,
  TempPlanTime,
  TempPlanStyle,
  PlanData,
  Origin
} from '../planType'

import {
  FPS,
  maxSecond,
  oneHourSecond,
  twentyFourHourSecond,
  // 轉換用
  secondFormat,
  secondToTop,
  topToSecond,
  secondToTime,
  timeToSecond
} from '../planUtils'

import PlanItem from './PlanItem.vue'

const props = defineProps({
  dayId: {
    type: Number as PropType<number>,
    required: true
  },
  planData: {
    type: Object as PropType<PlanData[]>,
    required: true
  },
  scheduleContainer: {
    type: [Object, null] as PropType<any>,
    required: true
  }
})

const emit = defineEmits([
  'addDataPlan',
  'updatePlanData',
  'setLastUpdatePlan',
  'setOriginPlan',
  'updatePlanRenderKey',
  'updateSchedule',
  'removeEvent'
])

const renderKey = ref(0)

const _FPS = 1000 / FPS

const isCheck = ref(false)

// 最後一次更新的分配
const lastUpdatePlan = ref<string | null>(null)
// 設置 最後一次更新的分配
const setLastUpdatePlan = (uuid: string) => {
  lastUpdatePlan.value = uuid
}


// 設置上一次分配結果
// 如果已存在 分配回到原位
const setOriginPlan = (plan: PlanData): void => {
  const planStyle = plan.style
  const { top, height } = planStyle

  const planTime = plan.time
  const { id: uuid, startSecond, endSecond } = planTime

  const isExist = checkTimeIsExist(startSecond, endSecond, uuid)
  // 如果已經存在 移到原位
  if (isExist) {
    moveOrigin(plan)
  } else {
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
}

// 如果最後更新的分配有重複 移到原位
// 如果確認中 無法對 分配進行修改
const checkLastUpdatePlan = async () => {
  const uuid = lastUpdatePlan.value

  if (!isEmpty(uuid)) {
    isCheck.value = true

    const plan = props.planData.find(plan => plan.time.id === uuid)
    delete plan.style.cursor
    delete plan.style.zIndex

    const { startSecond, endSecond } = plan.time

    const isExist = checkTimeIsExist(startSecond, endSecond, uuid)
    if (isExist) {
      moveOrigin(plan)
    }

    updatePlanRenderKey()
    emit('removeEvent')
    await nextTick()

    lastUpdatePlan.value = null
    setTimeout(() => {
      isCheck.value = false
    }, _FPS * 10)
  }
}

// 暫時的工時分配
const tempPlanTime = reactive<TempPlanTime>({
  start: '00:00',
  startSecond: 0,
  end: '00:00',
  endSecond: 0
})
const tempPlanStyle = reactive<TempPlanStyle>({
  left: 0,
  top: 0,
  height: 0,
  display: 'none'
})

// 確認工時 是否存在
const checkTimeIsExist = (
  startSecond: number,
  endSecond: number,
  filterId: Array<string> | string | null = null
): boolean => {
  let planList = []
  const filterIdType = getType(filterId)

  switch (filterIdType) {
    case 'Array':
      planList = props.planData.filter(plan => !filterId.includes(plan.time.id))
      break
    case 'String':
      planList = props.planData.filter(plan => plan.time.id !== filterId)
      break
    case 'Null':
    default:
      planList = props.planData
      break
  }

  // 全部都不包含
  return !planList.every(plan => {
    // 開始和結束都 <= 開始
    // 開始和結束都 >= 結束
    const { startSecond: _startSecond, endSecond: _endSecond } = plan.time
    return (
      (startSecond <= _startSecond && endSecond <= _startSecond) ||
      (startSecond >= _endSecond && endSecond >= _endSecond)
    )
  })
}

// 修改工時分配
const originPlanMap = new Map<string, Origin>()
// 移動到原來的位置
const moveOrigin = (plan: PlanData) => {
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
  emit('removeEvent')
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
const refMap = new Map()

// 建立暫時的工時分配
const createTempPlan = ($event: MouseEvent, hour: number) => {
  console.log('createTempPlan')
  const { clientY: mouseDownY } = $event

  // 表格
  if (isEmpty(props.scheduleContainer)) return
  const containerEl = props.scheduleContainer
  // 小時 對應的格子
  const blockEl = refMap.get(`${hour}`)

  if (containerEl && blockEl) {
    const { top: containerTop } = containerEl.getBoundingClientRect()
    // 暫時工時分配: 開始
    const _tempY = mouseDownY - containerTop
    const _startSecond = topToSecond(_tempY)
    tempPlanTime.startSecond = secondFormat(_startSecond)
    tempPlanTime.start = secondToTime(tempPlanTime.startSecond)

    // 暫時工時分配: 結束
    const _endSecond = _startSecond + oneHourSecond
    tempPlanTime.endSecond = secondFormat(_endSecond)
    tempPlanTime.end = secondToTime(tempPlanTime.endSecond)

    // 暫時工時分配 top = secondToTop(開始秒數)
    tempPlanStyle.top = secondToTop(tempPlanTime.startSecond)
    // 暫時工時分配 height = secondToTop(結束秒數 - 開始秒數)
    tempPlanStyle.height = secondToTop(tempPlanTime.endSecond - tempPlanTime.startSecond)

    props.scheduleContainer.addEventListener(
      'mousemove',
      throttle(function ($event: MouseEvent) {
        const { clientY: mouseMoveY } = $event

        // 變化高度
        const _moveY = mouseMoveY - mouseDownY
        const _change = _moveY < 0 ? 0 : _moveY
        const _changeEndSecond = topToSecond(_tempY + _change)
        tempPlanTime.endSecond = _changeEndSecond
        tempPlanTime.end = secondToTime(_changeEndSecond)

        tempPlanStyle.height = _change
      }, _FPS, { isNoLeading: true })
    )

    // 顯示暫時的工時分配
    tempPlanStyle.display = 'block'
  }
}
/**
 * 更新 分配畫面
 * 如果有暫時的工時分配 新增
 * checkLastUpdatePlan()
 * removeEvent()
 */
 const updateSchedule = async () => {
  console.log('updateSchedule', tempPlanStyle.display)
  // 有暫時的工時分配
  if (tempPlanStyle.display === 'block') {
    const { start, startSecond, end, endSecond } = tempPlanTime
    const uuid = getUuid()
    createDataPlan({
      id: uuid,
      status: 'new',
      start,
      startSecond,
      end,
      endSecond
    })

    // 隱藏暫時的工時分配
    tempPlanStyle.display = 'none'
    setLastUpdatePlan(uuid)
  }
  checkLastUpdatePlan()
  emit('removeEvent')
}

const updatePlanRenderKey = () => {
  renderKey.value++
}

</script>

<template>
  <div
    class="schedule-day"
    :key="`schedule-day-${props.dayId}-${renderKey}`"
    @mouseup="updateSchedule"
  >
    <!-- 暫時分配 -->
    <div
      class="schedule-temp-plan"
      :style="{
        display: tempPlanStyle.display,
        top: `${tempPlanStyle.top - 1}px`,
        height: `${tempPlanStyle.height}px`
      }"
    >
      <span>{{ `${tempPlanTime.start}` }}</span>
      <span> - </span>
      <span>{{ `${tempPlanTime.end}` }}</span>
    </div>

    <!-- 單一分配結果 -->
    <PlanItem
      v-for="plan in planData"
      :key="`PlanItem-${plan.time.id}`"
      :planData="plan"
      :scheduleContainer="scheduleContainer"
      :isCheck="isCheck"
      :originPlanMap="originPlanMap"
      @setLastUpdatePlan="setLastUpdatePlan"
      @setOriginPlan="setOriginPlan"
      @updatePlanRenderKey="updatePlanRenderKey"
      @updateSchedule="updateSchedule"
    />

    <!-- 背景表格 -->
    <div
      v-for="(row, hour) in 24"
      :key="hour"
      :ref="
        el => {
          refMap.set(`${hour}`, el)
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

  &-temp-plan {
    width: calc(100% - 2px);
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 4px;
    min-height: 12px;
    background-color: #eeeeee80;
    border: 1px solid #dddddd;
    text-align: center;
    padding-top: 2px;
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
