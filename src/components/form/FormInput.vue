<script setup lang="ts">
import { ElInput } from 'element-plus'
import type { PropType } from 'vue'
import { computed, useSlots } from 'vue'
import { useField } from 'vee-validate'
import type { VeeRes, ValidateType } from '@/lib/validate'
import validateFun from '@/lib/validate'

const props = defineProps({
  modelValue: {
    type: String as PropType<string>,
    required: true
  },
  validateKey: {
    type: String as PropType<string>,
    required: false,
    default: ''
  },
  direction: {
    type: String as PropType<'column' | 'row'>,
    required: false,
    default: 'column'
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
  },
  // element ui plus
  clearable: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false
  }
})

const bindAttributes = computed(() => {
  return {
    clearable: props.clearable
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

/* 一般寫法
const tempValue: WritableComputedRef<string> = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value)
})

*/
const {
  errorMessage,     // 錯誤訊息
  value: tempValue, // 值
  handleChange,     // 換值
  handleReset,      // 重置
  validate          // 驗證
} = useField('field', validateField, { validateOnValueUpdate: false })

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

defineExpose({
  key: props.validateKey,
  value: tempValue,
  handleReset,
  validate
})

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return Object.prototype.hasOwnProperty.call(slots, prop)
}

</script>

<template>
  <div class="input-container" :class="props.direction">
    <label v-if="props.label.length > 0" class="input-label">
      <span v-if="props.required" class="input-required input-prefix">*</span>
      <span v-else class="input-prefix"></span>
      <span>{{ props.label }}</span>
    </label>

    <ElInput
      v-model="tempValue"
      placeholder="Please input"
      class="input-main"
      :class="[`validate-${validateRes}`]"
      v-bind="bindAttributes"
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
      <template v-if="hasSlot('prefix')" #prefix>
        <slot name="prefix"></slot>
      </template>
      <template v-if="hasSlot('suffix')" #suffix>
        <slot name="suffix"></slot>
      </template>
    </ElInput>

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
    gap: 4px;

    &.row {
      flex-direction: row;
      align-items: center;
      height: 48px;
    }
    &.column {
      flex-direction: column;
    }
  }

  &-prefix {
    display: inline-block;
    width: 10px;
  }
  &-required {
    color: $danger;
  }

  &-label {
    width: fit-content;
    white-space: nowrap;
  }

  &-main {
    height: fit-content;
  }

  &-error {
    color: $danger;
  }
}
</style>