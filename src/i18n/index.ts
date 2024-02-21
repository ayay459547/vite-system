import { createI18n } from 'vue-i18n'

export type LangMap = Record<string, {
  zhTw: string
  zhCn: string
  en: string
}> & Object

export type Messages = {
  zhTw: { [key: string]: string },
  zhCn: { [key: string]: string },
  en: { [key: string]: string }
}

export const getI18nMessages = (langMap: LangMap): Messages => {
  return (langMap as any).$reduce((res: Messages, value: Record<string, any>, key: string) => {
    for (const userLanguage in value) {
      res[userLanguage][key] = value[userLanguage]
    }

    return res
  }, {
    zhTw: {},
    zhCn: {},
    en: {}
  })
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
  locale: 'zhTw',           // 設定語言
  fallbackLocale: 'zhTw',   // 若選擇的語言缺少翻譯則退回的語言
  messages: getI18nMessages(langMap)
})

export default i18n
