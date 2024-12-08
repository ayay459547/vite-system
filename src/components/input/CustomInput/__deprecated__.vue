<script setup lang="tsx">
import {
  inject,
  computed,
  ref,
  useSlots,
  renderSlot,
  nextTick,
  onMounted
} from 'vue'
// import { useField } from 'vee-validate'

import type { UseHook } from '@/declare/hook' // 全域功能類型
import {
  FormInput,
  FormSelect,
  FormSelectTree,
  FormSelectV2,
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

// @ts-ignore
import styles from './CustomInput.module.scss'

const scopedId = getUuid('__i-group-input__')

const props = defineProps(inputProps)
const emit = defineEmits([
  'update:model-value',
  'click',
  'change',
  'input',
  'focus',
  'clear',
  'blur',
  // select
  'remove-tag',
  'visible-change',
  // autocomplete
  'select'
])

const useHook: UseHook = inject('useHook')
const { i18nTranslate, i18nTest } = useHook({
  i18nModule: props.i18nModule
})

const slots = useSlots()

// i18nTranslate
const getTranslateLabel = (object: any) => {
  const label = i18nTest(object?.i18nLabel ?? '__none__')
    ? i18nTranslate(object.i18nLabel)
    : object.label ?? ''
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
const translateLabel = computed(() => {
  return getTranslateLabel(props)
})
const translateOptions = computed(() => {
  return getTranslateOptions(props.options)
})

const getTranslateShortCuts = (shortcuts?: Array<any>) => {
  if (!Array.isArray(shortcuts) || isEmpty(shortcuts)) return []

  return shortcuts.map(shortcut => {
    return {
      text: i18nTest(shortcut.i18nLabel) ? i18nTranslate(shortcut.i18nLabel) : shortcut.text,
      value: shortcut.value
    }
  })
}
const translateShortCuts = computed(() => {
  return getTranslateShortCuts(props.shortcuts)
})

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
      case 'text':
      case 'autocomplete':
      default:
        if (isEmpty(veeValue)) {
          return 'required'
        }
        break
    }
  }
  // 非必填
  if (isEmpty(veeValue)) return true

  // 多個驗證格式
  if (Object.prototype.toString.call(props.validate) === '[object Array]') {
    for (const type of props.validate as ValidateType[]) {
      const { test, label, i18nLabel } = validateFun[type](veeValue) as VeeRes
      if (!test) return getTranslateLabel({ label, i18nLabel })
    }
  }

  // 單一驗證格式
  if (Object.prototype.toString.call(props.validate) === '[object String]') {
    const { test, label, i18nLabel } = validateFun[props.validate as ValidateType](veeValue) as VeeRes
    if (!test) return getTranslateLabel({ label, i18nLabel })
  }

  return true
}

const inputValue = computed({
  get: () => {
    // 有錯誤才驗證
    handleChange(props.modelValue, isError.value)
    return props.modelValue
  },
  set: (value: Props.ModelValue) => {
    emit('update:model-value', value)
  }
})
const isError = computed(() => {
  return !isEmpty(errorMessage.value)
})

const validateKey = `${props.__key__}-${scopedId}`

/**
 * https://vee-validate.logaretm.com/v4/guide/composition-api/validation/
 * 如果您useField在輸入組件中使用，您不必自己管理它，它會自動為您完成。
 * 每當useField值發生變化時，它都會發出update:modelValue事件，
 * 並且每當modelValueprop 發生變化時useField，值都會自動同步和驗證。
 */
// const {
//   errorMessage, // 錯誤訊息
//   value: validateValue, // 值
//   handleChange, // 換值
//   handleReset: resetValidate, // 重置
//   validate: _validate // 驗證
// } = useField<any>(validateKey, validateField, {
//   validateOnValueUpdate: true,
//   initialValue: props.modelValue,
//   modelPropName: 'modelValue'
//   // valueProp: inputValue
// })

// const validate = async () => {
//   // 驗證前 需確認驗證值 與 輸入值相同
//   if (validateValue.value !== inputValue.value) {
//     validateValue.value = inputValue.value
//   }
//   await nextTick()

//   return _validate()
// }

// 錯誤訊息
const errorMessage = ref('')

// 驗證
const veeValidate = async () => {
  await nextTick()
  validateCount.value++
  const resValidate = validateField(inputValue.value)
  if (typeof resValidate === 'boolean' && resValidate) {
    errorMessage.value = ''

    return { valid: true, errors: [], value: inputValue, validateKey }
  } else {
    errorMessage.value = `${resValidate}`
    return { valid: false, errors: [resValidate], value: inputValue, validateKey }
  }
}

// 調用驗證
const handleChange = (value: any, isValidate: boolean) => {
  if (isValidate) veeValidate()
}

// 重置驗證
const resetValidate = () => {
  validateCount.value = 0
  errorMessage.value = ''
}

const i18nErrorMessage = computed(() => {
  const keyword = errorMessage?.value ?? ''

  if (i18nTest(keyword, defaultModuleType)) return i18nTranslate(keyword, defaultModuleType)
  return keyword
})

// event
const onEvent = computed(() => {
  const _event = {
    onFocus: (e: FocusEvent): void => {
      emit('focus', e)
    },
    onClear: (): void => {
      emit('clear')
    },
    onBlur: async (e: FocusEvent): Promise<void> => {
      emit('blur', e)

      // 確保畫面更新完才做驗證
      // 太快做驗證會一瞬間 出現紅色
      await nextTick()
      setTimeout(() => {
        handleChange(inputValue.value, true)
      }, 300)
    },
    onChange: (value: any): void => {
      emit('change', value)
      handleChange(value, true)
    },
    onInput: (value: any): void => {
      emit('input', value)
      handleChange(value, true)
    },
    // select
    onRemoveTag: (tagValue: any): void => {
      emit('remove-tag', tagValue)
    },
    onVisibleChange: (visible: boolean): void => {
      emit('visible-change', visible)
    },
    // autocomplete
    onSelect: (item: any): void => {
      emit('select', item)
    }
  }
  if (isEmpty(errorMessage.value)) {
    return {
      ..._event,
      onInput: (value: any): void => {
        emit('input', value)
        handleChange(value, false)
      }
    }
  } else {
    return _event
  }
})

const validateRes = computed<string>(() => {
  if (isEmpty(errorMessage.value)) return 'success'
  return 'error'
})

const _domValidateKey = ref<string>('')
const domValidateKey = computed(() => {
  return _domValidateKey.value.length > 0 ? _domValidateKey.value : validateKey
})

const inputRef = ref()
const selectRef = ref()
const selectTreeRef = ref()
const selectV2Ref = ref()
const datePickerRef = ref()
const timePickerRef = ref()
const autocompleteRef = ref()
const operatorRef = ref()

defineExpose({
  key: validateKey,
  value: inputValue.value,
  resetValidate,
  validate: veeValidate,
  setvalidateKey(validateKey: string) {
    _domValidateKey.value = validateKey
  },
  getDom() {
    // return document.querySelector(`[class*="__input-${domValidateKey.value}"]`)
    return document.querySelector(`[class*="__input-${scopedId}"]`)
  },
  focus() {
    switch (props.type) {
      case 'text':
      case 'textarea':
      case 'password':
        inputRef.value.focus()
        break
      case 'select':
        selectRef.value.focus()
        break
      case 'select-tree':
        selectTreeRef.value.focus()
        break
      case 'select-v2':
        selectV2Ref.value.focus()
        break
      case 'year':
      case 'month':
      case 'date':
      case 'dates':
      case 'datetime':
      case 'week':
      case 'datetimerange':
      case 'daterange':
      case 'monthrange':
        datePickerRef.value.focus()
        break
      case 'time':
      case 'timerange':
        timePickerRef.value.focus()
        break
      case 'autocomplete':
        autocompleteRef.value.focus()
        break
      case 'operator':
        operatorRef.value.focus()
        break
    }
  },
  blur() {
    switch (props.type) {
      case 'text':
      case 'textarea':
      case 'password':
        inputRef.value.blur()
        break
      case 'select':
        selectRef.value.blur()
        break
      case 'select-tree':
        selectTreeRef.value.blur()
        break
      case 'select-v2':
        selectV2Ref.value.blur()
        break
      case 'year':
      case 'month':
      case 'date':
      case 'dates':
      case 'datetime':
      case 'week':
      case 'datetimerange':
      case 'daterange':
      case 'monthrange':
        datePickerRef.value.blur()
        break
      case 'time':
      case 'timerange':
        timePickerRef.value.blur()
        break
      case 'autocomplete':
        autocompleteRef.value.blur()
        break
      case 'operator':
        operatorRef.value.blur()
        break
    }
  }
})

// render

// 'text' | 'textarea' | 'password' |
// 'select' | 'checkbox' | 'radio' |
// 'data' | 'datetime' | 'daterange' | 'dateitmerange'
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

/**
 * 依照插槽 建立template
 * @param slotList 插槽名稱列表
 * @returns 要渲染的插槽
 */
const getSlot = (slotList: string[] = []) => {
  const res = {}
  slotList.forEach(slotName => {
    if (!isEmpty(slots[slotName])) {
      res[slotName] = (scope: any) => {
        if (typeof slots[slotName] === 'function') {
          return slots[slotName](scope)
        } else {
          return renderSlot(slots, slotName, scope)
        }
      }
    }
  })
  return res
}

const renderInput = () => {
  switch (props.type) {
    case 'text':
    case 'number':
    case 'textarea':
    case 'password':
      return (
        <FormInput
          ref={inputRef}
          modelValue={inputValue.value}
          onUpdate:modelValue={($event: any) => (inputValue.value = $event)}
          // v-bind 綁定屬性
          {...props}
          type={props.type}
          round={props.round}
          floor={props.floor}
          ceil={props.ceil}
          max={props.max}
          min={props.min}
          errorMessage={errorMessage.value}
          // v-on 接收事件
          onFocus={(e: any) => onEvent.value.onFocus(e)}
          onClear={() => onEvent.value.onClear()}
          onBlur={(e: any) => onEvent.value.onBlur(e)}
          onChange={(e: any) => onEvent.value.onChange(e)}
          onInput={(e: any) => onEvent.value.onInput(e)}
        >
          {{
            ...getSlot(['prepend', 'append', 'prefix', 'suffix'])
          }}
        </FormInput>
      )
    case 'select':
      return (
        <FormSelect
          ref={selectRef}
          modelValue={inputValue.value}
          onUpdate:modelValue={($event: any) => (inputValue.value = $event)}
          // v-bind 綁定屬性
          {...props}
          options={translateOptions.value}
          errorMessage={errorMessage.value}
          // v-on 接收事件
          onFocus={(e: any) => onEvent.value.onFocus(e)}
          onClear={() => onEvent.value.onClear()}
          onBlur={(e: any) => onEvent.value.onBlur(e)}
          onChange={(e: any) => onEvent.value.onChange(e)}
          onRemove-tag={(e: any) => onEvent.value.onRemoveTag(e)}
          onVisible-change={(e: boolean) => onEvent.value.onVisibleChange(e)}
        >
          {{
            ...getSlot(['options', 'header', 'footer', 'prefix', 'label', 'tag', 'empty'])
          }}
        </FormSelect>
      )
    case 'select-tree':
      return (
        <FormSelectTree
          ref={selectTreeRef}
          modelValue={inputValue.value}
          onUpdate:modelValue={($event: any) => (inputValue.value = $event)}
          // v-bind 綁定屬性
          {...props}
          options={translateOptions.value}
          errorMessage={errorMessage.value}
          // v-on 接收事件
          onFocus={(e: any) => onEvent.value.onFocus(e)}
          onClear={() => onEvent.value.onClear()}
          onBlur={(e: any) => onEvent.value.onBlur(e)}
          onChange={(e: any) => onEvent.value.onChange(e)}
          onRemove-tag={(e: any) => onEvent.value.onRemoveTag(e)}
          onVisible-change={(e: boolean) => onEvent.value.onVisibleChange(e)}
        >
          {{
            ...getSlot(['options', 'header', 'footer', 'prefix', 'empty', 'label', 'tag', 'default'])
          }}
        </FormSelectTree>
      )
    case 'select-v2':
      return (
        <FormSelectV2
          ref={selectV2Ref}
          modelValue={inputValue.value}
          onUpdate:modelValue={($event: any) => (inputValue.value = $event)}
          // v-bind 綁定屬性
          {...props}
          options={translateOptions.value}
          errorMessage={errorMessage.value}
          // v-on 接收事件
          onFocus={(e: any) => onEvent.value.onFocus(e)}
          onClear={() => onEvent.value.onClear()}
          onBlur={(e: any) => onEvent.value.onBlur(e)}
          onChange={(e: any) => onEvent.value.onChange(e)}
          onRemove-tag={(e: any) => onEvent.value.onRemoveTag(e)}
          onVisible-change={(e: boolean) => onEvent.value.onVisibleChange(e)}
        >
          {{
            ...getSlot(['options', 'header', 'footer', 'prefix', 'empty'])
          }}
        </FormSelectV2>
      )
    case 'year':
    case 'month':
    case 'date':
    case 'dates':
    case 'datetime':
    case 'week':
    case 'datetimerange':
    case 'daterange':
    case 'monthrange':
      return (
        <FormDatePicker
          ref={datePickerRef}
          modelValue={inputValue.value}
          onUpdate:modelValue={($event: any) => (inputValue.value = $event)}
          // v-bind 綁定屬性
          {...props}
          type={props.type}
          shortcuts={translateShortCuts.value}
          errorMessage={errorMessage.value}
          // v-on 接收事件
          onFocus={(e: any) => onEvent.value.onFocus(e)}
          onBlur={(e: any) => onEvent.value.onBlur(e)}
          onChange={(e: any) => onEvent.value.onChange(e)}
        >
          {{ ...getSlot(['default', 'range-separator']) }}
        </FormDatePicker>
      )
    case 'time':
    case 'timerange':
      return (
        <FormTimePicker
          ref={timePickerRef}
          modelValue={inputValue.value}
          onUpdate:modelValue={($event: any) => (inputValue.value = $event)}
          // v-bind 綁定屬性
          {...props}
          type={props.type}
          errorMessage={errorMessage.value}
          // v-on 接收事件
          onFocus={(e: any) => onEvent.value.onFocus(e)}
          onBlur={(e: any) => onEvent.value.onBlur(e)}
          onChange={(e: any) => onEvent.value.onChange(e)}
        ></FormTimePicker>
      )
    case 'checkbox':
      return (
        <FormCheckbox
          modelValue={inputValue.value}
          onUpdate:modelValue={($event: any) => (inputValue.value = $event)}
          // v-bind 綁定屬性
          {...props}
          label={translateLabel.value}
          options={translateOptions.value}
          errorMessage={errorMessage.value}
          onChange={(e: any) => onEvent.value.onChange(e)}
        >
          {{ ...getSlot(['default', 'options']) }}
        </FormCheckbox>
      )
    case 'radio':
      return (
        <FormRadio
          modelValue={inputValue.value}
          onUpdate:modelValue={($event: any) => (inputValue.value = $event)}
          // v-bind 綁定屬性
          {...props}
          options={translateOptions.value}
          errorMessage={errorMessage.value}
          onChange={(e: any) => onEvent.value.onChange(e)}
        >
          {{ ...getSlot(['options']) }}
        </FormRadio>
      )
    case 'autocomplete':
      return (
        <FormAutocomplete
          ref={autocompleteRef}
          modelValue={inputValue.value}
          onUpdate:modelValue={($event: any) => (inputValue.value = $event)}
          // v-bind 綁定屬性
          {...props}
          errorMessage={errorMessage.value}
          onSelect={(e: any) => onEvent.value.onSelect(e)}
          onChange={(e: any) => onEvent.value.onChange(e)}
        >
          {{
            ...getSlot(['prepend', 'append', 'prefix', 'suffix']),
            default: ({ item }) => {
              return slots.default?.({ item })
            }
          }}
        </FormAutocomplete>
      )
    case 'operator':
      return (
        <FormOperator
          ref={operatorRef}
          modelValue={inputValue.value}
          onUpdate:modelValue={($event: any) => (inputValue.value = $event)}
          // v-bind 綁定屬性
          {...props}
          options={props.options}
          round={props.round}
          max={props.max}
          min={props.min}
          errorMessage={errorMessage.value}
          // v-on 接收事件
          onFocus={(e: any) => onEvent.value.onFocus(e)}
          onClear={() => onEvent.value.onClear()}
          onBlur={(e: any) => onEvent.value.onBlur(e)}
          onChange={(e: any) => onEvent.value.onChange(e)}
          onInput={(e: any) => onEvent.value.onInput(e)}
        >
          {{
            ...getSlot([
              // 'prepend',
              'append',
              'prefix',
              'suffix'
            ]),
            default: ({ label, value }) => {
              return slots.default?.({ label, value })
            }
          }}
        </FormOperator>
      )
    default:
      tipLog(`輸入框類型 ${props.type} 不存在`, [
        '以下為可用類型',
        'text',
        'number',
        'textarea',
        'password',
        'select',
        'year',
        'month',
        'date',
        'dates',
        'datetime',
        'week',
        'datetimerange',
        'daterange',
        'monthrange',
        'time',
        'timerange',
        'checkbox',
        'radio'
      ])
      return <div>{ props.type }</div>
  }
}

const CustomInputTemplate = () => (
  <div
    class={[
      `CustomInput_${version}`,
      styles['__input-container'],
      `__input-${domValidateKey.value}-${validateRes.value}`,
      `__input-${scopedId}`,
      styles[`__input-${props.direction}`]
    ]}
  >
    {!props.hiddenLabel && (
      <label class={styles['__input-label']}>
        {
          props.isValidate && props.required && (
            <span
              class={[
                styles['__input-required'],
                styles['__input-prefix']
              ]}
            >*</span>
          )
        }
        <CustomText label={translateLabel.value}></CustomText>
      </label>
    )}

    <div class={styles['__input-main']}>
      {props.text ? <div class='i-pt-xs'>{getTextValue.value}</div> : renderInput()}
      {props.isValidate && !props.hiddenErrorMessage && (
        <span class={styles['__input-error']}>{i18nErrorMessage.value}</span>
      )}
    </div>
  </div>
)

</script>

<template>
  <CustomInputTemplate />
</template>
