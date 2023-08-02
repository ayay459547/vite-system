import type { Navigation } from '@/declare/routes'
import { refactorRoutes } from '@/lib/lib_routes'
import routes from '@/router/routes'

const routesData = []
const options = []

refactorRoutes<Navigation>((leafNode, parentsNode) => {
  const nextNode: Navigation = {
    ...leafNode
  }
  if (parentsNode === null) {
    nextNode.breadcrumbName = [leafNode.name]
    nextNode.breadcrumbTitle = [leafNode.title]

    options.push({
      label: leafNode.title,
      value: leafNode.name
    })
  } else{
    nextNode.breadcrumbName = [...parentsNode.breadcrumbName, leafNode.name]
    nextNode.breadcrumbTitle = [...parentsNode.breadcrumbTitle, leafNode.title]
  }
  const status = nextNode?.meta?.status ?? 'new'

  if (!['', null, undefined].includes(nextNode.path)) {
    routesData.push({
      status,
      title: nextNode.title,
      path: nextNode.path,
      name: nextNode.breadcrumbName[0],
      mode: nextNode.breadcrumbTitle[0],
      breadcrumbTitle: nextNode.breadcrumbTitle.join(' / ')
    })
  }

  return {
    refactorNode: nextNode,
    isShow: true
  }
}, routes)

export const getOptions = () => {
  return options
}

export const getData = (params: any) => {
  const {
    status, title, path, mode, breadcrumbTitle,
    sort, page, size
  } = params

  const { key: sortKey, order: sortType} = sort

  const start = (page - 1) * size
  const end = start + size

  const filterList = ({
    status, title, path, mode, breadcrumbTitle
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
        case 'status':
          return value === route.status
        case 'title':
          return new RegExp(value).test(route.title)
        case 'path':
          return new RegExp(value).test(route.path)
        case 'mode':
          return route.name === value
        case 'breadcrumbTitle':
          return new RegExp(value).test(route.breadcrumbTitle)
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
  const { status, title, path, breadcrumbTitle } = params

  const filterList = ({
    status, title, path, breadcrumbTitle
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
        case 'status':
          return value === route.status
        case 'title':
          return new RegExp(value).test(route.title)
        case 'path':
          return new RegExp(value).test(route.path)
        case 'breadcrumbTitle':
          return new RegExp(value).test(route.breadcrumbTitle)
        default:
          return true
      }
    })
  }).length
}