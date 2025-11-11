export type I18nTranslate = (key: string | string[], i18nModule?: ScopeKey) => string
export type I18nTest = (key: string | string[], i18nModule?: ScopeKey) => boolean

export type LangMapType<T> = {
  zh_TW: T
  zh_CN: T
  en: T
}
export type I18nMap = Record<string, LangMapType<string>>

export type I18nMessages = LangMapType<{
  [key: string]: string
}>

export type LangType = 'zh_TW' | 'zh_CN' | 'en' | string | null

// i18n
export type I18nShowType = 'i18nKey'| 'systemDefault' | 'localSetting'

// excel 使用
export interface I18n {
  Key: string
  zh_TW?: string
  zh_CN?: string
  en?: string
}

export interface ModuleType {
  // 模組
  auto_common?: string
  mulsol_common?: string
  fund_common?: string
  apspub_common?: string
  optimiz_common?: string
  nodoc_common?: string
  intelgt_common?: string
  mmc_common?: string
  dmd_common?: string
  rtds_common?: string
  // 系統
  iPASP_common?: string
}

export type ScopeKey = keyof ModuleType | ''
