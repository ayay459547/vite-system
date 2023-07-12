<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'

import type { CheckboxValueType } from 'element-plus'
import { ElCheckbox } from 'element-plus'

export type ModelValue = CheckboxValueType

const props = defineProps({
  modelValue: {
    type: Boolean as PropType<ModelValue>,
    required: true
  },
  label: {
    type: String as PropType<string>,
    default: ''
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    default: false
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

const onCheckboxChange = (val: ModelValue) => {
  emit('change', val)
}

</script>

<template>
  <div class="checkbox-container">
    <ElCheckbox
      v-model="tempValue"
      size="large"
      :disabled="props.disabled"
      :validate-event="false"
      @change="onCheckboxChange"
    >
      {{ props.label }}
    </ElCheckbox>
  </div>
</template>

<style lang="scss" scoped>
.checkbox {
  &-container {
    width: fit-content;
    height: fit-content;
  }
}
</style>