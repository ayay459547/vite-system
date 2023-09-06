<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElPopover } from 'element-plus'

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
}
const props = withDefaults(defineProps<Props>(), {
  visible: null,
  width: 150,
  title: '',
  placement: 'bottom',
  trigger: 'click',
  popperStyle: '',
  showArrow: true
})

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

const tempVisible = computed<boolean>({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const elVisible = ref(false)
const tempElVisible = computed<boolean>({
  get: () => elVisible.value,
  set: (value: boolean) => elVisible.value = value
})

const onUpdateVisible = (value: boolean): boolean => {
  tempVisible.value = value
  tempElVisible.value = value
  return value
}

const isShow = computed<boolean>({
  get: () => {
    return tempVisible.value || tempElVisible.value
  },
  set: (v: boolean) => {
    onUpdateVisible(v)
  }
})

</script>

<template>
  <div class="popover-container">
    <ElPopover
      :visible="isShow"
      :placement="props.placement"
      :title="props.title"
      :width="props.width"
      :trigger="props.trigger"
      :popper-style="props.popperStyle"
      :show-arrow="props.showArrow"
      @update:visible="onUpdateVisible"
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
.popover {
  &-container {
    width: fit-content;
    height: fit-content;
  }
}
</style>