<script setup lang="ts">
import { computed } from 'vue'
import { ElSwitch } from 'element-plus'

import { getUuid } from '@/lib/lib_utils'

import type { Props, Emits } from './CustomSwitchInfo'
import { version, props as switchProps } from './CustomSwitchInfo'

const scopedId = getUuid('__i-switch__')

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
    class="__i-switch __i-switch-container"
    :class="`CustomSwitch_${version} ${scopedId}`"
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
:deep(.__i-switch) {
  .el-switch__input {
    span[aria-hidden] {
      font-weight: 600;
    }
  }
}
// .__switch {
//   &-container {
//     width: fit-content;
//     height: fit-content;
//   }
// }
</style>
