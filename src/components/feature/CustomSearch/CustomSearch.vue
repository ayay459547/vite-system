<script setup lang="ts">
import { computed, ref, nextTick, useSlots, inject } from 'vue'
import { storeToRefs } from 'pinia'

import type { UseHook } from '@/declare/hook'
import { useCustomSearchStore } from '@/stores/stores_CustomSearch'
import { CustomPopover, CustomSwitch, CustomInput, CustomButton, CustomBadge } from '@/components'
import { isEmpty, getUuid, hasOwnProperty } from '@/lib/lib_utils'

import type { ModelValue } from './CustomSearchInfo'
import { version, props as searchProps } from './CustomSearchInfo'

const scopedId = getUuid('__i-search__')

const props = defineProps(searchProps)

const emit = defineEmits([
  'update:modelValue',
  'update:active',
  'open',
  'close',
  'focus',
  'clear',
  'blur',
  'change',
  'input',
  'remove-tag',
  'visible-change',
  'select'
])

const useHook: UseHook = inject('useHook')
const { i18nTranslate, i18nTest } = useHook({
  i18nModule: props.i18nModule
})

const inpuValue = computed({
  get() {
    return props.modelValue
  },
  set(value: ModelValue) {
    emit('update:modelValue', value)
  }
})
// const onInputChange = (inpuValue: ModelValue) => {
//   onVisibleClick(false)
//   emit('change', inpuValue)
// }

const isActive = computed({
  get() {
    return props.active
  },
  set(value: boolean) {
    onVisibleClick(false)
    emit('change', inpuValue.value)
    emit('update:active', value)
  }
})

const customSearchStore = useCustomSearchStore()
const { activeScopedIdSet } = storeToRefs(customSearchStore)

const resizeEvent = () => {
  onVisibleClick(false)
}
const openListenerSize = () => {
  window.addEventListener('resize', resizeEvent, { once: true })
}

const iconSearchRef = ref()
const searchRef = ref()

const isVisible = computed({
  get() {
    const _isVisible = activeScopedIdSet.value.has(scopedId)
    if (_isVisible) {
      openListenerSize()
    } else {
      window.removeEventListener('resize', resizeEvent)
    }

    return _isVisible
  },
  async set(v: boolean) {
    if (v) {
      customSearchStore.setActiveScopedId(scopedId)

      await nextTick()
      if (props.search) {
        iconSearchRef?.value.focus()
      } else {
        searchRef?.value.focus()
      }
    } else {
      customSearchStore.removeActiveScopedId(scopedId)
    }
  }
})

const onVisibleClick = async (_isVisible: boolean) => {
  await nextTick()
  setTimeout(() => {
    emit(_isVisible ? 'open' : 'close')
    isVisible.value = _isVisible
  }, 0)
}

const isDot = computed(() => {
  if (!isActive.value || isEmpty(inpuValue.value)) return false

  switch (props.type) {
    case 'text':
    case 'textarea':
    case 'password':
    case 'autocomplete':
    case 'select':
    case 'year':
    case 'month':
    case 'date':
    case 'dates':
    case 'datetime':
    case 'week':
    case 'datetimerange':
    case 'daterange':
    case 'monthrange':
    case 'time':
    case 'timerange':
    case 'checkbox':
    case 'radio':
      return !isEmpty(inpuValue.value)
    case 'operator': {
      return (
        Array.isArray(inpuValue.value) &&
        !isEmpty(inpuValue.value[0]) &&
        !isEmpty(inpuValue.value[1])
      )
    }
    default:
      return false
  }
})

const bindAttributes = computed(() => {
  return {
    // 專案客製化屬性
    type: props.type,
    options: props.options,
    onlyNumber: props.onlyNumber,
    round: props.round,
    max: props.max,
    min: props.min,
    isValidate: props.isValidate,
    validateKey: props.validateKey,
    hiddenErrorMessage: props.hiddenErrorMessage,
    required: props.required,
    validate: props.validate,
    text: props.text,

    label: '',
    hiddenLabel: true,
    // element ui plus 相關屬性直接綁定
    clearable: props.clearable,
    disabled: props.disabled,
    rows: props.rows,
    showPassword: props.showPassword,
    loading: props.loading,
    placeholder: props.placeholder,
    // select
    remote: props.remote,
    remoteMethod: props.remoteMethod,
    multiple: props.multiple,
    multipleLimit: props.multipleLimit,
    maxCollapseTags: props.maxCollapseTags,
    collapseTags: props.multiple,
    collapseTagsTooltip: props.multiple,
    filterable: props.filterable,
    allowCreate: props.allowCreate,
    defaultFirstOption: props.defaultFirstOption,
    // datePicker
    format: props.format,
    valueFormat: props.valueFormat,
    shortcuts: props.shortcuts,
    // timePicker
    isRange: props.isRange,
    rangeSeparator: props.rangeSeparator,
    // autocomplete
    valueKey: props.valueKey,
    fitInputWidth: props.fitInputWidth,
    fetchSuggestions: props.fetchSuggestions,
    // i18nTranslate
    i18nModule: props.i18nModule
  }
})

const onEvent = {
  focus: (e: FocusEvent): void => {
    emit('focus', e)
  },
  clear: (): void => emit('clear'),
  blur: (e: FocusEvent): void => {
    emit('blur', e)
    onVisibleClick(false)
  },
  change: (value: string | number): void => emit('change', value),
  input: (value: string | number): void => emit('input', value),
  'remove-tag': (value: string | number): void => emit('remove-tag', value),
  'visible-change': (visible: boolean): void => emit('visible-change', visible),
  select: (value: string | number): void => emit('select', value)
}

// slot
const slots = useSlots()
const slotList = computed(() => {
  return [
    'prepend',
    'append',
    'prefix',
    'suffix',
    'header',
    'footer',
    'empty',
    'default',
    'range-separator',
    'option'
  ].filter(slotName => {
    return hasOwnProperty(slots, slotName)
  })
})

defineExpose({
  async validate() {
    await nextTick()
    return { valid: true }
  },
  getDom() {
    return document.querySelector(`.${scopedId}`)
  }
})

const translateLabel = computed(() => {
  return i18nTest(props?.i18nLabel) ? i18nTranslate(props.i18nLabel) : props.label
})
</script>

<template>
  <div :class="`CustomSearch_${version} ${scopedId}`" class="__search-wrapper">
    <!-- 只顯示搜尋按鈕 -->
    <template v-if="props.search">
      <div class="__search-title">
        <slot name="label">
          <label v-if="!isEmpty(translateLabel)">{{ translateLabel }}</label>
        </slot>

        <CustomPopover :visible="isVisible" :width="props.width" :placement="props.placement">
          <div>
            <div class="__search-title">
              <slot name="search-label">
                <label v-if="!isEmpty(translateLabel)">{{ translateLabel }}</label>
              </slot>
              <CustomSwitch v-model="isActive" />
            </div>

            <CustomInput
              ref="iconSearchRef"
              v-model="inpuValue"
              v-bind="bindAttributes"
              v-on="onEvent"
            >
              <template v-for="slotName in slotList" :key="slotName" #[slotName]>
                <slot :name="slotName"></slot>
              </template>
            </CustomInput>
          </div>
          <template #reference>
            <div @click="onVisibleClick(!isVisible)">
              <CustomBadge v-if="isDot" is-dot>
                <CustomButton icon-name="magnifying-glass" circle text />
              </CustomBadge>
              <CustomButton v-else icon-name="magnifying-glass" circle text />
            </div>
          </template>
        </CustomPopover>
      </div>
    </template>
    <!-- 直接全部顯示 -->
    <template v-else>
      <div class="__search-title">
        <slot name="search-label">
          <label v-if="!isEmpty(translateLabel)">{{ translateLabel }}</label>
        </slot>
        <CustomSwitch v-model="isActive" />
      </div>

      <CustomInput ref="searchRef" v-model="inpuValue" v-bind="bindAttributes" v-on="onEvent">
        <template v-for="slotName in slotList" :key="slotName" #[slotName]>
          <slot :name="slotName"></slot>
        </template>
      </CustomInput>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.__search {
  &-wrapper {
    width: 100%;
    min-width: fit-content;
    height: fit-content;
  }

  &-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    // padding: 0 2px;
  }
}
</style>
