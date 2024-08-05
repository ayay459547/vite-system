import type { Api } from '@/declare/ajax.ts'
import { ajax } from '@/lib/lib_ajax'
import { swal } from '@/lib/lib_utils'

// 表單資料
export type FormData = {
  dayOfWeek: string
  timeRange: [string, string] | null
}
export type CreateFormData = {} & FormData
export type UpdateFormData = { id: string } & FormData

// 送出 api 需要參數
export type FormParams = {
  dayOfWeek: string
  positive: boolean

  startHour: string
  startMinutes: string
  endHour: string
  endMinutes: string
}
export type CreateParams = {} & FormParams
export type UpdateParams = { id: string } & FormParams

// create
export const createData = async (form: CreateFormData) => {
  const { dayOfWeek, timeRange = ['', ''] } = form

  const [start = '', end = ''] = timeRange
  const [startHour = '', startMinutes = ''] = start.split(':')
  const [endHour = '', endMinutes = ''] = end.split(':')

  const resData = await ajax<Api<null>>(
    {
      url: '/workingTime/addGeneralWorkingTimes',
      method: 'post',
      data: [
        {
          dayOfWeek: `${dayOfWeek}`,
          positive: true,

          startHour,
          startMinutes,
          endHour,
          endMinutes
        }
      ] as CreateParams[]
    },
    {
      isFakeData: false,
      fakeData: {
        data: null,
        status: 'error'
      },
      isLog: false,
      delay: 300
    }
  )
  const { status, msg } = resData

  if (status !== 'success') {
    swal({
      icon: 'error',
      title: '新增資料失敗',
      text: msg ?? '請聯絡資訊人員',
      showCancelButton: false
    })
  }

  return status
}

// update
export const updateData = async (form: UpdateFormData) => {
  const { id = '', dayOfWeek, timeRange = ['', ''] } = form

  const [start = '', end = ''] = timeRange
  const [startHour = '', startMinutes = ''] = start.split(':')
  const [endHour = '', endMinutes = ''] = end.split(':')

  const resData = await ajax<Api<null>>(
    {
      url: '/workingTime/updateGeneralWorkingTimes',
      method: 'post',
      data: [
        {
          id: `${id}`,
          dayOfWeek: `${dayOfWeek}`,
          positive: true,

          startHour,
          startMinutes,
          endHour,
          endMinutes
        }
      ] as UpdateParams[]
    },
    {
      isFakeData: false,
      fakeData: {
        data: null,
        status: 'success'
      },
      delay: 300
    }
  )
  const { status, msg } = resData

  if (status !== 'success') {
    swal({
      icon: 'error',
      title: '更新資料失敗',
      text: msg ?? '請聯絡資訊人員',
      showCancelButton: false
    })
  }

  return status
}
