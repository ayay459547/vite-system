<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'

import type { CheckboxValueType, CheckboxGroupValueType } from 'element-plus'
import { ElCheckboxGroup, ElCheckbox } from 'element-plus'

export type ModelValue = CheckboxValueType | CheckboxGroupValueType

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Array<String | Number>] as PropType<ModelValue>,
    required: true
  },
  label: {
    type: String as PropType<string>,
    default: ''
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  options: {
    type: Array as PropType<{ label: string, value: string | number }[]>,
    default () {
      return []
    }
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
    <template v-if="options.length > 0 && Array.isArray(tempValue)">
      <ElCheckboxGroup
        v-model="tempValue"
        :validate-event="false"
        :disabled="props.disabled"
      >
        <ElCheckbox
          v-for="item in options"
          :key="item.value"
          :label="item.value"
        >
          {{ item.label }}
        </ElCheckbox>
      </ElCheckboxGroup>
    </template>
    <template v-else-if="!Array.isArray(tempValue)">
      <ElCheckbox
        v-model="tempValue"
        size="large"
        :disabled="props.disabled"
        :validate-event="false"
        @change="onCheckboxChange"
      >
        {{ props.label }}
      </ElCheckbox>
    </template>
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