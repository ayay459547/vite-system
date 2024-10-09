import { ref, shallowRef } from 'vue'
import type { Composer } from 'vue-i18n'
import { useI18n } from 'vue-i18n'

// import { read, utils } from '@/lib/lib_files'
import { isEmpty, hasOwnProperty } from '@/lib/lib_utils'
import { setI18nInfo, getI18nInfo } from '@/lib/lib_idb'

import type { LangMap } from '@/i18n'
import { getI18nMessages } from '@/i18n'

import type { ScopeKey, I18nTranslate, I18nTest } from './i18n_setting'
import { scopeList, defaultModuleType } from './i18n_setting'

/**
 * 如果不需要 更新翻譯檔
 * 註解 .xlsx?b64
 *
 * 只有啟動服務時有效 限定development
 * 讀取 ?b64
 * 1.將 i18n.xlsx 轉 base64
 * 2.base64 轉 json
 * 3.重新寫入 i18n.json
 */

import i18nJson from './i18n.json'
import i18nXlsx from './i18n.xlsx?b64'

// 測試用
// import i18nJson from './i18n_test.json'
// import i18nXlsx from './i18n_test.xlsx?b64'

const mode = (import.meta as any).env.MODE
if (mode === 'development') {
  console.groupCollapsed('[init] i18nXlsx')
  console.log(i18nXlsx)
  console.log(i18nJson)
  console.groupEnd()
}

export const initTranslateSrcFile = () => {
  const excelJsonList = i18nJson as any[]
  const moduleMap = {}

  if (isEmpty(excelJsonList)) return { langMap: {}, moduleMap }

  const scopeKeyList = []
  // 記錄不同模組翻譯檔版本
  scopeList.forEach(scopeItem => {
    const { scopeKey: i18nModule, label, version } = scopeItem

    scopeKeyList.push(i18nModule)
    // 使翻譯可區分模組 紀錄可用翻譯
    moduleMap[i18nModule] = new Set()

    // 紀錄版本
    getI18nInfo(i18nModule).then(info => {
      if (isEmpty(info) || info.version !== version) {
        setI18nInfo(i18nModule, { scopeKey: i18nModule, label, version })
      }
    })
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
      // key | 預設顯示文字 | 客製化(尚未製作)
      zhTw: `${i18nKey} | ${zh_TW} | ${zh_TW}`,
      zhCn: `${i18nKey} | ${zh_CN} | ${zh_CN}`,
      en: `${i18nKey} | ${en} | ${en}`
    }

    return resLangMap
  }, {})

  return { langMap, moduleMap }
}

export type GlobalI18n = Partial<
  Composer & {
    initModuleLangMap: () => void
    i18nTranslate: I18nTranslate
    i18nTest: I18nTest
    setModuleType: (type: ScopeKey) => void
  }
>
/**
 * @author Caleb
 * @description 針對各模組 設定翻譯
 * @returns {Object} 翻譯工具
 */
export const useGlobalI18n = (): GlobalI18n => {
  // 模組
  const moduleMap = shallowRef<Record<string, any>>({})
  // 翻譯
  const globalI18n = ref<Partial<Composer>>({
    t: () => '',
    te: () => false
  })

  const initModuleLangMap = () => {
    const { langMap, moduleMap: _moduleMap } = initTranslateSrcFile()

    const messages = getI18nMessages(langMap)

    const _globalI18n = useI18n({
      useScope: 'global',
      messages
    }) as Partial<Composer>

    moduleMap.value = _moduleMap
    globalI18n.value = _globalI18n
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
    i18nTest
  }
}
