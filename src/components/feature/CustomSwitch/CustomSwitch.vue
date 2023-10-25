<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'
import { ElSwitch } from 'element-plus'

export type Size = '' | 'large'| 'default'| 'small'
export type ModelValue = boolean

const props = defineProps({
  modelValue: {
    type: Boolean as PropType<ModelValue>,
    required: true
  },
  style: {
    type: String as PropType<string>,
    default: ''
  },
  activeText: {
    type: String as PropType<string>,
    default: ''
  },
  inactiveText: {
    type: String as PropType<string>,
    default: ''
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  loading: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  size: {
    type: String as PropType<Size>,
    default: ''
  },
  width: {
    type: [String, Number] as PropType<string | number>,
    default: ''
  }
})

const tempValue = computed<ModelValue>({
  get: () => props.modelValue,
  set: (value: ModelValue) => emit('update:modelValue', value)
})

const emit = defineEmits([
  'update:modelValue',
  'change'
])

const onSwitchChange = (val: boolean) => {
  emit('change', val)
}

</script>

<template>
  <div class="switch-wrapper">
    <ElSwitch
      v-model="tempValue"
      class="i-switch"
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
:deep(.i-switch) {
  .el-switch__input {
    span[aria-hidden] {
      font-weight: 600;
    }
  }
}
.switch {
  &-wrapper {
    width: fit-content;
    height: fit-content;
  }
}
</style>
