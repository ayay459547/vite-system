import type { SweetAlertOptions, SweetAlertResult } from 'sweetalert2'
import type { NotificationProps, NotificationHandle, MessageOptions, MessageHandler } from 'element-plus'

import type { IconType } from '@/components/feature/CustomIcon/CustomIcon.vue'
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

  type message = (options: Partial<MessageOptions>) => MessageHandler

  type permission = (permissionTotal?: string | null) => Permission

  type env = () => Record<string, any>

  type auth = () => Record<string, any>
}

export declare type Hook = () => {
  loading: HookList.loading
  i18nTranslate: HookList.i18nTranslate
  i18nTest: HookList.i18nTest
  eventList: HookList.eventList
  swal: HookList.swal
  notification: HookList.notification
  message: HookList.message
  permission: HookList.permission
  env: HookList.env
  auth: HookList.auth
}

export declare type SwalResult = {
  isConfirmed: boolean
  isDenied: boolean
  isDismissed: boolean
  value: boolean
}

export declare interface ObjectFunction {
  $forEach (callback: Function, thisArg?: any): void
  $map (callback: Function, thisArg?: any): any
  $filter (callback: Function, thisArg?: any): any
  $some (callback: Function, thisArg?: any): boolean
  $every (callback: Function, thisArg?: any): boolean
  $reduce (callback: Function, temp: any, thisArg?: any): any
}
