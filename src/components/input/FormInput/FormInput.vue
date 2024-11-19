<script setup lang="ts">
import { computed, useSlots, ref, onMounted, inject } from 'vue'
import { ElInput } from 'element-plus'

import type { UseHook } from '@/declare/hook' // 全域功能類型
import { isEmpty, hasOwnProperty, getUuid } from '@/lib/lib_utils' // 工具
import type { NumberFormatType } from '@/lib/lib_format' // 格式化
import { numberFormat } from '@/lib/lib_format' // 格式化
import { defaultModuleType } from '@/i18n/i18n_setting'

import type { Props, Emits, Expose } from './FormInputInfo'
import { version, props as formInputProps } from './FormInputInfo'

const scopedId = getUuid(version)

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

const props = defineProps(formInputProps)

const emit = defineEmits([
  'update:model-value',
  'focus',
  'blur',
  'clear',
  'change',
  'input',
  'click'
])

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: Props.ModelValue) => {
    emit('update:model-value', value)
  }
})

let lastValue: any = ''
onMounted(() => {
  lastValue = props.modelValue
})

// event
const onBlur: Emits.Blur = event => emit('focus', event)
const onFocus: Emits.Focus = event => emit('focus', event)
const onChange: Emits.Change = value => {
  let _value = value

  // 數字
  if (props.type === 'number') {
    // 轉化數字
    if (typeof _value === 'string') {
      _value = Number.parseFloat(_value)

      // 不是數字 給最後一次的值
      if (Number.isNaN(_value)) {
        _value = lastValue
      }
    }

    let numberFormatType: NumberFormatType = ''
    let numberFormatToFixed = 0
    if (typeof _value === 'number') {
      // 四捨五入
      if (!isEmpty(props.round)) {
        numberFormatType = 'round'
        numberFormatToFixed = props.round

      // 無條件進位
      } else if (!isEmpty(props.ceil)) {
        numberFormatType = 'ceil'
        numberFormatToFixed = props.ceil

        // 無條件捨去
      } else if (!isEmpty(props.floor)) {
        numberFormatType = 'floor'
        numberFormatToFixed = props.floor
      }

      _value = numberFormat<number>(_value, {
        type: numberFormatType,
        toFixed: numberFormatToFixed
      })

      // 最大值
      if (!isEmpty(props.max) && _value > props.max) {
        _value = props.max
      }
      // 最小值
      if (!isEmpty(props.min) && _value < props.min) {
        _value = props.min
      }
    }
  }

  // 去前後空白
  if (typeof _value === 'string') {
    _value = _value.replace(/^(\s+)|(\s+)$/g, '')
  }

  emit('change', _value)
  if (lastValue !== _value) {
    lastValue = _value
  }
}
const onInput: Emits.Input = value => emit('input', value)
const onClear: Emits.Clear = () => emit('clear')

// expose
const elInputRef = ref()
const blur: Expose.Blur = () => {
  elInputRef.value?.blur()
}
const clear: Expose.Clear = () => {
  elInputRef.value?.clear()
}
const focus: Expose.Focus = () => {
  elInputRef.value?.focus()
}
const resizeTextarea: Expose.ResizeTextarea = () => {
  elInputRef.value?.resizeTextarea()
}
const select: Expose.Select = () => {
  elInputRef.value?.select()
}
defineExpose({ blur, clear, focus, resizeTextarea, select })

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}
</script>

<template>
  <ElInput
    ref="elInputRef"
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
</template>

<style lang="scss" scoped></style>
