<script setup lang="ts">
import { ElInput } from 'element-plus'
import type { PropType } from 'vue'
import { defineProps, defineEmits, computed, useSlots } from 'vue'
import { useField } from 'vee-validate'
import type { VeeRes } from '@/lib/validate'
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

const validateRes = computed<string>(() => {
  if ([null, undefined, ''].includes(errorMessage.value)) return 'success'
  return 'error'
})

// 驗證
const validateField = (veeValue: string) => {
  // 必填
  if (props.required && [null, undefined, ''].includes(veeValue.trim())) {
    return '此輸入框為必填'
  }
  // 非必填
  if ([null, undefined, ''].includes(veeValue.trim())) return true

  // 多個驗證格式
  if (Object.prototype.toString.call(props.validate) === '[object Array]') {
    for (let type of (props.validate as ValidateType[])) {
      const { test, msg } = (validateFun[type](veeValue) as VeeRes)
      if (!test) return msg
    }
  }

  // 單一驗證格式
  if (Object.prototype.toString.call(props.validate) === '[object String]') {
    const { test, msg } = (validateFun[(props.validate as ValidateType)](veeValue) as VeeRes)
    if (!test) return msg
  }

  return true
}

/**
 * https://vee-validate.logaretm.com/v4/guide/composition-api/validation/
 * 如果您useField在輸入組件中使用，您不必自己管理它，它會自動為您完成。
 * 每當useField值發生變化時，它都會發出update:modelValue事件，
 * 並且每當modelValueprop 發生變化時useField，值都會自動同步和驗證。
 */
// const tempValue: WritableComputedRef<string> = computed({
//   get: () => props.modelValue,
//   set: (value: string) => emit('update:modelValue', value)
// })
const { errorMessage, value: tempValue, handleChange } = useField('field', validateField, { validateOnValueUpdate: false })

// event
const validationListeners = computed(() => {
  const event = {
    focus: (e: FocusEvent): void => {
      emit('focus', e)
    },
    clear: (): void => {
      emit('clear')
    },
    blur: (e: FocusEvent): void => {
      emit('blur', e)
      handleChange(e, true)
    },
    change: (value: string | number): void => {
      emit('change', value)
      handleChange(value, true)
    },
    input: (value: string | number): void => {
      emit('input', value)
      handleChange(value, true)
    }
  }
  if ([null, undefined, ''].includes(errorMessage.value)) {
    return {
      ...event,
      input: (value: string | number): void => {
        emit('input', value)
        handleChange(value, false)
      }
    }
  } else {
    return event
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
      <span v-if="props.required" class="input-required">*</span>
      <span>{{ props.label }}</span>
    </label>

    <el-input
      v-model="tempValue"
      placeholder="Please input"
      class="input-main"
      :class="[`validate-${validateRes}`]"
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
:deep(.input-main) {
  .el-input__wrapper {
    transition-duration: 0.3s;
    box-shadow: 0 0 0 1px inherit inset;
  }
  &.validate-error .el-input__wrapper {
    box-shadow: 0 0 0 1px $danger inset;
    background-color: lighten($danger, 20%);
  }
}
.input {
  &-container {
    width: 100%;
    height: 88px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &-required {
    color: $danger;
    display: inline-block;
    padding-right: 2px;
  }

  &-main {
    height: fit-content;
  }

  &-error {
    color: $danger;
  }
}
</style>