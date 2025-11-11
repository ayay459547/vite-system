/**
 * stores_auth
 * 使用者權限
 */
import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'

import type { AuthData } from '@/types/types_hook' // 全域功能類型
import { isEmpty, message, tipLog } from '@/lib/lib_utils' // 工具
import { formatDatetime } from '@/lib/lib_format' // 格式化
import { setLocalStorage, setCookie, getCookie, removeCookie } from '@/lib/lib_storage'
import { getToken, setToken, clearToken } from '@/lib/lib_token'

import { defaultAuthData, getAuthData } from './api'

// 跳過登入
const isSkipLogin = (import.meta as any).env.VITE_API_SKIP_LOGIN === 'true'

export const useAuthStore = defineStore('Auth', () => {
  /**
   * 使用者資料相關
   * 使用者資料會帶動權限
   */
  const authData = shallowRef<AuthData>(defaultAuthData)

  // 是否登入
  const isLogin = ref(false)

  // 登入
  const setAuthStatus = (userId: number, loginTime = formatDatetime(new Date(), 'YYYY-MM-DD_HH:mm:ss')) => {
    setCookie('loginTime', loginTime)
    setToken(userId, loginTime)

    // 通知登入狀態改變
    setLocalStorage('logState', 'login')
  }
  // 登出
  const clearAuthStatus = () => {
    clearToken()
    removeCookie('loginTime')

    // 通知登入狀態改變
    setLocalStorage('logState', 'logout')
  }

  /**
   * 確認狀態 目前是前端做
   * 有可能串後端 api
   */
  const checkAuthStatus = (): Promise<number | null> => {
    const loginTime = getCookie('loginTime')
    console.log('🍍 stores_auth checkAuthStatus()', loginTime)

    return new Promise(resolve => {
      const token = getToken(loginTime)

      if (token !== null) {
        const { userId } = token
        resolve(userId)

      } else {
        resolve(null)
      }
    })
  }

  /**
   * 初始化系統使用者
   * 初始化系統路由權限 Map(route, permissions)
   */
  const initAuthData = async (): Promise<void> => {
    const authStatus = await checkAuthStatus()

    isLogin.value = !isEmpty(authStatus) || isSkipLogin
    const userId = Number.parseInt(`${authStatus}`)

    if (isLogin.value) {
      // 使用 token 初始化使用者資料
      const { status, msg, data: resData } = await getAuthData(userId)
      if (status !== 'success') {
        message({
          type: 'error',
          message: msg ?? 'Get AuthData Error',
          dangerouslyUseHTMLString: true,
          duration: 10000
        })
      }
      const { user, roleFunction, role, groups } = resData ?? {}

      const isLoseAuthData = [user, roleFunction, role, groups].some(authData => isEmpty(authData))
      if (isLoseAuthData) {
        tipLog('缺少使用者資料', [{ user, roleFunction, role, groups }], 'table')
      }

      const loginTime = getCookie('loginTime')
      setAuthStatus(userId, loginTime)

      authData.value = {...defaultAuthData, ...resData}
    } else {
      clearAuthStatus()

      authData.value = defaultAuthData
    }
  }

  /**
   * 同步不同視窗的登入狀態
   * 任意視窗登入狀態變更時會變更logState，通知其他視窗的頁面重新加載
   */
  window.addEventListener('storage', (e: StorageEvent) => {
    if (e.key !== 'logState') return
    window.location.reload()
  })

  return {
    isLogin,
    authData,
    initAuthData,
    setAuthStatus,
    clearAuthStatus,
    checkAuthStatus
  }
})
