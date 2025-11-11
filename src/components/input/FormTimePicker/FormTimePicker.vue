<script setup lang="ts">
import { computed, ref, inject } from 'vue'
import type { DatePickerInstance } from 'element-plus'
import { ElTimePicker } from 'element-plus'

import type { UseHook } from '@/types/types_hook' // 全域功能類型
import { getUuid } from '@/lib/lib_utils' // 工具
import { defaultModuleType } from '@/declare/declare_i18n'

import type { Props, Emits, Expose } from './FormTimePickerInfo'
import { version, props as formTimePickerProps } from './FormTimePickerInfo'

const scopedId = getUuid(version)

const useHook = inject('useHook') as UseHook
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
  set: (value: Props['modelValue']) => emit('update:model-value', value)
})

// event
const onChange: Emits['change'] = value => emit('change', value)
const onBlur: Emits['blur'] = e => emit('blur', e)
const onFocus: Emits['focus'] = e => emit('focus', e)
const onClear: Emits['clear'] = () => emit('clear')
const onVisibleChange: Emits['visibleChange'] = visibility => emit('visible-change', visibility)

// expose
const ElTimePickerRef = ref<DatePickerInstance>()
const focus: Expose['focus'] = () => {
  ElTimePickerRef.value?.focus()
}
const blur: Expose['blur'] = () => {
  ElTimePickerRef.value?.blur()
}
const handleOpen : Expose['handleOpen'] = () => {
  ElTimePickerRef.value?.handleOpen ()
}
const handleClose : Expose['handleClose'] = () => {
  ElTimePickerRef.value?.handleClose ()
}
defineExpose({ focus, blur, handleOpen, handleClose   })

</script>

<template>
  <ElTimePicker
    ref="ElTimePickerRef"
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
    @change="onChange"
    @blur="onBlur"
    @focus="onFocus"
    @clear="onClear"
    @visible-change="onVisibleChange"
  ></ElTimePicker>
</template>

<style lang="scss">
div[class*="FormTimePicker"] {
  width: 100% !important;
  height: fit-content;
  border-radius: 4px;
}
</style>
