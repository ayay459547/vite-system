<script setup lang="ts">
import { inject } from 'vue'

import type { UseHook } from '@/declare/hook.ts'
import { WeekSchedule } from '@/components'

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
        <h3>WeekSchedule-test</h3>
      </template>
      <template #options="{ label }">
        {{ i18nTranslate(label) }}
      </template>
    </WeekSchedule>

    <WeekSchedule :options="typeList">
      <template #title>
        <h3>WeekSchedule-test-2</h3>
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
