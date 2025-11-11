import { computed, ref, shallowRef } from 'vue'
import { defineStore } from 'pinia'
import { useI18n } from 'vue-i18n'

import { useEventBus } from '@/lib/lib_hook' // 自訂Composition API
import { setLocalStorage, getLocalStorage } from '@/lib/lib_storage'

import type { LangType, I18nMap } from '@/types/types_i18n'
import {
  defaultModuleType, scopeList,
  defaultLang, langList,
  elLocaleMap,
  defaultI18nShowType, i18nShowTypeMap, i18nShowTypeList
} from '@/declare/declare_i18n'
import { getI18nMessages } from '@/lib/lib_i18n'
import { isEmpty, hasOwnProperty, fetchPublicJsonFile, tipLog } from '@/lib/lib_utils' // 工具

export const useI18nStore = defineStore('I18n', () => {
  const {
    te: i18nTe,
    t: i18nT,
    locale: i18nLocale, // 語言類型
    setLocaleMessage
    // getLocaleMessage
    // availableLocales
  } = useI18n({ useScope: 'global' })
  const i18nBus = useEventBus<string>('i18n')

  const systemLocale = ref<string>(defaultLang)

  const setSystemLocale = (lang: LangType) => {
    i18nLocale.value = lang ?? defaultLang
    systemLocale.value = lang ?? defaultLang
    i18nBus.emit('langChange', lang)
    setLocalStorage('locale', lang ?? defaultLang)
  }
  const initSystemLocale = () => {
    const locale_storage = getLocalStorage('locale')
    if (
      [null, undefined, ''].includes(locale_storage) ||
      // 設定的語言 沒有定義在系統中
      !langList.includes(locale_storage)
    ) {
      // 重置
      setLocalStorage('locale', defaultLang)
    }
    setSystemLocale(getLocalStorage('locale'))
  }

  const currentLang = computed(() => {
    return i18nT('locale-language')
  })

  // ElConfigProvider 使用 給所有 Element Plus UI 組件 翻譯
  const elLocale = computed(() => {
    return elLocaleMap[systemLocale.value]
  })

  // 確認翻譯 有沒有在 對應的模組中
  const moduleMap = shallowRef<Record<string, any>>({})
  // i18n 用對照表
  const i18nLangMap = shallowRef<I18nMap>({})

  // 系統預設 翻譯設定
  const langMap = shallowRef<I18nMap>({})

  // 顯示類型設定
  const __activeI18nShowType__ = ref(1)
  const activeI18nShowType = computed({
    get: () => __activeI18nShowType__.value,
    set: (v: number) => {
      __activeI18nShowType__.value = v
      const i18nShowType_storage = i18nShowTypeList[v]
      setLocalStorage('i18nShowType', i18nShowType_storage)
    }
  })
  // local 翻譯設定
  const localLangMap = shallowRef<I18nMap>({})
  const setLocalLangMap = (__localLangMap__: I18nMap) => {
    if (typeof __localLangMap__ !== 'object') return
    setLocalStorage('localLangMap', JSON.stringify(__localLangMap__))
    localLangMap.value = __localLangMap__
  }
  // 初始化 i18n 顯示設定
  const initI18nShow = () => {
    const i18nShowType_storage = getLocalStorage('i18nShowType')
    if (
      [null, undefined, ''].includes(i18nShowType_storage) ||
      // 設定的語言 沒有定義在系統中
      !i18nShowTypeList.includes(i18nShowType_storage)
    ) {
      // 重置
      setLocalStorage('i18nShowType', defaultI18nShowType)
    }
    activeI18nShowType.value = i18nShowTypeMap[getLocalStorage('i18nShowType')]

    // local 設定
    const localLangMap_storage = getLocalStorage('localLangMap')
    if ([null, undefined, ''].includes(localLangMap_storage)) {
      setLocalLangMap({})
    } else {
      localLangMap.value = JSON.parse(getLocalStorage('localLangMap'))
    }
  }

  // 初始化 模組+翻譯
  const isInitFinish = ref(false)
  const initModuleLangMap = async () => {
    // transformExcel.ts: 將 excel 轉換成 json
    const translateSrcFile: [any[], any[]] = await fetchPublicJsonFile('/i18N/translateSrcFile.json')

    // 有相同的 translateSrcFile_Cust 覆蓋 translateSrcFile
    const excelJsonList: any[] = [...translateSrcFile]

    const __moduleMap__: Record<string, Set<any>> = {}

    if (isEmpty(excelJsonList)) {
      tipLog('無翻譯檔資料', [
        `excelJsonList: ${excelJsonList}`,
        `moduleMap: ${moduleMap.value}`,
        `i18nLangMap: ${i18nLangMap.value}`,
        `langMap: ${langMap.value}`,
        `localLangMap: ${localLangMap.value}`
      ])
      return
    }

    const scopeKeyList: any[] = []

    // 記錄不同模組翻譯檔版本
    scopeList.forEach(scopeItem => {
      const { scopeKey: i18nModule } = scopeItem

      scopeKeyList.push(i18nModule)
      // 使翻譯可區分模組 紀錄可用翻譯
      __moduleMap__[i18nModule] = new Set()
    })

    const { __langMap__, __i18nLangMap__ } = excelJsonList.reduce<{
      __langMap__: I18nMap
      __i18nLangMap__: I18nMap
    }>((res, excelJsonItem) => {
      const { Key: i18nKey, zh_TW, zh_CN, en } = excelJsonItem

      scopeKeyList.forEach(i18nModule => {
        if (hasOwnProperty(excelJsonItem, i18nModule)) {
          __moduleMap__[i18nModule].add(i18nKey)
        }
      })

      res.__langMap__[i18nKey] = {
        zh_TW: `${zh_TW}`,
        zh_CN: `${zh_CN}`,
        en: `${en}`
      }

      const {
        zh_TW: local_zh_TW,
        zh_CN: local_zh_CN,
        en: local_en
      } = (
        hasOwnProperty(localLangMap.value, i18nKey) ?
        localLangMap.value[i18nKey] : excelJsonItem
      )

      // https://vue-i18n.intlify.dev/guide/advanced/composition#message-translation
      res.__i18nLangMap__[i18nKey] = {
        // 語言: key(開發使用) | 系統預設顯示 | local設定 (對應 useI18nTypeMap)
        zh_TW: `${i18nKey} | ${zh_TW} | ${local_zh_TW}`,
        zh_CN: `${i18nKey} | ${zh_CN} | ${local_zh_CN}`,
        en: `${i18nKey} | ${en} | ${local_en}`
      }

      return res
    }, {
      __langMap__: {},
      __i18nLangMap__: {}
    })

    const i18nMessages = getI18nMessages(__i18nLangMap__)
    for (const locale in i18nMessages) {
      setLocaleMessage(locale, i18nMessages[locale])
    }
    moduleMap.value = __moduleMap__
    i18nLangMap.value = __i18nLangMap__
    langMap.value = __langMap__

    console.groupCollapsed('🌎 init i18n')
      console.log(moduleMap.value)
      console.log(langMap.value)
    console.groupEnd()
    isInitFinish.value = true
  }

  // 將翻譯的key轉成array
  const getI18nKeyList = (i18nKey: string | string[]) => {
    let i18KeyList: string[] = []
    if (Array.isArray(i18nKey)) {
      i18KeyList = i18nKey
    } else if (typeof i18nKey === 'string') {
      i18KeyList = [i18nKey]
    }

    return i18KeyList
  }
  // 確認模組中是否有key
  const check_key_in_i18nModule = (i18KeyList: string[], i18nModule: string): boolean => {
    if (
      typeof moduleMap.value[i18nModule] !== 'object' ||
      i18KeyList.length === 0
    ) return false

    return i18KeyList.every(_i18nKey => {
      return moduleMap.value[i18nModule].has(_i18nKey)
    })
  }

  // 確認key是否存在翻譯
  const i18nTest = (i18nKey: string | string[], i18nModule: string = defaultModuleType) => {
    const i18KeyList = getI18nKeyList(i18nKey)
    if (!isInitFinish.value) return false

    if (!check_key_in_i18nModule(i18KeyList, i18nModule)) return false
    return i18KeyList.every(_i18nKey => {
      return i18nTe(_i18nKey)
    })
  }

  // 翻譯
  const i18nTranslate = (i18nKey: string | string[], i18nModule: string = defaultModuleType) => {
    const i18KeyList = getI18nKeyList(i18nKey)
    if (!isInitFinish.value) return ''

    if (!check_key_in_i18nModule(i18KeyList, i18nModule)) return i18KeyList.join(' , ')
    return i18KeyList.map(_i18nKey => {
      return i18nT(_i18nKey, activeI18nShowType.value)
    }).join(' ')
  }

  /**
   * 初始化語言
   * 1. cookie 設定
   * 2. i18n 顯示設定
   * 3. i18n 設定
   */
  const initI18n = () => {
    console.log('🍍 stores_i18n initI18n()')
    initSystemLocale()
    initI18nShow()
    initModuleLangMap()
  }
  initI18n()

  return {
    systemLocale,
    setSystemLocale,
    currentLang,
    elLocale,
    i18nLangMap,
    langMap,
    i18nTest,
    i18nTranslate,
    activeI18nShowType,
    localLangMap,
    setLocalLangMap,
    initModuleLangMap
  }
})
