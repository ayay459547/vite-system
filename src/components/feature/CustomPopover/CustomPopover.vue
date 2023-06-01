<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElPopover } from 'element-plus'

type Placement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'
type Trigger = 'click' | 'focus' | 'hover' | 'contextmenu'

interface Props {
  visible?: boolean
  width?: number
  title?: string
  placement?: Placement
  trigger?: Trigger
  popperStyle?: string
}
const props = withDefaults(defineProps<Props>(), {
  visible: false,
  width: 150,
  title: '',
  placement: 'bottom',
  trigger: 'click',
  popperStyle: ''
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
    <ElPopover
      v-model:visible="elVisible"
      :placement="props.placement"
      :title="props.title"
      :width="props.width"
      :trigger="props.trigger"
      :popper-style="props.popperStyle"
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