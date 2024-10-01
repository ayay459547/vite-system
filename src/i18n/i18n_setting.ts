import type { Composer } from 'vue-i18n'

import type { LangMap } from '@/i18n'

export type I18nTranslate = (key: string, i18nModule?: ScopeKey) => string
export type I18nTest = (key: string, i18nModule?: ScopeKey) => boolean

export type LocalI18n = Partial<
  Composer & {
    i18nTranslate: I18nTranslate
    i18nTest: I18nTest
  }
>

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
