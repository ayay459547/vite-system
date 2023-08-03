import type { Api } from '@/declare/ajax'
import { ajax } from '@/lib/lib_ajax'
import { swal } from '@/lib/lib_utils'
import type { TableData } from '../api'

export const createData = async (postData: TableData) => {
  const resData = await ajax<Api<number>>({
    url: '/page/create',
    method: 'post',
    data: postData
  }, {
    getFakeData: true,
    fakeData: {
      data: 5,
      status: 'success'
    },
    delay: 300
  })

  const { data, status } = resData

  if (status === 'success') {
    swal({
      icon: 'success',
      title: '新增成功'
    })

    return data
  } else {
    swal({
      icon: 'error',
      title: '新增資料失敗',
      text: '請聯絡資訊人員'
    })

    return 0
  }
}

export const updateData = async (postData: TableData) => {
  const resData = await ajax<Api<number>>({
    url: '/page1/update',
    method: 'post',
    data: postData
  }, {
    getFakeData: true,
    fakeData: {
      data: 2,
      status: 'success'
    },
    delay: 300
  })

  const { data, status } = resData

  if (status === 'success') {
    swal({
      icon: 'success',
      title: '更新成功'
    })

    return data
  } else {
    swal({
      icon: 'error',
      title: '新增資料失敗',
      text: '請聯絡資訊人員'
    })

    return 0
  }
}