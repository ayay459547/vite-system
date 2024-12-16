<script setup lang="ts">
import type { PropType } from 'vue'
import type { FitViewParams } from '@vue-flow/core'
import { Controls } from '@vue-flow/controls'

const props = defineProps({
  showZoom: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
    description: '顯示縮放按鈕'
  },
  showFitView: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
    description: '顯示 fit-view btn'
  },
  showInteractive: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
    description: '顯示鎖定互動式 btn'
  },
  fitViewParams: {
    type: Object as PropType<FitViewParams>,
    required: false,
    default: undefined,
    description: '用於適合視圖按鈕點擊的參數'
  }
})

</script>

<template>
  <Controls
    :showZoom="props.showZoom"
    :showFitView="props.showFitView"
    :showInteractive="props.showInteractive"
    :fitViewParams="props.fitViewParams"
  >
    <slot></slot>
  </Controls>
</template>

<style lang="scss" scoped></style>
