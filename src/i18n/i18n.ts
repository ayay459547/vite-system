import { createI18n } from 'vue-i18n'
import test from './test'
import base from './base'
import components from './components'

const langMap = {
  ...test,
  ...base,
  ...components,
  langType: {
    zhTw: '繁體中文',
    zhCn: '简体中文',
    en: 'English'
  }
}

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

export const options = [
  {
    label: '繁體中文',
    value: 'zhTw'
  },
  {
    label: '简体中文',
    value: 'zhCn'
  },
  {
    label: 'English',
    value: 'en'
  }
]

const i18n = createI18n({
  legacy: false,
  locale: 'zhTw',           // 設定語言
  fallbackLocale: 'zhTw',   // 若選擇的語言缺少翻譯則退回的語言
  messages: messages
})

export default i18n