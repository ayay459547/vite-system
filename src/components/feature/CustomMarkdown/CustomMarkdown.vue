<script setup lang="ts">
import { onMounted } from 'vue'

import { tipLog, getUuid } from '@/lib/lib_utils'

import { version, props as markdownProps } from './CustomMarkdownInfo'

const scopedId = getUuid('__i-markdown__')

const props = defineProps(markdownProps)

onMounted(() => {
  tipLog('Markdown 內容', [props.text])
})
</script>

<template>
  <div :class="`CustomMarkdown_${version} ${scopedId}`" class="__markdown-wrapper">
    <v-md-preview class="__markdown-container" :text="props.text"></v-md-preview>
  </div>
</template>

<style lang="scss" scoped>
:deep(.__markdown-container) {
  &.v-md-editor-preview {
    .vuepress-markdown-body {
      padding: 0 !important;
    }
  }
}

.__markdown {
  &-wrapper {
    width: 100%;
    height: 100%;
  }
}
</style>
