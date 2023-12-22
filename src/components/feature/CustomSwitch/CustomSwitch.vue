<script setup lang="ts">
import { type PropType, computed } from 'vue'
import { ElSwitch } from 'element-plus'
import { getUuid } from '@/lib/lib_utils'

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

const scopedId = getUuid('__i-switch__')

</script>

<template>
  <div class="__switch-wrapper" :class="scopedId">
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
