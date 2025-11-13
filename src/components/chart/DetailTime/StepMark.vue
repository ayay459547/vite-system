<script setup lang="ts">
import type { PropType } from 'vue'
import { inject } from 'vue'

import type { UseHook } from '@/types/types_hook' // 全域功能類型

const useHook = inject('useHook') as UseHook
const { i18nTranslate } = useHook({
  i18nModule: 'system'
})

interface Step {
  active: boolean
  param: string
  color: string
  i18nLabel: string
}
const props = defineProps({
  step: {
    type: Object as PropType<Step>,
    required: true
  }
})

const colorStyle = () => {
  if(!props.step.active) return {}
  return {
    'background-color': props.step.color
  }
}
const stepText = () => {
  return i18nTranslate(props.step.i18nLabel)
}

</script>

<template>
  <div class="stepinfo-container">
    <div class="stepinfo-color" :style="colorStyle()"></div>
    <div class='stepinfo-text'> {{ stepText() }}</div>
  </div>

</template>

<style lang="scss" scoped>
  .stepinfo {
    &-container {
      width: 100%;
      height: 40px;
      padding: 8px;
      gap: 8px;
      display: flex;
      flex-direction: row;
      align-items: center;

      cursor: pointer;
    }
    &-color {
      border: 1px solid lightgray;
      border-radius: 2px;
      width: 15px;
      height: 15px;
    }
  }
</style>
