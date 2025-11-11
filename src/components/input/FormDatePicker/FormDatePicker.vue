<script setup lang="ts">
import { computed, useSlots, ref, inject } from 'vue'
import type { DatePickerInstance } from 'element-plus'
import { ElDatePicker } from 'element-plus'

import type { UseHook } from '@/types/types_hook' // 全域功能類型
import { hasOwnProperty, getUuid } from '@/lib/lib_utils' // 工具
import { defaultModuleType } from '@/declare/declare_i18n'

import type { Props, Emits, Expose } from './FormDatePickerInfo'
import { version, props as formDatePickerProps } from './FormDatePickerInfo'

const scopedId = getUuid(version)

const useHook = inject('useHook') as UseHook
const { i18nTranslate, i18nTest } = useHook({
  i18nModule: defaultModuleType
})

const props = defineProps(formDatePickerProps)

const emit = defineEmits([
  'update:model-value',
  'input',
  'change',
  'blur',
  'focus',
  'clear',
  'calendar-change',
  'panel-change',
  'visible-change'
])

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: Props['modelValue']) => emit('update:model-value', value)
})

const getTranslateShortcuts = (shortcuts: Props['shortcuts']) => {
  if (!Array.isArray(shortcuts)) return []
  return shortcuts.map(shortcut => {
    const { i18nLabel, label, text, value } = shortcut

    return {
      text: i18nTest(i18nLabel) ? i18nTranslate(i18nLabel) : (label ?? text),
      value
    }
  })
}

// event
const onChange: Emits['change'] = val => emit('change', val)
const onBlur: Emits['blur'] = e => emit('blur', e)
const onFocus: Emits['focus'] = e => emit('focus', e)
const onClear: Emits['clear'] = () => emit('clear')
const onCalendarChange: Emits['calendarChange'] = val => emit('calendar-change', val)
const onPanelChange: Emits['panelChange'] = date => emit('panel-change', date)
const onVisibleChange: Emits['visibleChange'] = visibility => emit('visible-change', visibility)

// expose
const ElDatePickerRef = ref<DatePickerInstance>()
const focus: Expose['focus'] = () => {
  ElDatePickerRef.value?.focus()
  ElDatePickerRef.value?.handleOpen()
}
const blur: Expose['blur'] = () => {
  ElDatePickerRef.value?.blur()
  ElDatePickerRef.value?.handleClose()
}
const handleOpen: Expose['handleOpen'] = () => {
  ElDatePickerRef.value?.handleOpen()
}
const handleClose: Expose['handleClose'] = () => {
  ElDatePickerRef.value?.handleClose()
}
defineExpose({ focus, blur, handleOpen, handleClose })

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}
</script>

<template>
  <ElDatePicker
    ref="ElDatePickerRef"
    :class="scopedId"
    v-model="inputValue"
    :readonly="props.readonly"
    :disabled="props.disabled"
    :size="props.size"
    :editable="props.editable"
    :clearable="props.clearable"
    :placeholder="props.placeholder ?? i18nTranslate('pleaseSelect', defaultModuleType)"
    :start-placeholder="props.startPlaceholder ?? i18nTranslate('datetime-startTime', defaultModuleType)"
    :end-placeholder="props.endPlaceholder ?? i18nTranslate('datetime-endTime', defaultModuleType)"
    :type="props.type"
    :format="props.format"
    :popper-class="props.popperClass"
    :popper-options="props.popperOptions"
    :range-separator="props.rangeSeparator"
    :default-value="props.defaultValue"
    :default-time="props.defaultTime"
    :value-format="props.valueFormat"
    :id="props.id"
    :name="props.name"
    :unlink-panels="props.unlinkPanels"
    :prefix-icon="props.prefixIcon"
    :clear-icon="props.clearIcon"
    :validate-event="props.validateEvent"
    :disabled-date="props.disabledDate"
    :shortcuts="getTranslateShortcuts(props.shortcuts)"
    :cell-class-name="props.cellClassName"
    :teleported="props.teleported"
    :empty-values="props.emptyValues"
    :value-on-clear="props.valueOnClear"
    :fallback-placements="props.fallbackPlacements"
    :placement="props.placement"
    @change="onChange"
    @blur="onBlur"
    @focus="onFocus"
    @clear="onClear"
    @calendar-change="onCalendarChange"
    @panel-change="onPanelChange"
    @visible-change="onVisibleChange"
  >
    <template v-if="hasSlot('default')" #default="scope">
      <slot name="default" v-bind="scope"></slot>
    </template>
    <template v-if="hasSlot('range-separator')" #range-separator>
      <slot name="range-separator"></slot>
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
  </ElDatePicker>
</template>

<style lang="scss">
div[class*="FormDatePicker"] {
  width: 100% !important;
  height: fit-content;
  border-radius: 4px;
}
html.dark {
  :where(.el-date-editor.el-input__wrapper) {
    box-shadow: 0 0 0 1px var(--el-color-info-dark-2, var(--el-border-color)) inset;
  }
}
</style>
