import { computed, onBeforeMount } from 'vue'
import { defineStore } from 'pinia'
import { setCookie, getCookie } from '@/lib/cookie'
import { useI18n } from 'vue-i18n'

import ElzhTw from 'element-plus/dist/locale/zh-tw.min.js'
import ElzhCn from 'element-plus/dist/locale/zh-cn.min.js'
import Elen from 'element-plus/dist/locale/en.min.js'

export type LangType = 'zhTw' | 'zhCn' | 'en'
const localeType = {
  'zhTw': ElzhTw,
  'zhCn': ElzhCn,
  'en': Elen
}

export const useLocaleStore = defineStore('locale', () => {
  onBeforeMount(() => {
    init()
  })

  const {
    t,
    locale: i18nLocale
    // availableLocales
  } = useI18n({ useScope: 'global' })

  /**
   * 初始化語言
   * 以 cookie 上的為主
   */
  const init = () => {
    const cookieLocale = getCookie('locale')

    if ([null, undefined, ''].includes(cookieLocale)) {
      setCookie('locale', 'zhTw')
    }

    currentLang.value = getCookie('locale')
  }

  const currentLang = computed({
    set: (type: LangType) => {
      i18nLocale.value = type
      setCookie('locale', type)
    },
    get: () => {
      return t('langType')
    }
  })

  const locale = computed(() => {
    return {
      lang: currentLang.value, // 全局用
      el: localeType[currentLang.value] // element UI 使用
    }
  })

  return {
    currentLang,
    locale
  }
})