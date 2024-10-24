<script setup lang="ts">
import { ref, reactive } from 'vue'
import { MoreFilled } from '@element-plus/icons-vue'
import type { CustomTourProps } from '@/components' // 系統組件
import { CustomDividerView, CustomTour, CustomButton, CustomDivider } from '@/components' // 系統組件

const open = ref(false)
const current = ref(0)

const ref1 = ref()
const ref2 = ref()
const ref3 = ref()

const steps = reactive<CustomTourProps.Steps>([
  {
    target: ref1,
    // target: '.test-1',
    title: 'Upload File'
  },
  {
    // target: () => {
    //   return ref2
    // },
    target: '.test-2',
    title: 'Save File',
    description: 'Save your changes'
  },
  {
    target: '.test-3',
    title: 'Finish File',
    description: 'Click to see other'
  }
])

const onClose = () => {
  console.log('ref1 => ', ref1.value)
  console.log('ref2 => ', ref2.value)
  console.log('ref3 => ', ref3.value)
}

</script>

<template>
  <div class="page">
    <CustomDividerView>
      <template #left>
        <div class="page-left">
          <CustomButton type="primary" @click="open = true">Begin Tour</CustomButton>

          <CustomDivider />

          <div class="flex-row i-ga-md">
            <div ref="ref1">
              <CustomButton class="test-1">Upload</CustomButton>
            </div>
            <CustomButton ref="ref2" type="primary" class="test-2">Save</CustomButton>
            <CustomButton ref="ref3" :icon="MoreFilled" class="test-3"/>
          </div>

          <CustomTour
            v-model="open"
            v-model:current="current"
            :steps="steps"
            @close="onClose"
          >
            <template #header-steps="{ title }">{{ `${title} 777` }}</template>
            <template #steps="{ description }">{{ `${description} 5555` }}</template>
          </CustomTour>
        </div>
      </template>
      <template #right>
        <div class="page-right">
        </div>
      </template>
    </CustomDividerView>
  </div>
</template>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  &-left {
    padding: 12px;
    width: 1500px;
    height: 1500px;
    background-color: lightpink;
  }

  &-right {
    padding: 12px;
    width: 100%;
    height: 100%;
    background-color: lightblue;
  }
}
</style>
