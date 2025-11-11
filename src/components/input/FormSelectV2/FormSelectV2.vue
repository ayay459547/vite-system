<script setup lang="ts">
import { computed, useSlots, ref, inject } from 'vue'
import { ElSelectV2 } from 'element-plus'

import type { UseHook } from '@/types/types_hook' // 全域功能類型
import { hasOwnProperty, getUuid } from '@/lib/lib_utils' // 工具
import { defaultModuleType } from '@/declare/declare_i18n'

import type { Props, Emits, Expose } from './FormSelectV2Info'
import { version, props as formSelectV2Props } from './FormSelectV2Info'

const scopedId = getUuid(version)

const useHook = inject('useHook') as UseHook
const { i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

const props = defineProps(formSelectV2Props)

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
  set: (value: Props['modelValue']) => emit('update:model-value', value)
})

// event
const onChange: Emits['change'] = val => emit('change', val)
const onVisibleChange: Emits['visibleChange'] = visible => emit('visible-change', visible)
const onRemoveTag: Emits['removeTag'] = tagValue => emit('remove-tag', tagValue)
const onClear: Emits['clear'] = () => emit('clear')
const onBlur: Emits['blur'] = event => emit('blur', event)
const onFocus: Emits['focus'] = event => emit('focus', event)

// expose
const ElSelectV2Ref = ref<InstanceType<typeof ElSelectV2>>()
const focus: Expose['focus'] = () => ElSelectV2Ref.value?.focus()
const blur: Expose['blur'] = () => ElSelectV2Ref.value?.blur()
defineExpose({ focus, blur })

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}
</script>

<template>
  <ElSelectV2
    ref="ElSelectV2Ref"
    :class="scopedId"
    v-model="inputValue"
    :options="props.options"
    :props="props.props"
    :multiple="props.multiple"
    :disabled="props.disabled"
    :value-key="props.valueKey"
    :size="props.size"
    :clearable="props.clearable"
    :clear-icon="props.clearIcon"
    :collapse-tags="props.collapseTags"
    :multiple-limit="props.multipleLimit"
    :name="props.name"
    :effect="props.effect"
    :autocomplete="props.autocomplete"
    :placeholder="props.placeholder"
    :filterable="props.filterable"
    :allow-create="props.allowCreate"
    :filter-method="props.filterMethod"
    :loading="props.loading"
    :loading-text="props.loadingText"
    :reserve-keyword="props.reserveKeyword"
    :no-match-text="props.noMatchText"
    :no-data-text="props.noDataText"
    :popper-class="props.popperClass"
    :teleported="props.teleported"
    :append-to="props.appendTo"
    :persistent="props.persistent"
    :popper-options="props.popperOptions"
    :automatic-dropdown="props.automaticDropdown"
    :height="props.height"
    :item-height="props.itemHeight"
    :scrollbar-always-on="props.scrollbarAlwaysOn"
    :remote="props.remote"
    :remote-method="props.remoteMethod"
    :validate-event="props.validateEvent"
    :offset="props.offset"
    :show-arrow="props.showArrow"
    :placement="props.placement"
    :fallback-placements="props.fallbackPlacements"
    :collapse-tags-tooltip="props.collapseTagsTooltip"
    :max-collapse-tags="props.maxCollapseTags"
    :tag-type="props.tagType"
    :tag-effect="props.tagEffect"
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
    <template #default="{ item }">
      <slot
        name="options"
        :is-selected="inputValue === item.value"
        :label="item.label"
        :value="item.value"
        :data="item.data"
        v-bind="item"
      >
        <span>{{ item.label }}</span>
      </slot>
    </template>
    <template v-if="hasSlot('header')" #header>
      <slot name="header"></slot>
    </template>
    <template v-if="hasSlot('footer') || props.remote" #footer>
      <slot name="footer">
        <span class="search-more">{{ props.remote ? i18nTranslate('search-forMore', defaultModuleType) : '' }}</span>
      </slot>
    </template>
    <template v-if="hasSlot('empty')" #empty>
      <slot name="empty"></slot>
    </template>
    <template v-if="hasSlot('prefix')" #prefix>
      <slot name="prefix"></slot>
    </template>
    <template v-if="hasSlot('tag')" #tag>
      <slot name="tag"></slot>
    </template>
    <template v-if="hasSlot('loading')" #loading>
      <slot name="loading"></slot>
    </template>
    <template v-if="hasSlot('label')" #label="{ label, value }">
      <slot name="label" :label="label" :value="value"></slot>
    </template>
  </ElSelectV2>
</template>

<style lang="scss" scoped>
div[class*="FormSelectV2"] {
  width: 100%;
  height: fit-content;
}
.search-more {
  color: inherit;
  opacity: 0.5;
}
</style>
