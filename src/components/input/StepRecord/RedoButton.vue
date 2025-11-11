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

const forbidRedo = computed(() => {
  return !props.stepRecordManagement.hasNextStep()
})

</script>

<template>
  <CustomButton
    icon-x-type="ionicons5"
    icon-name="ArrowRedo"
    icon-size="small"
    label="重做"
    :disabled="forbidRedo"
    @click="props.stepRecordManagement.nextStep"
  />
  <!-- <div class="record-btn">
    <CustomButton
      icon-x-type="ionicons5"
      icon-name="ArrowRedo"
      icon-size="small"
      label="重做"
    />
    <CustomIcon

      size="small"
    />
    {{ '重做' }}
  </div> -->


</template>

<style lang="scss" scoped>
  .record {
    &-btn {
      display: flex;
      flex-direction: row;
      width: 60px;
      height: 36px;
      align-items: center;
      font-size: 14px;

      cursor: pointer;
    }
  }
</style>
