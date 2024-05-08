import {
  // properties,
  langMap
} from '@/i18n'
import { cutTableData, isEmpty } from '@/lib/lib_utils'

export type TableData = {
  keyword: string
  zhTw: string
  zhCn: string
  en: string
}

const langData = [] as TableData[]

;(langMap as any).$forEach(
  (
    lang: {
      zhTw: string
      zhCn: string
      en: string
    },
    key: string
  ) => {
    const { zhTw, zhCn, en } = lang

    langData.push({ keyword: key, zhTw, zhCn, en })
  }
)
// console.log(properties)
// properties.then(langProperties => {
//   if (!isEmpty(langProperties)) {
//     (langProperties as any).$forEach((lang: {
//       zhTw: string
//       zhCn: string
//       en: string
//     }, key: string) => {
//       const { zhTw, zhCn, en } = lang

//       langData.push({ keyword: key, zhTw, zhCn, en })
//     })

//   }
// })

export const getData = (params: any) => {
  const { keyword, zhTw, zhCn, en, sort = {}, page, size } = params
  console.log(langData)

  const { key: sortKey, order: sortType } = sort

  const filterList = (
    {
      keyword,
      zhTw,
      zhCn,
      en
    } as any
  ).$reduce((res: Record<string, string>[], curr: string, key: string) => {
    if (!isEmpty(curr)) {
      res.push({ key, value: curr })
    }
    return res
  }, []) as Record<string, string>[]

  const tempData = cutTableData(
    page,
    size,
    langData.filter(route => {
      if (isEmpty(filterList)) return true

      return filterList.every(item => {
        const { key, value } = item

        switch (key) {
          case 'keyword':
            return new RegExp(value).test(route.keyword)
          case 'zhTw':
            return new RegExp(value).test(route.zhTw)
          case 'zhCn':
            return new RegExp(value).test(route.zhCn)
          case 'en':
            return new RegExp(value).test(route.en)
          default:
            return true
        }
      })
    })
  )

  if (sortKey !== null) {
    switch (sortType) {
      case 'ascending':
        tempData.sort((a, b) => {
          return a[sortKey].localeCompare(b[sortKey], 'zh-Hans-TW', { sensitivity: 'accent' })
        })
        break
      case 'descending':
        tempData.sort((a, b) => {
          return b[sortKey].localeCompare(a[sortKey], 'zh-Hans-TW', { sensitivity: 'accent' })
        })
        break
    }
  }
  return tempData
}

export const getDataCount = (params: any): number => {
  const { keyword, zhTw, zhCn, en } = params

  const filterList = (
    {
      keyword,
      zhTw,
      zhCn,
      en
    } as any
  ).$reduce((res: Record<string, string>[], curr: string, key: string) => {
    if (!isEmpty(curr)) {
      res.push({ key, value: curr })
    }
    return res
  }, []) as Record<string, string>[]

  return langData.filter(route => {
    if (isEmpty(filterList)) return true

    return filterList.every(item => {
      const { key, value } = item

      switch (key) {
        case 'keyword':
          return new RegExp(value).test(route.keyword)
        case 'zhTw':
          return new RegExp(value).test(route.zhTw)
        case 'zhCn':
          return new RegExp(value).test(route.zhCn)
        case 'en':
          return new RegExp(value).test(route.en)
        default:
          return true
      }
    })
  }).length
}
