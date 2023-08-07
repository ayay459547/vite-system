<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, useSlots, ref, nextTick } from 'vue'
import { ElInput } from 'element-plus'
import { useField } from 'vee-validate'
import type { VeeRes, ValidateType } from '@/lib/lib_validate'
import validateFun from '@/lib/lib_validate'
import { isEmpty } from '@/lib/lib_utils'

type ModelValue = string | number | null

const props = defineProps({
  modelValue: {
    type: [String, Number, null] as PropType<ModelValue>,
    required: true
  },
  validateKey: {
    type: String as PropType<string>,
    required: false,
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
  onlyNumber: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  required: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  validate: {
    type: [Array, String, null] as PropType<ValidateType[] | ValidateType>,
    default: null
  },
  text: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  // element ui plus
  type: {
    type: String as PropType<string>,
    default: 'text'
  },
  rows: {
    type: Number as PropType<number>,
    default: 2
  },
  clearable: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  showPassword: {
    type: Boolean as PropType<boolean>,
    default: false
  }
})

const bindAttributes = computed(() => {
  return {
    type: props.type,
    rows: props.rows,
    clearable: props.clearable,
    disabled: props.disabled,
    showPassword: props.showPassword
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
  if (isEmpty(errorMessage.value)) return 'success'
  return 'error'
})

// 驗證
const validateField = (veeValue: ModelValue) => {
  // 必填
  if (props.required && isEmpty(veeValue)) {
    return '此輸入框為必填'
  }
  // 非必填
  if (isEmpty(veeValue)) return true

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

// 去空白
const inputValue = computed({
  get: () => props.modelValue,
  set: (value: ModelValue) => {
    let _value = value
    if (typeof value === 'string') {
      _value = value.trim()

      if (props.onlyNumber) {
        const regexp = /[\D]/g
        _value = _value.replace(regexp, '')
      }
    }
    emit('update:modelValue', _value)
  }
})

/**
 * https://vee-validate.logaretm.com/v4/guide/composition-api/validation/
 * 如果您useField在輸入組件中使用，您不必自己管理它，它會自動為您完成。
 * 每當useField值發生變化時，它都會發出update:modelValue事件，
 * 並且每當modelValueprop 發生變化時useField，值都會自動同步和驗證。
 */

const {
  errorMessage,     // 錯誤訊息
  value: tempValue, // 值
  handleChange,     // 換值
  handleReset,      // 重置
  validate          // 驗證
} = useField('field', validateField, {
  validateOnValueUpdate: false,
  initialValue: inputValue.value,
  valueProp: inputValue.value
})

// event
const validationListeners = computed(() => {
  const event = {
    focus: (e: FocusEvent): void => {
      emit('focus', e)
    },
    clear: (): void => {
      emit('clear')
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
    change: (value: string | number): void => {
      emit('change', value)
      handleChange(value, true)
    },
    input: (value: string | number): void => {
      let _value = value
      if (typeof value === 'string') {
        _value = value.trim()
      }
      emit('update:modelValue', _value)

      emit('input', _value)
      handleChange(_value, true)
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
  return Object.prototype.hasOwnProperty.call(slots, prop)
}

const getTextValue = (tempValue: ModelValue) => {
  if (isEmpty(tempValue)) return ''

  return tempValue
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
      <span>{{ props.label }}</span>
    </label>

    <div v-if="props.text">
      {{ getTextValue(tempValue) }}
    </div>

    <ElInput
      v-else
      v-model="inputValue"
      :placeholder="$t('pleaseInput')"
      class="input-main"
      :class="[`validate-${validateRes}`]"
      :validate-event="false"
      v-bind="bindAttributes"
      v-on="validationListeners"
      @click.stop
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