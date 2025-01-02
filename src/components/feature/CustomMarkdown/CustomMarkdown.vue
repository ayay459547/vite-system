<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { MdEditor as MdEditorV3, config } from 'md-editor-v3'
// import existing language
import 'md-editor-v3/lib/style.css'
import ZH_TW from '@vavt/cm-extension/dist/locale/zh-TW'

/**
 * 如果需要安裝擴展
 * https://github.com/imzbf/md-editor-extension
 */

import { getUuid } from '@/lib/lib_utils' // 工具
import { version, props as markdownProps } from './CustomMarkdownInfo'

const scopedId = getUuid(version)

const props = defineProps(markdownProps)

const __textValue__ = ref()
const textValue = computed({
  get: () => {
    return __textValue__.value
  },
  set: (v: string) => {
    __textValue__.value = v
  }
})

config({
  editorConfig: {
    languageUserDefined: { 'zh-TW': ZH_TW }
  }
})

watchEffect(() => {
  textValue.value = props.text
})

</script>

<template>
  <MdEditorV3
    v-model="textValue"
    language="zh-TW"
    theme="light"
    :class="scopedId"
    :auto-detect-code="props.autoDetectCode"
    :show-code-row-number="props.showCodeRowNumber"
    :auto-fold-threshold="props.autoFoldThreshold"
    :read-only="props.readOnly"
    :disabled="props.disabled"
    :preview="preview"
  ></MdEditorV3>
</template>

<style lang="scss" scoped></style>
