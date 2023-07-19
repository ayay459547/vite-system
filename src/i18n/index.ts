import { createI18n } from 'vue-i18n'
import views from './views'
import common from './common'
import components from './components'

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
    for (const langType in value) {
      res[langType][key] = value[langType]
    }

    return res
  }, {
    zhTw: {},
    zhCn: {},
    en: {}
  })
}

const langMap: LangMap = {
  ...views,
  ...common,
  ...components
}

export const options = [
  { label: '繁體中文', value: 'zhTw' },
  { label: '简体中文', value: 'zhCn' },
  { label: 'English', value: 'en' }
]

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