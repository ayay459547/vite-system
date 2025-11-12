<script setup lang="ts">
import type { PropType } from 'vue'
import { onMounted, inject, nextTick } from 'vue'
import { storeToRefs } from 'pinia'

import type { UseHook } from '@/types/types_hook' // 全域功能類型
import { useFormListSetting } from '@/lib/lib_columns'
import { CustomIcon, CustomPopover } from '@/components/feature'
import { FormList, CustomInput } from '@/components/input'
import { isEmpty, tipLog } from '@/lib/lib_utils'
import { useRestrictionsStore } from '@/stores/stores_logicRestriction/restrictions'
import type { Restriction, Restrictions } from '@/types/types_logicRestriction/restrictions'

import DescriptionView from './DescriptionView/DescriptionView.vue'
import type { DynamicForm } from './types'
import { restrictionColumnSetting } from './columns'

const useHook = inject('useHook') as UseHook
const { i18nTranslate } = useHook({
  i18nModule: 'fund_common'
})

const props = defineProps({
  maintainRestrictionType: {
    type: String as PropType<string>,
    default: '',
    required: false,
    description: `
      對應 declare_logicRestriction/enums 中
      MaintainRestrictionType

      MachineMergeConstraint
      MachineCategoryMergeConstraint
      MachineProcessChangeLine
      MachineProcessProductionConstraint
    `
  },
  isMountedAdd: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
    description: '是否在 onMounted 自動新增一筆資料'
  },
  hideColumns: {
    type: Array as PropType<Array<string>>,
    required: false,
    default: () => [],
    description: `
      由需要隱藏的欄位所組成的Array<string>

      restrictionType
      matchingTypeValue
      valueInArray
    `
  },
  title: {
    type: String as PropType<string>,
    required: false,
    default: undefined,
    description: '標題'
  }
})

const emit = defineEmits(['mounted'])

const setActiveColumnSetting = (() => {
  const newColumnSetting = {}
  const columnKey = Object.keys(restrictionColumnSetting)
  columnKey.forEach(key => {
    if (!props.hideColumns.includes(key)) newColumnSetting[key] = restrictionColumnSetting[key]
  })
  return newColumnSetting
})
const activeColumnSetting = setActiveColumnSetting()

// 動態欄位設定
const {
  columns: restrictionColumns,
  forms: restrictionForms,
  validate: restrictionValidate,
  add: restrictionAdd,
  remove: restrictionRemove
} = useFormListSetting<DynamicForm>(activeColumnSetting, 'form', [])

// 新增條件
const addRestriction = (restriction?: any) => {
  const status = isEmpty(restriction) ? 'NEW' : 'OLD'

  const newRestriction = {
    restrictionType: '',
    matchingTypeValue: '',
    valueInArray: '',
    status,
    ...restriction
  }
  restrictionAdd(newRestriction)
}
// 清除條件
const clearRestriction = () => {
  restrictionForms.value.splice(0)
}

// 動態欄位Input設定
const restrictionsStore = useRestrictionsStore()
const {
  initDynamic,
  basicInputAttr,
  getMatchingTypeOptions,
  getValueInArrayInputAttr,
  getSelectedValueKey
} = restrictionsStore
const {
  dynamicColumnsMap,
  restrictionTypeOptions
} = storeToRefs(restrictionsStore)

onMounted(async () => {
  restrictionForms.value.splice(0)
  if (props.isMountedAdd) {
    addRestriction()
  }
  await initDynamic(props.maintainRestrictionType)
  await nextTick()
  emit('mounted')
})

// 可用 matchingType
const getConditionTypeOptions = (row: any) => {
  const options = getMatchingTypeOptions(row.restrictionType)
  return options
}

// 依據欄位 給建議選項
const getConditionValueAttr = (row: any) => {
  const inputAttr = getValueInArrayInputAttr(row.restrictionType)
  return inputAttr
}
const getConditionValueSelectedKey = (row: any) => {
  const inputAttr = getSelectedValueKey(row.restrictionType)
  return inputAttr
}

// 清空後面資料
const formInputChange = (row: any, column: any) => {
  switch (column) {
    case 'restrictionType': {
      row.matchingTypeValue = ''
      row.valueInArray = ''
      break
    }
    case 'matchingTypeValue': {
      row.valueInArray = ''
      break
    }
  }
}

// 取得標題文字
const getTitleText = () => {
  return props.title ?? i18nTranslate('extra-restrictions')
}

// 使用 Restrictions 格式的資料 初始化
const initUseRestrictions = (restrictions: Restrictions) => {
  // console.log('restrictions => ', restrictions)

  if (!Array.isArray(restrictions)) {
    tipLog('傳入 restrictions 不是 Array', [
      '執行 initUseRestrictions(restrictions: Restrictions)',
      `傳入 restrictions 類型: ${typeof restrictions}`
    ])
    return
  }
  restrictionForms.value.splice(0)
  restrictions.forEach(restriction => {
    const {
      // _type, // 依據 restrictionType 自動設定
      _value
    } = restriction

    const { restrictionTypeAttr, valueInArray } = _value
    const restrictionType = restrictionTypeAttr?.id ?? ''
    // 欄位設定
    const columnSetting = dynamicColumnsMap.value.get(restrictionType)
    // matchingType 在 _value key 是動態的
    const { matchingType = '' } = columnSetting ?? {}

    addRestriction({
      restrictionType,
      matchingTypeValue: _value[matchingType] ?? '',
      valueInArray
    })
  })

}

// 取得 Restrictions 格式的資料
const getRestrictionsFormat = (): Restrictions => {
  const restrictions = restrictionForms.value.map(form => {
    const { restrictionType, matchingTypeValue, valueInArray, status } = form
    const columnSetting = dynamicColumnsMap.value.get(restrictionType) ?? { _type: '' }

    // 欄位設定
    const { _type, matchingType } = columnSetting

    const restriction: Restriction = {
      _type: _type ?? 'StrRestriction',
      _value: {
        // restrictionType: restrictionType ?? 'PRODUCT_NO', // 舊版
        restrictionTypeAttr: {
          // 不同的 ApsLogicRestricion 在使用規格類的 RestrictionType 時，指定 SpecType 後所產生的專屬 id
          id: restrictionType ?? 'PRODUCT_NO'
        },
        // matchingType 在 _value key 是動態的
        [matchingType]: matchingTypeValue ?? 'FULL',
        valueInArray: valueInArray ?? '',

        // 自動設定(依據上層)
        // positive: true,

        // 其他屬性 不開放設定
        // compareType: 'restrictionValue',
        // attrPath: 'process.id',
        // autoGeneratingId: false,
        // valueArrayNeedFullMatch: false,
        // inputValueCanRedundant: true,

        // 規格相關
        // specType: { // 舊版
        //   id: 'BodySize',
        //   name: 'XXXXXXXX'
        // },
        // specificationRestrictionContent: { // 舊版
        //   restrictionType: 4,
        //   name: 'XXX',
        //   specType: {
        //     id: 'BodySize'
        //   }
        // },

        // 更新方式
        mark: status === 'NEW' ? 'add' : 'update'
      }
    }
    return restriction
  })
  return restrictions
}

defineExpose({
  addRestriction,
  clearRestriction,
  submit: async () => {
    return await restrictionValidate().then(() => {
      const restrictionData = restrictionForms.value.map(form => {
        const { restrictionType, matchingTypeValue, valueInArray, status } = form
        const columnSetting = dynamicColumnsMap.value.get(restrictionType)
        return {
          restrictionType,
          matchingTypeValue,
          valueInArray,
          columnSetting,
          status
        }
      })

      return Promise.resolve(restrictionData)
    }).catch((errorList: any) => {
      return Promise.reject(errorList)
    })
  },
  initUseRestrictions,
  getRestrictionsFormat,
  submitRestrictions: async () => {
    return await restrictionValidate().then(() => {
      const restrictions = getRestrictionsFormat()
      return Promise.resolve(restrictions)
    }).catch((errorList: any) => {
      return Promise.reject(errorList)
    })
  }
})

</script>

<template>
  <div class="restrictions-form">
    <!-- Restrictions -->
    <FormList
      v-model="restrictionForms"
      :label="getTitleText()"
      :column-setting="activeColumnSetting"
      item-key="__key__"
      :min="0"
      is-create
      is-remove
      is-collapse
      @add="addRestriction"
      @remove="(index) => restrictionRemove(index)"
    >
      <template #header-all="{ column }">
        <div>
          <span v-if="column.required" class="text-danger i-pr-xs">*</span>
          <span>{{ i18nTranslate(column.i18nLabel) }}</span>
        </div>
      </template>
      <template #column-restrictionType="{row, prop}">
        <CustomInput
          v-model="row[prop]"
          v-bind="restrictionColumns[prop]"
          @change="formInputChange(row, 'restrictionType')"
          :options="restrictionTypeOptions"
          i18nModule="fund_common"
          hiddenLabel
        />
      </template>
      <template #header-matchingTypeValue="{ column }">
        <div class="fill flex-row i-ga-xs">
          <div>
            <span v-if="column.required" class="text-danger i-pr-xs">*</span>
            <span>{{ i18nTranslate(column.i18nLabel) }}</span>
          </div>

          <CustomPopover placement="bottom" width="600">
            <DescriptionView />
            <template #reference>
              <div class="text-primary cursor-pointer" @click="getRestrictionsFormat()">
                <CustomIcon name="circle-question" />
              </div>
            </template>
          </CustomPopover>
        </div>
      </template>
      <template #column-matchingTypeValue="{ row, prop }">
        <CustomInput
          v-model="row[prop]"
          v-bind="restrictionColumns[prop]"
          :options="getConditionTypeOptions(row)"
          @change="formInputChange(row, 'matchingTypeValue')"
          :disabled="isEmpty(row.restrictionType)"
        />
      </template>
      <template #column-valueInArray="{ row, prop }">
        <CustomInput
          v-model="row[prop]"
          v-bind="{
            ...restrictionColumns[prop],
            ...basicInputAttr,
            ...getConditionValueAttr(row)
          }"
          @change="formInputChange(row, 'valueInArray')"
          @modal-select-submit="(selectedValue) => {
            const [rowData] = selectedValue
            row[prop] = rowData[getConditionValueSelectedKey(row)] ?? ''
          }"
          :disabled="isEmpty(row.matchingTypeValue)"
        />
      </template>
    </FormList>
  </div>
</template>

<style lang="scss" scoped>
.restrictions-form {
  width: 100%;
  min-height: 60px;
  display: flex;
  flex-direction: column;
}
</style>
