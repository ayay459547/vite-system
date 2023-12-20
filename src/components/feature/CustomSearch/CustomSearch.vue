<script setup lang="ts">
import {
  CustomSwitch,
  // type InputType,
  // type Options,
  CustomInput,
  type PopoverPlacement,
  CustomPopover,
  CustomButton,
  CustomBadge
} from '@/components'

import {
  custom,
  elCommon,
  elInput,
  elSelect,
  elDatePicker,
  elTimePicker,
  elCheckbox,
  elRadio,
  elAutocomplete
} from '@/components/feature/CustomInput/props'

import { type PropType, computed, nextTick, useSlots } from 'vue'
import { isEmpty, getUuid, hasOwnProperty } from '@/lib/lib_utils'

import { useCustomSearchStore } from '@/stores/stores_CustomSearch'
import { storeToRefs } from 'pinia'

type ModelValue = any
const props = defineProps({
  modelValue: {
    type: [Array, String, Number, Boolean, null, undefined] as PropType<ModelValue>,
    default: false,
    description: '綁定值 v-model="..." '
  },
  active: {
    type: Boolean as PropType<boolean>,
    default: true,
    description: `是否啟用
      是: 拿到顯示的值
      否: 拿到 null `
  },
  width: {
    type: [String, Number] as PropType<string | number>,
    required: false,
    default: 300,
    description: '寬度'
  },
  placement: {
    type: String as PropType<PopoverPlacement>,
    required: false,
    default: 'top',
    description: '出現位置'
  },
  search: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否只顯示搜尋按鈕'
  },
  // 輸入框的 props
  ...custom,
  ...elCommon,
  ...elInput,
  ...elSelect,
  ...elDatePicker,
  ...elTimePicker,
  ...elCheckbox,
  ...elRadio,
  ...elAutocomplete
})

const emit = defineEmits([
  'update:modelValue',
  'update:active',
  'change',
  'blur',
  'clear',
  'open',
  'close'
])

const inpuValue = computed({
  get () {
    return props.modelValue
  },
  set (value: ModelValue) {
    emit('update:modelValue', value)
  }
})
const onInputChange = (inpuValue: ModelValue) => {
  onVisibleClick(false)
  emit('change', inpuValue)
}

const isActive = computed({
  get () {
    return props.active
  },
  set (value: boolean) {
    onVisibleClick(false)
    emit('change', inpuValue.value)
    emit('update:active', value)
  }
})

const scopedId = `__search__${getUuid()}`

const customSearchStore = useCustomSearchStore()
const { activeScopedId } = storeToRefs(customSearchStore)

const resizeEvent = () => {
  onVisibleClick(false)
}
const openListenerSize = () => {
  window.addEventListener('resize', resizeEvent, { once: true })
}

const isVisible = computed({
  get () {
    const _isVisible = scopedId === activeScopedId.value
    if (_isVisible) {
      openListenerSize()
    } else {
      window.removeEventListener('resize', resizeEvent )
    }

    return _isVisible
  },
  set (v: boolean) {
    if (v) {
      customSearchStore.setActiveScopedId(scopedId)
    } else {
      customSearchStore.clearActiveScopedId()
    }
  }
})

const onVisibleClick = (_isVisible: boolean) => {
  if (_isVisible) {
    emit('open')
  } else {
    emit('close')
  }
  isVisible.value = _isVisible
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
    fetchSuggestions: props.fetchSuggestions
  }
})

// slot
const slots = useSlots()
const slotList = computed(() => {
  return [
    'prepend', 'append',
    'prefix', 'suffix',
    'header', 'footer', 'empty',
    'default', 'range-separator',
    'option'
  ].filter(slotName => {
    return hasOwnProperty.call(slots, slotName)
  })
})

defineExpose({
  async validate () {
    await nextTick()
    return { valid: true }
  },
  getDom () {
    return document.querySelector(`.__search__${scopedId}`)
  }
})

</script>

<template>
  <div class="search" :class="`__search__${scopedId}`">
    <!-- 只顯示搜尋按鈕 -->
    <template v-if="props.search">
      <div class="search-title">
        <label>{{ props.label }}</label>

        <CustomPopover
          :visible="isVisible"
          :width="props.width"
          :placement="props.placement"
        >
          <div>
            <div class="search-title">
              <label>{{ props.label }}</label>
              <CustomSwitch v-model="isActive" />
            </div>

            <CustomInput
              v-model="inpuValue"
              v-bind="bindAttributes"
              @clear="emit('clear')"
              @blur="emit('blur')"
              @change="onInputChange"
            >
              <template
                v-for="slotName in slotList"
                :key="slotName"
                #[slotName]
              >
                <slot :name="slotName"></slot>
              </template>
            </CustomInput>
          </div>
          <template #reference>
            <div @click="onVisibleClick(!isVisible)">
              <CustomBadge v-if="isDot" is-dot>
                <CustomButton
                  icon-name="magnifying-glass"
                  circle
                  text
                />
              </CustomBadge>
              <CustomButton
                v-else
                icon-name="magnifying-glass"
                circle
                text
              />
            </div>
          </template>
        </CustomPopover>
      </div>
    </template>
    <!-- 直接全部顯示 -->
    <template v-else>
      <div class="search-title">
        <label>{{ props.label }}</label>
        <CustomSwitch v-model="isActive" />
      </div>

      <CustomInput
        v-model="inpuValue"
        v-bind="bindAttributes"
        @clear="emit('clear')"
        @blur="emit('blur')"
        @change="onInputChange"
      >
        <template
          v-for="slotName in slotList"
          :key="slotName"
          #[slotName]
        >
          <slot :name="slotName"></slot>
        </template>
      </CustomInput>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.search {
  width: 100%;
  min-width: fit-content;
  height: fit-content;

  &-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    padding: 0 2px;
  }
}
</style>
