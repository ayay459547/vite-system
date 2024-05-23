import type { SweetAlertOptions, SweetAlertResult } from 'sweetalert2'
import type {
  NotificationProps,
  NotificationHandle,
  MessageOptions,
  MessageHandler
} from 'element-plus'

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

export declare namespace UseHookReturn {
  type loading = (isOpen: boolean, message?: string) => void

  type i18nTranslate = (key: string, i18nModule?: ScopeKey) => string

  type i18nTest = (key: string, i18nModule?: ScopeKey) => boolean

  type eventList = (click: MouseEvent, eventList?: Array<EventItem>, options?: EventOptions) => void

  type swal = (sweetAlertOptions: SweetAlertOptions<any, any>) => Promise<SweetAlertResult<any>>

  type notification = (notificationProps: Partial<NotificationProps>) => NotificationHandle

  type message = (messageOptions: Partial<MessageOptions>) => MessageHandler

  type permission = (permissionTotal?: string | null) => Permission

  type env = () => Record<string, any>

  type auth = () => AuthData
}

export declare type UseHookOptions = {
  i18nModule: ScopeKey
}

export declare type UseHook = (options?: UseHookOptions) => {
  loading: UseHookReturn.loading
  i18nTranslate: UseHookReturn.i18nTranslate
  i18nTest: UseHookReturn.i18nTest
  eventList: UseHookReturn.eventList
  swal: UseHookReturn.swal
  notification: UseHookReturn.notification
  message: UseHookReturn.message
  permission: UseHookReturn.permission
  env: UseHookReturn.env
  auth: UseHookReturn.auth
}

export declare type SwalResult = {
  isConfirmed: boolean
  isDenied: boolean
  isDismissed: boolean
  value: boolean
}
