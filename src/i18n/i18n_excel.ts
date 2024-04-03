import { ref, shallowRef } from 'vue'
import type { Composer } from 'vue-i18n'
import { useI18n } from 'vue-i18n'

import { read, utils } from '@/lib/lib_files'
import type { I18nTranslate, I18nTest } from '@/lib/lib_hook'
import { isEmpty, hasOwnProperty } from '@/lib/lib_utils'
import { setI18nInfo, getI18nInfo } from '@/lib/lib_idb'

import { getI18nMessages } from '@/i18n'

import i18n from './i18n_table.xlsx?b64'
import type { ScopeKey, ModuleType, ModuleLangMap } from './i18n_setting'
import { defaultModuleLangMap, scopeList } from './i18n_setting'

export const getTranslateSrcFile = () => {
  const wb = read(i18n)
  const ws = wb.Sheets[wb.SheetNames[0]]
  const moduleList = utils.sheet_to_json<ModuleType>(ws)

  if (isEmpty(moduleList)) return defaultModuleLangMap

  const moduleLangMap = moduleList.reduce<ModuleLangMap>((resModuleLangMap, moduleItem) => {
    const { Key, en, zh_TW, zh_CN } = moduleItem

    scopeList.forEach(scopeItem => {
      const { scopeKey, label, version } = scopeItem

      if (hasOwnProperty(moduleItem, `${scopeKey}`)) {
        const i18nKey = `__${scopeKey}__:${Key}`

        // 切割 模組用翻譯
        resModuleLangMap[scopeKey][i18nKey] = {
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

export type GlobalI18n = Partial<Composer & {
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
export const useGlobalI18n = (): GlobalI18n => {
  const moduleType = ref('')
  const i18nMap = shallowRef<Record<string, any>>(defaultModuleLangMap)

  const initModuleLangMap = () => {
    const moduleLangMap = getTranslateSrcFile()

    const _i18nMap = {}
    for (const _moduleType in moduleLangMap) {
      const messages = getI18nMessages(moduleLangMap[_moduleType])

      const globalI18n = useI18n({
        useScope: 'global',
        messages
      }) as Partial<Composer>

      _i18nMap[_moduleType] = globalI18n
    }

    i18nMap.value = _i18nMap
  }

  const setModuleType = (type: string) => {
    moduleType.value = type
  }

  const i18nTranslate = (key: string, i18nModule?: string) => {
    const _i18nModule = !isEmpty(i18nModule) ? i18nModule : moduleType.value

    // 沒有對應模組
    if (
      !hasOwnProperty(i18nMap.value, _i18nModule) ||
      typeof i18nMap.value[_i18nModule]?.te !== 'function'
    ) return key

    // 有對應模組
    const i18nKey = `__${_i18nModule}__:${key}`
    if (i18nMap.value[_i18nModule]?.te(i18nKey) ?? false) {
      return i18nMap.value[_i18nModule].t(i18nKey)
    }
    return i18nMap.value[_i18nModule].t(key)
  }

  const i18nTest = (key: string, i18nModule?: string) => {
    const _i18nModule = !isEmpty(i18nModule) ? i18nModule : moduleType.value

    // 沒有對應模組
    if (
      !hasOwnProperty(i18nMap.value, _i18nModule) ||
      typeof i18nMap.value[_i18nModule]?.te !== 'function'
    ) return false

    // 有對應模組
    const i18nKey = `__${_i18nModule}__:${key}`
    return i18nMap.value[_i18nModule]?.te(i18nKey) ?? false
  }

  return {
    initModuleLangMap,
    setModuleType,
    i18nTranslate,
    i18nTest
  }
}
