<script setup lang="ts">
import { computed, useSlots, ref, inject } from 'vue'
import { ElAutocomplete } from 'element-plus'

import type { UseHook } from '@/declare/hook' // 全域功能類型
import { isEmpty, hasOwnProperty, getUuid } from '@/lib/lib_utils' // 工具
import { defaultModuleType } from '@/i18n/i18n_setting'

import type { Props, Emits, Expose } from './FormAutocompleteInfo'
import { version, props as formAutocompleteProps } from './FormAutocompleteInfo'

const scopedId = getUuid(version)

const props = defineProps(formAutocompleteProps)

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

const bindAttributes = computed(() => {
  const attributes: any = {
    clearable: props.clearable,
    disabled: props.disabled,
    valueKey: props.valueKey,
    fitInputWidth: props.fitInputWidth
  }
  if (!isEmpty(props.placeholder)) {
    attributes.placeholder = props.placeholder
  }

  return attributes
})

const emit = defineEmits([
  'update:modelValue',
  'select',
  'blur',
  'change'
])

const onEvent: {
  select: Emits.Select
  blur: Emits.Blur
  change: Emits.Change
} = {
  select: item => emit('select', item),
  blur: event => emit('blur', event),
  change: value => emit('change', value)
}

const validateRes = computed<string>(() => {
  if (isEmpty(props.errorMessage)) return 'success'
  return 'error'
})

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: Props.ModelValue) => {
    emit('update:modelValue', value)
    emit('change', value)
  }
})

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}

const elAutocompleteRef = ref()

const focus: Expose.Focus = () => {
  elAutocompleteRef.value?.focus()
}
const blur: Expose.Blur = () => {
  elAutocompleteRef.value?.blur()
}
defineExpose({ focus, blur })

</script>

<template>
  <div class="__i-autocomplete__" :class="scopedId">
    <ElAutocomplete
      ref="elAutocompleteRef"
      v-model="inputValue"
      class="__i-autocomplete__"
      :placeholder="i18nTranslate('pleaseInput')"
      :class="[`validate-${validateRes}`]"
      :validate-event="false"
      :fetch-suggestions="fetchSuggestions"
      v-bind="bindAttributes"
      v-on="onEvent"
      @click.stop
    >
      <template v-if="hasSlot('default')" #default="scope">
        <slot name="default" v-bind="scope"></slot>
      </template>
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
    </ElAutocomplete>
  </div>
</template>

<style lang="scss" scoped>
@use '../Form.scss' as *;

:deep(.__i-autocomplete__) {
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
    @include validate-error(autocomplete);
  }

  &.el-autocomplete {
    width: 100%;
  }
}

.__i-autocomplete__ {
  width: 100%;
  height: 100%;
}
</style>
