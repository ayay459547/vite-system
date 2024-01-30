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
  system?: LangMap
  test?: LangMap
  view?: LangMap
}

export type ScopeKey = keyof ModuleLangMap | ''

export const defaultModuleType = 'system'

export const scopeList = [
  { scopeKey: 'system', label: '系統', version: '1.0.2' },
  { scopeKey: 'test', label: '測試', version: '1.0.1' },
  { scopeKey: 'view', label: '頁面', version: '1.0.1' }
]

export const defaultModuleLangMap = {
  system: {},
  test: {},
  view: {}
}
