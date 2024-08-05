import type { Api, ApiRes } from '@/declare/ajax.ts'
import { ajax } from '@/lib/lib_ajax'

// 表單資料
export type FormData = {
  dateTimeRange: [string, string] | null
  machine_Id: string
  type: string
  note: string
}
export type CreateFormData = {} & FormData
export type UpdateFormData = { id: string } & FormData

// 送出 api 需要參數
export type FormParams = {
  endMinutes: string
  positive: boolean

  startDateTimeStr: string
  endDateTimeStr: string
  machine: { pk: { id: string } }
  type: string
  note: string
}
export type CreateParams = {} & FormParams
export type UpdateParams = { id: string } & FormParams

// create
export const createData = async (form: CreateFormData): Promise<ApiRes> => {
  const { dateTimeRange, machine_Id = '', type = '', note = '' } = form

  const [startDateTimeStr, endDateTimeStr] = Array.isArray(dateTimeRange) ? dateTimeRange : ['', '']

  const resData = await ajax<Api<null>>(
    {
      url: '/workingTime/addSpecifyMachineWorkingTimes',
      method: 'post',
      data: [
        {
          endMinutes: '0',
          positive: false,

          startDateTimeStr,
          endDateTimeStr,
          machine: {
            pk: { id: machine_Id }
          },
          type,
          note
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
  const { id = '', dateTimeRange, machine_Id = '', type = '', note = '' } = form

  const [startDateTimeStr, endDateTimeStr] = Array.isArray(dateTimeRange) ? dateTimeRange : ['', '']

  const resData = await ajax<Api<null>>(
    {
      url: '/workingTime/updateSpecifyMachineWorkingTimes',
      method: 'post',
      data: [
        {
          endMinutes: '0',
          positive: false,

          id: `${id}`,
          startDateTimeStr,
          endDateTimeStr,
          machine: {
            pk: { id: machine_Id }
          },
          type,
          note
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
