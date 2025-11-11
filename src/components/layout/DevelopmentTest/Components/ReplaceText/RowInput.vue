<script setup lang="ts">
import { ref } from 'vue'

import { FormInput } from '@/components/input' // 系統組件
import { isEmpty } from '@/lib/lib_utils' // 工具

/**
 * 替換頁面文字
 * 截圖 做簡報
 */
const regExpText = ref('')
const newText = ref('')
const replaceText = () => {
  if (isEmpty(regExpText)) return

  // 定義正規表達式，用來匹配需要替換的文本
  const regex = new RegExp(regExpText.value, 'g')

  // 遍歷所有文本節點
  const walker: TreeWalker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null
  )

  let node: Node | null = null

  node = walker.nextNode()
  while (!isEmpty(node)) {
    if (node !== null && node.nodeType === Node.TEXT_NODE) {
      // 替換文本
      node.textContent = (node?.textContent ?? '').replace(regex, `${newText.value}`)
    }
    node = walker.nextNode()
  }
}

defineExpose({
  replaceText
})

</script>

<template>
  <div class="flex-row-center i-ga-xs">
    <FormInput
      v-model="regExpText"
      placeholder="要替換的文字(RegExp)"
      clearable
    />
    <CustomIcon name="arrow-right"/>
    <FormInput
      v-model="newText"
      placeholder="替換後的文字"
      clearable
    />
  </div>
</template>

<style lang="scss" scoped></style>
