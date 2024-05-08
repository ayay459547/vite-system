<script setup lang="ts">
import { ref } from 'vue'

import markdown from '@/components/feature/CustomEmpty/CustomEmpty.md?raw'
import { CustomInput, CustomDivider, CustomMarkdown, CustomEmpty, CustomIcon } from '@/components'

// slot
const slotText = ref('slot default')
</script>

<template>
  <div class="page">
    <CustomInput label="插槽文字" v-model="slotText" clearable />

    <CustomEmpty :image-size="60" description="empty-test">
      <template #image>
        <CustomIcon name="cube" />
      </template>
      <span>{{ slotText }}</span>
    </CustomEmpty>

    <CustomDivider>markdown</CustomDivider>
    <CustomMarkdown :text="markdown" />
  </div>
</template>

<style lang="scss" scoped>
.page {
  padding: 16px;

  &-divider {
    width: 100%;
    height: 200px;
    min-height: 200px;

    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
