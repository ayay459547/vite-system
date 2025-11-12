<script setup lang="ts">
import type { PropType } from 'vue'
import { ref } from 'vue'

import CustomDivider from '@/components/feature/CustomDivider/CustomDivider.vue'
import LogicRestrictionForm from '@/components/views/Common/LogicRestrictionForm/LogicRestrictionForm.vue'
import type { MatcherConstraint } from '@/types/types_logicRestriction/matcher'
// import { isEmpty } from '@/lib/lib_utils'

const props = defineProps({
  maintainRestrictionType: {
    type: String as PropType<string>,
    default: 'OneStopProducingConstraint',
    description: 'MaintainRestrictionType'
  }
})

const PositiveConstraintRef = ref<InstanceType<typeof LogicRestrictionForm>>()
const NegativeConstraintRef = ref<InstanceType<typeof LogicRestrictionForm>>()

// 使用 Constraint 格式的資料 初始化
const initMatcherConstraint = (matcherConstraint: MatcherConstraint) => {
  // console.log('matcherConstraint => ', matcherConstraint)

  const { positiveConstraint = null, negativeConstraint = null } = matcherConstraint

  if (PositiveConstraintRef.value) {
    PositiveConstraintRef.value?.initUseLogicRestriction(positiveConstraint)
  }
  if (NegativeConstraintRef.value) {
    NegativeConstraintRef.value?.initUseLogicRestriction(negativeConstraint)
  }
}

// 取得 Constraint 格式的資料
const getMatcherConstraintFormat = (): MatcherConstraint => {
  const constraint: any = {
    _type: props.maintainRestrictionType,
    _value: {}
  }

  let positiveConstraint = constraint
  let negativeConstraint = constraint

  if (PositiveConstraintRef.value) {
    positiveConstraint = PositiveConstraintRef.value?.getLogicRestrictionFormat()
  }
  if (NegativeConstraintRef.value) {
    negativeConstraint = NegativeConstraintRef.value?.getLogicRestrictionFormat()
  }
  const matcherConstraint: MatcherConstraint = { positiveConstraint, negativeConstraint }
  return matcherConstraint
}

defineExpose({
  initMatcherConstraint,
  getMatcherConstraintFormat,
  submitMatcherConstraint: async () => {
    return Promise.all([
      PositiveConstraintRef.value.submitLogicRestriction(),
      NegativeConstraintRef.value.submitLogicRestriction()
    ]).then(() => {
      const matcherConstraint = getMatcherConstraintFormat()
      return Promise.resolve(matcherConstraint)
    }).catch((errorList: any) => {
      return Promise.reject(errorList)
    })
  }
})

</script>

<template>
  <div class="constraint-form">
    <div class="constraint-form-positive">
      <LogicRestrictionForm
        ref="PositiveConstraintRef"
        :maintainRestrictionType="props.maintainRestrictionType"
        positive
      ></LogicRestrictionForm>
    </div>

    <div>
      <CustomDivider direction="vertical"></CustomDivider>
    </div>

    <div class="constraint-form-negative">
      <LogicRestrictionForm
        ref="NegativeConstraintRef"
        :maintainRestrictionType="props.maintainRestrictionType"
        :positive="false"
      ></LogicRestrictionForm>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.constraint-form {
  width: 100%;
  min-height: 60px;
  display: flex;
  gap: 8px;

  &-positive,
  &-negative {
    flex: 1;
  }
}
</style>
