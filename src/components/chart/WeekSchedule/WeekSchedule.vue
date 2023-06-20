<script setup lang="ts">
import { PropType } from 'vue'
import type { Hook } from '@/declare/hook'
import { inject } from 'vue'
// import PlanItem from './PlanItem.vue'

export type TypeItem = {
  key: string
  label: string
  color: string
}

const hook: Hook = inject('hook')
const { i18nTranslate } = hook()

const props = defineProps({
  typeList: {
    type: Array as PropType<TypeItem[]>,
    required: false
  },
  itemList: {
    type: Array as PropType<any[]>,
    required: false
  }
})

console.log(props)

const dayList = [
  { id: 0, label: 'sunday' },
  { id: 1, label: 'monday' },
  { id: 2, label: 'tuesday' },
  { id: 3, label: 'wednesday' },
  { id: 4, label: 'thursday' },
  { id: 5, label: 'friday' },
  { id: 6, label: 'saturday' }
]
</script>

<template>
  <div class="schedule-wrapper">
    <div class="schedule-time">
      <div class="schedule-time-zero">{{ '00:00' }}</div>

      <ul class="schedule-time-list">
        <li
          v-for="hour in 24"
          :key="hour"
          class="schedule-time-item"
        >
          <div class="text">{{ `${hour}:00`.padStart(5, '0') }}</div>
        </li>
      </ul>
    </div>

    <div class="schedule-week">
      <ul class="schedule-day-list">
        <li
          v-for="dayItem in dayList"
          :key="dayItem.id"
          class="schedule-day-item"
        >
          {{ i18nTranslate(dayItem.label) }}
        </li>
      </ul>
      <div class="schedule-container">
        <div
          v-for="number in 168"
          :key="number"
          class="schedule-block"
        >
          <div class="first-block"></div>
          <div class="second-block"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$header-height: 30px;
$body-height: 960px;
.schedule {
  &-wrapper {
    width: 100%;
    min-width: 560px;
    height: fit-content;
    display: flex;
    padding: 4px;
  }
  &-time {
    width: 48px;
    &-zero {
      width: 100%;
      height: $header-height;
      transform: translateY(22px);
    }
    &-list {
      width: 100%;
      height: $body-height;
      display: grid;
      grid-template-rows: repeat(24, 1fr);
    }
    &-item {
      color: #4d4d4d;
      .text {
        transform: translateY(32px);
      }
    }
  }
  &-week {
    flex: 1;
  }

  &-day {
    &-list {
      width: 100%;
      height: $header-height;
      display: grid;
      grid-template-rows: 1fr;
      grid-template-columns: repeat(7, 1fr);
    }
    &-item {
      @extend %flex-center;
      color: #4d4d4d;
    }
  }

  &-container {
    width: 100%;
    height: $body-height;
    border: 1px solid #dddddd;
    border-right: 1px solid #dddddd00;
    display: grid;
    grid-template-rows: repeat(24, 1fr);
    grid-template-columns: repeat(7, 1fr);
  }
  &-block {
    border-right: 1px solid #dddddd;
    display: flex;
    flex-direction: column;
    transition-duration: 0.2s;

    &:hover {
      background-color: #dddddd;
    }
    .first-block {
      flex: 1;
      border-bottom: 1px solid #eeeeee;
    }
    .second-block {
      flex: 1;
      border-bottom: 1px solid #dddddd;
    }
  }
}
</style>