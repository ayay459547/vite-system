<script setup lang="ts">
import { ref, computed } from 'vue'

import { CustomButton, CustomButtonGroup, CustomIcon } from '@/components/feature' // 系統組件
import { FormInput } from '@/components/input' // 系統組件

import dayjs from '@/lib/lib_day'
import { isEmpty, aesDecrypt, webReload } from '@/lib/lib_utils' // 工具
import { getCookie } from '@/lib/lib_storage'
import { clearToken } from '@/lib/lib_token'

/**
 * dayjs format
 */
const beforeFormatText = ref(`${new Date()}`)
const formatText = ref('YYYY-MM-DD')
const afterFormatText = computed(() => {
  if (
    isEmpty(beforeFormatText.value) ||
    isEmpty(formatText.value)
  ) return ''

  return dayjs(beforeFormatText.value).format(formatText.value)
})

// 登入狀態
const privateKey = (import.meta as any).env.VITE_API_PRIVATE_KEY

let timer: any = null
/**
 * 檢查登入狀態資訊
 * @param isIntervalCheck 是否每5分鐘 檢查一次
 */
const checkToken = (isIntervalCheck?: boolean) => {
  const loginTime = getCookie('loginTime')
  const _token = getCookie('token') ?? ''
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
  <div class="flex-column i-ga-md">
    <!-- day format -->
    <div class="flex-column i-ga-xs">
      <h3>Dayjs Format 測試</h3>
      <div class="flex-row-center i-ga-xs">
        <FormInput
          v-model="beforeFormatText"
          placeholder="Format前的文字"
          clearable
          class="flex-3"
        />
        <FormInput
          v-model="formatText"
          placeholder="Format 格式"
          clearable
          class="flex-2"
        />
      </div>
      <div class="flex-center">
        <CustomIcon name="arrow-down"/>
      </div>
      <div class="border-info i-pa-xs">
        <span>Format後的文字 : </span>
        <b>{{ afterFormatText }}</b>
      </div>
    </div>

    <!-- 登入狀態 -->
    <h3>登入狀態 測試</h3>
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
      <CustomButton
        icon-name="remove"
        label="清除登入狀態"
        type="danger"
        plain
        size="large"
        @click="clearToken()"
      />
      <CustomButton
        icon-name="rotate-right"
        label="重整畫面"
        type="info"
        plain
        size="large"
        @click="webReload()"
      />
    </CustomButtonGroup>
  </div>
</template>

<style lang="scss" scoped></style>
