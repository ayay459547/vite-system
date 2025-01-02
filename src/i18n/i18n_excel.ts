import { ref, shallowRef } from 'vue'
import type { Composer } from 'vue-i18n'
import { useI18n } from 'vue-i18n'

import { isEmpty, hasOwnProperty } from '@/lib/lib_utils' // 工具
import type { LangMap } from '@/i18n'
import { getI18nMessages } from '@/i18n'

import type { I18nTranslate, I18nTest } from './i18n_setting'
import { scopeList, defaultModuleType } from './i18n_setting'

// transformExcel.ts: 將 excel 轉換成 json
import i18nJson from './i18n.json'

const initI18n = () => {
  const excelJsonList = i18nJson as any[]
  const moduleMap: Record<string, Set<any>> = {}

  if (isEmpty(excelJsonList)) return { langMap: {}, moduleMap }

  const scopeKeyList: any[] = []

  // 記錄不同模組翻譯檔版本
  scopeList.forEach(scopeItem => {
    const { scopeKey: i18nModule } = scopeItem

    scopeKeyList.push(i18nModule)
    // 使翻譯可區分模組 紀錄可用翻譯
    moduleMap[i18nModule] = new Set()
  })

  const langMap = excelJsonList.reduce<LangMap>((resLangMap, excelJsonItem) => {
    const { Key: i18nKey, en, zh_TW, zh_CN } = excelJsonItem

    scopeKeyList.forEach(i18nModule => {
      if (hasOwnProperty(excelJsonItem, i18nModule)) {
        moduleMap[i18nModule].add(i18nKey)
      }
    })

    // https://vue-i18n.intlify.dev/guide/advanced/composition#message-translation
    resLangMap[i18nKey] = {
      zhTw: `${zh_TW}`,
      zhCn: `${zh_CN}`,
      en: `${en}`

      // key | 預設顯示文字 | 客製化(可能需要 尚未製作)
      // zhTw: `${i18nKey} | ${zh_TW} | ${zh_TW}`,
      // zhCn: `${i18nKey} | ${zh_CN} | ${zh_CN}`,
      // en: `${i18nKey} | ${en} | ${en}`
    }

    return resLangMap
  }, {})

  return { langMap, moduleMap }
}

export type GlobalI18n = Partial<Composer> & {
  initModuleLangMap: () => void
  i18nTranslate: I18nTranslate
  i18nTest: I18nTest
  langMap: Record<string, any>
}

/**
 * @author Caleb
 * @description 針對各模組 設定翻譯
 * @returns {Object} 翻譯工具
 */
export const useGlobalI18n = (): GlobalI18n => {
  // 對照表
  const langMap = shallowRef<Record<string, any>>({})
  // 模組
  const moduleMap = shallowRef<Record<string, any>>({})
  // 翻譯
  const globalI18n = ref({
    t: (i18nKey: string) => `${i18nKey}`,
    te: (i18nKey: string) => (typeof i18nKey === 'string')
  })

  const initModuleLangMap = () => {
    const { langMap: _langMap, moduleMap: _moduleMap } = initI18n()

    const messages = getI18nMessages(_langMap)

    const _globalI18n = useI18n({
      useScope: 'global',
      messages
    })

    langMap.value = _langMap
    moduleMap.value = _moduleMap
    globalI18n.value = _globalI18n as any
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

    if (!check_key_in_i18nModule(i18KeyList, i18nModule)) return false
    return i18KeyList.every(_i18nKey => {
      return globalI18n.value.te(_i18nKey)
    })
  }

  // 翻譯
  const i18nTranslate = (i18nKey: string | string[], i18nModule: string = defaultModuleType) => {
    const i18KeyList = getI18nKeyList(i18nKey)

    if (!check_key_in_i18nModule(i18KeyList, i18nModule)) return i18KeyList.join(' , ')
    return i18KeyList.map(_i18nKey => {
      return globalI18n.value.t(_i18nKey)
    }).join(' ')
  }

  return {
    initModuleLangMap,
    i18nTranslate,
    i18nTest,
    langMap
  }
}
