<script setup lang="ts">
import type { PropType } from 'vue'
import type { StepRecord, StepRecordManagement } from './lib_step'

import CustomButton from '@/components/feature/CustomButton/CustomButton.vue'
import CustomPopover from '@/components/feature/CustomPopover/CustomPopover.vue'

import UndoButton from './UndoButton.vue'
import RedoButton from './RedoButton.vue'
import ActionLog from './ActionLog.vue'

const props = defineProps({
  stepRecordManagement: {
    type: Object as PropType<StepRecordManagement>,
    required: true
  }
})

</script>

<template>
  <div class="record-container">
    <!-- 還原前步驟 -->
    <UndoButton :stepRecordManagement="props.stepRecordManagement"/>
    <!-- 重作後步驟 -->
    <RedoButton :stepRecordManagement="props.stepRecordManagement"/>
    <CustomPopover
      placement="right-start"
      popperStyle="width: fit-content;"
    >
      <template #default>
        <div class="log-container">
          <ActionLog :stepRecordManagement="props.stepRecordManagement"/>
        <!-- {{ 'adasd' }} -->
        </div>
      </template>
      <template #reference>
        <CustomButton
          icon-x-type="fluent"
          icon-name="DocumentBulletListClock20Regular"
          icon-size="small"
        />
      </template>
    </CustomPopover>

  </div>
</template>

<style lang="scss" scoped>
  .record {
    &-container {
      display: flex;
      flex-direction: row;
    }
  }
  .log {
    &-container {
      display: flex;
      width: 300px;
      height: 400px;
    }
  }
</style>
