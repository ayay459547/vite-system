// @ts-ignore
import i18n from './i18n.xlsx?b64'
import { read, utils } from '@/lib/lib_files'
import { isEmpty, hasOwnProperty } from '@/lib/lib_utils'
import { setI18nInfo, getI18nInfo } from '@/lib/lib_idb'

import type { ModuleType, ModuleLangMap } from './i18n_setting'
import { defaultModuleLangMap, scopeList } from './i18n_setting'

export const initTranslateSrcFile = () => {
  const wb = read(i18n)
  const ws = wb.Sheets[wb.SheetNames[0]]
  const moduleList = utils.sheet_to_json<ModuleType>(ws)

  if (isEmpty(moduleList)) return {}

  const moduleLangMap = moduleList.reduce<ModuleLangMap>((moduleLangMap, moduleItem) => {
    const { Key, en, zh_TW, zh_CN } = moduleItem

    scopeList.forEach(scopeItem => {
      const { scopeKey, version } = scopeItem

      if (hasOwnProperty(moduleItem, `${scopeKey}`)) {
        moduleLangMap[scopeKey][Key] = {
          en,
          zhTW: zh_TW,
          zhCN: zh_CN
        }
      }

      // 紀錄版本
      getI18nInfo(scopeKey).then(info => {
        if (
          isEmpty(info) ||
          info.version !== version
        ) {
          setI18nInfo(scopeKey, { scopeKey, version })
        }
      })
    })

    return moduleLangMap
  }, defaultModuleLangMap)

  console.log(moduleLangMap)
  return moduleLangMap
}
