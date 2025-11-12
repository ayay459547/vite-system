<script setup lang="ts">
import type { PropType } from 'vue'
import { ref } from 'vue'

import CustomDraggable from '@/components/feature/CustomDraggable/CustomDraggable.vue'
import CustomDivider from '@/components/feature/CustomDivider/CustomDivider.vue'
import {
  // deepClone,
  getUuid,
  scrollToEl
} from '@/lib/lib_utils' // 工具

import type { LogicNestedData } from './types'
import LogicRestrictionTemplate from './Template/LogicRestrictionTemplate.vue'
import RestrictionsTemplate from './Template/RestrictionsTemplate.vue'
import NestedDraggable from './NestedDraggable/NestedDraggable.vue'

const props = defineProps({
  maintainRestrictionType: {
    type: String as PropType<string>,
    default: 'MachineProcessChangeLine',
    description: 'MaintainRestrictionType'
  }
})

const logicList = ref<any[]>([])

const LogicRestrictionTemplateRef = ref<InstanceType<typeof LogicRestrictionTemplate>>()
const RestrictionsTemplateRef = ref<InstanceType<typeof RestrictionsTemplate>>()

// 拷貝
const cloneLogicData = (taskItem: any) => {
  const newId = getUuid(`${taskItem.id}`)
  const newNode = {
    logicRestriction: {}, // 一個 tasks 可以有多個 logicRestriction
    restrictions: [], // 一個 tasks 只能有一個 restrictions(本身是複數)

    // 防止無限遞迴 task 遞迴使用的資料
    ...JSON.parse(JSON.stringify(taskItem)),
    // ...deepClone({}, taskItem),

    // 給新的 uuid
    id: newId
  }
  return newNode
}

// 複製 LogicRestriction
const onLogicRestrictionClone = (taskItem: any) => {
  const default_logicRestriction = LogicRestrictionTemplateRef.value.getLogicRestrictionFormat()

  return cloneLogicData({
    ...taskItem,
    logicRestriction: default_logicRestriction
  })
}

// 複製 Restrictions
const onRestrictionsClone = (taskItem: any) => {
  const default_restrictions = RestrictionsTemplateRef.value.getRestrictionsFormat()

  return cloneLogicData({
    ...taskItem,
    restrictions: default_restrictions
  })
}

const NestedDraggableRef = ref<InstanceType<typeof NestedDraggable>>()

// 使用 LogicNestedData 格式的資料 初始化
const initUseLogicNestedData = (logicNestedData: LogicNestedData) => {
 if (NestedDraggableRef.value) {
    NestedDraggableRef.value.initUseLogicNestedData(logicNestedData)
 }
}
// 取得 LogicNestedData 格式的資料
const getLogicNestedDataFormat = (): LogicNestedData => {
  return NestedDraggableRef.value.getLogicNestedDataFormat()
}

defineExpose({
  initUseLogicNestedData,
  getLogicNestedDataFormat,
  submitLogicNestedData: async () => {
    return await NestedDraggableRef.value.submitLogicNestedData().then(() => {
      const logicNestedData = getLogicNestedDataFormat()
      return Promise.resolve(logicNestedData)
    }).catch((errorList: any) => {
      if (Array.isArray(errorList)) {
        const errorItem = errorList[0]

        if (typeof errorItem.getDom === 'function') {
          const errorDom = errorItem.getDom()
          scrollToEl(errorDom)
        }
      }
      return Promise.reject(errorList)
    })
  }
})

</script>

<template>
  <div class="logic-nested">
    <div class="logic-nested-tasks">
      <NestedDraggable
        ref="NestedDraggableRef"
        v-model:tasks="logicList"
        :maintainRestrictionType="props.maintainRestrictionType"
      ></NestedDraggable>
    </div>

    <div class="logic-nested-form">
      <div class="logic-nested-form-container">
        <CustomDraggable
          :list="[{
            id: 'LogicRestrictionForm',
            type: 'logicRestriction',
            maintainRestrictionType: props.maintainRestrictionType,
            tasks: [] // 可設定階層
          }]"
          :group="{ name: 'group-logic-nested', pull: 'clone', put: false  }"
          item-key="id"
          :clone="onLogicRestrictionClone"
          handle=".logic-nested-draggable"
        >
          <template #item>
            <LogicRestrictionTemplate
              ref="LogicRestrictionTemplateRef"
              :maintainRestrictionType="props.maintainRestrictionType"
            ></LogicRestrictionTemplate>
          </template>
        </CustomDraggable>

        <CustomDivider></CustomDivider>

        <CustomDraggable
          :list="[{
            id: 'RestrictionsForm',
            type: 'restrictions',
            maintainRestrictionType: props.maintainRestrictionType,
            tasks: undefined // 不可設定階層
          }]"
          :group="{ name: 'group-logic-nested', pull: 'clone', put: false  }"
          item-key="id"
          :clone="onRestrictionsClone"
          handle=".logic-nested-draggable"
        >
          <template #item>
            <RestrictionsTemplate
              ref="RestrictionsTemplateRef"
              :maintainRestrictionType="props.maintainRestrictionType"
            ></RestrictionsTemplate>
          </template>
        </CustomDraggable>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.logic-nested {
  display: flex;
  gap: 32px;

  &-tasks,
  &-form {
    flex: 1;
  }

  &-form {

    &-container {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }
  }
}
</style>
