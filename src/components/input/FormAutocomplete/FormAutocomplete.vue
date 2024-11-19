<script setup lang="ts">
import { computed, useSlots, ref, inject } from 'vue'
import { ElAutocomplete } from 'element-plus'

import type { UseHook } from '@/declare/hook' // 全域功能類型
import { hasOwnProperty, getUuid } from '@/lib/lib_utils' // 工具
import { defaultModuleType } from '@/i18n/i18n_setting'

import type { Props, Emits, Expose } from './FormAutocompleteInfo'
import { version, props as formAutocompleteProps } from './FormAutocompleteInfo'

const scopedId = getUuid(version)

const props = defineProps(formAutocompleteProps)

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

const emit = defineEmits([
  'update:model-value',
  'blur',
  'focus',
  'input',
  'clear',
  'select',
  'change'
])

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: Props.ModelValue) => {
    emit('update:model-value', value)
  }
})

// event
const onBlur: Emits.Blur = event => emit('blur', event)
const onFocus: Emits.Focus = event => emit('blur', event)
const onInput: Emits.Input = value => emit('input', value)
const onClear: Emits.Clear =  () => emit('clear')
const onSelect: Emits.Select =  event => emit('focus', event)
const onChange: Emits.Change = value => emit('change', value)

// expose
const elAutocompleteRef = ref()
const blur: Expose.Blur = () => {
  elAutocompleteRef.value?.blur()
}
const close: Expose.Close = () => {
  elAutocompleteRef.value?.close()
}
const focus: Expose.Focus = () => {
  elAutocompleteRef.value?.focus()
}
const handleSelect: Expose.HandleSelect = (item: any) => {
  return elAutocompleteRef.value?.handleSelect(item)
}
const handleKeyEnter: Expose.HandleKeyEnter = () => {
  return elAutocompleteRef.value?.handleKeyEnter()
}
const highlight: Expose.Highlight = (itemIndex: number) => {
  return elAutocompleteRef.value?.highlight(itemIndex)
}
const getData : Expose.GetData = (queryString: string) => {
  return elAutocompleteRef.value?.getData(queryString)
}
defineExpose({ blur, close, focus, handleSelect, handleKeyEnter, highlight, getData })

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}
</script>

<template>
  <ElAutocomplete
    ref="elAutocompleteRef"
    :class="scopedId"
    v-model="inputValue"
    :placeholder="props.placeholder ?? i18nTranslate('pleaseInput')"
    :clearable="props.clearable"
    :disabled="props.disabled"
    :value-key="props.valueKey"
    :debounce="props.debounce"
    :fetch-suggestions="props.fetchSuggestions"
    :trigger-on-focus="props.triggerOnFocus"
    :select-when-unmatched="props.selectWhenUnmatched"
    :name="props.name"
    :aria-label="props.ariaLabel"
    :hide-loading="props.hideLoading"
    :popper-class="props.popperClass"
    :teleported="props.teleported"
    :highlight-first-item="props.highlightFirstItem"
    :fit-input-width="props.fitInputWidth"
    @blur="onBlur"
    @focus="onFocus"
    @input="onInput"
    @clear="onClear"
    @select="onSelect"
    @change="onChange"
    @click.stop
  >
    <template v-if="hasSlot('default')" #default="scope">
      <slot name="default" v-bind="scope"></slot>
    </template>
    <!-- 圖示用 -->
    <template v-if="hasSlot('prefix')" #prefix>
      <slot name="prefix"></slot>
    </template>
    <template v-if="hasSlot('suffix')" #suffix>
      <slot name="suffix"></slot>
    </template>
    <!-- 輸入框用 -->
    <template v-if="hasSlot('prepend')" #prepend>
      <slot name="prepend"></slot>
    </template>
    <template v-if="hasSlot('append')" #append>
      <slot name="append"></slot>
    </template>
    <template v-if="hasSlot('loading')" #loading>
      <slot name="loading"></slot>
    </template>
  </ElAutocomplete>
</template>

<style lang="scss" scoped></style>
