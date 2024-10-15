<script setup lang="ts">
import { ref, computed, useSlots } from 'vue'
import { ElTooltip } from 'element-plus'

import { getUuid } from '@/lib/lib_utils'

import { version, props as tooltipProps } from './CustomTooltipInfo'

const scopedId = getUuid(version)

const props = defineProps(tooltipProps)

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

const tempVisible = ref(false)

const tempValue = computed({
  get() {
    return typeof props.visible === 'boolean' ? props.visible : tempVisible.value
  },
  set(value: boolean) {
    tempVisible.value = value
    emit('update:visible', value)
  }
})

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}

</script>

<template>
  <ElTooltip
    :append-to="props.appendTo"
    effect="light"
    :content="props.content"
    :raw-content="props.rawContent"
    :placement="props.placement"
    :fallback-placements="props.fallbackPlacements"
    v-model:visible="tempValue"
    :disabled="props.disabled"
    :offset="props.offset"
    :transition="props.transition"
    :popper-options="props.popperOptions"
    :show-after="props.showAfter"
    :show-arrow="props.showArrow"
    :hide-after="props.hideAfter"
    :auto-close="props.autoClose"
    :popper-class="props.popperClass"
    :enterable="props.enterable"
    :teleported="props.teleported"
    :trigger="props.trigger"
    :virtual-triggering="props.virtualTriggering"
    :virtual-ref="props.virtualRef"
    :trigger-keys="props.triggerKeys"
    :persistent="props.persistent"
    :aria-label="props.ariaLabel"
    :class="scopedId"
  >
    <template #default>
      <slot></slot>
    </template>
    <template v-if="hasSlot('content')" #content>
      <slot name="content"></slot>
    </template>
  </ElTooltip>
</template>

<style lang="scss" scoped></style>
