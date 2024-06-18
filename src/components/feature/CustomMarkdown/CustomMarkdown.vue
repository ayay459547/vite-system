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
    class="markdown-container"
    :class="[
      `CustomMarkdown_${version}`,
      scopedId,
      scopedName
    ]"
  >
    <v-md-preview class="markdown-main" :text="props.text"></v-md-preview>
  </div>
</template>

<style lang="scss" scoped>
.__i-markdown__ :deep(.markdown-main) {
  &.v-md-editor-preview {
    .vuepress-markdown-body {
      padding: 0 !important;
      background-color: inherit !important;

      color: inherit !important;
      tr {
        background-color: var(--i-color-row-odd);
        &:hover {
          background-color: var(--i-color-row-odd-hover);
        }
      }
      tr:nth-child(2n) {
        background-color: var(--i-color-row-even);
        &:hover {
          background-color: var(--i-color-row-even-hover);
        }
      }
    }
  }
}

.__i-markdown__.markdown {
  &-container {
    width: 100%;
    height: 100%;
  }
}
</style>
