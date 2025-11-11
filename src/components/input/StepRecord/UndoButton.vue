<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'
import type { StepRecord, StepRecordManagement } from './lib_step'

// import CustomIcon from '@/components/feature/CustomIcon/CustomIcon.vue'
import CustomButton from '@/components/feature/CustomButton/CustomButton.vue'

const props = defineProps({
  stepRecordManagement: {
    type: Object as PropType<StepRecordManagement>,
    required: true
  }
})

const forbidUndo = computed(() => {
  return !props.stepRecordManagement.hasPrevStep()
})
</script>


<template>
  <CustomButton
    icon-x-type="ionicons5"
    icon-name="ArrowUndo"
    icon-size="small"
    label="還原"
    :disabled="forbidUndo"
    @click="props.stepRecordManagement.prevStep"
  />
<!-- <div class="record-btn">
    <CustomIcon
      x-type="ionicons5"
      name="ArrowUndo"
      size="small"
    />
    {{ '還原' }}
  </div> -->


</template>

<style lang="scss" scoped>
  .record {
    &-btn {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 14px;
      width: 60px;
      height: 36px;
      gap: 4px;

      cursor: pointer;
      // &:hover: {
      //   pion
      // }
    }
  }
</style>
