<script setup lang="ts">
import { inject, computed, ref, useSlots, nextTick, onMounted } from 'vue'

import type { UseHook } from '@/declare/hook' // 全域功能類型
import {
  FormInput,
  FormSelect,
  FormSelectV2,
  FormSelectTree,
  FormDatePicker,
  FormTimePicker,
  FormAutocomplete,
  FormRadio,
  FormCheckbox,
  FormOperator,
  CustomText
} from '@/components' // 系統組件

import { defaultModuleType } from '@/i18n/i18n_setting'
import { getUuid, hasOwnProperty, isEmpty, tipLog } from '@/lib/lib_utils' // 工具
import { formatDatetime } from '@/lib/lib_format' // 格式化

import type { VeeRes, ValidateType } from '@/lib/lib_validate'
import validateFun from '@/lib/lib_validate'

import type { Props, Expose } from './CustomInputInfo'
import { version, props as inputProps } from './CustomInputInfo'

const scopedId = getUuid(version)

const props = defineProps(inputProps)

const emit = defineEmits([
  'update:model-value',
  'change',
  'input',
  'focus',
  'clear',
  'blur',
  'remove-tag',
  'visible-change',
  'select',
  'calendar-change',
  'panel-change'
])

const useHook = inject('useHook') as UseHook 
const { i18nTranslate, i18nTest } = useHook({
  i18nModule: props.i18nModule
})

// i18nTranslate
const getTranslateLabel = (object: any) => {
  if (isEmpty(object)) return
  const { i18nLabel = '__none__', label, value } = object ?? {}
  return i18nTest(i18nLabel) ? i18nTranslate(i18nLabel) : (label ?? value)
}
const getTranslateOptions = (options: any[]): any => {
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
      case 'daterange':
      case 'timerange':
        if (
          !Array.isArray(veeValue) ||
          isEmpty(veeValue[0]) ||
          isEmpty(veeValue[1])
        ) return 'required'
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

const validateKey = `${props.__key__}${scopedId}`

// 錯誤訊息
const errorMessage = ref('')

const isError = computed(() => {
  return !isEmpty(errorMessage.value)
})

// 驗證
const veeValidate: Expose.Validate = async () => {
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

// event
const focus = (e: FocusEvent) => {
  emit('focus', e)
}
const clear = () => emit('clear')
const blur = async (e: FocusEvent) => {
  emit('blur', e)

  // 確保畫面更新完才做驗證
  // 太快做驗證會一瞬間 出現紅色
  await nextTick()
  setTimeout(() => {
    handleChange(inputValue.value, true)
  }, 300)
}

// event
const change = (value: any) => {
  emit('change', value)
  handleChange(value, true)
}
const input = (value: any) => emit('input', value)
const removeTag = (tagValue: any) => emit('remove-tag', tagValue)
const visibleChange = (visible: boolean) => emit('visible-change', visible)
const select = (item: any) => emit('select', item)
const calendarChange = (val: any) => emit('calendar-change', val)
const panelChange = (date: any) => emit('panel-change', date)

const inputRef = ref()

// expose
const key: Expose.Key = validateKey
const value: Expose.Value = inputValue.value
const resetValidate: Expose.ResetValidate = () => {
  validateCount.value = 0
  errorMessage.value = ''
}
const getDom: Expose.GetDom = () => document.querySelector(`[class*="input-${scopedId}"]`)
const onFocus: Expose.Focus = () => inputRef.value?.focus()
const onBlur: Expose.Blur = () => inputRef.value?.blur()
defineExpose({
  key,
  value,
  resetValidate, // 重置驗證
  validate: veeValidate,
  getDom,
  focus: onFocus,
  blur: onBlur
})

// 選項文字
const __getOptionsText__ = (value: any) => {
  if (isEmpty(props.options)) return `${value}`
  if (isEmpty(value)) return ''

  const findOptions = (options: any[], findValue: any): any => {
    if (isEmpty(options) || isEmpty(value)) return

    for(const _option of options) {
      if (_option.value === findValue) return _option

      const selected = findOptions(_option.options, findValue)
      if (!isEmpty(selected)) return selected
    }
  }

  if (Array.isArray(value)) {
    return value.map(item => {
      const selected = findOptions(props.options, item)
      return getTranslateLabel(selected ?? {})
    }).join(' , ')

  } else {
    const selected = findOptions(props.options, value)
    return getTranslateLabel(selected ?? {})
  }
}

const renderInput = computed(() => {
  const text = `${inputValue.value}`
  const options: any[] = getTranslateOptions(props.options)

  switch (props.type) {
    case 'text':
    case 'textarea':
    case 'password':
    case 'number': {
      return {
        components: FormInput,
        props: {
          round: props.round,
          floor: props.floor,
          ceil: props.ceil,
          modelValue: props.modelValue,
          type: props.type,
          maxlength: props.maxlength,
          minlength: props.minlength,
          showWordLimit: props.showWordLimit,
          placeholder: props.placeholder,
          clearable: props.clearable,
          formatter: props.formatter,
          parser: props.parser,
          showPassword: props.showPassword,
          disabled: props.disabled,
          size: props.size,
          prefixIcon: props.prefixIcon,
          suffixIcon: props.suffixIcon,
          rows: props.rows,
          autosize: props.autosize,
          autocomplete: props.autocomplete,
          name: props.name,
          readonly: props.readonly,
          max: props.max,
          min: props.min,
          step: props.step,
          resize: props.resize,
          autofocus: props.autofocus,
          form: props.form,
          ariaLabel: props.ariaLabel,
          tabindex: props.tabindex,
          validateEvent: props.validateEvent,
          inputStyle: props.inputStyle
        },
        event: { blur, focus, change, input, clear },
        text
      }
    }
    case 'select': {
      return {
        components: FormSelect,
        props: {
          multiple: props.multiple,
          disabled: props.disabled,
          valueKey: props.valueKey,
          size: props.size,
          clearable: props.clearable,
          collapseTags: props.collapseTags,
          collapseTagsTooltip: props.collapseTagsTooltip,
          multipleLimit: props.multipleLimit,
          name: props.name,
          effect: props.effect,
          autocomplete: props.autocomplete,
          placeholder: props.placeholder,
          filterable: props.filterable,
          allowCreate: props.allowCreate,
          filterMethod: props.filterMethod,
          remote: props.remote,
          remoteMethod: props.remoteMethod,
          remoteShowSuffix: props.remoteShowSuffix,
          loading: props.loading,
          loadingText: props.loadingText,
          noMatchText: props.noMatchText,
          noDataText: props.noDataText,
          popperClass: props.popperClass,
          reserveKeyword: props.reserveKeyword,
          defaultFirstOption: props.defaultFirstOption,
          teleported: props.teleported,
          appendTo: props.appendTo,
          persistent: props.persistent,
          automaticDropdown: props.automaticDropdown,
          clearIcon: props.clearIcon,
          fitInputWidth: props.fitInputWidth,
          suffixIcon: props.suffixIcon,
          tagType: props.tagType,
          tagEffect: props.tagEffect,
          validateEvent: props.validateEvent,
          offset: props.offset,
          showArrow: props.showArrow,
          placement: props.placement,
          fallbackPlacements: props.fallbackPlacements,
          maxCollapseTags: props.maxCollapseTags,
          popperOptions: props.popperOptions,
          ariaLabel: props.ariaLabel,
          emptyValues: props.emptyValues,
          valueOnClear: props.valueOnClear,
          options
        },
        event: { change, visibleChange, removeTag, clear, blur, focus },
        text: `${__getOptionsText__(inputValue.value)}`
      }
    }
    case 'select-v2': {
      return {
        components: FormSelectV2,
        props: {
          options,
          props: props.props,
          multiple: props.multiple,
          disabled: props.disabled,
          valueKey: props.valueKey,
          size: props.size,
          clearable: props.clearable,
          clearIcon: props.clearIcon,
          collapseTags: props.collapseTags,
          multipleLimit: props.multipleLimit,
          name: props.name,
          effect: props.effect,
          autocomplete: props.autocomplete,
          placeholder: props.placeholder,
          filterable: props.filterable,
          allowCreate: props.allowCreate,
          filterMethod: props.filterMethod,
          loading: props.loading,
          loadingText: props.loadingText,
          reserveKeyword: props.reserveKeyword,
          noMatchText: props.noMatchText,
          noDataText: props.noDataText,
          popperClass: props.popperClass,
          teleported: props.teleported,
          appendTo: props.appendTo,
          persistent: props.persistent,
          popperOptions: props.popperOptions,
          automaticDropdown: props.automaticDropdown,
          height: props.height,
          itemHeight: props.itemHeight,
          scrollbarAlwaysOn: props.scrollbarAlwaysOn,
          remote: props.remote,
          remoteMethod: props.remoteMethod,
          validateEvent: props.validateEvent,
          offset: props.offset,
          showArrow: props.showArrow,
          placement: props.placement,
          fallbackPlacements: props.fallbackPlacements,
          collapseTagsTooltip: props.collapseTagsTooltip,
          maxCollapseTags: props.maxCollapseTags,
          tagType: props.tagType,
          tagEffect: props.tagEffect,
          ariaLabel: props.ariaLabel,
          emptyValues: props.emptyValues,
          valueOnClear: props.valueOnClear
        },
        event: { change, visibleChange, removeTag, clear, blur, focus },
        text: `${__getOptionsText__(inputValue.value)}`
      }
    }
    case 'select-tree': {
      return {
        components: FormSelectTree,
        props: {
          multiple: props.multiple,
          disabled: props.disabled,
          valueKey: props.valueKey,
          size: props.size,
          clearable: props.clearable,
          collapseTags: props.collapseTags,
          collapseTagsTooltip: props.collapseTagsTooltip,
          multipleLimit: props.multipleLimit,
          name: props.name,
          effect: props.effect,
          autocomplete: props.autocomplete,
          placeholder: props.placeholder,
          filterable: props.filterable,
          allowCreate: props.allowCreate,
          filterMethod: props.filterMethod,
          remote: props.remote,
          remoteMethod: props.remoteMethod,
          remoteShowSuffix: props.remoteShowSuffix,
          loading: props.loading,
          loadingText: props.loadingText,
          noMatchText: props.noMatchText,
          noDataText: props.noDataText,
          popperClass: props.popperClass,
          reserveKeyword: props.reserveKeyword,
          defaultFirstOption: props.defaultFirstOption,
          teleported: props.teleported,
          appendTo: props.appendTo,
          persistent: props.persistent,
          automaticDropdown: props.automaticDropdown,
          clearIcon: props.clearIcon,
          fitInputWidth: props.fitInputWidth,
          suffixIcon: props.suffixIcon,
          tagType: props.tagType,
          tagEffect: props.tagEffect,
          validateEvent: props.validateEvent,
          offset: props.offset,
          showArrow: props.showArrow,
          placement: props.placement,
          fallbackPlacements: props.fallbackPlacements,
          maxCollapseTags: props.maxCollapseTags,
          popperOptions: props.popperOptions,
          ariaLabel: props.ariaLabel,
          emptyValues: props.emptyValues,
          valueOnClear: props.valueOnClear,
          options
        },
        event: { change, visibleChange, removeTag, clear, blur, focus },
        text: `${__getOptionsText__(inputValue.value)}`
      }
    }
    case 'year':
    case 'month':
    case 'date':
    case 'dates':
    case 'datetime':
    case 'week':
    case 'datetimerange':
    case 'daterange':
    case 'monthrange': {
      const format = props.format ?? 'YYYY-MM-DD'
      const valueFormat = props.valueFormat ?? 'YYYY-MM-DD'
      // 日期文字
      const __getDateText__ = (value: any) => {
        if (isEmpty(value)) return ''

        if (Array.isArray(value) && !isEmpty(value[0]) && !isEmpty(value[1])) {
          const [value1, value2] = value
          return `${formatDatetime(value1, format)} ${props.rangeSeparator} ${formatDatetime(value2, format)}`
        } else {
          return `${formatDatetime(value, format)}`
        }
      }

      return {
        components: FormDatePicker,
        props: {
          readonly: props.readonly,
          disabled: props.disabled,
          size: props.size,
          editable: props.editable,
          clearable: props.clearable,
          placeholder: props.placeholder,
          startPlaceholder: props.startPlaceholder,
          endPlaceholder: props.endPlaceholder,
          format,
          type: props.type,
          popperClass: props.popperClass,
          popperOptions: props.popperOptions,
          rangeSeparator: props.rangeSeparator,
          defaultValue: props.defaultValue,
          defaultTime: props.defaultTime,
          valueFormat,
          id: props.id,
          name: props.name,
          unlinkPanels: props.unlinkPanels,
          prefixIcon: props.prefixIcon,
          clearIcon: props.clearIcon,
          validateEvent: props.validateEvent,
          disabledDate: props.disabledDate,
          shortcuts: props.shortcuts,
          cellClassName: props.cellClassName,
          teleported: props.teleported,
          emptyValues: props.emptyValues,
          valueOnClear: props.valueOnClear,
          fallbackPlacements: props.fallbackPlacements,
          placement: props.placement
        },
        event: { change, blur, focus, clear, calendarChange, panelChange, visibleChange },
        text: `${__getDateText__(inputValue.value)}`
      }
    }
    case 'time':
    case 'timerange': {
      const format = props.format ?? 'HH:mm:ss'
      const valueFormat = props.valueFormat ?? 'HH:mm:ss'
      // 時間文字
      const __getTimeText__ = (value: any) => {
        if (isEmpty(value)) return ''

        const today = formatDatetime(new Date(), 'YYYY-MM-DD')

        if (Array.isArray(value) && !isEmpty(value[0]) && !isEmpty(value[1])) {
          const [value1, value2] = value
          return `${formatDatetime(`${today} ${value1}`, format)} ${props.rangeSeparator} ${formatDatetime(`${today} ${value2}`, format)}`
        } else {
          return `${formatDatetime(`${today} ${value}`, format)}`
        }
      }

      return {
        components: FormTimePicker,
        props: {
          type: props.type,
          readonly: props.readonly,
          disabled: props.disabled,
          editable: props.editable,
          clearable: props.clearable,
          size: props.size,
          placeholder: props.placeholder,
          startPlaceholder: props.startPlaceholder,
          endPlaceholder: props.endPlaceholder,
          isRange: props.isRange,
          arrowControl: props.arrowControl,
          popperClass: props.popperClass,
          rangeSeparator: props.rangeSeparator,
          format,
          defaultValue: props.defaultValue,
          valueFormat,
          id: props.id,
          name: props.name,
          ariaLabel: props.ariaLabel,
          prefixIcon: props.prefixIcon,
          clearIcon: props.clearIcon,
          disabledHours: props.disabledHours,
          disabledMinutes: props.disabledMinutes,
          disabledSeconds: props.disabledSeconds,
          teleported: props.teleported,
          tabindex: props.tabindex,
          emptyValues: props.emptyValues,
          valueOnClear: props.valueOnClear
        },
        event: { change, blur, focus, clear, visibleChange },
        text: `${__getTimeText__(inputValue.value)}`
      }
    }
    case 'autocomplete': {
      return {
        components: FormAutocomplete,
        props: {
          placeholder: props.placeholder,
          clearable: props.clearable,
          disabled: props.disabled,
          valueKey: props.valueKey,
          debounce: props.debounce,
          placement: props.placement,
          fetchSuggestions: props.fetchSuggestions,
          triggerOnFocus: props.triggerOnFocus,
          selectWhenUnmatched: props.selectWhenUnmatched,
          name: props.name,
          ariaLabel: props.ariaLabel,
          hideLoading: props.hideLoading,
          popperClass: props.popperClass,
          teleported: props.teleported,
          highlightFirstItem: props.highlightFirstItem,
          fitInputWidth: props.fitInputWidth
        },
        event: { blur, focus, input, clear, select, change },
        text
      }
    }
    case 'radio': {
      return {
        components: FormRadio,
        props: {
          options,
          radioType: props.radioType,
          modelValue: props.modelValue,
          size: props.size,
          disabled: props.disabled,
          textColor: props.textColor,
          fill: props.fill,
          validateEvent: props.validateEvent,
          ariaLabel: props.ariaLabel,
          id: props.id,
          name: props.name
        },
        event: { change },
        text: `${__getOptionsText__(inputValue.value)}`
      }
    }
    case 'checkbox': {
      const __getCheckBoxText__ = (value: any) => {
        if (isEmpty(value)) return ''
        if (typeof value === 'boolean') return value ? 'v' : 'x'
        return __getOptionsText__(value)
      }

      return {
        components: FormCheckbox,
        props: {
          label: props.label,
          modelValue: props.modelValue,
          disabled: props.disabled,
          indeterminate: props.indeterminate,
          options
        },
        event: { change },
        text: `${__getCheckBoxText__(inputValue.value)}`
      }
    }
    case 'operator': {
      const [selectValue, inputText] = inputValue.value
      const selectText = __getOptionsText__(selectValue)

      return {
        components: FormOperator,
        props: {
          type: props.type,
          round: props.round,
          max: props.max,
          min: props.min,
          clearable: props.clearable,
          disabled: props.disabled,
          placeholder: props.placeholder,
          options
        },
        event: { blur, focus, change, input, clear },
        text: `${selectText} ${inputText ?? ''}`
      }
    }
    default: {

      tipLog(`輸入框類型 ${props.type} 不存在`, [props])
      return {
        components: FormInput,
        props: { ...props },
        event: {},
        text
      }
    }
  }
})

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}
</script>

<template>
  <div :class="[scopedId, `input-${scopedId}`, `input-${props.direction}`]">
    <label v-if="!props.hiddenLabel" class="input-label">
      <span v-if="props.isValidate && props.required" class="input-prefix">*</span>
      <CustomText :label="getTranslateLabel(props)"></CustomText>
    </label>

    <div class='input-main' :class="`validate-${isError ? 'error' : 'success'}`">
      <div v-if="props.text" class='input-text'>
        <span v-if="!isEmpty(renderInput.text)">{{ renderInput.text }}</span>
        <span v-else class="opacity-3">{{ i18nTranslate('none-var', defaultModuleType) }}</span>
      </div>
      <component
        v-else
        :is="renderInput.components"
        v-bind="renderInput.props"
        v-on="renderInput.event"
        ref="inputRef"
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
        <template v-if="hasSlot('decrease-icon')" #decrease-icon>
          <slot name="decrease-icon"></slot>
        </template>
        <template v-if="hasSlot('increase-icon')" #increase-icon>
          <slot name="increase-icon"></slot>
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
        <template v-if="hasSlot('loading')" #loading>
          <slot name="loading"></slot>
        </template>
        <template v-if="hasSlot('empty')" #empty="scope">
          <slot name="empty" v-bind="scope"></slot>
        </template>
        <template v-if="hasSlot('range-separator')" #range-separator="scope">
          <slot name="range-separator" v-bind="scope"></slot>
        </template>
        <template v-if="hasSlot('prev-month')" #prev-month>
          <slot name="prev-month"></slot>
        </template>
        <template v-if="hasSlot('next-month')" #next-month>
          <slot name="next-month"></slot>
        </template>
        <template v-if="hasSlot('prev-year')" #prev-year>
          <slot name="prev-year"></slot>
        </template>
        <template v-if="hasSlot('next-year')" #next-year>
          <slot name="next-year"></slot>
        </template>
        <template v-if="hasSlot('default')" #default="scope">
          <slot name="default" v-bind="scope"></slot>
        </template>
      </component>
      <span v-if="props.isValidate && !props.hiddenErrorMessage" class="input-error">
        {{ i18nTranslate(errorMessage, defaultModuleType) }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use './CustomInput.scss' as *;

div[class*="CustomInput"] {
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

      @include form-success(FormInput);
      @include form-success(FormSelect);
      @include form-success(FormSelectV2);
      @include form-success(FormSelectTree);
      @include form-success(FormDatePicker);
      @include form-success(FormTimePicker);
      @include form-success(FormAutocomplete);
      @include form-success(FormRadio);
      @include form-success(FormCheckbox);
      @include form-success(FormOperator);

      &.validate-error {
        @include form-error(FormInput);
        @include form-error(FormSelect);
        @include form-error(FormSelectV2);
        @include form-error(FormSelectTree);
        @include form-error(FormDatePicker);
        @include form-error(FormTimePicker);
        @include form-error(FormAutocomplete);
        @include form-error(FormRadio);
        @include form-error(FormCheckbox);
        @include form-error(FormOperator);
      }
    }

    &-text {
      line-height: 32px;
    }
    &-error {
      color: var(--i-color-danger);
      width: 100%;
      height: 20px;
    }
  }
}

:global(.el-picker__popper) {
  z-index: var(--i-z-index-select-option) !important;
}
:global(.el-select__popper) {
  z-index: var(--i-z-index-select-option) !important;
}
:global(.el-select-dropdown__item) {
  padding: 0 32px 0 20px;
}
</style>
