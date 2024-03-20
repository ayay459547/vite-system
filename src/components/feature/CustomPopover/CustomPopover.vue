<script setup lang="ts">
import { customRef, ref } from 'vue'
import { ElPopover } from 'element-plus'

import { isEmpty, getUuid } from '@/lib/lib_utils'

import {
  version,
  props as popoverProps
} from './CustomPopoverInfo'

const scopedId = getUuid('__i-popover__')

const props = defineProps(popoverProps)

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
  <ElPopover
    v-model:visible="tempValue"
    :placement="props.placement"
    :title="props.title"
    :width="props.width"
    :trigger="props.trigger"
    :popper-style="props.popperStyle"
    :show-arrow="props.showArrow"
    :offset="props.offset"
    :class="`CustomPopover_${version} ${scopedId}`"
    class="__popover-container"
  >
    <template #reference>
      <slot name="reference"></slot>
    </template>
    <template #default>
      <slot></slot>
    </template>
  </ElPopover>
</template>

<style lang="scss" scoped>
// .__popover {
//   &-container {
//     width: fit-content;
//     height: fit-content;
//   }
// }
</style>
