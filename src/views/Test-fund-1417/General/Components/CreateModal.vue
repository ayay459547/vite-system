<script setup lang="ts">
import { inject, ref, onMounted } from 'vue'

import type { UseHook } from '@/declare/hook.ts'
import { useFormSetting } from '@/lib/lib_columns'
import { scrollToEl } from '@/lib/lib_utils'
import { CustomInput } from '@/components'

import { type CreateFormData, createData } from './api'
import { columnSetting } from '../columns'

const isLoading = ref(true)

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook({
  i18nModule: 'system'
})

const {
  columns: formColumn,
  forms: form,
  // reset: resetForm,
  validate: validateForm
} = useFormSetting<CreateFormData>(columnSetting, 'form')

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 300)
})

defineExpose({
  submit: async () => {
    return await validateForm()
      .then(async () => {
        const status = await createData(form)

        return status
      })
      .catch(errorList => {
        const error = errorList.find(errorItem => {
          return errorItem.el !== null
        })
        if (error) {
          const el = error.getDom()
          scrollToEl(el)
        }

        return 'error'
      })
  }
})
</script>

<template>
  <div v-loading="isLoading" class="modal grid-row">
    <CustomInput
      class="grid-col-xs-24"
      i18n-module="system"
      v-model="form.dayOfWeek"
      v-bind="formColumn.dayOfWeek"
      :label="i18nTranslate(formColumn.dayOfWeek.i18nLabel)"
    />

    <CustomInput
      class="grid-col-xs-24"
      v-model="form.timeRange"
      v-bind="formColumn.timeRange"
      :label="i18nTranslate(formColumn.timeRange.i18nLabel)"
    />
  </div>
</template>

<style lang="scss" scoped>
.modal {
  width: 100%;
  height: fit-content;
  padding: 16px 24px;
}
</style>
