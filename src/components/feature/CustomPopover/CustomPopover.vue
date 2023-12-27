<script setup lang="ts">
import { customRef, ref } from 'vue'
import { ElPopover } from 'element-plus'

import { isEmpty, getUuid } from '@/lib/lib_utils'

export type Placement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'
export type Trigger = 'click' | 'focus' | 'hover' | 'contextmenu'

export interface Props {
  visible?: boolean | null
  width?: number | string
  title?: string
  placement?: Placement
  trigger?: Trigger
  popperStyle?: string
  showArrow?: boolean
  offset?: number
}
const props = withDefaults(defineProps<Props>(), {
  visible: null,
  width: 150,
  title: '',
  placement: 'bottom',
  trigger: 'click',
  popperStyle: '',
  showArrow: true,
  offset: 0
})

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

const scopedId = getUuid('__i-popover__')

</script>

<template>
  <div class="__popover-container" :class="scopedId">
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
