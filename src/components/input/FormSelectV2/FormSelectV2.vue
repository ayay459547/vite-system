<script setup lang="ts">
import { computed, useSlots, ref, inject } from 'vue'
import { ElSelectV2 } from 'element-plus'

import type { UseHook } from '@/declare/hook' // 全域功能類型
import { isEmpty, hasOwnProperty, getUuid } from '@/lib/lib_utils' // 工具
import { defaultModuleType } from '@/i18n/i18n_setting'

import type { Props, Emits } from './FormSelectV2Info'
import { version, props as formSelectV2Props } from './FormSelectV2Info'

const scopedId = getUuid(version)

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

const propsValue = {
  value: 'value',
  label: 'label',
  options: 'options',
  disabled: 'disabled'
}

const props = defineProps(formSelectV2Props)

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
    defaultFirstOption: props.defaultFirstOption,
    valuekey: props.valuekey,

    // 固定
    props: propsValue
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

const elSelectV2Ref = ref()
defineExpose({
  focus: (): void => {
    if (elSelectV2Ref.value) {
      elSelectV2Ref.value.focus()
    }
  },
  blur: (): void => {
    if (elSelectV2Ref.value) {
      elSelectV2Ref.value.blur()
    }
  }
})
</script>

<template>
  <div class="__i-select-v2__" :class="scopedId">
    <ElSelectV2
      ref="elSelectV2Ref"
      v-model="inputValue"
      class="__i-select-v2__"
      :placeholder="i18nTranslate('pleaseSelect', defaultModuleType)"
      :class="[`validate-${validateRes}`]"
      :validate-event="false"
      v-bind="bindAttributes"
      v-on="onEvent"
      :options="options"
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
      <template v-if="hasSlot('prefix')" #prefix>
        <slot name="prefix"></slot>
      </template>
      <template v-if="hasSlot('empty')" #empty>
        <slot name="empty"></slot>
      </template>
      <template v-if="hasSlot('tag')" #tag>
        <slot name="tag"></slot>
      </template>
      <template v-if="hasSlot('loading')" #loading>
        <slot name="loading"></slot>
      </template>
    </ElSelectV2>
  </div>
</template>

<style lang="scss" scoped>
@use '../Form.scss' as *;

:deep(.__i-select-v2__) {
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
    @include validate-error(select-v2);
  }
}
.__i-select-v2__ {
  width: 100%;
  height: 100%;
}

.search-more {
  color: inherit;
  opacity: 0.5;
}
</style>
