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
  system?: string
  common?: string
}

export type ScopeKey = keyof ModuleType | ''
