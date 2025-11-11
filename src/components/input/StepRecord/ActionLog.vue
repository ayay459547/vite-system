<script setup lang="ts">
import type { PropType } from 'vue'
import type { StepRecordManagement } from './lib_step'

// import CustomIcon from '@/components/feature/CustomIcon/CustomIcon.vue'
// import CustomButton from '@/components/feature/CustomButton/CustomButton.vue'

const props = defineProps({
  stepRecordManagement: {
    type: Object as PropType<StepRecordManagement>,
    required: true
  }
})

const returnToStep = (index: number) => {
  console.log('RETURN =>', index)
  props.stepRecordManagement.toStep(index)
}

const stepClass = (index: number) => {
  if(index === props.stepRecordManagement.curStepIndex.value) return 'cur'
  else return ''
}
</script>

<template>
  <div class="log-container">
    <div class="log-header">
      <div class="log-header index"> {{ '#' }} </div>
      <div class="log-header text"> {{ 'ACTION' }}</div>
    </div>
    <div class="log-body">
      <template v-for="record, index in props.stepRecordManagement.stepRecords" :key="record">
        <div class="log-item" :class="stepClass(index)"
          @click="returnToStep(index)"
        >
          <div class="log-item index"> {{ index }} </div>
          <div class="log-item text"> {{ record.stepName }}</div>
        </div>
      </template>
    </div>
  </div>

</template>

<style lang="scss" scoped>
  .log {
    &-container {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      border: 1px solid rgb(200, 200, 200);
      border-radius: 4px;
    }
    &-header {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 28px;
      font-weight: 600;
      justify-content: center;
      align-items: center;
      // text-align: center;

      background-color: var(--i-color-table-thead);
      border-bottom: 1px solid rgb(200, 200, 200);
      &.index {
        width: 50px;
        border-right: 1px solid rgb(200, 200, 200);
      }
    }


    &-list {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      font-size: 14px;
    }

    &-item {
      width: 100%;
      display: flex;
      flex-direction: row;
      height: 28px;
      // font-weight: 600;
      justify-content: center;
      align-items: center;
      border-bottom: 1px solid rgb(200, 200, 200);
      &.index {
        width: 50px;
        border-right: 1px solid rgb(200, 200, 200);
      }
      &:hover {
        background-color: rgb(255, 242, 226);
        font-weight: 600;
        // background-color: var(--i-color-table-thead);
      }
      &.cur {
        background-color: rgb(255, 228, 193);
      }

      &-name {

      }
    }
  }
</style>
