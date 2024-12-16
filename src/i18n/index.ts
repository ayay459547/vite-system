import { createI18n } from 'vue-i18n'

export type LangMap = Record<string, {
  zhTw: string
  zhCn: string
  en: string
}> & Object

export type Messages = {
  zhTw: { [key: string]: string }
  zhCn: { [key: string]: string }
  en: { [key: string]: string }
}

export const getI18nMessages = (langMap: LangMap): Messages => {
  const res: any = {
    zhTw: {},
    zhCn: {},
    en: {}
  }

  for (const langKey in langMap) {
    const langValue: any = langMap[langKey]
    for (const userLanguage in langValue) {
      res[userLanguage][langKey] = langValue[userLanguage]
    }
  }
  return res as Messages
}

export const options = [
  { label: '繁體中文', value: 'zhTw' },
  { label: '简体中文', value: 'zhCn' },
  { label: 'English', value: 'en' }
]

export const langMap: LangMap = {
  langType: {
    zhTw: '繁體中文',
    zhCn: '简体中文',
    en: 'English'
  }
}

const i18n = createI18n({
  fallbackWarn: false,
  missingWarn: false,
  legacy: false,
  globalInjection: true,
  locale: 'zhTw', // 設定語言
  fallbackLocale: 'zhTw', // 若選擇的語言缺少翻譯則退回的語言
  messages: getI18nMessages(langMap)
})

export default i18n
