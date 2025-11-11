import type { WatchHandle } from 'vue'
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'

import type { VeeRes, ValidateType } from '@/lib/lib_validate'
import validateFun from '@/lib/lib_validate'
import { isEmpty } from '@/lib/lib_utils' // 工具
import { useModalSelectStore } from '@/stores/stores_components/useModalSelectStore'

import type { Props } from './CustomInputInfo'

// 驗證
export const useValidate = (props: Record<string, any>, i18nTest: (string: any) => boolean) => {
  const validateCount = ref(0)
  onMounted(() => {
    validateCount.value = 0
  })

  const validateField = (veeValue: Props['modelValue']) => {
    // 一開始不驗證
    if (validateCount.value === 0) {
      validateCount.value++
      return true
    }
    // 必填
    if (props.required) {
      switch (props.type) {
        case 'operator':
        case 'daterange':
        case 'timerange':
          if (
            !Array.isArray(veeValue) ||
            isEmpty(veeValue[0]) ||
            isEmpty(veeValue[1])
          ) return 'validate-required'
          break
        default:
          if (isEmpty(veeValue)) return 'validate-required'
          break
      }
    }
    // 非必填
    if (isEmpty(veeValue)) return true

    // 多個驗證格式
    if (Object.prototype.toString.call(props.validate) === '[object Array]') {
      for (const type of props.validate as ValidateType[]) {
        const { test, label, i18nLabel } = validateFun[type](veeValue) as VeeRes
        if (!test) return i18nTest(i18nLabel) ? i18nLabel : label
      }
    }

    // 單一驗證格式
    if (Object.prototype.toString.call(props.validate) === '[object String]') {
      const { test, label, i18nLabel } = validateFun[props.validate as ValidateType](veeValue) as VeeRes
      if (!test) return i18nTest(i18nLabel) ? i18nLabel : label
    }

    return true
  }

  // 錯誤訊息
  const errorMessage = ref('')

  const isError = computed(() => {
    return !isEmpty(errorMessage.value)
  })

  return {
    validateCount,
    validateField,
    errorMessage,
    isError
  }
}

// ModalSelect
export const useModalSelect = (isUseModalSelect: boolean, onOpenCallback: () => void) => {
  const valueModalSelect = ref()

  const modalSelectStore = useModalSelectStore()
  const { isModalOpen } = storeToRefs(modalSelectStore)

  // 監聽
  let unwatch: WatchHandle | null = null

  const openWatchModalSelect = () => {
    if (!isUseModalSelect) return
    unwatch = watch(isModalOpen, (newValue: boolean, oldValue: boolean) => {
      /**
       * 當打開 ModalSelectManagement
       * 需要輸入框 blur (關閉選擇框的選項)
       */
      if (!oldValue && newValue) {
        onOpenCallback()
      } else {
        stopWatchModalSelect()
      }
    }, { deep: false, immediate: false })
  }

  const stopWatchModalSelect = () => {
    if (!isUseModalSelect) return
    if (unwatch && typeof unwatch === 'function') {
      unwatch() // 取消監聽
      unwatch = null
    }
  }

  onUnmounted(() => {
    stopWatchModalSelect()
  })

  return {
    valueModalSelect,
    openWatchModalSelect,
    stopWatchModalSelect
  }
}
