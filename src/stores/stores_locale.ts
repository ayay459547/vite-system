import { computed, onBeforeMount, ref } from 'vue'
import { defineStore } from 'pinia'
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
    const cookieLocale = localStorage.getItem('locale')

    if ([null, undefined, ''].includes(cookieLocale)) {
      localStorage.setItem('locale', 'zhTw')
    }

    currentLang.value = localStorage.getItem('locale')
  }
  const elLocale = ref('zhTw')

  const currentLang = computed({
    set: (type: LangType) => {
      i18nLocale.value = type
      elLocale.value = type
      localStorage.setItem('locale', type)
    },
    get: () => {
      return t('langType')
    }
  })

  const locale = computed(() => {
    return {
      lang: currentLang.value, // 當前語言
      i18n: i18nLocale.value,  // i18n
      el: localeType[elLocale.value] // element UI 使用
    }
  })

  return {
    elLocale,
    currentLang,
    locale
  }
})
