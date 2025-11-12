import type { Api } from '@/types/types_ajax'
import { ajax } from '@/lib/lib_ajax'
import { isEmpty, swal, deepClone, reverse } from '@/lib/lib_utils' // 工具

import { fakeTableData } from './fakeData'

export type TableData = {
  id?: number
  no: string
  name: string
  location: string
  statusRemarks: string
  leadTime: string
  productionCapacity: string
  groupName: string
  children?: Array<ChildData>
}
export type ChildData = {
  id?: number
  operationMethodCode: string
  operationMethod: string
  productivity: number
  machineTime: number
}

const filterFakeData = (filter: any, rowData: TableData) => {
  const filterKeyList = [
    'no',
    'name',
    'location',
    'statusRemarks',
    'leadTime',
    'productionCapacity',
    'groupName'
  ]
  const fitlerList = filterKeyList.reduce((res, key) => {
    const _filter = filter[key]
    if (!isEmpty(_filter)) {
      const regexp = new RegExp(_filter)
      res.push({
        key,
        regexp
      })
    }
    return res
  }, [])

  if (isEmpty(fitlerList)) return true

  return fitlerList.every(item => {
    const { key, regexp } = item
    const data = rowData[key]

    return regexp.test(data)
  })
}

// > 0
const sortFakeData = (sortingList: any[], filterData: TableData[]): TableData[] => {
  const resData = deepClone([], filterData) as TableData[]

  resData.sort((a, b) => {
    let res = 0
    sortingList.forEach(item => {
      const { key, order } = item

      switch (order) {
        case 'ascending':
          res = a[key] - b[key]
          break
        case 'descending':
          res = b[key] - a[key]
          break
      }
    })
    return res
  })

  return resData
}

// api
export const getData = async (params: any) => {
  const {
    no = '',
    name = '',
    location = '',
    statusRemarks = '',
    leadTime = '',
    productionCapacity = '',
    groupName = '',

    sortingList = []
  } = params

  const filter = {
    no,
    name,
    location,
    statusRemarks,
    leadTime,
    productionCapacity,
    groupName
  }

  const resData = await ajax<TableData[]>(
    {
      url: '/api/getTableDataCount',
      method: 'post',
      data: {}
    },
    {
      isFakeData: true,
      fakeData: {
        data: fakeTableData,
        status: 'success'
      },
      delay: 300
    }
  )

  const { data, status } = resData

  if (status === 'success') {
    const _data = data.filter(rowData => {
      return filterFakeData(filter, rowData)
    })
    return sortFakeData(reverse(sortingList), _data)
  } else {
    swal({
      icon: 'error',
      title: '取得資料失敗',
      text: '請聯絡資訊人員'
    })
  }
}

export const getDataCount = async (params: any) => {
  const {
    no = '',
    name = '',
    location = '',
    statusRemarks = '',
    leadTime = '',
    productionCapacity = '',
    groupName = ''
  } = params

  const filter = {
    no,
    name,
    location,
    statusRemarks,
    leadTime,
    productionCapacity,
    groupName
  }

  const resData = await ajax<TableData[]>(
    {
      url: '/api/getTableDataCount',
      method: 'post',
      data: {}
    },
    {
      isFakeData: true,
      fakeData: {
        data: fakeTableData,
        status: 'success'
      },
      delay: 300
    }
  )

  const { data, status } = resData

  if (status === 'success') {
    return data.filter(rowData => {
      return filterFakeData(filter, rowData)
    }).length
  } else {
    swal({
      icon: 'error',
      title: '取得資料失敗',
      text: '請聯絡資訊人員'
    })
  }
}

export const createData = async (postData: TableData) => {
  const resData = await ajax<number>(
    {
      url: '/page1/create',
      method: 'post',
      data: postData
    },
    {
      isFakeData: true,
      fakeData: {
        data: 5,
        status: 'success'
      },
      delay: 300
    }
  )
  return resData
}

export const updateData = async (postData: TableData) => {
  const resData = await ajax<number>(
    {
      url: '/page1/update',
      method: 'post',
      data: postData
    },
    {
      isFakeData: true,
      fakeData: {
        data: 2,
        status: 'success'
      },
      delay: 300
    }
  )
  return resData
}

export const deleteData = async (rowData: TableData) => {
  await new Promise(resolve => {
    console.log('delete id => ', rowData.id)

    setTimeout(() => {
      resolve('delete success')
    }, 1000)
  })
}
