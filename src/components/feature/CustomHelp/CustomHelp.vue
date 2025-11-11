<script setup lang="ts">
import { ref, onBeforeMount, computed, inject } from 'vue'
import { storeToRefs } from 'pinia'

import type { UseHook } from '@/types/types_hook' // 全域功能類型
import { useI18nStore } from '@/stores/useI18nStore'
import { getUuid, isEmpty, fetchPublicFileUrl } from '@/lib/lib_utils' // 工具
// import { defaultModuleType } from '@/declare/declare_i18n'

import CustomButton from '@/components/feature/CustomButton/CustomButton.vue'
import CustomEmpty from '@/components/feature/CustomEmpty/CustomEmpty.vue'
import CustomModal from '@/components/feature/CustomModal/CustomModal.vue'

import { version, props as helpProps } from './CustomHelpInfo'

const scopedId = getUuid(version)

const useHook = inject('useHook') as UseHook
const { i18nTranslate } = useHook({
  // i18nModule: defaultModuleType
  i18nModule: 'fund_common'
})

const props = defineProps(helpProps)

const isShowPDF = ref(false)
const isError = ref(true)

const pdfSrc = ref('')
const iframeSrc = ref('')

// 翻譯檔
const i18nStore = useI18nStore()
const { systemLocale } = storeToRefs(i18nStore)

const helpTitle = computed(() => {
  return [props.title, i18nTranslate('info')].filter(str => !isEmpty(str)).join(' - ')
})

onBeforeMount(async () => {
  pdfSrc.value = (
    props.isSupportI18n ?
    // 目前沒有製作 其他語言的教育訓練
    `/PDF/${systemLocale.value}${props.filePath}.pdf` :
    // 主要使用 繁體中文的教育訓練
    `/PDF${props.filePath}`
  )

  const fileSrc = await fetchPublicFileUrl(pdfSrc.value)
  isError.value = isEmpty(fileSrc)
  iframeSrc.value = fileSrc
})
</script>

<template>
  <div :class="scopedId">
    <CustomModal
      v-model="isShowPDF"
      :title="helpTitle"
      width-size="large"
      height-size="large"
      hidden-footer
      :modal="false"
    >
      <div class="fill i-pa-xs user-select-none" >
        <CustomEmpty v-if="isError">
          <div class="text-danger">{{ pdfSrc }}</div>
        </CustomEmpty>
        <iframe
          v-else
          :src="iframeSrc"
          width="100%"
          height="100%"
        ></iframe>
      </div>
    </CustomModal>

    <CustomButton
      icon-x-type="fluent"
      icon-name="BookQuestionMark24Filled"
      :label="helpTitle"
      type="info"
      plain
      @click="isShowPDF = !isShowPDF"
    />
  </div>
</template>

<style lang="scss" scoped></style>
