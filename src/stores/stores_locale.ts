import { computed, onBeforeMount, ref } from 'vue'
import { defineStore } from 'pinia'
import { useI18n } from 'vue-i18n'

import ElzhTw from 'element-plus/dist/locale/zh-tw.min.js'
import ElzhCn from 'element-plus/dist/locale/zh-cn.min.js'
import Elen from 'element-plus/dist/locale/en.min.js'

export type LangType = 'zhTw' | 'zhCn' | 'en' | string | null
const elLocaleMap = {
  zhTw: ElzhTw,
  zhCn: ElzhCn,
  en: Elen
}

export const useLocaleStore = defineStore('locale', () => {

  const {
    t: i18nT,
    locale: i18nLocale // 語言類型
    // availableLocales
  } = useI18n({ useScope: 'global' })

  const systemLocale = ref('zhTw')

  const setSystemLocale = (lang: LangType) => {
    i18nLocale.value = lang
    systemLocale.value = lang
    localStorage.setItem('locale', lang)
  }

  const currentLang = computed(() => {
    return i18nT('locale-language')
  })

  // element ui config locale
  const elLocale = computed(() => {
    return elLocaleMap[systemLocale.value]
  })

  /**
   * 初始化語言
   * 以 cookie 上的為主
   */
  const init = () => {
    const cookieLocale = localStorage.getItem('locale')

    if ([null, undefined, ''].includes(cookieLocale)) {
      localStorage.setItem('locale', 'zhTw')
    }

    setSystemLocale(localStorage.getItem('locale'))
  }
  onBeforeMount(() => {
    init()
  })

  // @ts-ignore TEST 更換語言
  window.changeLang = () => {
    switch (systemLocale.value) {
      case 'zhTw':
        setSystemLocale('zhCn')
        break
      case 'zhCn':
        setSystemLocale('en')
        break
      case 'en':
        setSystemLocale('zhTw')
        break
      default:
        setSystemLocale('zhTw')
        break
    }
  }

  return {
    systemLocale,
    setSystemLocale,
    currentLang,
    elLocale
  }
})
