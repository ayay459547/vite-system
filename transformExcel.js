import { readFileSync, writeFileSync } from 'fs'
import chokidar from 'chokidar'
import { read, utils } from 'xlsx'

const readExcel = filePath => {
  const excelJson = readFileSync(filePath, 'base64')
  const excelObj = JSON.parse(JSON.stringify(excelJson))
  const workBook = read(excelObj)
  return workBook
}

let i18nWatcher = null
/**
 * @author Caleb
 * @description 將 i18n excel 轉換成 json
 * @see https://docs.sheetjs.com/docs/demos/static/vitejs/
 * 範例使用在 plugins 中
 * 改成使用 chokidar 監聽檔案變化 重寫 json
 */
export const transformI18n = () => {
  if (i18nWatcher !== null) return

  const excelPath = './src/i18n/i18n.xlsx'
  const jsonPath = './src/i18n/i18n.json'

  console.log('\x1B[32m%s\x1B[0m', '監聽 i18n.xlsx 變化')

  const i18n_workBookToJson = () => {
    console.log('\x1B[34m%s\x1B[0m', 'i18n.xlsx => i18n.json')
    console.table({
      type: 'i18n',
      'Excel 路徑': excelPath,
      'JSON 路徑': jsonPath
    })

    const workBook = readExcel(excelPath)

    const [
      wsTranslate, // 一般翻譯
      wsLiveBoard, // 看板
      wsViews // 頁面
      // wsAbbreviation // 縮寫
    ] = [
      workBook.Sheets[workBook.SheetNames[0]],
      workBook.Sheets[workBook.SheetNames[1]],
      workBook.Sheets[workBook.SheetNames[2]]
      // workBook.Sheets[workBook.SheetNames[3]]
    ]
    const i18nData = [
      ...utils.sheet_to_json(wsTranslate),
      ...utils.sheet_to_json(wsLiveBoard),
      ...utils.sheet_to_json(wsViews)
      // ...utils.sheet_to_json(wsAbbreviation)
    ]

    writeFileSync(jsonPath, JSON.stringify(i18nData), { flag: 'w' })
  }

  i18n_workBookToJson() // 先進行一次轉換
  i18nWatcher = chokidar.watch(excelPath, {
    persistent: true
  })
  i18nWatcher.on('change', () => {
    i18n_workBookToJson()
  })
}
transformI18n()


/**
 *
 */
let routesWatcher = null
export const transformRoutes = () => {
  if (routesWatcher !== null) return

  const excelPath = './src/router/routes.xlsx'
  const jsonPath = './src/router/routes.json'

  console.log('\x1B[32m%s\x1B[0m', '監聽 routes.xlsx 變化')

  const routes_workBookToJson = () => {
    console.log('\x1B[34m%s\x1B[0m', 'routes.xlsx => routes.json')
    console.table({
      type: 'routes',
      'Excel 路徑': excelPath,
      'JSON 路徑': jsonPath
    })

    const workBook = readExcel(excelPath)
    const wsRoutes =  workBook.Sheets[workBook.SheetNames[0]]
    const routes = [...utils.sheet_to_json(wsRoutes)]

    writeFileSync(jsonPath, JSON.stringify(routes), { flag: 'w' })
  }

  routes_workBookToJson() // 先進行一次轉換
  i18nWatcher = chokidar.watch(excelPath, {
    persistent: true
  })
  i18nWatcher.on('change', () => {
    routes_workBookToJson()
  })
}
transformRoutes()
