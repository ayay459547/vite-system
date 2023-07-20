<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElTooltip } from 'element-plus'

export type Placement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'
export type Trigger = 'click' | 'focus' | 'hover' | 'contextmenu'

export interface Props {
  visible?: boolean
  placement?: Placement
  trigger?: Trigger
}
const props = withDefaults(defineProps<Props>(), {
  visible: false,
  placement: 'bottom',
  trigger: 'hover'
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

const isShow = computed<boolean>(() => {
  return onUpdateVisible(tempVisible.value)
})

</script>

<template>
  <div class="popover-container">
    <ElTooltip
      :visible="isShow"
      :placement="props.placement"
      :trigger="props.trigger"
      @update:visible="onUpdateVisible"
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
.popover {
  &-container {
    width: fit-content;
    height: fit-content;
  }
}
</style>