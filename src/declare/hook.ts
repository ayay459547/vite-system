import type { SweetAlertOptions, SweetAlertResult } from 'sweetalert2'

export declare type IconType = 'fas' | 'far' | 'fab'

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

  type eventList = (
    click: MouseEvent,
    eventList?: Array<EventItem>,
    options?: EventOptions
  ) => void

  type i18nTranslate = (key: string) => string

  type swal = (options: SweetAlertOptions<any, any>) => Promise<SweetAlertResult<any>>
}
export declare type Hook = () => {
  loading: HookList.loading
  eventList: HookList.eventList
  i18nTranslate: HookList.i18nTranslate
  swal: HookList.swal
}