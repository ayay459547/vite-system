<script setup lang="ts">
import { reactive, ref } from 'vue'

import {
  LogicNested,
  LogicRestrictionForm,
  MatcherForm,
  RestrictionsForm
} from '@/components/views'
import { CustomModal, CustomButton } from '@/components/feature'

const modal = reactive({
  isLogicNested: false,
  isRestrictionsForm: false,
  isLogicRestrictionForm: false,
  isMatcherForm: false
})

const LogicNestedRef = ref<InstanceType<typeof LogicNested>>()
const RestrictionsFormRef = ref<InstanceType<typeof RestrictionsForm>>()
const LogicRestrictionFormRef = ref<InstanceType<typeof LogicRestrictionForm>>()
const MatcherFormRef = ref<InstanceType<typeof MatcherForm>>()

const submitForm = async (formType: string) => {
  try {
    let res: any = null
    console.log('submitForm => ', formType)
    switch (formType) {
      case 'LogicNested':
        res = await LogicNestedRef.value.submitLogicNestedData()
        break
      case 'RestrictionsForm':
        res = await RestrictionsFormRef.value.submitRestrictions()
        break
      case 'LogicRestrictionForm':
        res = await LogicRestrictionFormRef.value.submitLogicRestriction()
        break
      case 'MatcherForm':
        res = await MatcherFormRef.value.submitMatcher()
        break
      case '':
      default:
        break
    }
    console.log('submitForm =>', res)
  } catch (e) {
    console.log('submitForm Error => ', e)
  }
}

</script>

<template>
  <div class="i-page border">
    <div class="flex-grid-row i-ga-lg">
      <div class="flex-col-xs-24">
        <CustomModal
          v-model="modal.isLogicNested"
          title="LogicNested"
          width-size="large"
          height-size="large"
          @submit="submitForm('LogicNested')"
        >
          <div class="i-modal">
            <LogicNested ref="LogicNestedRef"></LogicNested>
          </div>
        </CustomModal>
        <CustomButton
          type="success"
          label="多階層 LogicRestriction 設定 ( LogicNested.vue )"
          plain
          size="large"
          @click="modal.isLogicNested = true"
        />
      </div>

      <div class="flex-col-xs-24">
        <CustomModal
          v-model="modal.isRestrictionsForm"
          title="RestrictionsForm"
          width-size="large"
          height-size="large"
          @submit="submitForm('RestrictionsForm')"
        >
          <div class="i-modal">
            <RestrictionsForm ref="RestrictionsFormRef"></RestrictionsForm>
          </div>
        </CustomModal>
        <CustomButton
          type="primary"
          label="Restrictions 設定 ( RestrictionsForm.vue )"
          plain
          size="large"
          @click="modal.isRestrictionsForm = true"
        />
      </div>

      <div class="flex-col-xs-24">
        <CustomModal
          v-model="modal.isLogicRestrictionForm"
          title="LogicRestrictionForm"
          width-size="large"
          height-size="large"
          @submit="submitForm('LogicRestrictionForm')"
        >
          <div class="i-modal">
            <LogicRestrictionForm ref="LogicRestrictionFormRef"></LogicRestrictionForm>
          </div>
        </CustomModal>
        <CustomButton
          type="primary"
          label="LogicRestriction 設定 ( LogicRestrictionForm.vue )"
          plain
          size="large"
          @click="modal.isLogicRestrictionForm = true"
        />
      </div>

      <div class="flex-col-xs-24">
        <CustomModal
          v-model="modal.isMatcherForm"
          title="MatcherForm"
          width-size="large"
          height-size="large"
          @submit="submitForm('MatcherForm')"
        >
          <div class="i-modal">
            <MatcherForm ref="MatcherFormRef"></MatcherForm>
          </div>
        </CustomModal>
        <CustomButton
          type="info"
          label="Matcher 設定 ( MatcherForm.vue )"
          plain
          size="large"
          @click="modal.isMatcherForm = true"
        />
      </div>

    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
