import type { SweetAlertOptions, SweetAlertResult } from 'sweetalert2'
import type { IconType } from '@/components/feature/CustomIcon/CustomIcon.vue'

export declare interface EventItem {
  icon: [IconType, string] | []
  label: string
  event: Function
}
export declare interface EventOptions {
  width: number
}
export declare interface CustomPopoverQueue {
  queueId: number
  clientX: number
  clientY: number
  eventList: EventItem[]
  options?: EventOptions
}
export declare namespace HookList {
  type loading = (isOpen: boolean, message?: string) => void

  type i18nTranslate = (key: string) => string

  type i18nTest = (key: string) => boolean

  type eventList = (
    click: MouseEvent,
    eventList?: Array<EventItem>,
    options?: EventOptions
  ) => void

  type swal = (options: SweetAlertOptions<any, any>) => Promise<SweetAlertResult<any>>
}
export declare type Hook = () => {
  loading: HookList.loading
  i18nTranslate: HookList.i18nTranslate
  i18nTest: HookList.i18nTest
  eventList: HookList.eventList
  swal: HookList.swal
}