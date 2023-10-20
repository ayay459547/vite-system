import type { SweetAlertOptions, SweetAlertResult } from 'sweetalert2'
import type { IconType } from '@/components/feature/CustomIcon/CustomIcon.vue'
import type { NotificationProps, NotificationHandle } from 'element-plus'
import type { Permission } from '@/lib/lib_permission'

export declare interface EventItem {
  icon: [IconType, string] | []
  label: string
  disabled?: boolean
  active?: boolean
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

  type notification = (options: Partial<NotificationProps>) => NotificationHandle

  type permission = (permissionTotal?: number | null) => Permission

  type getEnv = () => Record<string, any>
}

export declare type Hook = () => {
  loading: HookList.loading
  i18nTranslate: HookList.i18nTranslate
  i18nTest: HookList.i18nTest
  eventList: HookList.eventList
  swal: HookList.swal
  notification: HookList.notification
  permission: HookList.permission
  getEnv: HookList.getEnv
}

export declare type SwalResult = {
  isConfirmed: boolean
  isDenied: boolean
  isDismissed: boolean
  value: boolean
}