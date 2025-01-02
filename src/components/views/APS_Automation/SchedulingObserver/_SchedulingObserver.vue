<script setup lang="ts">
/**
 * 使用 setTimeout 定期取得 排程狀態
 */
import type { PropType } from 'vue'
import { inject, onMounted, computed, onUnmounted } from 'vue'

// 全域功能類型
import type { UseHook } from '@/declare/hook' // 全域功能類型
import { CustomButton } from '@/components' // 系統組件

// 引入API
import { getSchedulingState } from './api'

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
    description: `
      v-model 是否為排程中
    `
  },
  textIsScheduling: {
    type: String as PropType<string>,
    required: false,
    description: '系統排程時的提示文字'
  },
  textUnScheduling: {
    type: String as PropType<string>,
    required: false,
    default: '系統排程完',
    description: ''
  },
  interval: {
    type: Number as PropType<number>,
    required: false,
    default: 10,
    description: `
      相隔多久時間檢查排停，單位為秒
      預設十秒鐘
    `
  }

})

const emit = defineEmits([
  'update:model-value', // 更新modelValue(isScheduling)
  'change' // modelValue變更時觸發
])

defineExpose({
  reset: () => resetScheduling(1000) // 頁面編輯排程後 重新檢查時使用
})


const schedulingState = computed({
  get: () => props.modelValue,
  set: (value:boolean) => {
    emit('update:model-value', value)
  }
})

// 檢察Scheduling並更新v-model
// schedulingState有變更則回傳true
const setScheduling = async () => {
  const resData = await getSchedulingState()
  const { status, data } = resData
  if(status === 'success') {
    const prevState = schedulingState.value
    const nextState = data.isScheduling
    if(prevState !== nextState) {
      schedulingState.value = nextState
      return true
    }
  }
  return false
}
// 定期檢查用 會觸發@change
const checkScheduling = async () => {
  if(stopCheck)  {
    clearInterval(nIntervId)
  } else {
    const successChange = await setScheduling()
    if(successChange)  emit('change', schedulingState.value)
  }
}

// 頁面編輯排程或者頁面載入時 一次性重設SchedulingState
// 不觸發@change
const resetScheduling = async (delay?: number) => {
  schedulingState.value = true // 設置狀態為排程中
  if(delay) setTimeout(setScheduling, delay)
  else setScheduling()
}

// 根據是否排停顯示文字
const messageText = () => {
  if(schedulingState.value) {  // 排程中
    return props.textIsScheduling ?? i18nTranslate('system-scheduling')
  }
  else return props.textUnScheduling // 排停
}

let stopCheck = false
let nIntervId
onMounted(() => {
  // 是否使用排停檢察功能
  if(useSchedulingCheck()) {
    // 使用則定期檢查排停
    resetScheduling()
    const intervalMS = props.interval * 1000 // seconds => millseconds
    nIntervId = setInterval(checkScheduling, intervalMS)
  }
  else {
    // 不使用則固定視為排停
    schedulingState.value = false
  }

  // 一段時間後設置為排停，測試用
  // setTimeout(() => {
  //   schedulingState.value = false
  // }, 5000)
})

onUnmounted(() => {
  stopCheck = true
})

</script>

<template>
  <CustomButton
    v-if="useSchedulingCheck"
    icon-name="check"
    type="danger"
    :loading="schedulingState"
  >
    <span>{{ messageText() }}</span>
  </CustomButton>
</template>

<style lang="scss" scoped></style>
