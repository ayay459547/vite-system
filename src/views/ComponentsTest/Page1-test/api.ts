import type { Api } from '@/declare/ajax'
import { ajax } from '@/lib/lib_ajax'

export type TableData = {
  id?: number
  date: string
  name: string
  address: string
  state?: string
  city?: string
  children?: Array<TableData>
}

export const fakeTableData: TableData[] = [
  {
    id: 1,
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    state: 'success',
    city: 'city1'
  },
  {
    id: 2,
    date: '2016-05-02',
    name: 'Caleb',
    address: 'No. 189, Grove St, Los Angeles',
    state: 'success',
    city: 'city1',
    children: [
      {
        id: 21,
        date: '2016-05-02',
        name: 'Caleb2',
        address: 'No. 189, Grove St, Los Angeles',
        state: 'success',
        city: 'city1'
      },
      {
        id: 22,
        date: '2016-05-02',
        name: 'Caleb3',
        address: 'No. 189, Grove St, Los Angeles'
      }
    ]
  },
  {
    id: 3,
    date: '2016-05-04',
    name: 'Peter',
    address: 'No. 189, Grove St, Los Angeles',
    state: 'success',
    city: 'city1'
  },
  {
    id: 4,
    date: '2016-05-01',
    name: 'Amy',
    address: 'address-1'
  }
]

// api
export const getData = async () => {
  const resData = await ajax<Api<TableData[]>>({
    url: '/page1/get',
    method: 'post',
    data: {}
  }, {
    isFakeData: true,
    fakeData: {
      data: fakeTableData,
      status: 'success'
    },
    delay: 300
  })
  return resData
}

export const getDataCount = async () => {
  const resData = await ajax<Api<number>>({
    url: '/page1/get',
    method: 'post',
    data: {}
  }, {
    isFakeData: true,
    fakeData: {
      data: 1000,
      status: 'success'
    },
    delay: 300
  })
  return resData
}

export const createData = async (postData: TableData) => {
  const resData = await ajax<Api<number>>({
    url: '/page1/create',
    method: 'post',
    data: postData
  }, {
    isFakeData: true,
    fakeData: {
      data: 5,
      status: 'success'
    },
    delay: 300
  })
  return resData
}

export const updateData = async (postData: TableData) => {
  const resData = await ajax<Api<number>>({
    url: '/page1/update',
    method: 'post',
    data: postData
  }, {
    isFakeData: true,
    fakeData: {
      data: 2,
      status: 'success'
    },
    delay: 300
  })
  return resData
}

export const deleteData = async (rowData: TableData) => {
  await new Promise((resolve) => {
    console.log('delete id => ', rowData.id)

    setTimeout(() => {
      resolve('delete success')
    }, 1000)
  })
}