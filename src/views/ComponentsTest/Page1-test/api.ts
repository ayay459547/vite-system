import { ajax } from '@/lib/utils'

export type TableData = {
  id?: number
  date: string
  name: string
  address: string
}

export const fakeTableData: TableData[] = [
  {
    id: 1,
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    id: 2,
    date: '2016-05-02',
    name: 'Caleb',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    id: 3,
    date: '2016-05-04',
    name: 'Peter',
    address: 'No. 189, Grove St, Los Angeles'
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
  const resData = await ajax<TableData[]>({
    url: '/page1/get',
    method: 'get',
    data: {}
  }, {
    getFakeData: true,
    fakeData: fakeTableData,
    status: 'success',
    delay: 300
  })
  return resData
}

export const createData = async (postData: TableData) => {
  const resData = await ajax<number>({
    url: '/page1/create',
    method: 'post',
    data: postData
  }, {
    getFakeData: true,
    fakeData: 5,
    status: 'success',
    delay: 300
  })
  return resData
}

export const updateData = async (postData: TableData) => {
  const resData = await ajax<number>({
    url: '/page1/update',
    method: 'post',
    data: postData
  }, {
    getFakeData: true,
    fakeData: 2,
    status: 'success',
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