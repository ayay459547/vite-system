<script setup lang="ts">
import { useSlots, ref, onMounted, inject, computed } from 'vue'
import { ElInput } from 'element-plus'

import type { UseHook } from '@/declare/hook' // 全域功能類型
import { isEmpty, hasOwnProperty, getUuid } from '@/lib/lib_utils' // 工具
import { defaultModuleType } from '@/i18n/i18n_setting'
import { numberFormat } from '@/lib/lib_format' // 格式化

import type { Props, Emits, Expose } from './FormInputInfo'
import { version, props as formInputProps } from './FormInputInfo'

const scopedId = getUuid(version)

const useHook = inject('useHook') as UseHook 
const { i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

const props = defineProps(formInputProps)

const emit = defineEmits([
  'update:model-value',
  'blur',
  'focus',
  'clear',
  'change',
  'input'
])

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: Props.ModelValue) => emit('update:model-value', value)
})

let lastValue: any = ''
onMounted(() => {
  lastValue = props.modelValue
})

// 數字格式化
const __formatNumberValue__ = (value: any) => {
  let _value = value
  if (typeof _value === 'string') {
    _value = Number.parseFloat(_value)
    // 不是數字 給最後一次的值
    if (Number.isNaN(_value)) { _value = lastValue }
  }

  const _formatOptions = { type: '', toFixed: 0 }
  if (typeof _value === 'number') {
    // 四捨五入
    if (!isEmpty(props.round)) {
      _formatOptions.type = 'round'
      _formatOptions.toFixed = props.round

    // 無條件進位
    } else if (!isEmpty(props.ceil)) {
      _formatOptions.type = 'ceil'
      _formatOptions.toFixed = props.ceil

    // 無條件捨去
    } else if (!isEmpty(props.floor)) {
      _formatOptions.type = 'floor'
      _formatOptions.toFixed = props.floor
    }
    _value = numberFormat<number>(_value, _formatOptions)

    // 最大值
    if (!isEmpty(props.max) && _value > props.max) {
      _value = props.max

    // 最小值
    } else if (!isEmpty(props.min) && _value < props.min) {
      _value = props.min
    }
  }

  return _value
}

// event
// :model-value="props.modelValue"
// @update:model-value="onUpdateModelValue"
// const onUpdateModelValue = (value: Props.ModelValue) => emit('update:model-value', value)
const onBlur: Emits.Blur = event => emit('blur', event)
const onFocus: Emits.Focus = event => emit('focus', event)
const onChange: Emits.Change = value => {
  let _value = value

  // 轉化數字
  if (props.type === 'number') {
    _value = __formatNumberValue__(_value)
  }

  // 去前後空白
  if (typeof _value === 'string') {
    _value = _value.replace(/^(\s+)|(\s+)$/g, '')
  }
  inputValue.value = _value
  emit('change', _value)
}
const onInput: Emits.Input = value => emit('input', value)
const onClear: Emits.Clear = () => emit('clear')

// expose
const ElInputRef = ref()
const blur: Expose.Blur = () => ElInputRef.value?.blur()
const clear: Expose.Clear = () => ElInputRef.value?.clear()
const focus: Expose.Focus = () => ElInputRef.value?.focus()
const resizeTextarea: Expose.ResizeTextarea = () => ElInputRef.value?.resizeTextarea()
const select: Expose.Select = () => ElInputRef.value?.select()
defineExpose({ blur, clear, focus, resizeTextarea, select })

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}
</script>

<template>
  <ElInput
    ref="ElInputRef"
    :class="scopedId"
    :type="props.type"
    v-model="inputValue"
    :maxlength="props.maxlength"
    :minlength="props.minlength"
    :show-word-limit="props.showWordLimit"
    :placeholder="props?.placeholder ?? i18nTranslate('pleaseInput')"
    :clearable="props.clearable"
    :formatter="props.formatter"
    :parser="props.parser"
    :show-password="props.showPassword"
    :disabled="props.disabled"
    :size="props.size"
    :prefix-icon="props.prefixIcon"
    :suffix-icon="props.suffixIcon"
    :rows="props.rows"
    :autosize="props.autosize"
    :autocomplete="props.autocomplete"
    :name="props.name"
    :readonly="props.readonly"
    :max="props.max"
    :min="props.min"
    :step="props.step"
    :resize="props.resize"
    :autofocus="props.autofocus"
    :form="props.form"
    :aria-label="props.ariaLabel"
    :tabindex="props.tabindex"
    :validate-event="props.validateEvent"
    :input-style="props.inputStyle"
    @blur="onBlur"
    @focus="onFocus"
    @change="onChange"
    @input="onInput"
    @clear="onClear"
  >
    <template v-if="hasSlot('prepend')" #prepend>
      <slot name="prepend"></slot>
    </template>
    <template v-if="hasSlot('append')" #append>
      <slot name="append"></slot>
    </template>
    <template v-if="hasSlot('prefix')" #prefix>
      <slot name="prefix"></slot>
    </template>
    <template v-if="hasSlot('suffix')" #suffix>
      <slot name="suffix"></slot>
    </template>
  </ElInput>
</template>

<style lang="scss">
div[class*="FormInput"] {
  width: 100%;
  height: fit-content;

  .el-input__suffix {
    position: absolute;
    right: 8px;
    top: 0px;
  }
  .el-input-group__prepend,
  .el-input-group__append {
    padding: 0 12px;
  }
}
</style>
