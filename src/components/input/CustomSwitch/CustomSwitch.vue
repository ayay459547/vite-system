<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { ElSwitch } from 'element-plus'

import { getUuid } from '@/lib/lib_utils' // 工具

import type { Props, Emits } from './CustomSwitchInfo'
import { version, props as switchProps } from './CustomSwitchInfo'

const scopedId = getUuid(version)

const props = defineProps(switchProps)

const tempValue = computed<Props.ModelValue>({
  get: () => props.modelValue,
  set: (value: Props.ModelValue) => emit('update:model-value', value)
})

const emit = defineEmits(['update:model-value', 'change'])

const onChange: Emits.Change = (val: string | number | boolean) => {
  emit('change', val)
}

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}

</script>

<template>
  <ElSwitch
    :class="scopedId"
    v-model="tempValue"
    :disabled="props.disabled"
    :loading="props.loading"
    :size="props.size"
    :width="props.width"
    :inline-prompt="props.inlinePrompt"
    :active-icon="props.activeIcon"
    :inactive-icon="props.inactiveIcon"
    :active-action-icon="props.activeActionIcon"
    :inactive-action-icon="props.inactiveActionIcon"
    :active-text="props.activeText"
    :inactive-text="props.inactiveText"
    :active-value="props.activeValue"
    :inactive-value="props.inactiveValue"
    :name="props.name"
    :validate-event="props.validateEvent"
    :before-change="props.beforeChange"
    :id="props.id"
    :tabindex="props.tabindex"
    :aria-label="props.ariaLabel"
    @change="onChange"
  >
    <template v-if="hasSlot('active-action')" #active-action>
      <slot name="active-action"></slot>
    </template>
    <template v-if="hasSlot('inactive-action')" #inactive-action>
      <slot name="inactive-action"></slot>
    </template>
  </ElSwitch>
</template>

<style lang="scss" scoped>
div[class*="__CustomSwitch"] {
  font-weight: 600;

  &.el-switch {
    :deep(.el-switch__core) {
      padding: 0 2px;
    }

    &.is-checked :deep(.el-switch__core .el-switch__inner) {
      padding: 0 24px 0 6px;
    }
    :deep(.el-switch__core .el-switch__inner) {
      padding: 0 6px 0 24px;
    }
  }
}
</style>
