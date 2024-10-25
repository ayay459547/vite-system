<script setup lang="ts">
import { ref } from 'vue'
import {
  CustomButton,
  CustomButtonGroup,
  CustomIcon,
  FormInput
} from '@/components' // 系統組件

import { isEmpty, aesDecrypt } from '@/lib/lib_utils' // 工具
import { getCookie } from '@/lib/lib_cookie'

/**
 * 替換頁面文字
 * 截圖 做簡報
 */
 const regExpText = ref('')
const newText = ref('')
const replaceText = () => {
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
    if (node.nodeType === Node.TEXT_NODE) {
      // 替換文本
      node.textContent = node.textContent.replace(regex, `${newText.value}`)
    }
    node = walker.nextNode()
  }
}


// 登入狀態
const privateKey = (import.meta as any).env.VITE_API_PRIVATE_KEY

let timer: any = null
/**
 * 檢查登入狀態資訊
 * @param isIntervalCheck 是否每5分鐘 檢查一次
 */
const checkToken = (isIntervalCheck?: boolean) => {
  const loginTime = getCookie('loginTime')
  const _token = getCookie('token')
  const temp = aesDecrypt(_token, `${privateKey}__${loginTime}`)

  const log = () => {
    console.groupCollapsed('CheckToken')
    console.log('now:', new Date())
    console.log('token:', _token)
    console.log('loginTime:', loginTime)
    console.log('userId:', temp)
    console.groupEnd()
  }
  log()

  if (typeof isIntervalCheck !== 'boolean') return

  if (timer || !isIntervalCheck) {
    clearInterval(timer)
  }

  if (isIntervalCheck) {
    timer = setInterval(() => {
      log()
    }, 5 * 60 * 1000)
  }

}

</script>

<template>
  <div>
    <!-- 替換文字 -->
    <div class="flex-column-center i-ga-xs i-py-md">
      <FormInput
        v-model="regExpText"
        placeholder="要替換的文字(RegExp)"
        clearable
      />
      <CustomIcon name="arrow-down"/>
      <FormInput
        v-model="newText"
        placeholder="替換後的文字"
        clearable
      />
      <CustomButton
        icon-name="language"
        label="替換"
        type="warning"
        plain
        size="large"
        style="width: 100%;"
        @click="replaceText"
      />
    </div>

    <!-- 登入狀態 -->
    <CustomButtonGroup>
      <CustomButton
        icon-name="user-shield"
        label="登入狀態"
        type="danger"
        plain
        size="large"
        @click="checkToken()"
      />
      <CustomButton
        icon-name="stopwatch"
        label="開啟定期確認"
        type="danger"
        plain
        size="large"
        @click="checkToken(true)"
      />
      <CustomButton
        icon-name="pause"
        label="關閉定期確認"
        type="danger"
        plain
        size="large"
        @click="checkToken(false)"
      />
    </CustomButtonGroup>
  </div>
</template>

<style lang="scss" scoped>

</style>
