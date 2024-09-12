<script setup lang="ts">
import { computed, useSlots, ref, inject } from 'vue'
import { ElTreeSelect } from 'element-plus'

import type { UseHook } from '@/declare/hook'
import { isEmpty, hasOwnProperty, getUuid } from '@/lib/lib_utils'
import { defaultModuleType } from '@/i18n/i18n_setting'

import type { Props, Emits, Expose } from './FormSelectTreeInfo'
import { version, props as formSelectTreeProps } from './FormSelectTreeInfo'

const scopedId = getUuid(version)

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

const props = defineProps(formSelectTreeProps)

// tree
const bindTreeAttributes = {
  props: {
    children: 'options',
    // label: 'value'
    label: 'label'
  },
  renderAfterExpand: true
}

const bindAttributes = computed(() => {
  const attributes: any = {
    ...bindTreeAttributes,
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

const elSelectTreeRef = ref()

const focus: Expose.Focus = () => {
  elSelectTreeRef.value?.focus()
}
const blur: Expose.Blur = () => {
  elSelectTreeRef.value?.blur()
}
defineExpose({ focus, blur })

</script>

<template>
  <div class="__i-select-tree__" :class="[`validate-${validateRes}`, scopedId]">
    <ElTreeSelect
      ref="elSelectTreeRef"
      v-model="inputValue"
      class="__i-select-tree__"
      :placeholder="i18nTranslate('pleaseSelect', defaultModuleType)"
      :validate-event="false"
      v-bind="bindAttributes"
      v-on="onEvent"
      :data="props.options"
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

      <template #default="{ node, data }">
        <div class="options">
          <slot name="options" :node="node" :data="data" :bind="data">
            <span>{{ data?.label ?? data?.value }}</span>
          </slot>
        </div>
      </template>
    </ElTreeSelect>
  </div>
</template>

<style lang="scss" scoped>
@use '../Form.scss' as *;

.validate-error:deep(.__i-select-tree__) {
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

  .is-filterable,
  .el-select__wrapper,
  .el-input__wrapper {
    @include validate-error(select-tree);
  }
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
}
</style>
