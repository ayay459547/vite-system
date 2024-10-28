<script setup lang="ts">
import { computed } from 'vue'
import { ElSwitch } from 'element-plus'

import { getUuid } from '@/lib/lib_utils' // 工具

import type { Props, Emits } from './CustomSwitchInfo'
import { version, props as switchProps } from './CustomSwitchInfo'

const scopedId = getUuid(version)

const props = defineProps(switchProps)

const tempValue = computed<Props.ModelValue>({
  get: () => props.modelValue,
  set: (value: Props.ModelValue) => emit('update:modelValue', value)
})

const emit = defineEmits(['update:modelValue', 'change'])

const onChange: Emits.Change = (val: string | number | boolean) => {
  emit('change', val)
}
</script>

<template>
  <ElSwitch
    v-model="tempValue"
    :class="scopedId"
    :style="props.style"
    :active-text="props.activeText"
    :inactive-text="props.inactiveText"
    :disabled="props.disabled"
    :loading="props.loading"
    :width="props.width"
    :size="props.size"
    :validate-event="false"
    @change="onChange"
  ></ElSwitch>
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
