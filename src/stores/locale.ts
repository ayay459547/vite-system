import { ref, computed, onBeforeMount } from 'vue'
import { defineStore } from 'pinia'
import { setCookie, getCookie } from '@/lib/cookie'

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
  // 初始化語言
  const init = () => {
    const cookieLocale = getCookie('locale')

    if ([null, undefined, ''].includes(cookieLocale)) {
      setCookie('locale', 'zhTw')
    }

    currentLang.value = getCookie('locale')
  }

  const setLang = (type: LangType) => {
    setCookie('locale', type)
    currentLang.value = type
  }
  const getLang = (): string => {
    // return getCookie('locale')
    return currentLang.value
  }

  const currentLang = ref('zhTw')

  const locale = computed(() => {
    return {
      lang: currentLang.value, // 全局用
      el: localeType[currentLang.value] // element UI 使用
    }
  })

  return {
    setLang,
    getLang,
    locale
  }
})
