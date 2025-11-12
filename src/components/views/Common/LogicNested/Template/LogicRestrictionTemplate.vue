<script setup lang="ts">
import type { PropType } from 'vue'
import { ref } from 'vue'

import type { LogicRestriction } from '@/types/types_logicRestriction/logicRestriction'
import CustomIcon from '@/components/feature/CustomIcon/CustomIcon.vue'
import CustomButton from '@/components/feature/CustomButton/CustomButton.vue'
import CustomCard from '@/components/feature/CustomCard/CustomCard.vue'
import LogicRestrictionForm from '@/components/views/Common/LogicRestrictionForm/LogicRestrictionForm.vue'

const props = defineProps({
  maintainRestrictionType: {
    type: String as PropType<string>,
    default: '',
    description: 'MaintainRestrictionType'
  },
  isRemove: {
    type: Boolean as PropType<boolean>,
    default: false,
    description: '是否可以刪除'
  }
})

const emit = defineEmits(['remove'])

const LogicRestrictionFormRef = ref<InstanceType<typeof LogicRestrictionForm>>()
const initUseLogicRestriction = (logicRestriction: LogicRestriction) => {
  LogicRestrictionFormRef.value.initUseLogicRestriction(logicRestriction)
}
const getLogicRestrictionFormat = (): LogicRestriction => {
  return LogicRestrictionFormRef.value.getLogicRestrictionFormat()
}
defineExpose({
  initUseLogicRestriction,
  getLogicRestrictionFormat,
  submitLogicRestriction: () => {
    return LogicRestrictionFormRef.value.submitLogicRestriction()
  }
})

</script>

<template>
  <CustomCard class="logic-nested-logicRestriction">
    <template #header>
      <div class="logic-nested-draggable">
        <label>邏輯設定</label>
        <div class="flex-row-center">
          <CustomIcon x-type="material" name="DragIndicatorRound" />
          <CustomButton
            v-if="props.isRemove"
            type="danger"
            icon-name="trash-can"
            text
            @click="emit('remove')"
          />
        </div>
      </div>
    </template>

    <LogicRestrictionForm
      ref="LogicRestrictionFormRef"
      :maintainRestrictionType="props.maintainRestrictionType"
      :isRestrictions="false"
    ></LogicRestrictionForm>
    <slot></slot>
  </CustomCard>
</template>

<style lang="scss" scoped>
.logic-nested {
  &-logicRestriction {
    width: 100%;
  }
  &-draggable {
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
