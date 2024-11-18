// import type { Api, ApiRes } from '@/declare/ajax'
// import { ajax } from '@/lib/lib_ajax'
// import type { Options } from '@/components' // 系統組件

// import { blockSortingTypes } from '@/variable'
// import { getTypeItemIndexValue } from './columns'

// 表單資料
export type FormData = {
  id?: string
  key?: string
  sortingBy?: number | string
  checkIn?: number | string
  order?: any
}

export type UpdatePostData = Array<{
  scheduleBlockSortingSettings: Array<{
    blockSortingTypePk: {
      typeItemIndex: string
    }
    sequence: number
    SORT_TYPE: string | 'ASC' | 'DESC'
  }>
  scheduleBlockTypePk: {
    typeItemIndex: string
  }
}>
