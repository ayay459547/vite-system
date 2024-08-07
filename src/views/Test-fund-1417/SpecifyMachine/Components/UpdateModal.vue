<script setup lang="ts">
import { type PropType, onMounted, ref, inject, nextTick } from 'vue'

import type { UseHook } from '@/declare/hook'
import { useFormSetting } from '@/lib/lib_columns'
import { scrollToEl } from '@/lib/lib_utils'
import { CustomInput } from '@/components'

import type { TableData } from '../api'
import { type UpdateFormData, updateData } from './api'
import { columnSetting } from '../columns'

const isLoading = ref(true)

const useHook: UseHook = inject('useHook')
const { swal, i18nTranslate } = useHook({
  i18nModule: 'system'
})

const {
  columns: formColumn,
  forms: form,
  // reset: resetForm,
  validate: validateForm
} = useFormSetting<UpdateFormData>(columnSetting, 'form')

const props = defineProps({
  data: {
    type: Object as PropType<TableData | null>,
    required: false
  }
})

const dataId = ref(0)

onMounted(async () => {
  const {
    id = 0,
    startDateTime = '',
    endDateTime = '',
    machine_Id = '',
    type = '',
    note = ''
  } = props?.data ?? {}

  dataId.value = id
  form.dateTimeRange = [startDateTime, endDateTime]
  form.machine_Id = machine_Id
  form.type = type
  form.note = note

  await nextTick()
  setTimeout(() => {
    isLoading.value = false
  }, 300)
})

defineExpose({
  submit: async () => {
    if (isLoading.value) return 'error'

    return await validateForm()
      .then(async () => {
        isLoading.value = true

        const { status, msg } = await updateData({
          id: dataId.value,
          ...form
        })

        if (status === 'success') {
          swal({
            icon: 'success',
            title: i18nTranslate('update-success'),
            showCancelButton: false
          })
        } else {
          swal({
            icon: 'error',
            title: i18nTranslate('update-fail'),
            text: msg,
            showCancelButton: false
          })
        }

        isLoading.value = false
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
  <div v-loading="isLoading" class="modal">
    <div class="grid-row">
      <CustomInput
        class="grid-col-xs-24"
        v-model="form.dateTimeRange"
        v-bind="formColumn.dateTimeRange"
      />

      <CustomInput
        class="grid-col-xs-24 grid-col-md-12"
        v-model="form.machine_Id"
        v-bind="formColumn.machine_Id"
      />

      <CustomInput
        class="grid-col-xs-24 grid-col-md-12"
        v-model="form.type"
        v-bind="formColumn.type"
      />

      <CustomInput
        class="grid-col-xs-24"
        v-model="form.note"
        v-bind="formColumn.note"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal {
  width: 100%;
  height: fit-content;
  min-height: 100%;
  padding: 16px 24px;
}
</style>
