<script setup lang="ts">
import { onMounted } from 'vue'

import { tipLog, getUuid } from '@/lib/lib_utils.ts'

import { version, props as markdownProps } from './CustomMarkdownInfo.ts'

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
        background-color: var(--i-color-markdown-odd);
        &:hover {
          background-color: var(--i-color-markdown-odd-hover);
        }
      }
      tr:nth-child(2n) {
        background-color: var(--i-color-markdown-even);
        &:hover {
          background-color: var(--i-color-markdown-even-hover);
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

<style lang="scss">
@use '@/assets/styles/utils' as utils;

$light-color: (
  'markdown--odd': #fcfcfc,
  'markdown--odd-hover': #f2f4f8,
  'markdown--even': #f7f7f7,
  'markdown--even-hover': #f2f4f8
);

$dark-color: (
  'markdown-odd': #303030,
  'markdown-odd-hover': #424243,
  'markdown-even': #39393A,
  'markdown-even-hover': #424243
);

// 顏色設定
html {
  // var(--i-color-table-thead)
  @each $type, $color in $light-color {
    @include utils.set-css-var-value(('color', $type), $color);
  }
}

html.dark {
  // var(--i-color-table-thead)
  @each $type, $color in $dark-color {
    @include utils.set-css-var-value(('color', $type), $color);
  }
}
</style>
