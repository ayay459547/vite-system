import type { Api } from '@/declare/ajax'
import { ajax } from '@/lib/lib_ajax'
import { swal, isEmpty } from '@/lib/lib_utils'

// 表單資料
export type FormData = {
  column1: string
  column2: string
  column3: string
  column4: string
  column5: string
}
export type CreateFormData = {} & FormData
export type UpdateFormData = {} & FormData

// 送出 api 需要參數
export type FormParams = {
  column1: string
  column2: string
  column3: string
  column4: string
  column5: string
}
export type CreateParams = {} & FormParams
export type UpdateParams = {} & FormParams

// create
export const createData = async (form: CreateFormData) => {
  const {
    column1,
    column2,
    column3,
    column4,
    column5
  } = form

  const resData = await ajax<Api<null>>({
    url: '/api/create',
    method: 'post',
    data: {
      column1,
      column2,
      column3,
      column4,
      column5
    } as CreateParams
  }, {
    isFakeData: true,
    fakeData: {
      data: null,
      status: 'success'
    },
    delay: 300
  })
  const { status, msg } = resData

  if (status !== 'success') {
    swal({
      icon: 'error',
      title: '新增資料失敗',
      text: isEmpty(msg) ? '請聯絡資訊人員' : msg
    })
  }

  return status
}

// update
export const updateData = async (form: UpdateFormData) => {
  const {
    column1,
    column2,
    column3,
    column4,
    column5
  } = form

  const resData = await ajax<Api<null>>({
    url: '/api/update',
    method: 'put',
    data: {
      column1,
      column2,
      column3,
      column4,
      column5
    } as UpdateParams
  }, {
    isFakeData: true,
    fakeData: {
      data: null,
      status: 'success'
    },
    delay: 300
  })
  const { status, msg } = resData

  if (status !== 'success') {
    swal({
      icon: 'error',
      title: '更新資料失敗',
      text: isEmpty(msg) ? '請聯絡資訊人員' : msg
    })
  }

  return status
}
