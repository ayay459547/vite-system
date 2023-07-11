<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, ref } from 'vue'

import { ElRadioGroup, ElRadio } from 'element-plus'

export type Options = Array<{
  label: string
  value: string | number | boolean
  disabled?: boolean
}>

type ModelValue = number | string | boolean | null

const props = defineProps({
  modelValue: {
    type: [Boolean, String, Number, null] as PropType<ModelValue>,
    required: true
  },
  options: {
    type: Array as PropType<Options>,
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

const onRadioChange = (val: ModelValue) => {
  emit('change', val)
}

</script>

<template>
  <div class="radio-container">
    <ElRadioGroup
      v-model="tempValue"
      size="large"
      :validate-event="false"
      @change="onRadioChange"
    >
      <ElRadio
        v-for="option in props.options"
        :key="`key-${option.value}`"
        :label="option.value"
        :disabled="option.disabled ?? false"
      >
        <slot :label="option.label" :value="option.value">{{ option.label }}</slot>
      </ElRadio>
    </ElRadioGroup>
  </div>
</template>

<style lang="scss" scoped>
.radio {
  &-container {
    width: fit-content;
    height: fit-content;
  }
}
</style>