<script setup lang="ts">
import { inject } from 'vue'

import type { UseHook } from '@/declare/hook'
import WeekSchedule from './WeekSchedule/WeekSchedule.vue'

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook()

const typeList = [
  {
    value: 'normalWorkingTime',
    label: 'normalWorkingTime',
    color: '#cfccf6'
  },
  {
    value: 'firstOverTime',
    label: 'firstOverTime',
    color: '#f3ffc6'
  },
  {
    value: 'secondOverTime',
    label: 'secondOverTime',
    color: '#a7e8c4'
  },
  {
    value: 'extendedWorkingTime',
    label: 'extendedWorkingTime',
    color: '#f2b5c9'
  }
]
</script>

<template>
  <div class="page-container">
    <WeekSchedule :options="typeList">
      <template #title>
        <h3>機台工時分配測試</h3>
      </template>
      <template #options="{ label }">
        {{ i18nTranslate(label) }}
      </template>
    </WeekSchedule>
  </div>
</template>

<style lang="scss" scoped>
.page {
  &-container {
    padding: 16px;
  }
}
</style>
