<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'
import { ElPopover } from 'element-plus'

import { getUuid, hasOwnProperty } from '@/lib/lib_utils'

import { version, props as popoverProps } from './CustomPopoverInfo'

const scopedName = '__i-popover__'
const scopedId = getUuid(scopedName)

const props = defineProps(popoverProps)

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

const tempVisible = ref(false)

const tempValue = computed({
  get() {
    if (typeof props.visible === 'boolean') {
      return props.visible
    } else {
      return tempVisible.value
    }
  },
  set(value: boolean) {
    tempVisible.value = value
    emit('update:visible', value)
  }
})

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}

const popoverRef = ref()
// const updatePopper = async () => {
//   console.log('updatePopper')
//   await nextTick()
//   if(popoverRef.value) {
//     console.log(popoverRef.value)
//     // popoverRef.value?.updatePopper()
//   }
// }
// defineExpose({
//   updatePopper
// })
</script>

<template>
  <ElPopover
    ref="popoverRef"
    v-model:visible="tempValue"
    :placement="props.placement"
    :title="props.title"
    :width="props.width"
    :trigger="props.trigger"
    :popper-style="props.popperStyle"
    :show-arrow="props.showArrow"
    :offset="props.offset"
    :virtual-ref="props.virtualRef"
    :virtual-triggering="props.virtualTriggering"
    class="popover-container"
    :class="[
      `CustomPopover_${version}`,
      scopedId,
      scopedName
    ]"
  >
    <template v-if="hasSlot('reference')" #reference>
      <slot name="reference"></slot>
    </template>
    <template #default>
      <slot></slot>
    </template>
  </ElPopover>
</template>

<style lang="scss" scoped></style>
