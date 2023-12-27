
<script setup lang="ts">
import { type PropType, onMounted } from 'vue'

import { getUuid } from '@/lib/lib_utils'

const props = defineProps({
  text: {
    type: String as PropType<string>,
    default: '',
    description: 'markdown 內容'
  }
})

onMounted(() => {
  console.log(props.text)
})

const scopedId = getUuid('__i-markdown__')

</script>

<template>
  <div class="__markdown-wrapper" :class="scopedId">
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
