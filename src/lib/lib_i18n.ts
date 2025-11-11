import type { I18nMessages, I18nMap } from '@/types/types_i18n'
import { defaultMessages } from '@/declare/declare_i18n'
import { deepClone } from '@/lib/lib_utils'

/**
 * @author Caleb
 * @param {I18nMap} i18nLangMap Map表
 * @returns {I18nMessages} 轉換成 vue-i18n 使用的格式
 */
export const getI18nMessages = (i18nLangMap: I18nMap): I18nMessages => {
  const res: I18nMessages = deepClone({}, defaultMessages)

  for (const langKey in i18nLangMap) {
    const langValue: any = i18nLangMap[langKey]
    for (const userLanguage in langValue) {
      res[userLanguage][langKey] = langValue[userLanguage]
    }
  }
  return res
}
