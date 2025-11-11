<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'
import { ElPopover } from 'element-plus'

import { getUuid, hasOwnProperty } from '@/lib/lib_utils' // 工具

import { version, props as popoverProps } from './CustomPopoverInfo'

const scopedId = getUuid(version)

const props = defineProps(popoverProps)

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

const tempVisible = ref(false)

const tempValue = computed({
  get: () => {
    if (typeof props.visible === 'boolean') return props.visible
    return tempVisible.value
  },
  set: (value: boolean) => {
    tempVisible.value = value
    emit('update:visible', value)
  }
})

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}

const ElPopoverRef = ref<typeof ElPopover>()
// const updatePopper = async () => {
//   console.log('updatePopper')
//   await nextTick()
//   if(ElPopoverRef.value) {
//     console.log(ElPopoverRef.value)
//     // ElPopoverRef.value?.updatePopper()
//   }
// }
// defineExpose({
//   updatePopper
// })
</script>

<template>
  <ElPopover
    ref="ElPopoverRef"
    :class="scopedId"
    :trigger="props.trigger"
    :title="props.title"
    :effect="props.effect"
    :content="props.content"
    :width="props.width"
    :placement="props.placement"
    :disabled="props.disabled"
    v-model:visible="tempValue"
    :offset="props.offset"
    :transition="props.transition"
    :show-arrow="props.showArrow"
    :popper-options="props.popperOptions"
    :popper-class="props.popperClass"
    :popper-style="props.popperStyle"
    :show-after="props.showAfter"
    :hide-after="props.hideAfter"
    :auto-close="props.autoClose"
    :tabindex="props.tabindex"
    :teleported="props.teleported"
    :persistent="props.persistent"
    :virtual-ref="props.virtualRef"
    :virtual-triggering="props.virtualTriggering"
  >
    <template v-if="hasSlot('reference')" #reference>
      <slot name="reference"></slot>
    </template>
    <template v-if="hasSlot('default')" #default>
      <slot></slot>
    </template>
  </ElPopover>
</template>

<style lang="scss" scoped></style>
