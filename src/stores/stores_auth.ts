/**
 * stores_auth
 * 使用者權限
 */

import { defineStore } from 'pinia'
import { ref, shallowRef, computed, shallowReactive } from 'vue'

import type { AuthData, PermissionData } from '@/declare/hook' // 全域功能類型
import { getRouterLeafLayer } from '@/lib/lib_routes'
import routes from '@/router/routes'

import { permission } from '@/lib/lib_permission' // 權限
import { isEmpty, swal } from '@/lib/lib_utils' // 工具
import { formatDatetime } from '@/lib/lib_format' // 格式化
import { setCookie, removeCookie, getToken, setToken, clearToken, getCookie } from '@/lib/lib_cookie'

import { defaultAuthData, getAuthData } from './api'

// 跳過登入
const isSkipLogin = (import.meta as any).env.VITE_API_SKIP_LOGIN === 'true'

export const useAuthStore = defineStore('auth', () => {
  // 是否已確認登入狀態
  const isCheckedStatus = ref(false)

  /**
   * 使用者資料相關
   * 使用者資料會帶動權限
   */
  const authData = shallowRef<AuthData>(defaultAuthData)
  const isLogin = computed(() => {
    return !isEmpty(authData.value?.user?.id)
  })

  /**
   * 依照使用者 id
   * 取得權限資料
   * Map(route, permissions)
   */
  const routesPermission = shallowReactive(new Map<string, number>())

  const setRoutesPermission = async (permissionList: PermissionData[]) => {
    permissionList.forEach(permissionItem => {
      const {
        readPermissions,
        createPermissions,
        updatePermissions,
        deletePermissions,
        executePermissions,
        pk
      } = permissionItem

      const { functionID } = pk
      /**
       * 依據 api 取得的路由權限
       * 設定 權限的總和
       */
      let _permission = 0
      if (readPermissions) {
        _permission += permission.read
      }
      if (createPermissions) {
        _permission += permission.create
      }
      if (updatePermissions) {
        _permission += permission.update
      }
      if (deletePermissions) {
        _permission += permission.delete
      }
      if (executePermissions) {
        _permission += permission.execute
      }
      routesPermission.set(functionID, _permission)
    })
  }
  // 將所有路由權限變為 0
  const clearRoutesPermission = () => {
    const permissionList = getRouterLeafLayer(routes, [1, 2, 3], false)

    permissionList.forEach(permissionItem => {
      routesPermission.set(permissionItem.name, 0)
    })
  }

  // 登入
  const setAuthStatus = (userId: number, loginTime = formatDatetime(new Date(), 'YYYY-MM-DD_HH:mm:ss')) => {
    setCookie('loginTime', loginTime)
    setToken(userId, loginTime)
  }
  // 登出
  const clearAuthStatus = () => {
    clearToken()
    removeCookie('loginTime')
  }
  /**
   * 確認狀態 目前是前端做
   * 有可能串後端 api
   */
  const checkAuthStatus = async (): Promise<number | null> => {
    const loginTime = getCookie('loginTime')

    return await new Promise(resolve => {
      const token = getToken(loginTime)

      if (token !== null) {
        const { userId } = token
        setAuthStatus(userId, loginTime)
        resolve(userId)

      } else {
        clearAuthStatus()
        resolve(null)
      }
    })
  }

  /**
   * 初始化系統使用者
   * 初始化系統路由權限 Map(route, permissions)
   */
  const initSystemData = async () => {
    isCheckedStatus.value = false

    if (isSkipLogin) {
      isCheckedStatus.value = true
      return
    }

    routesPermission.clear()

    const userId = await checkAuthStatus()

    let authId: any = null
    let permissionList: Array<any> = []
    let tempAuthData: AuthData = defaultAuthData

    if (!isEmpty(userId)) {
      // 使用 token 初始化使用者資料
      const { status, msg, data: resData } = await getAuthData(userId)
      if (status !== 'success') {
        swal({
          icon: 'error',
          title: 'API error',
          text: msg ?? '',
          showCancelButton: false
        })
      }

      const { user, roleFunction } = resData

      authId = user.id
      permissionList = roleFunction
      tempAuthData = resData
    }

    if (!isEmpty(authId)) {
      authData.value = tempAuthData
      setRoutesPermission(permissionList)
    } else {
      authData.value = defaultAuthData
      clearRoutesPermission()
    }

    isCheckedStatus.value = true
  }

  return {
    // 路由確認用
    isCheckedStatus,
    isLogin,

    authData,
    routesPermission,

    setAuthStatus,
    clearAuthStatus,
    checkAuthStatus,
    initSystemData
  }
})
