import type { SweetAlertOptions, SweetAlertResult } from 'sweetalert2'
import type {
  NotificationProps,
  NotificationHandle,
  MessageOptions,
  MessageHandler
} from 'element-plus'

import type { IconType } from '@/components/feature/CustomIcon/CustomIconInfo'
import type { Permission as PagePermission } from '@/lib/lib_permission'
import type { ScopeKey } from '@/i18n/i18n_setting'

// 使用者
export declare interface User {
  id?: number
  loginName?: string
  fullName?: string
  enabled?: boolean

  password?: string
}

// 權限 角色
export declare interface Role {
  id?: number
  roleName?: string
  description?: string
}

// 權限 詳細資料
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

// 權限 群組
export declare interface Group {
  id: number
  fullName?: string
}

// 權限 使用者
export declare interface AuthData {
  user?: User
  role?: Role
  roleFunction?: Array<PermissionData>
  groups?: Array<Group>
}

// event 事件
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
  type Loading = (isOpen: boolean, message?: string) => void
  type I18nTranslate = (key: string, i18nModule?: ScopeKey) => string
  type I18nTest = (key: string, i18nModule?: ScopeKey) => boolean
  type EventList = (click: MouseEvent, eventList?: Array<EventItem>, options?: EventOptions) => void
  type Swal = (sweetAlertOptions: SweetAlertOptions<any, any>) => Promise<SweetAlertResult<any>>
  type Notification = (notificationProps: Partial<NotificationProps>) => NotificationHandle
  type Message = (messageOptions: Partial<MessageOptions>) => MessageHandler
  type Permission = (permissionTotal?: string | null) => PagePermission
  type Env = () => Record<string, any>
  type Auth = () => AuthData
}

export declare type UseHookOptions = {
  i18nModule: ScopeKey
}

export declare type UseHook = (options?: UseHookOptions) => {
  loading: UseHookReturn.Loading
  i18nTranslate: UseHookReturn.I18nTranslate
  i18nTest: UseHookReturn.I18nTest
  eventList: UseHookReturn.EventList
  swal: UseHookReturn.Swal
  notification: UseHookReturn.Notification
  message: UseHookReturn.Message
  permission: UseHookReturn.Permission
  env: UseHookReturn.Env
  auth: UseHookReturn.Auth
}

export declare type SwalResult = {
  isConfirmed: boolean
  isDenied: boolean
  isDismissed: boolean
  value: boolean
}
