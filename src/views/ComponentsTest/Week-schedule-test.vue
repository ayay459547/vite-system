<script setup lang="ts">
import type { Hook } from '@/declare/hook'
import { inject } from 'vue'
import { WeekSchedule } from '@/components'

const hook: Hook = inject('hook')
const { i18nTranslate } = hook()

const typeList = [
  {
    key: 'normalWorkingTime',
    label: i18nTranslate('normalWorkingTime'),
    color: '#cfccf6'
  },
  {
    key: 'firstOverTime',
    label: i18nTranslate('firstOverTime'),
    color: '#f3ffc6'
  },
  {
    key: 'secondOverTime',
    label: i18nTranslate('secondOverTime'),
    color: '#a7e8c4'
  },
  {
    key: 'extendedWorkingTime',
    label: i18nTranslate('extendedWorkingTime'),
    color: '#f2b5c9'
  }
]

</script>

<template>
  <div class="page-container">
    <h3 class="i-mb-md">WeekSchedule-test</h3>
    <WeekSchedule
      :type-list="typeList"
    />
  </div>
</template>

<style lang="scss" scoped>
.page {
  &-container {
    padding: 16px;
  }
}
</style>