<script setup lang="ts">
import type { PropType } from 'vue'
import { inject, ref, onMounted } from 'vue'

import type { UseHook } from '@/types/types_hook' // 全域功能類型
import CustomInput from '@/components/input/CustomInput/CustomInput.vue'
import RestrictionsForm from '@/components/views/Common/RestrictionsForm/RestrictionsForm.vue'
import type { LogicRestriction } from '@/types/types_logicRestriction/logicRestriction'
import type { Restrictions } from '@/types/types_logicRestriction/restrictions'

import { useFormSetting } from '@/lib/lib_columns'
import { isEmpty } from '@/lib/lib_utils'

import type { LogicRestrictionForm } from './types'
import { columnSetting } from './columns'

const useHook = inject('useHook') as UseHook
const { auth } = useHook({
  i18nModule: 'fund_common'
})
const authData = auth()

const props = defineProps({
  maintainRestrictionType: {
    type: String as PropType<string>,
    default: '',
    description: 'MaintainRestrictionType'
  },
  positive: {
    type: Boolean as PropType<boolean>,
    default: undefined,
    description: '正負向'
  },
  combineLogic: {
    type: String as PropType<string>,
    default: 'OR',
    description: 'OR / AND'
  },
  // RestrictionsForm
  isRestrictions: {
    type: Boolean as PropType<boolean>,
    default: true,
    description: '是否使用 RestrictionsForm'
  },
  RestrictionsFormProps: {
    type: Object as PropType<Record<string, any>>,
    default: () => {
      return {}
    },
    required: false,
    description: 'RestrictionsFormProps 使用的屬性'
  }
})

const {
  columns: formColumn,
  forms: form,
  // reset: resetForm,
  validate: validateForm
} = useFormSetting<LogicRestrictionForm>(columnSetting, 'form')

const init = () => {
  if (!isEmpty(props.maintainRestrictionType)) {
    form.maintainRestrictionType = props.maintainRestrictionType
  }

  if (typeof props.positive === 'boolean') {
    form.positive = props.positive
  }

  if (!isEmpty(props.combineLogic)) {
    form.combineLogic = props.combineLogic
  }
}

// Restrictions

// 必須要是 true, 否則無意義
const isUseRestrictions = ref(true)
const RestrictionsFormRef = ref<InstanceType<typeof RestrictionsForm>>()

// 使用 LogicRestriction 格式的資料 初始化
const initUseLogicRestriction = (logicRestriction: LogicRestriction) => {
  // console.log('logicRestriction => ', logicRestriction)

  const { _type, _value } = logicRestriction
  const {
    combineLogic = 'OR',
    positive = true,
    // logicRestrictions, // 使用 LogicNested 設定階層
    restrictions = []
  } = _value

  form.maintainRestrictionType = _type
  form.combineLogic = combineLogic
  form.positive = positive

  if (RestrictionsFormRef.value) {
    RestrictionsFormRef.value?.initUseRestrictions(restrictions)
  }
}

// 取得 LogicRestriction 格式的資料
const getLogicRestrictionFormat = (): LogicRestriction => {
  const userName = authData?.user?.fullName ?? ''

  let restrictions: Restrictions = []
  if (RestrictionsFormRef.value) {
    restrictions = RestrictionsFormRef.value?.getRestrictionsFormat()
  }

  const logicRestriction: LogicRestriction = {
    _type: form.maintainRestrictionType,
    _value: {
      employeeName: userName,
      combineLogic: form.combineLogic,
      positive: form.positive,
      logicRestrictions: [],

      // 自動設定
      // constraintType: 'engineering',

      // 其他屬性 不開放設定
      // lastVersion: 'IsLast',
      // autoGeneratingId: false,
      // factoryNo: 'AA',
      // hiberversion: 0,
      restrictions: restrictions ?? []
    }
  }
  return logicRestriction
}

defineExpose({
  initUseLogicRestriction,
  getLogicRestrictionFormat,
  submitLogicRestriction: async () => {
    const validateList: Array<Promise<any>> = [validateForm()]
    if (RestrictionsFormRef.value) {
      validateList.push(RestrictionsFormRef.value?.submitRestrictions())
    }
    return await Promise.all(validateList).then(() => {
      const logicRestriction = getLogicRestrictionFormat()
      return Promise.resolve(logicRestriction)
    }).catch((errorList: any) => {
      return Promise.reject(errorList)
    })
  }
})

onMounted(() => {
  init()
})

</script>

<template>
  <div class="logic-restriction-form">
    <!-- LogicRestriction -->
    <div class=" flex-grid-row">
      <!-- MaintainRestrictionType 不開放使用者設定 -->
      <CustomInput
        class="flex-col-xs-24"
        v-model="form.maintainRestrictionType"
        v-bind="formColumn.maintainRestrictionType"
      />

      <CustomInput
        class="flex-col-xs-24 flex-col-lg-12"
        v-model="form.positive"
        v-bind="formColumn.positive"
      />
      <CustomInput
        class="flex-col-xs-24 flex-col-lg-12"
        v-model="form.combineLogic"
        v-bind="formColumn.combineLogic"
      />
    </div>

    <template v-if="isRestrictions">
      <!-- 必須要是 true, 否則無意義 -->
      <!-- <CustomInput
        v-model="isUseRestrictions"
        type="checkbox"
        :label="i18nTranslate('extra-restrictions')"
        hidden-label
      /> -->

      <RestrictionsForm
        v-if="isUseRestrictions"
        ref="RestrictionsFormRef"
        v-bind="props.RestrictionsFormProps"
      ></RestrictionsForm>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.logic-restriction-form {
  width: 100%;
  min-height: 60px;
  display: flex;
  flex-direction: column;
}
</style>
