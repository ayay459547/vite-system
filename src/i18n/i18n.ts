import { createI18n } from 'vue-i18n'
import test from './test'

const langMap = {...test}

export type Messages = {
  zhTw: { [key: string]: string },
  zhCn: { [key: string]: string },
  en: { [key: string]: string }
}

export const messages = (langMap as any).$reduce((res: Messages, value: Record<string, any>, key: string) => {
  for (const langType in value) {
    res[langType][key] = value[langType]
  }

  return res
}, {
  zhTw: {},
  zhCn: {},
  en: {}
})


const i18n = createI18n({
  locale: 'zhTw',           // 設定語言
  fallbackLocale: 'zhTw',   // 若選擇的語言缺少翻譯則退回的語言
  messages: messages
})

export default i18n