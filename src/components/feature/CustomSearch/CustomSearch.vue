<script setup lang="ts">
import { computed, ref, nextTick, useSlots, inject, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import type { UseHook } from '@/declare/hook.ts'
import { defaultModuleType } from '@/i18n/i18n_setting'
import { useFormListSetting } from '@/lib/lib_columns'
import { useCustomSearchStore } from '@/stores/stores_CustomSearch'
import { CustomPopover, CustomSwitch, CustomInput, CustomButton, CustomBadge, CustomTooltip, FormCheckbox, FormList } from '@/components'
import { isEmpty, getUuid, hasOwnProperty, getProxyData } from '@/lib/lib_utils'
import { conditionOptions } from '@/variable'

import type { Props } from './CustomSearchInfo'
import { version, props as searchProps } from './CustomSearchInfo'

const scopedId = getUuid('__i-search__')

const props = defineProps(searchProps)

const emit = defineEmits([
  'update:modelValue',
  'update:active',
  'update:activeConditions',
  'update:conditions',
  'open',
  'close',
  'focus',
  'clear',
  'blur',
  'change',
  'input',
  'remove-tag',
  'visible-change',
  'select',
  'submit'
])

const useHook: UseHook = inject('useHook')
const { i18nTranslate, i18nTest } = useHook({
  i18nModule: props.i18nModule
})

const inpuValue = computed({
  get() {
    return props.modelValue
  },
  set(value: Props.ModelValue) {
    emit('update:modelValue', value)
  }
})
// const onInputChange = (inpuValue: Props.ModelValue) => {
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

// 條件搜尋
const isActiveConditions = computed({
  get () {
    return props.activeConditions
  },
  set (value: boolean) {
    if (value) {
      onVisibleClick(true)
    } else {
      emit('change', inpuValue.value)
    }
    emit('update:activeConditions', value)
  }
})

const columnSetting = {
  conditionType: {
    label: '篩選類型',
    table: {
      width: 150
    },
    filter: {
      type: 'select',
      options: conditionOptions,
      default: '',
      validate: [],
      required: true,
      hiddenErrorMessage: true,
      hiddenLabel: true
    }
  },
  filterValue: {
    label: '篩選值',
    table: {
      minWidth: 180
    },
    filter: {
      default: '',
      validate: [],
      required: true,
      hiddenErrorMessage: true,
      hiddenLabel: true
    }
  }
}

const noValueList = ['isBlank', 'notBlank', 'isNull', 'notNull']

interface Form {
  columnType?: string
  conditionType?: string
  filterValue?: string
}

const {
  // defaultValue,
  columns: formColumn,
  forms: formList,
  validate: validateForm,
  add,
  remove
} = useFormListSetting<Form>(columnSetting, 'filter', [])

const reset = () => {
  formList.value.splice(0)
  add()
}

const addItem = () => {
  validateForm().then(() => {
    add()
  })
}

onMounted(() => {
  add()
})

const conditionList = computed(() => {
  return formList.value.reduce((res, formItem) => {
    const { conditionType, filterValue } = formItem
    const isNoValue = noValueList.includes(conditionType)

    if (
      !isEmpty(conditionType) &&
      (!isNoValue ? !isEmpty(filterValue) : true)
    ) {
      res.push({
        columnId: props.columnId,
        condition: conditionType,
        value: isNoValue ? '' : filterValue
      })
    }
    return res
  }, [])
})
const submit = () => {
  if (isActiveConditions.value) {
    validateForm().then(() => {
      emit('update:conditions', getProxyData(conditionList.value))
      emit('submit')
      onVisibleClick(!isVisible.value)
    })
  }
}

// 是否有filter生效
const isDot = computed(() => {
  if (!isActive.value) return false

  let isInputEmpty = false

  switch (props.type) {
    case 'text':
    case 'textarea':
    case 'password':
    case 'autocomplete':
    case 'select':
    case 'select-v2':
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
      isInputEmpty = isEmpty(inpuValue.value)
      break
    case 'operator':
      isInputEmpty = !(
        Array.isArray(inpuValue.value) &&
        !isEmpty(inpuValue.value[0]) &&
        !isEmpty(inpuValue.value[1])
      )
      break
    default:
      isInputEmpty = true
      break
  }

  return !isInputEmpty || (
    isActiveConditions.value && props.conditions.length > 0
  )
})

// 事件
const onEvent = {
  focus: (e: FocusEvent): void => {
    emit('focus', e)
  },
  clear: (): void => emit('clear'),
  blur: (e: FocusEvent): void => {
    emit('blur', e)

    if (!isActiveConditions.value) {
      onVisibleClick(false)
    }
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

const popverWidth = computed(() => {
  if (!props.isCondition) return 300
  return isActiveConditions.value ? 500 : 350
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

        <CustomPopover
          :visible="isVisible"
          :width="popverWidth"
          placement="bottom"
        >
          <div class="__search-detail">
            <div class="__search-title">
              <slot name="search-label">
                <label v-if="!isEmpty(translateLabel)">{{ translateLabel }}</label>
              </slot>
              <CustomSwitch v-model="isActive" />
            </div>

            <div class="__search-input">
              <CustomInput
                ref="iconSearchRef"
                v-model="inpuValue"
                v-bind="bindAttributes"
                v-on="onEvent"
                :disabled="!isActive"
              >
                <template v-for="slotName in slotList" :key="slotName" #[slotName]>
                  <slot :name="slotName"></slot>
                </template>
              </CustomInput>

              <div style="width: fit-content;">
                <CustomTooltip placement="right">
                  <template #content>
                    <div>{{ i18nTranslate('進階設定', defaultModuleType) }}</div>
                  </template>
                  <FormCheckbox
                    v-show="props.isCondition"
                    v-model="isActiveConditions"
                    :disabled="!isActive"
                  />
                </CustomTooltip>
              </div>
            </div>

            <template v-if="isActiveConditions && props.isCondition && isActive">
              <div class="i-py-xs">
                <FormList
                  v-model="formList"
                  :label="'進階設定'"
                  :table-data="formList"
                  :column-setting="columnSetting"
                  item-key="key"
                  is-create
                  is-remove
                  :min="1"
                  @add="addItem"
                  @remove="remove"
                >
                  <template #header-all="{ column }">
                    <div class="text-danger i-pr-xs">*</div>
                    <div>{{ column.label }}</div>
                  </template>
                  <template #column-conditionType="{ rowIndex }">
                    <CustomInput
                      v-model="formList[rowIndex].conditionType"
                      v-bind="formColumn.conditionType"
                    ></CustomInput>
                  </template>
                  <template #column-filterValue="{ rowIndex }">
                    <CustomInput
                      v-if="!noValueList.includes(formList[rowIndex].conditionType)"
                      v-model="formList[rowIndex].filterValue"
                      v-bind="formColumn.filterValue"
                    ></CustomInput>
                    <div v-else></div>
                  </template>
                </FormList>
              </div>

              <div class="__search-footer">
                <CustomButton
                  :label="i18nTranslate('reset', defaultModuleType)"
                  type="info"
                  plain
                  icon-name="repeat"
                  @click="reset"
                />

                <CustomButton
                  type="primary"
                  plain
                  :label="i18nTranslate('confirm', defaultModuleType)"
                  icon-name="check"
                  icon-move="scale"
                  @click="submit"
                />
              </div>
            </template>
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

    <Teleport to="body">
      <div
        v-if="isVisible && props.isCondition"
        class="__search-close"
        @click="onVisibleClick(false)"
      ></div>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
.__search {
  &-wrapper {
    width: 100%;
    min-width: fit-content;
    height: fit-content;
  }

  &-title,
  &-input {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    // padding: 0 2px;
  }

  &-detail,
  &-btn {
    z-index: var(--i-z-index-search-detail);
  }
  &-detail {
    height: fit-content;
    max-height: 50vh;
    overflow: auto;
    padding-right: 8px;
  }
  &-btn {
    transform: translateY(4px);
  }

  &-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 6px;
    padding: 4px;
  }

  &-close {
    position: fixed;
    z-index: var(--i-z-index-search-close);
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    // pointer-events: none;
  }
}
</style>
