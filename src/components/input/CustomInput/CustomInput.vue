<script setup lang="ts">
import { inject, computed, ref, useSlots, nextTick, onMounted } from 'vue'
import { useField } from 'vee-validate'

import type { UseHook } from '@/declare/hook' // 全域功能類型
import {
  FormInput,
  FormSelect,
  FormSelectV2,
  FormSelectTree,
  FormDatePicker,
  FormTimePicker,
  FormCheckbox,
  FormRadio,
  FormAutocomplete,
  FormOperator,
  CustomText
} from '@/components' // 系統組件

import { defaultModuleType } from '@/i18n/i18n_setting'
import { isEmpty, tipLog, getUuid } from '@/lib/lib_utils' // 工具
import { formatDatetime } from '@/lib/lib_format' // 格式化
import type { VeeRes, ValidateType } from '@/lib/lib_validate'
import validateFun from '@/lib/lib_validate'

import type { Props } from './CustomInputInfo'
import { version, props as inputProps } from './CustomInputInfo'

const scopedId = getUuid(version)

const props = defineProps(inputProps)
const emit = defineEmits([
  'update:modelValue',
  'click',
  'change',
  'input',
  'focus',
  'clear',
  'blur',
  'remove-tag',
  'visible-change',
  'select'
])

const useHook: UseHook = inject('useHook')
const { i18nTranslate, i18nTest } = useHook({
  i18nModule: props.i18nModule
})

// i18nTranslate
const getTranslateLabel = (object: any) => {
  const label = i18nTest(object?.i18nLabel ?? '__none__') ?
    i18nTranslate(object.i18nLabel) : object.label ?? ''
  return label
}
const getTranslateOptions = (options: any[]) => {
  if (!Array.isArray(options)) return null

  const i18nOptions = options.map(option => {
    return {
      ...option,
      label: getTranslateLabel(option),
      value: option.value,
      options: getTranslateOptions(option?.options)
    }
  })
  return i18nOptions
}
const getTranslateShortCuts = (shortcuts?: Array<any>) => {
  if (!Array.isArray(shortcuts) || isEmpty(shortcuts)) return []

  return shortcuts.map(shortcut => {
    return {
      text: i18nTest(shortcut.i18nLabel) ? i18nTranslate(shortcut.i18nLabel) : shortcut.text,
      value: shortcut.value
    }
  })
}

const validateCount = ref(0)
onMounted(() => {
  validateCount.value = 0
})

// 驗證
const validateField = (veeValue: Props.ModelValue) => {
  // 一開始不驗證
  if (validateCount.value === 0) {
    validateCount.value++
    return true
  }
  // 必填
  if (props.required) {
    switch (props.type) {
      case 'operator':
        if (!Array.isArray(veeValue) || isEmpty(veeValue[0]) || isEmpty(veeValue[1])) {
          // 此輸入框為必填
          return 'required'
        }
        break
      default:
        if (isEmpty(veeValue)) return 'required'
        break
    }
  }
  // 非必填
  if (isEmpty(veeValue)) return true

  // 多個驗證格式
  if (Object.prototype.toString.call(props.validate) === '[object Array]') {
    for (const type of props.validate as ValidateType[]) {
      const { test, msg } = validateFun[type](veeValue) as VeeRes
      if (!test) return msg
    }
  }

  // 單一驗證格式
  if (Object.prototype.toString.call(props.validate) === '[object String]') {
    const { test, msg } = validateFun[props.validate as ValidateType](veeValue) as VeeRes
    if (!test) return msg
  }

  return true
}

const inputValue = computed({
  get: () => {
    return props.modelValue
  },
  set: (value: Props.ModelValue) => {
    validateValue.value = value
    emit('update:modelValue', value)
  }
})

/**
 * https://vee-validate.logaretm.com/v4/guide/composition-api/validation/
 * 如果您useField在輸入組件中使用，您不必自己管理它，它會自動為您完成。
 * 每當useField值發生變化時，它都會發出update:modelValue事件，
 * 並且每當modelValueprop 發生變化時useField，值都會自動同步和驗證。
 */
const {
  errorMessage, // 錯誤訊息
  value: validateValue, // 值
  handleChange, // 換值
  handleReset, // 重置
  validate: __veeValidate__ // 驗證
} = useField<any>(props.validateKey, validateField, {
  validateOnValueUpdate: true,
  initialValue: props.modelValue,
  modelPropName: 'modelValue'
  // valueProp: inputValue
})

const veeValidate = async () => {
  // 驗證前 需確認驗證值 與 輸入值相同
  if (validateValue.value !== inputValue.value) {
    validateValue.value = inputValue.value
  }
  await nextTick()
  return __veeValidate__()
}

const i18nErrorMessage = computed(() => {
  const keyword = errorMessage?.value ?? ''

  if (i18nTest(keyword, defaultModuleType)) return i18nTranslate(keyword, defaultModuleType)
  return keyword
})

// event
const onEvent = {
  focus: (e: FocusEvent) => emit('focus', e),
  clear: () => emit('clear'),
  blur: async (e: FocusEvent) => {
    emit('blur', e)

    // 確保畫面更新完才做驗證
    // 太快做驗證會一瞬間 出現紅色
    await nextTick()
    setTimeout(() => {
      handleChange(inputValue.value, true)
    }, 300)
  },
  change: (value: any) => {
    emit('change', value)
    handleChange(value, true)
  },
  input: (value: any) => {
    emit('input', value)
    handleChange(value, !isEmpty(errorMessage.value))
  },
  removeTag: (tagValue: any) => emit('remove-tag', tagValue),
  visibleChange: (visible: boolean) => emit('visible-change', visible),
  select: (item: any) => emit('select', item)
}

const inputRef = ref()

defineExpose({
  key: props.validateKey,
  value: inputValue.value,
  handleReset: () => {
    validateCount.value = 0
    handleReset()
  },
  validate: veeValidate,
  getDom: () => document.querySelector(`[class*="input-${scopedId}"]`),
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur()
})

// 文字顯示
const getTextValue = computed(() => {
  if (isEmpty(inputValue.value)) return ''
  switch (props.type) {
    case 'text':
    case 'textarea':
    case 'password':
    case 'autocomplete':
      return inputValue.value
    case 'select':
    case 'select-tree':
    case 'select-v2':
    case 'radio': {
      const findCallback = (_option: any) => {
        if (Array.isArray(_option.options) && _option.options.length > 0) {
          return _option.options.find(findCallback)
        } else {
          return _option.value === inputValue.value
        }
      }
      const option = props.options.find(findCallback)
      return getTranslateLabel(option)
    }
    case 'year':
    case 'month':
    case 'date':
    case 'dates':
    case 'datetime':
    case 'week':
    case 'datetimerange':
    case 'daterange':
    case 'monthrange':
      if (Array.isArray(inputValue.value)) {
        const [value1, value2] = inputValue.value
        return `${formatDatetime(value1, props.format)} ~ ${formatDatetime(
          value2,
          props.format
        )}`
      } else {
        return formatDatetime(inputValue.value, props.format)
      }
    case 'time':
    case 'timerange':
      if (Array.isArray(inputValue.value)) {
        const [value1, value2] = inputValue.value
        return `${value1} ~ ${value2}`
      } else {
        return `${inputValue.value}`
      }
    case 'checkbox':
      if (Array.isArray(inputValue.value)) {
        return inputValue.value.map(item => {
          const option = props.options.find(_option => _option.value === item)
          return getTranslateLabel(option)
        })
      } else {
        return `${inputValue.value}`
      }
    case 'operator': {
      const [selectValue = '', inputText = ''] = inputValue.value
      const option = props.options.find(_option => _option.value === selectValue)
      return `${getTranslateLabel(option)}-${inputText}`
    }
    default:
      return ''
  }
})

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}

const renderInput = computed(() => {
  switch (props.type) {
    case 'text':
    case 'number':
    case 'textarea':
    case 'password':
      return FormInput
    case 'select':
      return FormSelect
    case 'select-v2':
      return FormSelectV2
    case 'select-tree':
      return FormSelectTree
    case 'year':
    case 'month':
    case 'date':
    case 'dates':
    case 'datetime':
    case 'week':
    case 'datetimerange':
    case 'daterange':
    case 'monthrange':
      return FormDatePicker
    case 'time':
    case 'timerange':
      return FormTimePicker
    case 'checkbox':
      return FormCheckbox
    case 'radio':
      return FormRadio
    case 'autocomplete':
      return FormAutocomplete
    case 'operator':
      return FormOperator
    default:
      tipLog(`輸入框類型 ${props.type} 不存在`, [props])
      return null
  }
})

</script>

<template>
  <div :class="[scopedId, `input-${scopedId}`, `input-${props.direction}`]">
    <label v-if="!props.hiddenLabel" class="input-label">
      <span v-if="props.isValidate && props.required" class="input-prefix">*</span>
      <CustomText :label="getTranslateLabel(props)"></CustomText>
    </label>

    <div class='input-main'>
      <div v-if="props.text" class='i-pt-xs'>{{ getTextValue }}</div>
      <component
        v-else
        :is="renderInput"
        v-bind="props"
        v-on="onEvent"
        ref="inputRef"
        :options="getTranslateOptions(props.options)"
        :errorMessage="errorMessage"
        :shortcuts="getTranslateShortCuts(props.shortcuts)"
        v-model="inputValue"
      >
        <template v-if="hasSlot('prepend')" #prepend="scope">
          <slot name="prepend" v-bind="scope"></slot>
        </template>
        <template v-if="hasSlot('append')" #append="scope">
          <slot name="append" v-bind="scope"></slot>
        </template>
        <template v-if="hasSlot('prefix')" #prefix="scope">
          <slot name="prefix" v-bind="scope"></slot>
        </template>
        <template v-if="hasSlot('suffix')" #suffix="scope">
          <slot name="suffix" v-bind="scope"></slot>
        </template>
        <template v-if="hasSlot('options')" #options="scope">
          <slot name="options" v-bind="scope"></slot>
        </template>
        <template v-if="hasSlot('header')" #header="scope">
          <slot name="header" v-bind="scope"></slot>
        </template>
        <template v-if="hasSlot('footer')" #footer="scope">
          <slot name="footer" v-bind="scope"></slot>
        </template>
        <template v-if="hasSlot('label')" #label="scope">
          <slot name="label" v-bind="scope"></slot>
        </template>
        <template v-if="hasSlot('tag')" #tag="scope">
          <slot name="tag" v-bind="scope"></slot>
        </template>
        <template v-if="hasSlot('empty')" #empty="scope">
          <slot name="empty" v-bind="scope"></slot>
        </template>
        <template v-if="hasSlot('range-separator')" #range-separator="scope">
          <slot name="range-separator" v-bind="scope"></slot>
        </template>
        <template v-if="hasSlot('default')" #default="scope">
          <slot name="default" v-bind="scope"></slot>
        </template>
      </component>
      <span v-if="props.isValidate && !props.hiddenErrorMessage" class="input-error">
        {{ i18nErrorMessage }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
div[class*="__CustomInput"] {
  width: 100%;
  height: fit-content;
  display: flex;
  gap: 8px;
  position: relative;
  // overflow: hidden;

  &.input {
    &-row {
      flex-direction: row;
      align-items: flex-start;

      .__input-label {
        transform: translateY(8px);
      }
    }
    &-column {
      flex-direction: column;

      .__input-label {
        transform: translateY(2px);
      }
    }
  }
  .input {
    &-prefix {
      display: inline-block;
      position: absolute;
      left: -10px;
      top: 0;
      color: var(--i-color-danger);
    }

    &-label {
      // width: fit-content;
      // white-space: wrap;
      white-space: nowrap;
    }

    &-main {
      display: flex;
      flex-direction: column;
      gap: 6px;
      width: 100%;
    }

    &-error {
      color: var(--i-color-danger);
      width: 100%;
      height: 20px;
    }
  }
}
</style>
