import type { LangMap } from '@/i18n'

export interface I18n {
  Key: string
  zhTW?: string
  zhCN?: string
  en?: string
  zh_TW?: string
  zh_CN?: string
}

export interface ModuleType extends I18n {
  system?: string
  test?: string
  view?: string
}

export type ModuleLangMap = {
  system: LangMap
  test: LangMap
  view: LangMap
}

export const scopeList = [
  { scopeKey: 'system', version: '1.0.1' },
  { scopeKey: 'test', version: '1.0.0' },
  { scopeKey: 'view', version: '1.0.0' }
]

export const defaultModuleLangMap = {
  system: {},
  test: {},
  view: {}
}
