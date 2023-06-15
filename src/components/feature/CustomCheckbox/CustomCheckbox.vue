<script setup lang="ts">
import { CheckboxValueType, ElCheckbox } from 'element-plus'
import type { PropType } from 'vue'
import { computed } from 'vue'

type ModelValue = boolean

const props = defineProps({
  modelValue: {
    type: Boolean as PropType<ModelValue>,
    required: true
  },
  direction: {
    type: String as PropType<'column' | 'row'>,
    default: 'column'
  },
  label: {
    type: String as PropType<string>,
    default: ''
  }
})

const tempValue = computed<boolean>({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

const emit = defineEmits([
  'update:modelValue',
  'change'
])

const onCheckboxChange = (val: CheckboxValueType) => {
  emit('change', val)
}

</script>

<template>
  <ElCheckbox
    v-model="tempValue"
    size="large"
    :validate-event="false"
    @change="onCheckboxChange"
  >
    {{ props.label }}
  </ElCheckbox>
</template>

<style lang="scss" scoped>
</style>