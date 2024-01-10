import { ref, shallowRef } from 'vue'
import type { Composer, ComposerTranslation } from 'vue-i18n'
import { useI18n } from 'vue-i18n'

import { read, utils } from '@/lib/lib_files'
import { isEmpty, hasOwnProperty } from '@/lib/lib_utils'
import { setI18nInfo, getI18nInfo } from '@/lib/lib_idb'

import { getI18nMessages } from '@/i18n'

// @ts-ignore
import i18n from './i18n.xlsx?b64'
import type { ScopeKey, ModuleType, ModuleLangMap } from './i18n_setting'
import { defaultModuleLangMap, scopeList } from './i18n_setting'

export const initTranslateSrcFile = () => {
  const wb = read(i18n)
  const ws = wb.Sheets[wb.SheetNames[0]]
  const moduleList = utils.sheet_to_json<ModuleType>(ws)

  if (isEmpty(moduleList)) return defaultModuleLangMap

  const moduleLangMap = moduleList.reduce<ModuleLangMap>((resModuleLangMap, moduleItem) => {
    const { Key, en, zh_TW, zh_CN } = moduleItem

    scopeList.forEach(scopeItem => {
      const { scopeKey, label, version } = scopeItem

      if (hasOwnProperty(moduleItem, `${scopeKey}`)) {
        resModuleLangMap[scopeKey][Key] = {
          en,
          zhTw: zh_TW,
          zhCn: zh_CN
        }
      }

      // 紀錄版本
      getI18nInfo(scopeKey).then(info => {
        if (
          isEmpty(info) ||
          info.version !== version
        ) {
          setI18nInfo(scopeKey, { label, scopeKey, version })
        }
      })
    })

    return resModuleLangMap
  }, defaultModuleLangMap)

  return moduleLangMap
}


export type I18nTranslate = ComposerTranslation
export type I18nTest = (key: string) => boolean

export type ParentI18n = Partial<Composer & {
  initModuleLangMap: () => void
  i18nTranslate: I18nTranslate
  i18nTest: I18nTest
  setModuleType: (type: ScopeKey) => void
}>
/**
 * @author Caleb
 * @description 針對各模組 設定翻譯
 * @returns {Object} 翻譯工具
 */
export const useParentI18n = (): ParentI18n => {
  const moduleType = ref('')
  const i18nMap = shallowRef<Record<string, any>>(defaultModuleLangMap)

  const initModuleLangMap = () => {
    const moduleLangMap = initTranslateSrcFile()

    const _i18nMap = {}
    for (const moduleType in moduleLangMap) {
      const messages = getI18nMessages(moduleLangMap[moduleType])

      const globalI18n = useI18n({
        useScope: 'global',
        messages
      }) as Partial<Composer>

      _i18nMap[moduleType] = globalI18n
    }

    i18nMap.value = _i18nMap
  }

  const setModuleType = (type: string) => {
    moduleType.value = type
  }

  const i18nTranslate = (key: string) => {
    // 有對應模組
    if (hasOwnProperty(i18nMap.value, moduleType.value)) {
      return i18nMap.value[moduleType.value].t(key)
    }
    // 沒有對應模組
    return key
  }

  const i18nTest = (key: string) => {
    // 有對應模組
    if (hasOwnProperty(i18nMap.value, moduleType.value)) {
      return i18nMap.value[moduleType.value].te(key)
    }
    // 沒有對應模組
    return false
  }

  return {
    initModuleLangMap,
    setModuleType,
    i18nTranslate,
    i18nTest
  }
}
