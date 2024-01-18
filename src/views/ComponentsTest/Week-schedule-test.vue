<script setup lang="ts">
import { inject } from 'vue'

import type { UseHook } from '@/declare/hook'
import { WeekSchedule } from '@/components'

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook()

const typeList = [
  {
    key: 'normalWorkingTime',
    label: 'normalWorkingTime',
    color: '#cfccf6'
  },
  {
    key: 'firstOverTime',
    label: 'firstOverTime',
    color: '#f3ffc6'
  },
  {
    key: 'secondOverTime',
    label: 'secondOverTime',
    color: '#a7e8c4'
  },
  {
    key: 'extendedWorkingTime',
    label: 'extendedWorkingTime',
    color: '#f2b5c9'
  }
]

</script>

<template>
  <div class="page-container">
    <h3 class="i-mb-md">WeekSchedule-test</h3>
    <WeekSchedule
      :type-list="typeList"
    >
      <template #label="{ label }">
        {{ i18nTranslate(label) }}
      </template>
    </WeekSchedule>

    <WeekSchedule
      :type-list="typeList"
    >
      <template #label="{ label }">
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
