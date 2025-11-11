<script setup lang="ts">
import { ref, computed, inject, shallowRef, onMounted, nextTick } from 'vue'
import { storeToRefs } from 'pinia'

import type { UseHook } from '@/types/types_hook' // 全域功能類型
import { useI18nStore } from '@/stores/useI18nStore'
import CustomInput from '@/components/input/CustomInput/CustomInput.vue'
import FormList from '@/components/input/FormList/FormList.vue'
import CustomButton from '@/components/feature/CustomButton/CustomButton.vue'

import type { LangMapType, I18nMap } from '@/types/types_i18n'
import { i18nShowTypeOptions, defaultModuleType } from '@/declare/declare_i18n'
import { useFormListSetting } from '@/lib/lib_columns'
import { isEmpty, scrollToEl } from '@/lib/lib_utils'
import { getColumnSetting } from './columns'

const useHook = inject('useHook') as UseHook
const { i18nTranslate, swal } = useHook({
  i18nModule: defaultModuleType
})

const i18nStore = useI18nStore()
const { setLocalLangMap, initModuleLangMap } = i18nStore
const {
  activeI18nShowType,
  langMap,
  localLangMap
} = storeToRefs(i18nStore)

const columnSetting = getColumnSetting()

type Form = { i18nKey: string } & LangMapType<string>

const {
  // defaultValue,
  columns: formColumn,
  forms: formList,
  validate: validateFormList,
  // reset: resetFormList,
  add,
  remove
} = useFormListSetting<Form>(columnSetting, 'form', [])

const onI18KeyChange = (i18nKey: string, rowIndex: number) => {
  const langInfo = langMap.value[i18nKey]
  formList.value[rowIndex] = {
    i18nKey,
    ...langInfo
  }
}

const langMapOptions = shallowRef([])
const selectedOptions = computed(() => {
  return formList.value.map(formItem => {
    return formItem.i18nKey
  })
})
const showLangMapOptions = (currentValue: string) => {
  return langMapOptions.value.filter(option => {
    return (
      currentValue === option.value ||
      !selectedOptions.value.includes(option.value)
    )
  })
}

// 初始化
const isLoading = ref(true)
const init = async () => {
  isLoading.value = true

  // 可設定的翻譯
  const getLabel = (langInfo: LangMapType<string>) => {
    const lableList = []
    for (const langType in langInfo) {
      const langValue = langInfo[langType]
      lableList.push(`${langValue}`)
    }
    return lableList.join(' , ')
  }
  const __langMapOptions__ = []
  for (const i18nKey in langMap.value) {
    const langInfo = langMap.value[i18nKey]
    __langMapOptions__.push({
      label: getLabel(langInfo),
      value: i18nKey
    })
  }
  langMapOptions.value = __langMapOptions__

  // local已設定
  for (const i18nKey in localLangMap.value) {
    const langInfo = localLangMap.value[i18nKey]
    add({ i18nKey, ...langInfo })
  }

  await nextTick()
  if (isEmpty(formList.value)) {
    add()
  }

  setTimeout(() => {
    isLoading.value = false
  }, 300)
}

onMounted(() => {
  init()
})

const onShowTypeChange = async () => {
  await nextTick()

  setTimeout(() => {
    const el = document.querySelectorAll('.i18n-show-type-bottom')
    if (isEmpty(el)) return
    scrollToEl(el[0], { block: 'center' })
  }, 0)
}

const submit = async () => {
  await nextTick()
  return await validateFormList()
    .then(async () => {
      isLoading.value = true

      const newLocalLangMap: I18nMap = {}
      formList.value.forEach(formItem => {
        const langInfo = {...formItem}
        delete langInfo.i18nKey
        newLocalLangMap[formItem.i18nKey] = {...langInfo}
      })
      setLocalLangMap(newLocalLangMap)

      await initModuleLangMap()

      swal({
        icon: 'success',
        title: i18nTranslate('update-success'),
        showCancelButton: false
      })
      setTimeout(() => {
        isLoading.value = false
      }, 300)
    })
    .catch(errorList => {
      const error = errorList.find(errorItem => {
        return errorItem.el !== null
      })
      if (error) {
        const el = error.getDom()
        scrollToEl(el)
      } else {
        swal({
          icon: 'error',
          title: i18nTranslate('update-failed'),
          text: 'Update Local language Setting Error',
          showCancelButton: false
        })
      }
    })
}

</script>

<template>
  <div v-loading="isLoading" class="i-modal">
    <CustomInput
      v-model="activeI18nShowType"
      label="'語言顯示類型"
      i18n-label="language-show-type"
      type="radio"
      :options="i18nShowTypeOptions"
      @change="onShowTypeChange"
    />

    <Transition name="slide-up" mode="out-in">
      <div v-show="activeI18nShowType === 2" class="i-py-md flex-column">
        <FormList
          v-model="formList"
          :column-setting="columnSetting"
          is-create
          is-remove
          @add="add"
          @remove="remove"
        >
          <template #title>
            <div class="fill flex-row content-between align-center">
              <label>{{ i18nTranslate('translation-localSetting', defaultModuleType) }}</label>

              <CustomButton
                type="success"
                :label="i18nTranslate('save')"
                icon-name="save"
                @click="submit"
              />
            </div>
          </template>
          <template #column-all="{ prop, rowIndex }">
            <CustomInput
              v-model="formList[rowIndex][prop]"
              v-bind="formColumn[prop]"
            ></CustomInput>
          </template>
          <template #column-i18nKey="{ prop, rowIndex }">
            <CustomInput
              v-model="formList[rowIndex][prop]"
              v-bind="formColumn[prop]"
              :options="showLangMapOptions(formList[rowIndex][prop])"
              @change="onI18KeyChange($event, rowIndex)"
            ></CustomInput>
          </template>
        </FormList>

        <div class="i18n-show-type-bottom"></div>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped></style>
