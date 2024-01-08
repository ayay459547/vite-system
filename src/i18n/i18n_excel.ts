// @ts-ignore
import i18n from './i18n.xlsx?b64'
import { read, utils } from '@/lib/lib_files'
import type { LangMap } from '@/i18n'
import { isEmpty, hasOwnProperty } from '@/lib/lib_utils'

interface I18n {
  Key: string
  zhTW?: string
  zhCN?: string
  en?: string
}

interface ModuleType extends I18n {
  system?: string
  test?: string
  view?: string
}

type ModuleLangMap = {
  system: LangMap
  test: LangMap
  view: LangMap
}

export const initTranslateSrcFile = () => {
  const wb = read(i18n)
  const ws = wb.Sheets[wb.SheetNames[0]]
  const moduleList = utils.sheet_to_json<ModuleType>(ws)

  if (isEmpty(moduleList)) return {}

  const scopeList = ['system', 'test', 'view']

  const moduleLangMap = moduleList.reduce<ModuleLangMap>((moduleLangMap, moduleItem) => {
    const { Key, en, zhTW, zhCN } = moduleItem

    scopeList.forEach(scopeKey => {
      if (hasOwnProperty(moduleItem, scopeKey)) {
        moduleLangMap[scopeKey][Key] = { en, zhTW, zhCN }
      }
    })

    return moduleLangMap
  }, {
    system: {},
    test: {},
    view: {}
  })

  console.log(moduleLangMap)
  return moduleLangMap
}
