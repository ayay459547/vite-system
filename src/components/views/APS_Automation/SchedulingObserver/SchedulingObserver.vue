<script setup lang="ts">
/**
 * 使用 WebSocket 排程資訊
 */
import type { PropType } from 'vue'
import { inject, ref, onMounted, computed, onUnmounted, watch } from 'vue'

// 全域功能類型
import type { UseHook } from '@/declare/hook' // 全域功能類型
import type { CustomButtonProps } from '@/components' // 系統組件
import { CustomIcon, CustomButton, CustomPopover, CustomProgress } from '@/components' // 系統組件
import { isEmpty } from '@/lib/lib_utils'

import { useWebSocket } from '@/lib/lib_hook'
// import { fake_useWebSocket } from './wsTest' // 測試用

const useHook = inject('useHook') as UseHook 
const { i18nTranslate } = useHook({
  i18nModule: 'auto_common'
})

// 是否使用排停檢查
const useSchedulingCheck = () => {
  return true
  // return false
}

const props = defineProps({
  modelValue: {
    type: Boolean as PropType<boolean>,
    required: true,
    description: 'v-model 是否為排程中'
  }
})

const emit = defineEmits([
  'update:model-value', // 更新modelValue(isScheduling)
  'change' // modelValue變更時觸發
])

const tempValue = computed({
  get: () => props.modelValue,
  set: (value:boolean) => {
    emit('update:model-value', value)
  }
})

// 儲存發送和接收的訊息
type WsMessage = {
  isScheduling: boolean // 是否排程中
  // 有排程才有以下資訊
  progressRate?: number // 排程進度
  startTime?: string // 排程開始時間
  completeTime?: string // 排程結束時間
  schedulingProgressTime?: number // 排程進行時間
}
const wsMessage = ref<WsMessage>({
  isScheduling: false
})

// const { status, data, close, open } = fake_useWebSocket('/ejb-demo/webSocket/schedulingProgress', {})
const { status, data, close, open } = useWebSocket('/ejb-demo/webSocket/schedulingProgress', {
  autoReconnect: {
    retries: 10, // 錯誤 重新連線10次
    delay: 3000
  }
})

// 監聽接收到的訊息
watch(data, (newMessage: string) => {
  const _newMessage = JSON.parse(newMessage) as WsMessage
  if (typeof _newMessage === 'object') {
    wsMessage.value = _newMessage
    tempValue.value = _newMessage.isScheduling
  }
})

const reset = () => {
  open()
  tempValue.value = false
}
defineExpose({
  // 頁面編輯排程後 重新檢查時使用
  reset
})
onMounted(() => reset())
onUnmounted(() => close())

// 排程狀態
const schedulingState = computed(() => {
  // 連線中, 連線失敗
  if (['CONNECTING', 'CLOSED'].includes(status.value)) return status.value
  // status.value = 'OPEN' 連線成功

  if (wsMessage.value.isScheduling) {
    return 'scheduling' // 排程中
  }
  // 沒有 開始日期, 完成日期 => 從未進行排程
  if (isEmpty(wsMessage.value.startTime) && isEmpty(wsMessage.value.completeTime)) {
    return 'not-scheduled' // 未排程
  }
  return 'scheduled' // 已排程
})

// 依據排程狀態 決定按鈕樣式
const buttonInfo = computed<{
  type: CustomButtonProps.Type
  icon: string
  text: string
}>(() => {
  switch (schedulingState.value) {
    case 'CONNECTING': // 連線中
      return { type: 'warning', icon: 'PlugConnected', text: i18nTranslate('ws-connecting') }
    case 'CLOSED': // 連線失敗
      return { type: 'danger', icon: 'ExclamationMark', text: i18nTranslate('ws-connect-error') }
      case 'scheduling': // 系統排程中
        return { type: 'primary', icon: 'Loader', text: i18nTranslate('system-scheduling') }
    case 'scheduled': // 系統已排程
      return { type: 'success', icon: 'BrowserCheck', text: i18nTranslate('system-scheduled') }
    case 'not-scheduled': // 系統未排程
      return { type: '', icon: 'BrowserCheck', text: i18nTranslate('system-not-scheduled') }
    default:
      return { type: '', icon: 'BrowserCheck', text: '' }
  }
})

// 進度
const percentage = computed(() => {
  switch (schedulingState.value) {
    case 'scheduling':
      return wsMessage.value.progressRate
    case 'scheduled':
      return 100
    case 'CONNECTING':
    case 'CLOSED':
    case 'not-scheduled':
    default:
      return 0
  }
})
// 狀態
const progressStatus = computed(() => {
  switch (schedulingState.value) {
    case 'CONNECTING':
      return 'warning'
    case 'CLOSED':
      return 'exception'
    case 'scheduled':
      return 'success'
    case 'scheduling':
    case 'not-scheduled':
    default:
      return ''
  }
})

</script>

<template>
  <div class="Scheduling-observer">
    <CustomPopover :width="240" trigger="click">
      <template #reference>
        <CustomButton
          v-if="useSchedulingCheck"
          :type="buttonInfo.type"
          plain
        >
          <template #icon>
            <CustomIcon
              class="scheduling-icon"
              :class="schedulingState === 'scheduling' ? 'is-scheduling' : ''"
              x-type="tabler"
              :name="buttonInfo.icon"
            />
          </template>
          <span class="scheduling-text">{{ buttonInfo.text }}</span>
        </CustomButton>
      </template>
      <div class="scheduling-info">
        <div class="scheduling-progress-wrapper">
          <CustomProgress
            type="circle"
            :percentage="percentage"
            :status="progressStatus"
          >
            <template #default>
              <div class="scheduling-progress-container">
                <div v-if="['CLOSED', 'CONNECTING'].includes(schedulingState)">
                  {{ buttonInfo.text }}
                </div>
                <template v-else>
                  <span class="scheduling-progress-rate">{{ `${percentage}%` }}</span>
                  <span class="scheduling-progress-second">{{ `${wsMessage.schedulingProgressTime ?? '0'} s` }}</span>
                </template>
              </div>
            </template>
          </CustomProgress>
        </div>
        <div v-show="!['CONNECTING', 'CLOSED'].includes(schedulingState)" class="scheduling-time">
          <span>{{ `${i18nTranslate('datetime-startTime')}: ${wsMessage.startTime ?? ''}` }}</span>
          <span>{{ `${i18nTranslate('datetime-endTime')}: ${wsMessage.completeTime ?? ''}` }}</span>
        </div>
      </div>
    </CustomPopover>
  </div>
</template>

<style lang="scss" scoped>
@keyframes loading-rotate {
  0% { transform: rotateZ(0deg); }
  100% { transform: rotateZ(360deg); }
}

.scheduling {
  &-observer {
    width: fit-content;
    height: fit-content;
  }

  &-icon {
    font-size: 0.8em !important;
    display: flex;
    align-items: center;

    &.is-scheduling {
      animation: loading-rotate 1.5s linear infinite;
    }
  }
  &-info {
    display: flex;
    flex-direction: column;
  }
  &-progress {
    &-wrapper {
      margin: 0 auto;
    }
    &-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    &-rate {
      font-size: 1.4em;
    }
    &-second {
      font-size: 1em;
    }
  }
  &-time {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}

</style>
