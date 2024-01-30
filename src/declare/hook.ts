import type { SweetAlertOptions, SweetAlertResult } from 'sweetalert2'
import type { NotificationProps, NotificationHandle, MessageOptions, MessageHandler } from 'element-plus'

import type { IconType } from '@/components/feature/CustomIcon/CustomIconInfo'
import type { Permission } from '@/lib/lib_permission'
import type { ScopeKey } from '@/i18n/i18n_setting'

export declare interface User {
  id?: number
  loginName?: string
  fullName?: string
  enabled?: boolean

  password?: string
}

export declare interface Role {
  id?: number
  roleName?: string
  description?: string
}

export declare interface PermissionData {
  autoGeneratingId: boolean
  createDate: string
  lastUpdateTimestamp: string
  routerName: string
  pk: {
    functionID: string
    roleID: number
  }

  readPermissions: boolean
  createPermissions: boolean
  updatePermissions: boolean
  deletePermissions: boolean
  executePermissions: boolean
}

export declare interface Group {
  id: number
  fullName?: string
}

export declare interface AuthData {
  user?: User
  role?: Role
  roleFunction?: Array<PermissionData>
  groups?: Array<Group>
}

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

export declare namespace UseHookList {
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

  type auth = () => AuthData
}

export declare type UseHookOptions = {
  i18nModule: ScopeKey
}

export declare type UseHook = (options?: UseHookOptions) => {
  loading: UseHookList.loading
  i18nTranslate: UseHookList.i18nTranslate
  i18nTest: UseHookList.i18nTest
  eventList: UseHookList.eventList
  swal: UseHookList.swal
  notification: UseHookList.notification
  message: UseHookList.message
  permission: UseHookList.permission
  env: UseHookList.env
  auth: UseHookList.auth
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
