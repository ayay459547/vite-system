import type { Composer, ComposerTranslation } from 'vue-i18n'
import { createI18n, useI18n } from 'vue-i18n'
import test from './test'
import views from './views'
import base from './base'
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

const getI18nMessages = (langMap: LangMap): Messages => {
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
  ...test,
  ...views,
  ...base,
  ...components,
  langType: {
    zhTw: '繁體中文',
    zhCn: '简体中文',
    en: 'English'
  }
}

export const options = [
  { label: '繁體中文', value: 'zhTw' },
  { label: '简体中文', value: 'zhCn' },
  { label: 'English', value: 'en' }
]

export const usePageI18n = (langMap: LangMap): Partial<Composer & { i18nTranslate: ComposerTranslation, i18nTest: (key: string) => boolean }> => {
  const pageI18n = useI18n({
    messages: getI18nMessages(langMap)
  }) as Partial<Composer>

  return {
    ...pageI18n,
    i18nTranslate: pageI18n.t,
    i18nTest: pageI18n.te
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
console.log(i18n)

export default i18n