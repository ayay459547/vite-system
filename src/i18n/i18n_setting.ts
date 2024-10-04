export type I18nTranslate = (key: string | string[], i18nModule?: ScopeKey) => string
export type I18nTest = (key: string | string[], i18nModule?: ScopeKey) => boolean

export interface I18n {
  Key: string
  en?: string
  zh_TW?: string
  zh_CN?: string
}

export interface ModuleType {
  system?: string
  test?: string
  view?: string
}

export type ScopeKey = keyof ModuleType | ''

export const defaultModuleType: ScopeKey = 'system'

export const scopeList = [
  { scopeKey: 'system', label: '系統', version: '1.1.0' },
  { scopeKey: 'test', label: '測試', version: '1.1.0' },
  { scopeKey: 'view', label: '頁面', version: '1.1.0' }
]

export const defaultModuleLangMap = {
  system: {},
  test: {},
  view: {}
}
