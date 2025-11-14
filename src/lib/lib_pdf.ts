import { hasOwnProperty, fetchPublicJsonFile } from '@/lib/lib_utils'
import { defaultLang, fontPathMap } from '@/declare/declare_i18n'

/**
 * @description 設定PDF字型
 *
 * @modifiedBy Caleb
 * @modifiedDate 2025-02-07
 * @modifiedDescription 調整引入方式 await import => await fetchPublicJsonFile
 * import 會經過打包 json 會轉成 js 檔案
 * fetchPublicJsonFile 是透過送 get 請求取得檔案
 *
 * @param {Object} doc 文件
 * @param {String} lang 語言
 * @returns {String | null} 名稱
 */
export const setPdfLangFont = async (doc: any, lang: string): Promise<string | null> => {
  if (lang === 'en') return null
  const fontName = `PdfFont_${lang}`
  // const fontData = await import(`@/assets/font/${fontName}.json`)

  const getFont = async () => {
    const fontPath = hasOwnProperty(fontPathMap, lang) ? fontPathMap[lang] : fontPathMap[defaultLang]
    return fetchPublicJsonFile(fontPath)
  }

  const fontData = await getFont()
  // console.log('fontData => ', fontData)

  const addFont = async (type: string) => {
    doc.addFileToVFS(`${fontName}-${type}.ttf`, fontData[type])
    doc.addFont(`${fontName}-${type}.ttf`, fontName, type)
  }
  await addFont('bold')
  await addFont('normal')
  doc.setFont(fontName)
  return fontName
}
