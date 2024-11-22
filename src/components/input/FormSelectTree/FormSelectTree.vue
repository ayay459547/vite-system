<script setup lang="ts">
import { computed, useSlots, ref, inject } from 'vue'
import { ElTreeSelect } from 'element-plus'

import type { UseHook } from '@/declare/hook' // 全域功能類型
import { hasOwnProperty, getUuid } from '@/lib/lib_utils' // 工具
import { defaultModuleType } from '@/i18n/i18n_setting'

import type { Props, Emits, Expose } from './FormSelectTreeInfo'
import { version, props as formSelectTreeProps } from './FormSelectTreeInfo'

const scopedId = getUuid(version)

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

const props = defineProps(formSelectTreeProps)

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
  change: value => emit('change', value),
  removeTag: tagValue => emit('remove-tag', tagValue),
  visibleChange: visible => emit('visible-change', visible)
}

// expose
const elSelectTreeRef = ref()
const focus: Expose.Focus = () => {
  elSelectTreeRef.value?.focus()
}
const blur: Expose.Blur = () => {
  elSelectTreeRef.value?.blur()
}
defineExpose({ focus, blur })

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}
</script>

<template>
  <div>
    <ElTreeSelect
      ref="elSelectTreeRef"
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
      v-on="onEvent"
      :data="props.options"
      :props="{
        children: 'options',
        // label: 'value'
        label: 'label'
      }"
      :render-after-expand="true"
    >
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

      <template #default="{ node, data: item }">
        <div class="options">
          <slot
            name="options"
            :is-selected="inputValue === item.value"
            :label="item.label"
            :value="item.value"
            :data="item.data"
            v-bind="item"
            :node="node"
          >
            <span>{{ item?.label ?? item?.value }}</span>
          </slot>
        </div>
      </template>
    </ElTreeSelect>
  </div>
</template>

<style lang="scss" scoped></style>
