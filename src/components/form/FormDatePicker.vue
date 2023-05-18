<script setup lang="ts">
import { ElDatePicker } from 'element-plus'
import type { PropType } from 'vue'
import { computed, useSlots } from 'vue'
import { useField } from 'vee-validate'
import type { ValidateType } from '@/lib/validate'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

type BaseValue = string | null
type ModelValue = BaseValue | [BaseValue, BaseValue]

type PickerType = 'year' | 'month' | 'date' | 'dates' | 'datetime' | 'week' | 'datetimerange' | 'daterange' | 'monthrange'

const props = defineProps({
  modelValue: {
    type: [Array, String, null] as PropType<ModelValue>,
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
  },
  type: {
    type: String as PropType<PickerType>,
    default: 'date'
  }
})

const bindAttributes = computed(() => {
  return {
    clearable: props.clearable,
    type: props.type
  }
})

const emit = defineEmits([
  'update:modelValue',
  'blur',
  'focus',
  'change'
])

const validateRes = computed<string>(() => {
  if ([null, undefined, ''].includes(errorMessage.value)) return 'success'
  return 'error'
})

// 驗證
const validateField = (veeValue: ModelValue) => {
  // 非必填
  if (!props.required) return true

  // 必填
  if (Array.isArray(veeValue)) {
    const [ value1, value2 ] = veeValue

    if([null, undefined, ''].includes(value1)) return '此輸入框為必填'
    if([null, undefined, ''].includes(value2)) return '此輸入框為必填'
  } else {
    if([null, undefined, ''].includes(veeValue)) return '此輸入框為必填'
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
    focus: (e: FocusEvent): void => {
      emit('focus', e)
    },
    blur: (e: FocusEvent): void => {
      emit('blur', e)
    },
    change: (value: string | number): void => {
      emit('change', value)
      handleChange(value, true)
    }
  }

  return event
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

    <ElDatePicker
      v-model="tempValue"
      placeholder="Please input"
      class="input-main"
      format="YYYY-MM-DD"
      value-format="YYYY-MM-DD"
      :start-placeholder="t('startTime')"
      :end-placeholder="t('endTime')"
      :class="[`validate-${validateRes}`]"
      v-bind="bindAttributes"
      v-on="validationListeners"
    >
      <template v-if="hasSlot('default')" #default>
        <slot name="default"></slot>
      </template>
      <template v-if="hasSlot('range-separator')" #range-separator>
        <slot name="range-separator"></slot>
      </template>
    </ElDatePicker>

    <span class="input-error">{{ errorMessage }}</span>
  </div>
</template>

<style lang="scss" scoped>
:deep(.input-main) {
  &.el-date-editor {
    width: 100% !important;
    max-height: 32px !important;
  }
  &.validate-error.el-date-editor {
    box-shadow: 0 0 0 1px $danger inset;
    background-color: lighten($danger, 20%);
  }

  .el-input__wrapper {
    transition-duration: 0.3s;
    box-shadow: 0 0 0 1px inherit inset;

    position: relative;
  }
  .el-input__suffix {
    position: absolute;
    right: 8px;
    top: 0px;
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