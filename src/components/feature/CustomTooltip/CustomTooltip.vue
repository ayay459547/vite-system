<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElTooltip } from 'element-plus'

import { getUuid } from '@/lib/lib_utils.ts'

import { version, props as tooltipProps } from './CustomTooltipInfo.ts'

const scopedName = '__i-tooltip__'
const scopedId = getUuid(scopedName)

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
</script>

<template>
  <ElTooltip
    v-model:visible="tempValue"
    :placement="props.placement"
    :trigger="props.trigger"
    :popper-class="props.popperClass"
    :show-arrow="props.showArrow"
    :offset="props.offset"
    :enterable="props.enterable"
    :show-after="props.showAfter"
    :virtual-ref="props.virtualRef"
    :virtual-triggering="props.virtualTriggering"
    :popper-options="props.popperOptions"
    effect="light"
    class="tooltip-container"
    :class="[
      `CustomTooltip_${version}`,
      scopedId,
      scopedName
    ]"
  >
    <template #default>
      <slot></slot>
    </template>
    <template #content>
      <slot name="content"></slot>
    </template>
  </ElTooltip>
</template>

<style lang="scss" scoped></style>
