<script setup lang="ts">
import { ElInput } from 'element-plus'
import type { PropType, WritableComputedRef } from 'vue'
import { defineProps, defineEmits, computed, useSlots } from 'vue'
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

const emit = defineEmits([
  'update:modelValue',
  'blur',
  'focus',
  'change',
  'input',
  'clear'
])

const tempValue: WritableComputedRef<string> = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value)
})

const validateRes = computed<string>(() => {
  if ([null, undefined, ''].includes(errorMessage.value)) return 'error'
  return 'success'
})

// 驗證
const validateField = (veeValue: string) => {
  if (!props.required) return true

  if ([null, undefined, ''].includes(veeValue.trim())) {
    return '此輸入框為必填'
  }

  if (Object.prototype.toString.call(props.validate) === '[object Array]') {
    for (let type of (props.validate as ValidateType[])) {
      const { res, msg } = validateFun[type](veeValue)
      if (!res) return msg
    }
  }

  if (Object.prototype.toString.call(props.validate) === '[object String]') {
    const { res, msg } = validateFun[(props.validate as ValidateType)](veeValue)
    if (!res) return msg
  }

  return true
}

const tempVeeValue: WritableComputedRef<string> = computed({
  get: () => veeValue.value,
  set: (value: string) => tempValue.value = value
})

const { errorMessage, value: veeValue, handleChange } = useField('field', validateField, { validateOnValueUpdate: false })

// event
const focus = (e: FocusEvent): void => {
  emit('focus', e)
}
const clear = (): void => {
  emit('clear')
}

const validationListeners = computed(() => {
  if (!errorMessage.value) {
    return {
      blur: (e: FocusEvent): void => {
        emit('blur', e)
        handleChange(e)
      },
      change: (value: string | number): void => {
        emit('change', value)
        handleChange(value)
      },
      input: (value: string | number): void => {
        emit('input', value)
        handleChange(value, false)
      }
    }
  }

  return {
    blur: handleChange,
    change: handleChange,
    input: handleChange
  }
})

// slot
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
      v-model="tempVeeValue"
      placeholder="Please input"
      class="input-main"
      :class="[`validate-${validateRes}`]"
      @focus="focus"
      @clear="clear"
      v-on="validationListeners"
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
    height: 88px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &-error {
    color: $danger;
  }
}
</style>