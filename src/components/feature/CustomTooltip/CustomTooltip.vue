<script setup lang="ts">
import { customRef, ref } from 'vue'
import { ElTooltip } from 'element-plus'

import { isEmpty, getUuid } from '@/lib/lib_utils'

import {
  version,
  props as tooltipProps
} from './CustomTooltipInfo'

const scopedId = getUuid('__i-tooltip__')

const props = defineProps(tooltipProps)

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

const tempVisible = ref(false)

const tempValue = customRef((track, trigger) => {
  return {
    get () {
      track() // 追蹤數據改變
      if (
        !isEmpty(props.visible) &&
        typeof props.visible === 'boolean'
      ) return props.visible

      return tempVisible.value
    },
    set (value: boolean) {
      tempVisible.value = value
      emit('update:visible', value)
      trigger() // 通知 vue 重新解析
    }
  }
})

</script>

<template>
  <ElTooltip
    v-model:visible="tempValue"
    :placement="props.placement"
    :trigger="props.trigger"
    :popper-class="props.popperClass"
    :show-arrow="props.showArrow"
    :offset="props.offset"
    :enterable="props.enterable"
    :show-after="props.showAfter"
    effect="light"
    :class="`CustomTooltip_${version} ${scopedId}`"
    class="__popover-wrapper"
  >
    <template #default>
      <slot></slot>
    </template>
    <template #content>
      <slot name="content"></slot>
    </template>
  </ElTooltip>
</template>

<style lang="scss" scoped>
// .__popover {
//   &-wrapper {
//     width: fit-content;
//     height: fit-content;
//   }
// }
</style>
