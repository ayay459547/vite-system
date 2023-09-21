
<script setup lang="ts">
import type { PropType } from 'vue'
import { onMounted } from 'vue'

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

</script>

<template>
  <div class="markdown-wrapper">
    <v-md-preview :text="props.text"></v-md-preview>
  </div>
</template>

<style lang="scss" scoped>
.markdown {
  &-wrapper {
    width: 100%;
    height: 100%;
  }
}
</style>
