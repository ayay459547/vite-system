<script setup lang="ts">
import { ElInput } from 'element-plus'
import type { PropType, WritableComputedRef } from 'vue'
import { ref, defineProps, defineEmits, computed, useSlots } from 'vue'
import { useField } from 'vee-validate'
import validateFun from '@/lib/validate'

type ValidateType = 'number' | 'identityCard' | 'phone' | 'password' | ''

const props = defineProps({
  modelValue: {
    type: String as PropType<string>,
    required: true
  },
  label: {
    type: String as PropType<string>,
    required: false,
    default: ''
  },
  required: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false
  },
  validate: {
    type: [Array, String, null] as PropType<ValidateType[] | ValidateType>,
    required: false,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const tempValue: WritableComputedRef<string> = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value)
})

function validateField (value: string) {
  if (!props.required) return true

  if ([null, undefined, ''].includes(value.trim())) {
    return '此輸入框為必填'
  }

  if (Object.prototype.toString.call(props.validate) === '[object Array]') {
    for (let type of (props.validate as ValidateType[])) {
      const { res, msg } = validateFun[type](value)
      if (!res) return msg
    }
  }

  if (Object.prototype.toString.call(props.validate) === '[object String]') {
    const { res, msg } = validateFun[(props.validate as ValidateType)](value)
    if (!res) return msg
  }

  return true
}

const validateValue = ref(null)
const setValidateValue = () => {
  validateValue.value = tempValue.value
  console.log('value => ', value)
}
const { errorMessage, value } = useField(() => validateValue.value, validateField)

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return Object.prototype.hasOwnProperty.call(slots, prop)
}

</script>

<template>
  <div class="input-container">
    <label v-if="props.label.length > 0" class="input-label">
      {{ props.label }}
    </label>

    <el-input
      v-model="tempValue"
      placeholder="Please input"
      class="input-main"
      @blur="setValidateValue"
    >
      <!-- 輸入框用 -->
      <template v-if="hasSlot('prepend')" #prepend>
        <slot name="prepend"></slot>
      </template>
      <template v-if="hasSlot('append')" #append>
        <slot name="append"></slot>
      </template>
      <!-- 圖示用 -->
      <template #prefix>
        <slot name="prefix"></slot>
      </template>
      <template #suffix>
        <slot name="suffix"></slot>
      </template>
    </el-input>

    <span class="input-error">{{ errorMessage }}</span>
  </div>
</template>

<style lang="scss" scoped>
.input {
  &-container {
    width: fit-content;
    height: fit-content;
  }

  &-error {
    color: $danger;
  }
}
</style>