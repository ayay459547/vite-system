<script setup lang="ts">
import { ref } from 'vue'
import TESTComponents from './TESTComponents.vue'

// 使用 ref 取得組件 TESTComponents
const TESTComponentsRef = ref<InstanceType<typeof TESTComponents>>()

const onLabelClick = ($event: string) => {
  if (!TESTComponentsRef.value) return
  // TESTComponentsRef.value.addCount()
  TESTComponentsRef.value.count++
  console.log('onLabelClick => ', `${$event} - ${TESTComponentsRef.value.count}`)
}
</script>

<template>
  <div class="i-page flex-column i-ga-md" style="width: 500px;">
    <TESTComponents
      ref="TESTComponentsRef"
      label="TEST"
      v-on:label-click="onLabelClick"
    >
      <template #label>{{ 'TEST' }}</template>
      <template #default="{ count }">{{ `count: ${count}` }}</template>
      <!-- <span>default slot</span> -->
    </TESTComponents>
  </div>
</template>

<style lang="scss" scoped></style>
