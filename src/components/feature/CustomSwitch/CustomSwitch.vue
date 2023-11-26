<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'
import { ElSwitch } from 'element-plus'

export type Size = '' | 'large'| 'default'| 'small'
export type ModelValue = boolean

const props = defineProps({
  modelValue: {
    type: Boolean as PropType<ModelValue>,
    required: true,
    description: 'v-model 綁定是否顯示'
  },
  style: {
    type: String as PropType<string>,
    default: '',
    description: '樣式'
  },
  activeText: {
    type: String as PropType<string>,
    default: '',
    description: '啟用文字'
  },
  inactiveText: {
    type: String as PropType<string>,
    default: '',
    description: '不啟用文字'
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    default: false,
    description: '是否禁用'
  },
  loading: {
    type: Boolean as PropType<boolean>,
    default: false,
    description: '是否讀取中'
  },
  size: {
    type: String as PropType<Size>,
    default: '',
    description: '大小'
  },
  width: {
    type: [String, Number] as PropType<string | number>,
    default: '',
    description: '寬度'
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
