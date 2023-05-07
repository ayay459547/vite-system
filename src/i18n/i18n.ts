import { createI18n } from 'vue-i18n'
import test from './test'

const getLang = (type: 'zhTw' | 'zhCn' | 'en') => {
  const resMap = {}
  for (const key in test) {
    resMap[key] = test[key][type]
  }
  return resMap
}

const i18n = createI18n({
  locale: 'zh-tw',           // 設定語言
  fallbackLocale: 'zh-tw',   // 若選擇的語言缺少翻譯則退回的語言
  messages: {
    zhTw: getLang('zhTw'),
    zhCn: getLang('zhCn'),
    en: getLang('en')
  }
})

export default i18n