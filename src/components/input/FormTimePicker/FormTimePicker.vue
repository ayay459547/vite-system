<script setup lang="ts">
import { computed, ref, inject } from 'vue'
import { ElTimePicker } from 'element-plus'

import type { UseHook } from '@/declare/hook' // 全域功能類型
import { getUuid } from '@/lib/lib_utils' // 工具
import { defaultModuleType } from '@/i18n/i18n_setting'

import type { Props, Emits, Expose } from './FormTimePickerInfo'
import { version, props as formTimePickerProps } from './FormTimePickerInfo'

const scopedId = getUuid(version)

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

const props = defineProps(formTimePickerProps)

const emit = defineEmits([
  'update:model-value',
  'input',
  'change',
  'blur',
  'focus',
  'clear',
  'visible-change'
])

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: Props.ModelValue) => {
    emit('update:model-value', value)
  }
})

// event
const onInput = () => emit('input', inputValue.value) // 預防CustomInput @input錯誤
const onChange: Emits.Change = value => emit('change', value)
const onBlur: Emits.Blur = e => emit('blur', e)
const onFocus: Emits.Focus = e => emit('focus', e)
const onClear: Emits.Clear = () => emit('clear')
const onVisibleChange: Emits.VisibleChange = visibility => emit('visible-change', visibility)

// expose
const elTimePickerRef = ref()
const focus: Expose.Focus = () => {
  elTimePickerRef.value?.focus()
}
const blur: Expose.Blur = () => {
  elTimePickerRef.value?.blur()
}
const handleOpen : Expose.HandleOpen = () => {
  elTimePickerRef.value?.handleOpen ()
}
const handleClose : Expose.HandleClose = () => {
  elTimePickerRef.value?.handleClose ()
}
defineExpose({ focus, blur, handleOpen, handleClose   })

</script>

<template>
  <ElTimePicker
    ref="elTimePickerRef"
    :class="scopedId"
    v-model="inputValue"
    :readonly="props.readonly"
    :disabled="props.disabled"
    :editable="props.editable"
    :clearable="props.clearable"
    :size="props.size"
    :placeholder="props.placeholder ?? i18nTranslate('pleaseSelect', defaultModuleType)"
    :start-placeholder="props.startPlaceholder ?? i18nTranslate('datetime-startTime', defaultModuleType)"
    :end-placeholder="props.endPlaceholder ?? i18nTranslate('datetime-endTime', defaultModuleType)"
    :is-range="props.isRange ?? (props.type === 'timerange')"
    :arrow-control="props.arrowControl"
    :popper-class="props.popperClass"
    :range-separator="props.rangeSeparator"
    :format="props.format"
    :default-value="props.defaultValue"
    :value-format="props.valueFormat"
    :id="props.id"
    :name="props.name"
    :aria-label="props.ariaLabel"
    :prefix-icon="props.prefixIcon"
    :clear-icon="props.clearIcon"
    :disabled-hours="props.disabledHours"
    :disabled-minutes="props.disabledMinutes"
    :disabled-seconds="props.disabledSeconds"
    :teleported="props.teleported"
    :tabindex="props.tabindex"
    :empty-values="props.emptyValues"
    :value-on-clear="props.valueOnClear"
    @input="onInput"
    @change="onChange"
    @blur="onBlur"
    @focus="onFocus"
    @clear="onClear"
    @visible-change="onVisibleChange"
  ></ElTimePicker>
</template>

<style lang="scss" scoped></style>
