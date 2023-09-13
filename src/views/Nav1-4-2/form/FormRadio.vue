<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, ref } from 'vue'
import { ElRadioGroup, ElRadio } from 'element-plus'
import { useField } from 'vee-validate'
import { isEmpty } from '@/lib/lib_utils'

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
  validateKey: {
    type: String as PropType<string>,
    default: ''
  },
  direction: {
    type: String as PropType<'column' | 'row'>,
    default: 'column'
  },
  label: {
    type: String as PropType<string>,
    default: ''
  },
  hiddenLabel: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  required: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  options: {
    type: Array as PropType<Options>,
    default () {
      return []
    }
  },
  optionDirection: {
    type: String as PropType<'column' | 'row'>,
    default: 'row'
  },
  text: {
    type: Boolean as PropType<boolean>,
    default: false
  }
})

const bindAttributes = computed(() => {
  return {
    validateEvent: false
  }
})

const emit = defineEmits([
  'update:modelValue',
  'change'
])

const validateRes = computed<string>(() => {
  if (isEmpty(errorMessage.value)) return 'success'
  return 'error'
})

// 驗證
const validateField = (veeValue: ModelValue) => {
  // 非必填
  if (!props.required) return true

  // 必填
  if (props.required && isEmpty(veeValue)) {
    return '此輸入框為必填'
  }

  return true
}

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
    change: (value: ModelValue): void => {
      emit('change', value)
      handleChange(value, true)
    }
  }

  return event
})

const _domValidateKey = ref<string>('')
const domValidateKey = computed(() => {
  return _domValidateKey.value.length > 0 ? _domValidateKey.value : props.validateKey
})

defineExpose({
  key: props.validateKey,
  value: tempValue,
  handleReset,
  validate,
  setvalidateKey (validateKey: string) {
    _domValidateKey.value = validateKey
  },
  getDom () {
    return document.querySelector(`[class*="input-${domValidateKey.value}"]`)
  }
})

const getTextValue = (tempValue: ModelValue) => {
  if (isEmpty(tempValue)) return ''

  const _option = props.options.find(option => option.value === tempValue)
  return _option?.label ?? ''
}

</script>

<template>
  <div
    class="input-container"
    :class="[
      `input-${domValidateKey}-${validateRes}`,
      `${props.direction}`,
      props.hiddenLabel ? 'hidden-label' : ''
    ]"
  >
    <label v-if="!props.hiddenLabel" class="input-label">
      <span v-if="props.required" class="input-required input-prefix">*</span>
      <span v-else class="input-prefix"></span>
      <span>{{ props.label }}</span>
    </label>

    <div v-if="props.text" class="i-pt-sm">
      {{ getTextValue(tempValue) }}
    </div>

    <ElRadioGroup
      v-else
      v-model="tempValue"
      size="large"
      :validate-event="false"
      v-bind:class="bindAttributes"
      v-on="validationListeners"
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

    <span class="input-error">{{ errorMessage }}</span>
  </div>
</template>

<style lang="scss" scoped>
.input {
  &-container {
    width: 100%;
    height: 88px;
    display: flex;
    gap: 4px;
    position: relative;
    &.hidden-label {
      height: 48px;
    }
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
    position: absolute;
    left: -10px;
    top: 0;
  }
  &-required {
    color: $danger;
    display: inline-block;
    padding-right: 2px;
  }

  &-label {
    width: fit-content;
    white-space: nowrap;
    height: 21px;
  }

  &-main {
    height: fit-content;
  }

  &-error {
    color: $danger;
  }
}
</style>