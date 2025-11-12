<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, onMounted } from 'vue'

import CustomInput from '@/components/input/CustomInput/CustomInput.vue'
import { useFormSetting } from '@/lib/lib_columns'
import type { Matcher, MatcherConstraint } from '@/types/types_logicRestriction/matcher'

import MatcherConstraintForm from './MatcherConstraintForm/MatcherConstraintForm.vue'
import type { MatcherForm } from './types'
import { columnSetting } from './columns'

const props = defineProps({
  maintainRestrictionType: {
    type: String as PropType<string>,
    default: 'RouteClassifySettingConstraint',
    description: 'MaintainRestrictionType'
  }
})

const {
  columns: formColumn,
  forms: form,
  // reset: resetForm,
  validate: validateForm
} = useFormSetting<MatcherForm>(columnSetting, 'form')

const isUseMatchingMode = ref(false)

onMounted(() => {
  isUseMatchingMode.value = (
    props.maintainRestrictionType === 'RouteClassifySettingConstraint'
  )
})

const MatcherConstraintFormRef = ref<InstanceType<typeof MatcherConstraintForm>>()

// 使用 Matcher結構 初始化資料
const initUseMatcher = (matcher: Matcher) => {
  // console.log('matcher => ', matcher)

  const {
    matchingMode = '',
    positiveConstraint,
    negativeConstraint
  } = matcher

  form.matchingMode = matchingMode
  const matcherConstraint: MatcherConstraint = { positiveConstraint, negativeConstraint }
  MatcherConstraintFormRef.value.initMatcherConstraint(matcherConstraint)
}

// 取得 Matcher格式 資料
const getMatcherFormat = (): Matcher => {
  const { positiveConstraint, negativeConstraint } = MatcherConstraintFormRef.value.getMatcherConstraintFormat()

  const matcher: Matcher = {
    matchingMode: form.matchingMode,
    positiveConstraint,
    negativeConstraint
  }
  return matcher
}

defineExpose({
  initUseMatcher,
  getMatcherFormat,
  submitMatcher: async () => {
    const validateList: Array<Promise<any>> = [validateForm()]
    if (MatcherConstraintFormRef.value) {
      validateList.push(MatcherConstraintFormRef.value?.submitMatcherConstraint())
    }
    return await Promise.all(validateList).then(() => {
      const logicRestriction = getMatcherFormat()
      return Promise.resolve(logicRestriction)
    }).catch((errorList: any) => {
      return Promise.reject(errorList)
    })
  }
})

</script>

<template>
  <div class="matcher-form">
    <div v-show="isUseMatchingMode" class="flex-grid-row">
      <CustomInput
        class="flex-col-xs-24"
        v-model="form.matchingMode"
        v-bind="formColumn.matchingMode"
      />
    </div>

    <div class="i-py-md">
      <MatcherConstraintForm
        ref="MatcherConstraintFormRef"
        :maintainRestrictionType="props.maintainRestrictionType"
      ></MatcherConstraintForm>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.matcher-form {
  width: 100%;
  min-height: 60px;
  display: flex;
  flex-direction: column;
}
</style>
