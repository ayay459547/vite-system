<script setup lang="ts">
import { ref, computed, watch } from 'vue'
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
  set: (value: boolean) => emit('update:visible', value)
})

watch(tempVisible, (newValue) => {
  elVisible.value = newValue
})

const elVisible = ref(false)

watch(elVisible, (newValue) => {
  tempVisible.value = newValue
})

</script>

<template>
  <div class="popover-container">
    <ElTooltip
      v-model:visible="elVisible"
      :placement="props.placement"
      :trigger="props.trigger"
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