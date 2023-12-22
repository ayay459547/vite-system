<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, useSlots, onMounted, onBeforeUnmount, ref, nextTick } from 'vue'
import { ElDatePicker } from 'element-plus'
import { useField } from 'vee-validate'
import type { ValidateType } from '@/lib/lib_validate'
import { useI18n } from 'vue-i18n'
import { isEmpty, hasOwnProperty } from '@/lib/lib_utils'
import { datetimeFormat } from '@/lib/lib_day'
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
  hiddenLabel: {
    type: Boolean as PropType<boolean>,
    default: false
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
  text: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  // element ui plus
  clearable: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  type: {
    type: String as PropType<PickerType>,
    default: 'date'
  },
  format: {
    type: String as PropType<string>,
    default: 'YYYY-MM-DD'
  },
  valueFormat: {
    type: String as PropType<string>,
    default: 'YYYY-MM-DD'
  }
})

const bindAttributes = computed(() => {
  return {
    type: props.type,
    clearable: props.clearable,
    disabled: props.disabled,
    format: props.format,
    valueFormat: props.valueFormat
  }
})

const emit = defineEmits([
  'update:modelValue',
  'blur',
  'focus',
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
  if (Array.isArray(veeValue)) {
    const [ value1, value2 ] = veeValue

    if(isEmpty(value1)) return '此輸入框為必填'
    if(isEmpty(value2)) return '此輸入框為必填'
  } else {
    if(isEmpty(veeValue)) return '此輸入框為必填'
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
    blur: async (e: FocusEvent): Promise<void> => {
      emit('blur', e)

      // 確保畫面更新完才做驗證
      // 太快做驗證會一瞬間 出現紅色
      await nextTick()
      setTimeout(() => {
        handleChange(tempValue.value, true)
      }, 300)
    },
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

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}

onMounted(() => {
  window.addEventListener('touchstart', e => e.preventDefault())
})

onBeforeUnmount(() => {
  window.removeEventListener('touchstart', e => e.preventDefault())
})

const getTextValue = (tempValue: ModelValue) => {
  if (isEmpty(tempValue)) return ''

  if (Array.isArray(tempValue)) {
    const [value1, value2] = tempValue
    return `${datetimeFormat(value1, props.format)} ~ ${datetimeFormat(value2, props.format)}`
  } else {
    return datetimeFormat(tempValue, props.format)
  }
}

</script>

<template>
  <div
    class="input-container"
    :class="[
      `input-${domValidateKey}-${validateRes}`,
      `${props.direction}`
    ]"
  >
    <label v-if="!props.hiddenLabel" class="input-label">
      <span v-if="props.required" class="input-required input-prefix">*</span>
      <span>{{ props.label }}</span>
    </label>

    <div v-if="props.text" class="i-pt-sm">
      {{ getTextValue(tempValue) }}
    </div>

    <ElDatePicker
      v-else
      v-model="tempValue"
      :placeholder="$t('pleaseInput')"
      class="input-main"
      :start-placeholder="t('startTime')"
      :end-placeholder="t('endTime')"
      :class="[`validate-${validateRes}`]"
      :validate-event="false"
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
    border-radius: 4px;
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