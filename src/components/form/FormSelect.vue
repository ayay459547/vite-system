<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, useSlots, ref, inject } from 'vue'
import { ElSelect, ElOption } from 'element-plus'

import type { UseHook } from '@/declare/hook'
import { isEmpty, hasOwnProperty, getUuid } from '@/lib/lib_utils'
import { defaultModuleType } from '@/i18n/i18n_setting'

export type ModelValue = string | number | boolean | null | Record<string, any> | Array<any>

export type Option = {
  label: string
  value: string | number | boolean | null
  data?: any
  disabled?: boolean
}

export type Options = Array<Option>

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Array, Object, null] as PropType<ModelValue>,
    required: true
  },
  errorMessage: {
    type: String as PropType<string>,
    default: ''
  },
  options: {
    type: Array as PropType<Options>,
    default() {
      return []
    }
  },
  // 區別一般 select 與 group select 尚未製作
  type: {
    type: String as PropType<string>,
    default: 'text'
  },
  // element ui plus
  clearable: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  loading: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  remote: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  remoteMethod: {
    type: Function as PropType<Function>,
    required: false
  },
  remoteShowSuffix: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  multiple: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  multipleLimit: {
    type: Number as PropType<number>,
    default: 0
  },
  maxCollapseTags: {
    type: Number as PropType<number>,
    default: 1
  },
  filterable: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  allowCreate: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  defaultFirstOption: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  placeholder: {
    type: String as PropType<string>,
    required: false
  },
  // tsx event
  'onUpdate:modelValue': Function as PropType<(e: any) => void>,
  onFocus: Function as PropType<(e: FocusEvent) => void>,
  onClear: Function as PropType<() => void>,
  onBlur: Function as PropType<(e: FocusEvent) => void>,
  onChange: Function as PropType<(value: string | number) => void>,
  'onRemove-tag': Function as PropType<(tagValue: any) => void>,
  'onVisible-change': Function as PropType<(visible: boolean) => void>
})

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

const onEvent = {
  focus: (e: FocusEvent): void => emit('focus', e),
  clear: (): void => emit('clear'),
  blur: (e: FocusEvent): void => emit('blur', e),
  change: (value: string | number): void => {
    emit('change', value ?? '')
  },
  removeTag: (tagValue: any): void => emit('remove-tag', tagValue),
  visibleChange: (visible: boolean): void => emit('visible-change', visible)
}

const validateRes = computed<string>(() => {
  if (isEmpty(props.errorMessage)) return 'success'
  return 'error'
})

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: ModelValue) => {
    emit('update:modelValue', value ?? '')
  }
})

const scopedId = getUuid('__i-select__')

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}

const elSelectRef = ref()
defineExpose({
  focus: (): void => {
    if (elSelectRef.value) {
      elSelectRef.value.focus()
    }
  },
  blur: (): void => {
    if (elSelectRef.value) {
      elSelectRef.value.blur()
    }
  }
})
</script>

<template>
  <div class="__i-select__" :class="scopedId">
    <ElSelect
      ref="elSelectRef"
      v-model="inputValue"
      class="__i-select__"
      :placeholder="i18nTranslate('pleaseSelect')"
      :class="[`validate-${validateRes}`]"
      :validate-event="false"
      v-bind="bindAttributes"
      v-on="onEvent"
    >
      <slot>
        <ElOption
          v-for="item in props.options"
          :key="`__${item.value}__`"
          :label="item.label"
          :value="item.value"
          :disabled="item.disabled"
        ></ElOption>
      </slot>
      <template v-if="hasSlot('header')" #header>
        <slot name="header"></slot>
      </template>
      <template v-if="hasSlot('footer') || props.remote" #footer>
        <slot name="footer">
          <span class="search-more">{{ props.remote ? '搜尋顯示更多' : '' }}</span>
        </slot>
      </template>
      <template v-if="hasSlot('prefix')" #prefix>
        <slot name="prefix"></slot>
      </template>
      <template v-if="hasSlot('empty')" #empty>
        <slot name="empty"></slot>
      </template>
    </ElSelect>
  </div>
</template>

<style lang="scss" scoped>
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
    box-shadow: 0 0 0 1px $danger inset;
    background-color: lighten($danger, 20%);
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
</style>

<style lang="scss">
.el-select__popper {
  z-index: var(--i-z-index-select-option) !important;
}
</style>
