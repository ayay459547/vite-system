<script setup lang="ts">
import { onMounted } from 'vue'

import { tipLog, getUuid } from '@/lib/lib_utils'

import { version, props as markdownProps } from './CustomMarkdownInfo'

const scopedName = '__i-markdown__'
const scopedId = getUuid(scopedName)

const props = defineProps(markdownProps)

onMounted(() => {
  tipLog('Markdown 內容', [props.text])
})
</script>

<template>
  <div
    class="markdown-wrapper"
    :class="[
      `CustomMarkdown_${version}`,
      scopedId,
      scopedName
    ]"
  >
    <v-md-preview class="markdown-container" :text="props.text"></v-md-preview>
  </div>
</template>

<style lang="scss" scoped>
.__i-markdown__ :deep {
  .markdown-container {
    &.v-md-editor-preview {
      .vuepress-markdown-body {
        padding: 0 !important;
      }
    }
  }
}

.__i-markdown__.markdown {
  &-wrapper {
    width: 100%;
    height: 100%;
  }
}
</style>
