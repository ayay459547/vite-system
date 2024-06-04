import type { Api, ApiRes } from '@/declare/ajax'
import { ajax } from '@/lib/lib_ajax'

// 表單資料
export type FormData = {
  machine_Id: string
  dayOfWeek: number | string
  timeRange: [string, string] | null
}
export type CreateFormData = {} & FormData
export type UpdateFormData = { id: string } & FormData

// 送出 api 需要參數
export type FormParams = {
  machine: {
    pk: { id: string }
  }
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
export const createData = async (form: CreateFormData): Promise<ApiRes> => {
  const { machine_Id = '', dayOfWeek, timeRange = ['', ''] } = form

  const [start = '', end = ''] = timeRange
  const [startHour = '', startMinutes = ''] = start.split(':')
  const [endHour = '', endMinutes = ''] = end.split(':')

  const resData = await ajax<Api<null>>(
    {
      url: '/workingTime/addMachineWorkingTimes',
      method: 'post',
      data: [
        {
          machine: {
            pk: { id: machine_Id }
          },
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
        status: 'success'
      },
      delay: 300
    }
  )
  const { status, msg } = resData

  if (['success', true].includes(status)) {
    return { status: 'success', msg }
  } else {
    return { status: 'error', msg }
  }
}

// update
export const updateData = async (form: UpdateFormData): Promise<ApiRes> => {
  const { id = '', machine_Id = '', dayOfWeek, timeRange = ['', ''] } = form

  const [start = '', end = ''] = timeRange
  const [startHour = '', startMinutes = ''] = start.split(':')
  const [endHour = '', endMinutes = ''] = end.split(':')

  const resData = await ajax<Api<null>>(
    {
      url: '/workingTime/updateMachineWorkingTimes',
      method: 'post',
      data: [
        {
          machine: {
            pk: { id: machine_Id }
          },
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

  if (['success', true].includes(status)) {
    return { status: 'success', msg }
  } else {
    return { status: 'error', msg }
  }
}
