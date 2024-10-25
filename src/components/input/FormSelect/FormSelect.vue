<script setup lang="ts">
import { computed, useSlots, ref, inject } from 'vue'
import { ElSelect, ElOptionGroup, ElOption } from 'element-plus'

import type { UseHook } from '@/declare/hook' // 全域功能類型
import { isEmpty, hasOwnProperty, getUuid } from '@/lib/lib_utils' // 工具
import { defaultModuleType } from '@/i18n/i18n_setting'

import type { Props, Emits, Expose } from './FormSelectInfo'
import { version, props as formSelectProps } from './FormSelectInfo'

const scopedId = getUuid(version)

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

const props = defineProps(formSelectProps)

const bindAttributes = computed(() => {
  const attributes: any = {
    clearable: props.clearable,
    disabled: props.disabled,
    loading: props.loading,
    remote: props.remote,
    remoteMethod: props.remoteMethod,
    remoteShowSuffix: props.remoteShowSuffix,
    multiple: props.multiple,
    multipleLimit: props.multipleLimit,
    maxCollapseTags: props.maxCollapseTags,
    collapseTags: props.multiple,
    collapseTagsTooltip: props.multiple,
    filterable: props.filterable,
    reserveKeyword: props.reserveKeyword,
    allowCreate: props.allowCreate,
    defaultFirstOption: props.defaultFirstOption
  }
  if (!isEmpty(props.placeholder)) {
    attributes.placeholder = props.placeholder
  }

  return attributes
})

const emit = defineEmits([
  'update:modelValue',
  'focus',
  'blur',
  'clear',
  'change',
  'remove-tag',
  'visible-change'
])

const onEvent: {
  focus: Emits.Focus
  clear: Emits.Clear
  blur: Emits.Blur
  change: Emits.Change
  removeTag: Emits.RemoveTag
  visibleChange: Emits.VisibleChange
} = {
  focus: $event => emit('focus', $event),
  clear: (): void => emit('clear'),
  blur: $event => emit('blur', $event),
  change: value => {
    emit('change', value ?? '')
  },
  removeTag: tagValue => emit('remove-tag', tagValue),
  visibleChange: visible => emit('visible-change', visible)
}

const validateRes = computed<string>(() => {
  if (isEmpty(props.errorMessage)) return 'success'
  return 'error'
})

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: Props.ModelValue) => {
    emit('update:modelValue', value ?? '')
  }
})

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}

const elSelectRef = ref()

const focus: Expose.Focus = () => {
  elSelectRef.value?.focus()
}
const blur: Expose.Blur = () => {
  elSelectRef.value?.blur()
}
defineExpose({ focus, blur })

</script>

<template>
  <div class="__i-select__" :class="scopedId">
    <ElSelect
      ref="elSelectRef"
      v-model="inputValue"
      class="__i-select__"
      :placeholder="i18nTranslate('pleaseSelect', defaultModuleType)"
      :class="[`validate-${validateRes}`]"
      :validate-event="false"
      v-bind="bindAttributes"
      v-on="onEvent"
    >
      <slot>
        <template
          v-for="item in props.options"
          :key="`option-${item.value}-${scopedId}`"
        >
          <ElOptionGroup
            v-if="Array.isArray(item.options) && item.options.length > 0"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          >
            <ElOption
              v-for="subItem in item.options"
              :key="`sub-option-${subItem.value}-${scopedId}`"
              :label="subItem.label"
              :value="subItem.value"
              :data="subItem.data"
              :disabled="subItem.disabled"
            >
              <template v-if="hasSlot('options')">
                <slot
                  name="options"
                  :is-selected="inputValue === subItem.value"
                  :label="subItem.label"
                  :value="subItem.value"
                  :data="subItem.data"
                  v-bind="subItem"
                ></slot>
              </template>
              <div v-else class="sub-options">{{ subItem.label }}</div>
            </ElOption>
          </ElOptionGroup>

          <ElOption
            v-else
            :label="item.label"
            :value="item.value"
            :data="item.data"
            :disabled="item.disabled"
          >
            <template v-if="hasSlot('options')">
              <slot
                name="options"
                :is-selected="inputValue === item.value"
                :label="item.label"
                :value="item.value"
                :data="item.data"
                v-bind="item"
              ></slot>
            </template>
            <div v-else class="options">{{ item.label }}</div>
          </ElOption>
        </template>
      </slot>
      <template v-if="hasSlot('header')" #header>
        <slot name="header"></slot>
      </template>
      <template v-if="hasSlot('footer') || props.remote" #footer>
        <slot name="footer">
          <span class="search-more">{{ props.remote ? i18nTranslate('search-forMore', defaultModuleType) : '' }}</span>
        </slot>
      </template>
      <template v-if="hasSlot('prefix')" #prefix>
        <slot name="prefix"></slot>
      </template>
      <template v-if="hasSlot('empty')" #empty>
        <slot name="empty"></slot>
      </template>
      <template v-if="hasSlot('label')" #label="{ label, value }">
        <slot name="label" :label="label" :value="value"></slot>
      </template>
      <template v-if="hasSlot('tag')" #tag>
        <slot name="tag"></slot>
      </template>
      <template v-if="hasSlot('loading')" #loading>
        <slot name="loading"></slot>
      </template>
    </ElSelect>
  </div>
</template>

<style lang="scss" scoped>
@use '../Form.scss' as *;

:deep(.__i-select__) {
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
  &.validate-error .is-filterable,
  &.validate-error .el-select__wrapper,
  &.validate-error .el-input__wrapper {
    @include validate-error(select);
  }
}
.__i-select__ {
  width: 100%;
  height: 100%;
}

.search-more {
  color: inherit;
  opacity: 0.5;
}
.options,
.sub-options {
  font-size: 1em;
}
</style>

<style lang="scss">
.el-select__popper {
  z-index: var(--i-z-index-select-option) !important;

  .el-select-dropdown__item {
    padding: 0 32px 0 20px;
  }
}
</style>
