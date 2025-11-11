/**
 * 打包: 只將現在的excel 重新複寫json
 * 啟動服務: 監聽excel變化 重新複寫json
 */
import { transformI18n, transformRoutes } from './transformExcel'

// 不監聽 excel 變化, 只做轉換 xlsx => json
const isWatch = false
const transformI18nList = [
  {
    fileName: 'translateSrcFile',
    excelPath: './portal/i18N/translateSrcFile.xlsx',
    excel_CustPath: './portal/i18N/translateSrcFile_Cust.xlsx',
    jsonPath: './portal/i18N/translateSrcFile.json'
  },
  {
    fileName: 'translateSrcFile',
    excelPath: './public/i18N/translateSrcFile.xlsx',
    excel_CustPath: './public/i18N/translateSrcFile_Cust.xlsx',
    jsonPath: './public/i18N/translateSrcFile.json'
  }
]
transformI18n(isWatch, transformI18nList)
const transformRouterList = [
  {
    fileName: 'routes',
    excelPath: './portal/router/routes.xlsx',
    jsonPath: './portal/router/routes.json'
  },
  {
    fileName: 'routes',
    excelPath: './public/router/routes.xlsx',
    jsonPath: './public/router/routes.json'
  }
]
transformRoutes(isWatch, transformRouterList)
