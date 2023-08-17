<script setup lang="ts">
import {
  CustomTimeLine,
  CustomIcon
} from '@/components'

const options = [
  {
    timestamp: '8/18',
    label: '看板管理 + 看板',
    type: 'primary'
  },
  {
    timestamp: '8/25',
    label: '排程參數設定',
    type: ''
  },
  {
    timestamp: '8/31',
    label: '機台分配',
    type: ''
  }
]

</script>

<template>
  <div class="page">
    <h3 class="i-mb-md">Schedule</h3>

    <CustomTimeLine :options="options">
      <template #default="scope">
        <div>
          scope.label
        </div>
      </template>
    </CustomTimeLine>
  </div>
</template>

<style lang="scss" scoped>
.page {
  width: 100%;
  padding: 16px;
}
</style>
