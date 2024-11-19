<script setup lang="ts">
import { computed, useSlots, ref, inject } from 'vue'
import { ElSelect, ElOptionGroup, ElOption } from 'element-plus'

import type { UseHook } from '@/declare/hook' // 全域功能類型
import { hasOwnProperty, getUuid } from '@/lib/lib_utils' // 工具
import { defaultModuleType } from '@/i18n/i18n_setting'

import type { Props, Emits, Expose } from './FormSelectInfo'
import { version, props as formSelectProps } from './FormSelectInfo'

const scopedId = getUuid(version)

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

const props = defineProps(formSelectProps)

const emit = defineEmits([
  'update:model-value',
  'focus',
  'blur',
  'clear',
  'change',
  'remove-tag',
  'visible-change'
])

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: Props.ModelValue) => {
    emit('update:model-value', value)
  }
})

// event
const onChange: Emits.Change = value => emit('change', value)
const onVisibleChange: Emits.VisibleChange = visible => emit('visible-change', visible)
const onRemoveTag: Emits.RemoveTag = tagValue => emit('remove-tag', tagValue)
const onClear: Emits.Clear = () => emit('clear')
const onBlur: Emits.Blur = event => emit('blur', event)
const onFocus: Emits.Focus = event => emit('focus', event)

// expose
const elSelectRef = ref()
const focus: Expose.Focus = () => {
  elSelectRef.value?.focus()
}
const blur: Expose.Blur = () => {
  elSelectRef.value?.blur()
}
defineExpose({ focus, blur })

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}
</script>

<template>
  <ElSelect
    ref="elSelectRef"
    :class="scopedId"
    v-model="inputValue"
    :multiple="props.multiple"
    :disabled="props.disabled"
    :value-key="props.valueKey"
    :size="props.size"
    :clearable="props.clearable"
    :collapse-tags="props.collapseTags"
    :collapse-tags-tooltip="props.collapseTagsTooltip"
    :multiple-limit="props.multipleLimit"
    :name="props.name"
    :effect="props.effect"
    :autocomplete="props.autocomplete"
    :placeholder="props.placeholder ?? i18nTranslate('pleaseSelect', defaultModuleType)"
    :filterable="props.filterable"
    :allow-create="props.allowCreate"
    :filter-method="props.filterMethod"
    :remote="props.remote"
    :remote-method="props.remoteMethod"
    :remote-show-suffix="props.remoteShowSuffix"
    :loading="props.loading"
    :loading-text="props.loadingText"
    :no-match-text="props.noMatchText"
    :no-data-text="props.noDataText"
    :popper-class="props.popperClass"
    :reserve-keyword="props.reserveKeyword"
    :default-first-option="props.defaultFirstOption"
    :teleported="props.teleported"
    :append-to="props.appendTo"
    :persistent="props.persistent"
    :automatic-dropdown="props.automaticDropdown"
    :clear-icon="props.clearIcon"
    :fit-input-width="props.fitInputWidth"
    :suffix-icon="props.suffixIcon"
    :tag-type="props.tagType"
    :tag-effect="props.tagEffect"
    :validate-event="props.validateEvent"
    :placement="props.placement"
    :fallback-placements="props.fallbackPlacements"
    :max-collapse-tags="props.maxCollapseTags"
    :popper-options="props.popperOptions"
    :aria-label="props.ariaLabel"
    :empty-values="props.emptyValues"
    :value-on-clear="props.valueOnClear"
    @change="onChange"
    @visible-change="onVisibleChange"
    @remove-tag="onRemoveTag"
    @clear="onClear"
    @blur="onBlur"
    @focus="onFocus"
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
            <slot
              name="options"
              :is-selected="inputValue === subItem.value"
              :label="subItem.label"
              :value="subItem.value"
              :data="subItem.data"
              v-bind="subItem"
            >
              <div class="sub-options">{{ subItem.label }}</div>
            </slot>
          </ElOption>
        </ElOptionGroup>

        <ElOption
          v-else
          :label="item.label"
          :value="item.value"
          :data="item.data"
          :disabled="item.disabled"
        >
          <slot
            name="options"
            :is-selected="inputValue === item.value"
            :label="item.label"
            :value="item.value"
            :data="item.data"
            v-bind="item"
          >
            <div class="options">{{ item.label }}</div>
          </slot>
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
</template>

<style lang="scss" scoped>
.search-more {
  color: inherit;
  opacity: 0.5;
}
</style>
