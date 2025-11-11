import { readFileSync, writeFileSync } from 'fs'
import chokidar from 'chokidar'
import { read, utils } from 'xlsx'

type OpenWatchCallBack = (options: Transform) => void

interface Transform {
  fileName: string
  excelPath: string
  excel_CustPath?: string
  jsonPath: string
}

const readExcel = (filePath: string) => {
  const excelJson = readFileSync(filePath, 'base64')
  const excelObj = JSON.parse(JSON.stringify(excelJson))
  const workBook = read(excelObj)
  return workBook
}

const workBookToJsonLog = (options: Transform) => {
  const { fileName, excelPath, excel_CustPath, jsonPath } = options

  console.log('\n ------------------------------------------------------------------------ \n')
  console.log('\x1B[34m%s\x1B[0m', `${fileName}.xlsx => ${fileName}.json`)
  console.table({
    fileName,
    'Excel 路徑': excelPath,
    'Excel Cust 路徑': excel_CustPath,
    'JSON 路徑': jsonPath
  })
}

const watcherMap: Record<string, any> = {
  i18nWatcher: null,
  routesWatcher: null
}

const openWatch = (watcherMapKey: string, callback: OpenWatchCallBack, transformList: any[]) => {
  if (watcherMap[watcherMapKey] !== null) return

  // 是啟動服務才監聽檔案
  transformList.forEach(transformI18nItem => {
    const { fileName, excelPath, excel_CustPath, jsonPath } = transformI18nItem
    console.log('\x1B[36m%s\x1B[0m', `監聽 ${excelPath} 變化`)
    watcherMap[watcherMapKey] = chokidar.watch(excelPath, {
      persistent: true
    })
    watcherMap[watcherMapKey].on('change', () => {
      callback({fileName, excelPath, excel_CustPath, jsonPath})
    })
  })
}

/**
 * @author Caleb
 * @description 將 translateSrcFile excel 轉換成 json
 * @see https://docs.sheetjs.com/docs/demos/static/vitejs/
 * 範例使用在 plugins 中
 * 改成使用 chokidar 監聽檔案變化 重寫 json
 * @param {boolean} isWatch 是否是服務
 */
export const transformI18n = (isWatch: boolean, transformList: Transform[]) => {
  const i18n_workBookToJson = (options: Transform) => {
    const { fileName, excelPath, excel_CustPath, jsonPath } = options

    workBookToJsonLog({ fileName, excelPath, excel_CustPath, jsonPath })

    /**
     * @description 讀取excel 轉換成物件資料的陣列
     * @param {string} excelPath Excel路徑
     * @param {Array<number>} useSheets 使用分頁頁碼
     */
    const setI18nData = (excelPath:any, useSheets: Array<number>) => {
      if(typeof excelPath !== 'string') return []
      if(excelPath.length <= 0) return [] // 無效路徑回傳空陣列

      const workBook = readExcel(excelPath)
      const sheetData = useSheets.map(page => workBook.Sheets[workBook.SheetNames[page]])
      const i18nData = sheetData.flatMap(sheet => utils.sheet_to_json(sheet))
      return i18nData as Array<any>
    }

    const i18nData = setI18nData(excelPath, [0, 1, 2])
    const i18nData_Cust = setI18nData(excel_CustPath, [0])

    const repeatedI18n: Array<any> = []

    // 重複的key取代
    const __i18nData__ = [...i18nData, ...i18nData_Cust]
    const i18nMap = __i18nData__.reduce<Map<string, any>>((tempMap, i18n) => {
      // 只取需要的欄位
      const {
        Key, zh_TW, zh_CN, en,
        auto_common, mulsol_common, fund_common, apspub_common, optimiz_common,
        nodoc_common, intelgt_common, mmc_common, dmd_common, rtds_common,
        iPASP_common
      } = i18n

      if (Key) {
        if (tempMap.has(Key)) {
          repeatedI18n.push({ Key, zh_TW, zh_CN, en })
        }
        tempMap.set(Key, {
          Key, zh_TW, zh_CN, en,
          auto_common, mulsol_common, fund_common, apspub_common, optimiz_common,
          nodoc_common, intelgt_common, mmc_common, dmd_common, rtds_common,
          iPASP_common
        })
      }
      return tempMap
    }, new Map())

    if (repeatedI18n.length > 0) {
      console.log('\x1B[43m%s\x1B[0m', '注意翻譯檔有重複的 Key')
      console.table(repeatedI18n)
    }

    const excelJsonList = Array.from(i18nMap).map(item => {
      const [key, value] = item
      return { key, ...value }
    })
    writeFileSync(jsonPath, JSON.stringify(excelJsonList), { flag: 'w' })
  }

  // 先進行一次轉換
  transformList.forEach(transformI18nItem => {
    const { fileName, excelPath, excel_CustPath, jsonPath } = transformI18nItem
    i18n_workBookToJson({ fileName, excelPath, excel_CustPath, jsonPath })
  })

  // 是啟動服務才監聽檔案
  if (isWatch) {
    openWatch('i18nWatcher', i18n_workBookToJson, transformList)
  }
}

/**
 * @author Caleb
 * @description 將 routes excel 轉換成 json
 * @see https://docs.sheetjs.com/docs/demos/static/vitejs/
 * 範例使用在 plugins 中
 * 改成使用 chokidar 監聽檔案變化 重寫 json
 * @param {boolean} isWatch 是否是服務
 */
export const transformRoutes = (isWatch: boolean, transformList: Transform[]) => {
  const routes_workBookToJson = (options: Transform) => {
    const { fileName, excelPath, jsonPath } = options
    workBookToJsonLog({ fileName, excelPath, jsonPath })

    const workBook = readExcel(excelPath)
    /**
     * 0: auth 後端權限使用
     * 1: routes 前端設定使用(主要)
     * 2: permission 前端權限定義
     */
    const wsRoutes = workBook.Sheets[workBook.SheetNames[1]]
    const excelJsonList = [...utils.sheet_to_json(wsRoutes)]

    writeFileSync(jsonPath, JSON.stringify(excelJsonList), { flag: 'w' })
  }

  // 先進行一次轉換
  transformList.forEach(transformI18nItem => {
    const { fileName, excelPath, jsonPath } = transformI18nItem
    routes_workBookToJson({ fileName, excelPath, jsonPath })
  })

  // 是啟動服務才監聽檔案
  if (isWatch) {
    openWatch('routesWatcher', routes_workBookToJson, transformList)
  }
}
