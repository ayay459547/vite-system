import { read, utils } from 'xlsx'
import { readFileSync, writeFileSync } from 'fs'

// 換版本 更新Json翻譯
export const writeI18nJSON = () => {
  console.log('writeI18nJSON')
  const localI18nVersion = localStorage.getItem('i18nVersion')
  const i18nVersion = import.meta.env.VITE_API_I18N_VERSION

  const isChange = [null, undefined, ''].includes(localI18nVersion) || (localI18nVersion !== i18nVersion)

  if (isChange) {
    // 讀取 excel
    const b64 = readFileSync('./src/i18n.xlsx', 'base64')
    const i18n = JSON.parse(JSON.stringify(b64))

    const wb = read(i18n)
    const [
      wsTranslate,
      wsOptions,
      wsLiveBoard,
      wsPage
    ] = [
      wb.Sheets[wb.SheetNames[0]],
      wb.Sheets[wb.SheetNames[1]],
      wb.Sheets[wb.SheetNames[2]],
      wb.Sheets[wb.SheetNames[3]]
    ]
    const moduleList = [
      ...utils.sheet_to_json(wsTranslate),
      ...utils.sheet_to_json(wsOptions),
      ...utils.sheet_to_json(wsLiveBoard),
      ...utils.sheet_to_json(wsPage)
    ]

    // 將新的翻譯檔寫入
    writeFileSync('./src/i18n.json', JSON.stringify(moduleList), { 'flag': 'w' })
    localStorage.setItem('buildVersion', i18nVersion)
  }
}
