<script setup lang="ts">
import { customRef, ref } from 'vue'
import { ElPopover } from 'element-plus'

import { isEmpty } from '@/lib/lib_utils'

import {
  version,
  scopedId,
  props as popoverProps
} from './CustomPopoverInfo'

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
  <div :class="`CustomPopover_${version} ${scopedId}`" class="__popover-container">
    <ElPopover
      v-model:visible="tempValue"
      :placement="props.placement"
      :title="props.title"
      :width="props.width"
      :trigger="props.trigger"
      :popper-style="props.popperStyle"
      :show-arrow="props.showArrow"
      :offset="props.offset"
    >
      <template #reference>
        <slot name="reference"></slot>
      </template>
      <template #default>
        <slot></slot>
      </template>
    </ElPopover>
  </div>
</template>

<style lang="scss" scoped>
.__popover {
  &-container {
    width: fit-content;
    height: fit-content;
  }
}
</style>
