<script setup lang="ts">
import type { PropType } from 'vue'
import { ref } from 'vue'

import type { Restrictions } from '@/types/types_logicRestriction/restrictions'
import CustomIcon from '@/components/feature/CustomIcon/CustomIcon.vue'
import CustomButton from '@/components/feature/CustomButton/CustomButton.vue'
import CustomCard from '@/components/feature/CustomCard/CustomCard.vue'
import RestrictionsForm from '@/components/views/Common/RestrictionsForm/RestrictionsForm.vue'

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

const RestrictionsFormRef = ref<InstanceType<typeof RestrictionsForm>>()
const initUseRestrictions = (logicRestriction: Restrictions) => {
  RestrictionsFormRef.value.initUseRestrictions(logicRestriction)
}
const getRestrictionsFormat = (): Restrictions => {
  return RestrictionsFormRef.value.getRestrictionsFormat()
}
defineExpose({
  initUseRestrictions,
  getRestrictionsFormat,
  submitRestrictions: () => {
    return RestrictionsFormRef.value.submitRestrictions()
  }
})

</script>

<template>
  <CustomCard class="logic-nested-restrictions">
    <template #header>
      <div class="logic-nested-draggable">
        <label>比對設定</label>
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

    <RestrictionsForm
      ref="RestrictionsFormRef"
      :maintainRestrictionType="props.maintainRestrictionType"
    ></RestrictionsForm>
  </CustomCard>
</template>

<style lang="scss" scoped>
.logic-nested {
  &-restrictions {
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
