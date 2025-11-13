import type {
  LangMapType,
  I18nMap,
  I18nMessages,
  LangType,
  I18nShowType,
  ScopeKey
} from '@/types/types_i18n'

import ElzhTw from 'element-plus/dist/locale/zh-tw.min.js'
import ElzhCn from 'element-plus/dist/locale/zh-cn.min.js'
import Elen from 'element-plus/dist/locale/en.min.js'

const mode = (import.meta as any).env.MODE

export const i18nMap: I18nMap = {
  langType: {
    zh_TW: '繁體中文',
    zh_CN: '简体中文',
    en: 'English'
  }
}

export const defaultMessages: I18nMessages = {
  zh_TW: {},
  zh_CN: {},
  en: {}
}

export const defaultLang: LangType = 'zh_TW'

export const langList = ['zh_TW', 'zh_CN', 'en']
export const langOptions = [
  { label: '繁體中文', value: 'zh_TW' },
  { label: '简体中文', value: 'zh_CN' },
  { label: 'English', value: 'en' }
]

// i18n
export const defaultI18nShowType: I18nShowType = 'systemDefault'
export const i18nShowTypeInfo = [
  { key: 'i18nKey', label: 'I18n Key ( Excel )' },
  { key: 'systemDefault', label: '系統預設', i18nLabel: 'translation-systemDefault' },
  { key: 'localSetting', label: '本地設定', i18nLabel: 'translation-localSetting' }
]
export const i18nShowTypeList = i18nShowTypeInfo.map(item => item.key)
export const i18nShowTypeMap = i18nShowTypeInfo.reduce((res, item, index) => {
  res[item.key] = index
  return res
}, {})
export const i18nShowTypeOptions = i18nShowTypeInfo.reduce((res, item, index) => {
  // 非開發 沒有顯示 i18n key 的選項
  if (mode !== 'development' && item.key === 'i18nKey') return res

  res.push({
    label: item.label,
    i18nLabel: item.i18nLabel,
    value: index
  })
  return res
}, [])

// Element Plus UI 使用
export const elLocaleMap: LangMapType<any> = {
  zh_TW: ElzhTw,
  zh_CN: ElzhCn,
  en: Elen
}

// PDF 字型使用
export const fontPathMap: Partial<LangMapType<string>> = {
  zh_TW: '/font/PdfFont_zh_TW.json',
  zh_CN: '/font/PdfFont_zh_CN.json'
}

// excel 使用
export const defaultModuleType: ScopeKey = 'system'

export const scopeList = [
  { scopeKey: 'system', label: '排程自動化作業', version: '1.1.0' },
  { scopeKey: 'system', label: '多方案模組', version: '1.1.0' },
  { scopeKey: 'system', label: '排程基本資訊', version: '1.1.0' },
  { scopeKey: 'system', label: '排程發放', version: '1.1.0' },
  { scopeKey: 'system', label: '資源管理', version: '1.1.0' },
  { scopeKey: 'system', label: '權限管理', version: '1.1.0' },
  { scopeKey: 'system', label: '排程智慧化', version: '1.1.0' },
  { scopeKey: 'system', label: '物控模組', version: '1.1.0' },
  { scopeKey: 'system', label: '訂單需求管理', version: '1.1.0' },
  { scopeKey: 'system', label: 'RTDS', version: '1.1.0' },
  { scopeKey: 'system', label: 'demo', version: '1.1.0' }
]
