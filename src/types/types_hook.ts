import type { SweetAlertOptions, SweetAlertResult } from 'sweetalert2'
import type {
  NotificationProps,
  NotificationHandle,
  MessageOptions,
  MessageHandler
} from 'element-plus'

import type { CustomIconProps } from '@/components/feature' // 系統組件: 功能
import type { Permission as PagePermission } from '@/lib/lib_permission' // 權限
import type { Navigation } from '@/types/types_routes'
import type {
  ScopeKey,
  I18nTranslate as _I18nTranslate,
  I18nTest as _I18nTest
} from '@/types/types_i18n'

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
  icon: CustomIconProps | [CustomIconProps['type'], string] | []
  label: string
  disabled?: boolean
  active?: boolean
  event: ((...args: any[]) => any)
  class?: string
  id?: string // 端對端測試
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

export declare interface UseHookReturn {
  loading: (isOpen: boolean, message?: string) => void
  i18nTranslate: _I18nTranslate
  i18nTest: _I18nTest
  eventList: (click: MouseEvent, eventList?: Array<EventItem>, options?: EventOptions) => void
  swal: (sweetAlertOptions: SweetAlertOptions) => Promise<SweetAlertResult<any> | any>
  notification: (notificationProps: Partial<NotificationProps>) => NotificationHandle
  message: (messageOptions: Partial<MessageOptions>) => MessageHandler
  permission: (routeName?: string | null, hiddenLog?: boolean) => PagePermission
  routeData: (routeName?: string | null) => Navigation
  env: () => Record<string, any>
  auth: () => AuthData
  redirectInfo: () => {
    fromPage: string,
    queryData: any
  }
}

export declare type UseHookOptions = {
  i18nModule?: ScopeKey
}

export declare type UseHook = (options?: UseHookOptions) => {
  loading: UseHookReturn['loading']
  i18nTranslate: UseHookReturn['i18nTranslate']
  i18nTest: UseHookReturn['i18nTest']
  eventList: UseHookReturn['eventList']
  swal: UseHookReturn['swal']
  notification: UseHookReturn['notification']
  message: UseHookReturn['message']
  permission: UseHookReturn['permission']
  routeData: UseHookReturn['routeData']
  env: UseHookReturn['env']
  auth: UseHookReturn['auth']
  redirectInfo: UseHookReturn['redirectInfo']
}

export declare type SwalResult = {
  isConfirmed: boolean
  isDenied: boolean
  isDismissed: boolean
  value: boolean
}
