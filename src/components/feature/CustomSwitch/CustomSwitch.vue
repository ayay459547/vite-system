<script setup lang="ts">
import { computed } from 'vue'
import { ElSwitch } from 'element-plus'

import type { ModelValue } from './CustomSwitchInfo'
import {
  version,
  scopedId,
  props as switchProps
} from './CustomSwitchInfo'

const props = defineProps(switchProps)

const tempValue = computed<ModelValue>({
  get: () => props.modelValue,
  set: (value: ModelValue) => emit('update:modelValue', value)
})

const emit = defineEmits([
  'update:modelValue',
  'change'
])

const onSwitchChange = (value: boolean) => {
  emit('change', value)
}

</script>

<template>
  <div :class="`CustomSwitch_${version} ${scopedId}`" class="__switch-wrapper">
    <ElSwitch
      v-model="tempValue"
      class="__i-switch"
      :style="props.style"
      :active-text="props.activeText"
      :inactive-text="props.inactiveText"
      :disabled="props.disabled"
      :loading="props.loading"
      :width="props.width"
      :size="props.size"
      :validate-event="false"
      @change="onSwitchChange"
    ></ElSwitch>
  </div>
</template>

<style lang="scss" scoped>
:deep(.__i-switch) {
  .el-switch__input {
    span[aria-hidden] {
      font-weight: 600;
    }
  }
}
.__switch {
  &-wrapper {
    width: fit-content;
    height: fit-content;
  }
}
</style>
