<script setup lang="ts">
import { computed, ref, nextTick, useSlots, inject } from 'vue'
import { storeToRefs } from 'pinia'

import type { UseHook } from '@/declare/hook' // 全域功能類型
import { defaultModuleType } from '@/i18n/i18n_setting'
import { useFormListSetting } from '@/lib/lib_columns'
import { useCustomSearchStore } from '@/stores/stores_CustomSearch'
import { CustomSwitch, CustomInput, CustomButton, CustomTooltip, FormCheckbox, FormList } from '@/components' // 系統組件

import throttle from '@/lib/lib_throttle'
import { getUuid, hasOwnProperty, isEmpty, getProxyData } from '@/lib/lib_utils' // 工具
import { conditionOptions } from '@/declare/variable'

import type { Props } from './CustomSearchInfo'
import { version, props as searchProps } from './CustomSearchInfo'
import SearchContainer from './Components/SearchContainer.vue'

const scopedId = getUuid(version)

const props = defineProps(searchProps)

const emit = defineEmits([
  'update:model-value',
  'update:active',
  'update:active-conditions',
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

const useHook = inject('useHook') as UseHook 
const { i18nTranslate, i18nTest } = useHook({
  i18nModule: props.i18nModule
})

const inpuValue = computed({
  get() {
    return props.modelValue
  },
  set(value: Props.ModelValue) {
    emit('update:model-value', value)
  }
})

const isActive = computed({
  get: () => props.active,
  set(value: boolean) {
    visibleChange(false)
    emit('change', inpuValue.value)
    emit('update:active', value)
  }
})

const customSearchStore = useCustomSearchStore()
const { activeScopedIdSet } = storeToRefs(customSearchStore)

const resizeEvent = () => visibleChange(false)
const openListenerSize = () => {
  window.addEventListener('resize', resizeEvent, { once: true })
}

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
      if (isActiveConditions.value) return
      searchRef?.value.focus()

    } else {
      customSearchStore.removeActiveScopedId(scopedId)
    }
  }
})

const visibleChange = async (_isVisible: boolean) => {
  await nextTick()
  setTimeout(() => {
    emit(_isVisible ? 'open' : 'close')
    isVisible.value = _isVisible
  }, 0)
}

// 條件搜尋
const isActiveConditions = computed({
  get () {
    return props.activeConditions && isActive.value
  },
  set: async (value: boolean) => {
    isVisible.value = false
    if (!value) {
      emit('change', inpuValue.value)
    }
    emit('update:active-conditions', value)

    await nextTick()
    isVisible.value = true
  }
})

const columnSetting = {
  conditionType: {
    label: '條件',
    i18nLabel: 'select-condition',
    table: {
      width: 150
    },
    filter: {
      type: 'select',
      default: '',
      validate: [],
      required: true,
      hiddenErrorMessage: true,
      hiddenLabel: true
    }
  },
  filterValue: {
    label: '查詢值',
    i18nLabel: 'select-condition-value',
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
// 依據後端資料 限制使用選項
const allowConditionOptions = computed(() => {
  if (isEmpty(props.allowConditions)) return conditionOptions
  return conditionOptions.filter(conditionOption => {
    return props.allowConditions.includes(conditionOption.value)
  })
})
// 依序不同類型的資料 顯示不同書入框
const noValueList = ['IsBlank', 'NotBlank', 'IsNull', 'NotNull']

const filterValueType = computed(() => {
  const inputType = props?.type ?? ''

  switch (inputType) {
    case 'year':
      return 'year'
    case 'month':
    case 'monthrange':
      return 'month'
    case 'week':
      return 'week'
    case 'date':
    case 'dates':
    case 'daterange':
      return 'date'
    case 'datetime':
    case 'datetimerange':
      return 'datetime'
    case 'time':
    case 'timerange':
      return 'time'
    case 'text':
    default:
      return 'text'
  }
})

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
  reset: resetFormList,
  add,
  remove
} = useFormListSetting<Form>(columnSetting, 'filter', [])

/**
 * formList 與 props.conditions 不同
 * 手動更新 Conditions
 */
const updateConditions = () => {
  const conditionList = formList.value.reduce<any[]>((res, formItem) => {
    const { conditionType, filterValue } = formItem
    const isNoValue = noValueList.includes(conditionType ?? '')

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
  emit('update:conditions', getProxyData(conditionList))
}
const throttleUpdateConditions = throttle<typeof updateConditions>(updateConditions, 200, {
  isNoLeading: false,
  isNoTrailing: false
})

// 重製 conditions
const resetConditions = () => {
  formList.value.splice(0) // 清空 formList
  add() // 重新加入1筆新的
  throttleUpdateConditions() // 同步更新 conditions
  isActiveConditions.value = false // 關閉進階搜尋
}
// 移除1筆 conditions
const removeItem = (rowIndex: number) => {
  if (formList.value.length > 1) {
    remove(rowIndex) // 移除1筆 formList
    throttleUpdateConditions() // 同步更新 conditions
  } else {
    resetConditions() // 重製 conditions
  }
}
// 新增1筆 conditions
const addItem = () => {
  validateForm().then(() => {
    add() // 新增1筆 formList
    throttleUpdateConditions() // 同步更新 conditions
  }).catch(e => {
    console.log('CustomSearch addItem: ', e)
  })
}

// 重製 formList 資料
const initFormList = async () => {
  resetFormList()
  if (Array.isArray(props.conditions) && !isEmpty(props.conditions)) {
    props.conditions.forEach(item => {
      const { condition: conditionType, value: filterValue } = item
      // 至少有一種資料才新增
      if (!isEmpty(conditionType) || !isEmpty(filterValue)) {
        add({ conditionType, filterValue })
      }
    })
  }
  await nextTick()
  if (isEmpty(formList.value)) {
    add()
  }
}
// 每次顯示在畫面上 重新塞入 formList 資料
const onFormListVisibility = (state: boolean) => {
  if (state) {
    initFormList()
  }
}
// 送出
const submitConditions = () => {
  if (isActiveConditions.value) {
    validateForm().then(() => {
      throttleUpdateConditions() // 同步更新 conditions
      emit('submit')
      visibleChange(!isVisible.value)
    }).catch(e => {
      console.log('CustomSearch submit: ', e)
    })
  }
}

// 是否有filter生效
const isDot = computed(() => {
  if (!isActive.value) return false

  let isInputEmpty = false

  switch (props.type) {
    case 'operator':
      isInputEmpty = !(
        Array.isArray(inpuValue.value) &&
        !isEmpty(inpuValue.value[0]) &&
        !isEmpty(inpuValue.value[1])
      )
      break
    default:
      isInputEmpty = isEmpty(inpuValue.value)
      break
  }

  return !isInputEmpty || (isActiveConditions.value && !isEmpty(props.conditions))
})

defineExpose({
  async validate() {
    await nextTick()
    return { valid: true }
  },
  getDom() {
    return document.querySelector(`div[class*="${scopedId}"]`)
  }
})

const slots = useSlots()
const slotList = computed(() => {
  const _slotList = [
    'prepend', 'append', 'prefix', 'suffix',
    'options', 'header', 'footer',
    'label', 'tag', 'loading', 'empty',
    'range', 'prev', 'next', 'prev', 'next',
    'default'
  ]

  return _slotList.filter(slotName => {
    return hasOwnProperty(slots, slotName)
  })
})
</script>

<template>
  <SearchContainer
    :isDot="isDot"
    :isVisible="isVisible"
    :isActiveConditions="isActiveConditions"
    :isCondition="props.isCondition"
    :width="props.width"
    :placement="props.placement"
    :search="props.search"
    :class="scopedId"
    @visible-change="visibleChange"
  >
    <template #label>
      <label class="__search-label">
        {{ i18nTest(props?.i18nLabel) ? i18nTranslate(props.i18nLabel) : (props?.label ?? '') }}
      </label>
    </template>
    <!-- 是否啟用Filter -->
    <template #switch>
      <CustomSwitch v-model="isActive" />
    </template>
    <!-- 搜尋 -->
    <template #input>
      <div class="__search-detail">
        <div class="__search-input">
          <!-- 一般搜尋 -->
          <CustomInput
            ref="searchRef"
            v-bind="props"
            :is-validate="false"
            :hidden-error-message="true"
            :required="false"
            label=""
            hidden-label
            @focus="(e: FocusEvent): void => emit('focus', e)"
            @clear="(): void => emit('clear')"
            @blur="(e: FocusEvent): void => {
              emit('blur', e)
              if (!isActiveConditions.value) visibleChange(false)
            }"
            @change="(value: string | number): void => emit('change', value)"
            @input="(value: string | number): void => emit('input', value)"
            @remove-tag="(value: string | number): void => emit('remove-tag', value)"
            @visible-change="(visible: boolean): void => emit('visible-change', visible)"
            @select="(value: string | number): void => emit('select', value)"
            v-model="inpuValue"
            :disabled="!isActive"
          >
            <template
              v-for="slotName in slotList"
              :key="`icon-search-${slotName}-${scopedId}`"
              #[slotName]="scope"
            >
              <slot :name="slotName" v-bind="scope"></slot>
            </template>
          </CustomInput>

          <!-- 是否啟用 進階搜尋 -->
          <div style="width: fit-content;">
            <CustomTooltip
              placement="top"
              :teleported="false"
              :showAfter="300"
              :offset="0"
            >
              <template #content>
                <div>{{ i18nTranslate('setting-advanced', defaultModuleType) }}</div>
              </template>

              <FormCheckbox
                v-show="props.isCondition"
                v-model="isActiveConditions"
                :disabled="!isActive"
              />
            </CustomTooltip>
          </div>
        </div>
        <!-- 進階搜尋 -->
        <template v-if="isActiveConditions && props.isCondition && isActive">
          <div v-element-visibility="onFormListVisibility" class="i-py-xs">
            <FormList
              v-model="formList"
              :label="i18nTranslate('setting-advanced', defaultModuleType)"
              :column-setting="columnSetting"
              item-key="__key__"
              is-create
              is-remove
              @add="addItem"
              @remove="removeItem"
            >
              <template #header-all="{ column }">
                <div class="text-danger i-pr-xs">*</div>
                <div>{{ i18nTranslate(column.i18nLabel, defaultModuleType) }}</div>
              </template>
              <template #column-conditionType="{ rowIndex }">
                <CustomInput
                  v-model="formList[rowIndex].conditionType"
                  v-bind="formColumn.conditionType"
                  :options="allowConditionOptions"
                  @change="throttleUpdateConditions()"
                ></CustomInput>
              </template>
              <template #column-filterValue="{ rowIndex }">
                <CustomInput
                  v-if="!noValueList.includes(formList[rowIndex].conditionType)"
                  v-model="formList[rowIndex].filterValue"
                  v-bind="formColumn.filterValue"
                  :type="filterValueType"
                  @change="throttleUpdateConditions()"
                ></CustomInput>
                <div v-else></div>
              </template>
            </FormList>
          </div>

          <div v-if="props.search" class="__search-footer">
            <CustomButton
              :label="i18nTranslate('reset', defaultModuleType)"
              type="info"
              plain
              icon-name="repeat"
              @click="resetConditions"
            />

            <CustomButton
              :label="i18nTranslate('submit', defaultModuleType)"
              type="primary"
              plain
              icon-name="check"
              icon-move="scale"
              @click="submitConditions"
            />
          </div>
        </template>
      </div>
    </template>
  </SearchContainer>
</template>

<style lang="scss" scoped>
.__search {
  &-label {
    width: 100%;
    flex: 0 1 auto;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &-detail {
    flex: 1;
    width: 100%;
    height: fit-content;
    max-height: 50vh;
    overflow: auto;
    padding-right: 8px;
  }

  &-input {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    overflow: hidden;
  }

  &-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 6px;
    padding: 4px;
  }
}
</style>
