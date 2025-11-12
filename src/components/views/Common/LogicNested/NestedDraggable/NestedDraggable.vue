<script setup lang="ts">
import type { PropType } from 'vue'
import { reactive, computed, inject } from 'vue'

import type { UseHook } from '@/types/types_hook' // 全域功能類型
import type { CustomDraggableTypes } from '@/components/feature'
import CustomDraggable from '@/components/feature/CustomDraggable/CustomDraggable.vue'
import { defaultModuleType } from '@/declare/declare_i18n'

import { isEmpty, tipLog, getUuid } from '@/lib/lib_utils'
import type { LogicRestriction, LogicRestrictions } from '@/types/types_logicRestriction/logicRestriction'
import type { Restrictions } from '@/types/types_logicRestriction/restrictions'

import type { LogicNestedData } from '../types'
import NestedDraggableItem from './NestedDraggableItem/NestedDraggableItem.vue'
import SubNestedDraggable from './NestedDraggable.vue'

const useHook = inject('useHook') as UseHook
const { i18nTranslate, notification } = useHook({
  i18nModule: defaultModuleType
})

const props = defineProps({
  tasks: {
    type: Array as PropType<any[]>,
    default: undefined
  },
  maintainRestrictionType: {
    type: String as PropType<string>,
    default: 'MachineProcessChangeLine',
    description: 'MaintainRestrictionType'
  }
})

const emit = defineEmits(['update:tasks'])


// 分配的 ref
const NestedDraggableItemRef = reactive<Record<string, InstanceType<typeof NestedDraggableItem>>>({})
const SubNestedDraggableRef = reactive<Record<string, InstanceType<typeof SubNestedDraggable>>>({})

// 移除
const onRemove = (task: any, taskIndex: number) => {
  delete NestedDraggableItemRef[`NestedDraggableItem-${task.id}`]
  delete SubNestedDraggableRef[`SubNestedDraggable-${task.id}`]


  const newTasks = [...props.tasks].filter(item => !isEmpty(item))
  newTasks.splice(taskIndex, 1)
  emit('update:tasks', newTasks)
}

/**
 * LogicRestriction(本身是單個, 所以可以設定多個)
 * Restrictions(本身是多個, 所以只能設定一個)
 */
const isHasRestrictions = computed(() => {
  const restrictionsTasks = props.tasks.filter(task => {
    return task.type === 'restrictions'
  })
  return restrictionsTasks.length >= 2
})
const onDraggableChange = ($event: CustomDraggableTypes['draggableChange']) => {
  const { added } = $event
  const { element: task, newIndex: taskIndex  } = added
  console.log($event)

  // 如果新增後有2個 Restrictions, 移除新增的
  if (isHasRestrictions.value) {
    onRemove(task, taskIndex)

    notification({
      type: 'warning',
      title: `${i18nTranslate('create')}${i18nTranslate('failed')}`, // 新增失敗
      message: i18nTranslate('warning-existedData') // 資料已存在
    })
  }
}


// 使用 LogicNestedData 格式的資料 初始化
const initUseLogicNestedData = ({ logicRestrictions, restrictions }: LogicNestedData) => {
  if (!Array.isArray(logicRestrictions) && !Array.isArray(restrictions)) {
    tipLog('傳入 logicRestrictions, restrictions 都不是 Array', [
      `傳入 logicRestrictions 類型: ${typeof logicRestrictions}`,
      `傳入 restrictions 類型: ${typeof restrictions}`
    ])
    return
  }

  const newTasks = []
  logicRestrictions.forEach(logicRestriction => {
    const newId = getUuid('LogicRestrictionForm')
    newTasks.push({
      id: newId,
      type: 'logicRestriction',
      maintainRestrictionType: props.maintainRestrictionType,
      tasks: [], // 可設定階層
      logicRestriction
    })
  })

  if (!isEmpty(restrictions)) {
    const newId = getUuid('RestrictionsForm')
    newTasks.push({
      id: newId,
      type: 'restrictions',
      maintainRestrictionType: props.maintainRestrictionType,
      tasks: undefined, // 不可設定階層
      restrictions
    })
  }
  emit('update:tasks', newTasks)
}
// 取得 LogicNestedData 格式的資料
const getLogicNestedDataFormat = (): LogicNestedData => {
  const logicRestrictions: LogicRestrictions = []
  let restrictions: Restrictions = []

  props.tasks.forEach(task => {
    const ItemRef = NestedDraggableItemRef[`NestedDraggableItem-${task.id}`]
    if (isEmpty(ItemRef)) return

    if (task.type === 'logicRestriction') {
      const __logicRestriction__ = ItemRef.getLogicFormat() as LogicRestriction
      let subLogicRestrictions = []
      let subRestrictions = []

      const ItemSubRef = SubNestedDraggableRef[`SubNestedDraggable-${task.id}`]
      if (ItemSubRef) {
        const {
          logicRestrictions: __subLogicRestrictions__,
          restrictions: __subRestrictions__
        }: LogicNestedData = ItemSubRef.getLogicNestedDataFormat()
        subLogicRestrictions = __subLogicRestrictions__
        subRestrictions = __subRestrictions__
      }

      logicRestrictions.push({
        _type: __logicRestriction__._type,
        _value: {
          ...__logicRestriction__._value,
          logicRestrictions: subLogicRestrictions,
          restrictions: subRestrictions
        }
      })
    } else if (task.type === 'restrictions') {
      const __restrictions__ = ItemRef.getLogicFormat() as Restrictions
      restrictions = __restrictions__
    }
  })
  return { logicRestrictions, restrictions }
}

defineExpose({
  initUseLogicNestedData,
  getLogicNestedDataFormat,
  submitLogicNestedData: async () => {
    const validateList: Array<Promise<any>> = []

    props.tasks.forEach(task => {
      const ItemRef = NestedDraggableItemRef[`NestedDraggableItem-${task.id}`]
      if (ItemRef) {
        validateList.push(ItemRef.submitLogic())
      }
      const ItemSubRef = SubNestedDraggableRef[`SubNestedDraggable-${task.id}`]
      if (ItemSubRef) {
        validateList.push(ItemSubRef.submitLogicNestedData())
      }
    })

    return await Promise.all(validateList).then(() => {
      const logicNestedData = getLogicNestedDataFormat()
      // console.log('logicNestedData => ', logicNestedData)
      return Promise.resolve(logicNestedData)
    }).catch((errorList: any) => {
      return Promise.reject(errorList)
    })
  }
})

</script>

<template>
  <CustomDraggable
    class="drag-logic"
    :list="props.tasks"
    :group="{ name: 'group-logic-nested' }"
    item-key="id"
    handle=".logic-nested-draggable"
    @change="onDraggableChange($event)"
  >
    <template #item="{ element: task, index: taskIndex }">
      <NestedDraggableItem
        :ref="(el: InstanceType<typeof NestedDraggableItem>) => {
          if (el) { NestedDraggableItemRef[`NestedDraggableItem-${task.id}`] = el }
          return el
        }"
        :key="task.id"
        :index="taskIndex"
        class="drag-logic-item"
        :type="task.type"
        :maintainRestrictionType="task.maintainRestrictionType"
        :logicRestriction="task.logicRestriction"
        :restrictions="task.restrictions"
        @remove="onRemove(task, taskIndex)"
      >
        <SubNestedDraggable
          :ref="(el: InstanceType<typeof SubNestedDraggable>) => {
            if (el) { SubNestedDraggableRef[`SubNestedDraggable-${task.id}`] = el }
            return el
          }"
          v-if="(
            ![undefined, null].includes(props.tasks) &&
            task.type === 'logicRestriction'
          )"
          v-model:tasks="task.tasks"
        />
      </NestedDraggableItem>
    </template>
  </CustomDraggable>
</template>

<style lang="scss" scoped>
.drag-logic {
  width: 100%;
  height: fit-content;
  min-height: 80px;
  outline: 1px dashed var(--el-color-primary);
  border-radius: 6px;

  &-item {
    width: 100%;
    height: fit-content;
    min-height: 60px;
    padding: 16px;
  }
}
</style>
