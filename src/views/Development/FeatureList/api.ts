import type { Navigation } from '@/declare/routes'
import { refactorRoutes } from '@/lib/lib_routes'
import routes from '@/router/routes'

const routesData = []
refactorRoutes<Navigation>((leafNode, parentsNode) => {
  const nextNode: Navigation = {
    ...leafNode
  }
  if (parentsNode === null) {
    nextNode.breadcrumbName = [leafNode.name]
    nextNode.breadcrumbTitle = [leafNode.title]
  } else{
    nextNode.breadcrumbName = [...parentsNode.breadcrumbName, leafNode.name]
    nextNode.breadcrumbTitle = [...parentsNode.breadcrumbTitle, leafNode.title]
  }

  if (!['', null, undefined].includes(nextNode.path)) {
    routesData.push({
      title: nextNode.title,
      path: nextNode.path,
      breadcrumbTitle: nextNode.breadcrumbTitle.join(' / ')
    })
  }

  return {
    refactorNode: nextNode,
    isShow: true
  }
}, routes)

export const getData = (params: any) => {
  const {
    title, path, breadcrumbTitle,
    sort, page, size
  } = params

  const { key: sortKey, order: sortType} = sort

  const start = (page - 1) * size
  const end = start + size

  const filterList = ({
    title, path, breadcrumbTitle
  } as any).$reduce((
    res: Record<string, string>[],
    curr: string,
    key: string
  ) => {
    if (!['', null, undefined].includes(curr)) {
      res.push({ key, value: curr})
    }
    return res
  }, []) as Record<string, string>[]

  const tempData = routesData.filter(route => {
    return filterList.every(item => {
      const { key, value } = item

      switch (key){
        case 'title':
          return new RegExp(value).test(route.title)
        case 'path':
          return new RegExp(value).test(route.path)
        case 'breadcrumbTitle':
          return new RegExp(value).test(route.breadcrumbTitle.join(' / '))
        default:
          return true
      }
    })
  }).splice(start, end)

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

export const getDataCount = (params: any) => {
  const { title, path, breadcrumbTitle } = params

  const filterList = ({
    title, path, breadcrumbTitle
  } as any).$reduce((
    res: Record<string, string>[],
    curr: string,
    key: string
  ) => {
    if (!['', null, undefined].includes(curr)) {
      res.push({ key, value: curr})
    }
    return res
  }, []) as Record<string, string>[]

  return routesData.filter(route => {
    return filterList.every(item => {
      const { key, value } = item

      switch (key){
        case 'title':
          return new RegExp(value).test(route.title)
        case 'path':
          return new RegExp(value).test(route.path)
        case 'breadcrumbTitle':
          return new RegExp(value).test(route.breadcrumbTitle.join(' / '))
        default:
          return true
      }
    })
  }).length
}