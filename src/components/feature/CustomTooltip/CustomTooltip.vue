<script setup lang="ts">
import { customRef, ref } from 'vue'
import { ElTooltip } from 'element-plus'
import { isEmpty, getUuid } from '@/lib/lib_utils'

export type Placement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'
export type Trigger = 'click' | 'focus' | 'hover' | 'contextmenu'

export interface Props {
  visible?: boolean | null
  placement?: Placement
  trigger?: Trigger
  popperClass?: string
  showArrow?: boolean
  offset?: number
}
const props = withDefaults(defineProps<Props>(), {
  visible: null,
  placement: 'bottom',
  trigger: 'hover',
  popperClass: '',
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
    <ElTooltip
      v-model:visible="tempValue"
      :placement="props.placement"
      :trigger="props.trigger"
      :popper-class="props.popperClass"
      :show-arrow="props.showArrow"
      :offset="props.offset"
      effect="light"
    >
      <template #default>
        <slot></slot>
      </template>
      <template #content>
        <slot name="content"></slot>
      </template>
    </ElTooltip>
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
