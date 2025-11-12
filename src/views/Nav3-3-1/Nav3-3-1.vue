<script setup lang="ts">
import { ref } from 'vue'

import { CustomCollapse, CustomDivider } from '@/components/feature'

const active1 = ref(['options1', 'options2'])

const active2 = ref('options3')
</script>

<template>
  <div class="page">
    <CustomDivider>一般模式</CustomDivider>
    <div class="border-success i-pa-lg">
      <CustomCollapse
        v-model="active1"
        :options="[
          { label: '選項1', value: 'options1' },
          { label: '選項2', value: 'options2', disabled: true },
          { label: '選項3', value: 'options3' }
        ]"
      >
        <template #default="{ label, value, disabled }">
          <div class="flex-column i-ga-md">
            <label>{{ `文字: ${label}` }}</label>
            <label>{{ `值: ${value}` }}</label>
            <label class="text-danger">{{ `是否鎖定: ${disabled}` }}</label>
          </div>
        </template>
      </CustomCollapse>
    </div>

    <CustomDivider>手風琴模式</CustomDivider>
    <div class="border-primary i-pa-lg">
      <CustomCollapse
        v-model="active2"
        :options="[
          { label: '選項1', value: 'options1' },
          { label: '選項2', value: 'options2' },
          { label: '選項3', value: 'options3', disabled: true }
        ]"
        accordion
      >
        <template #default="{ label, value, disabled }">
          <div class="flex-column i-ga-md">
            <label>{{ `文字: ${label}` }}</label>
            <label>{{ `值: ${value}` }}</label>
            <label class="text-danger">{{ `是否鎖定: ${disabled}` }}</label>
          </div>
        </template>
      </CustomCollapse>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  padding: 16px;
}
</style>
