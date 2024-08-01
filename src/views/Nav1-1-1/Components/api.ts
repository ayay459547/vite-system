import type { Api } from '@/declare/ajax'
import { ajax } from '@/lib/lib_ajax'
import { message } from '@/lib/lib_utils'
import type { TableData } from '../api'

export const createData = async (postData: TableData) => {
  const resData = await ajax<Api<number>>(
    {
      url: '/page/create',
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

  const { status, msg, data } = resData

  if (status === 'success') {
    message({
      type: 'success',
      message: msg ?? 'Create Success',
      duration: 10000
    })

    return data
  } else {
    message({
      type: 'error',
      message: msg ?? 'Create Error',
      duration: 10000
    })

    return 0
  }
}

export const updateData = async (postData: TableData) => {
  const resData = await ajax<Api<number>>(
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

  const { status, msg, data } = resData

  if (status === 'success') {
    message({
      type: 'success',
      message: msg ?? 'Update Success',
      duration: 10000
    })

    return data
  } else {
    message({
      type: 'error',
      message: msg ?? 'Update Error',
      duration: 10000
    })

    return 0
  }
}
