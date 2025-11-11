import { aesEncrypt, aesDecrypt } from '@/lib/lib_utils' // 工具
import { setCookie, getCookie, removeCookie } from '@/lib/lib_storage' // 前端儲存
// import { formatDatetime } from '@/lib/lib_format'

const privateKey = (import.meta as any).env.VITE_API_PRIVATE_KEY
const tokenTime = (import.meta as any).env.VITE_API_TOKEN_TIME

export interface Token {
  uid: string
  date: Date
  userId: number
}

/**
 * @description 取得登入資訊
 * @param {String} loginTime YYYY-MM-DD_HH:mm:ss
 * @returns 使用者資訊
 */
export const getToken = (loginTime?: string): Token | null => {
  try {
    const token = getCookie('token')
    if (['', null, undefined].includes(token)) return null

    const _userId = aesDecrypt(token ?? '', `${privateKey}__${loginTime}`)
    const userId = Number.parseInt(_userId)
    if (Number.isNaN(userId)) {
      throw `userId = '${_userId}'`
    }

    const userData = {
      uid: '',
      date: new Date(),
      userId
    }
    return userData
  } catch (e) {
    console.log(e)
    return null
  }
}

/**
 * @description 設定登入資訊
 * @param {Number} userId 使用者ID
 * @param {String} loginTime YYYY-MM-DD_HH:mm:ss
 * @return {String} token
 */
export const setToken = (userId: number, loginTime: string): string => {
  try {
    if (['', null, undefined].includes(loginTime)) return ''

    const token = aesEncrypt(`${userId}`, `${privateKey}__${loginTime}`)

    const minutes = Number.parseInt(tokenTime)

    // 保存時間 (分鐘)
    const expiresTime = new Date(new Date().getTime() + minutes * 60 * 1000)
    // console.log('Set', expiresTime)
    // 保存時間: 測試(秒)
    // const expiresTime = new Date(new Date().getTime() + minutes * 1000)

    // console.log('minutes => ', {
    //   minutes,
    //   expiresTime,
    //   formatExires: formatDatetime(expiresTime, 'HH:mm:ss')
    // })

    setCookie('token', token, { expires: expiresTime })
    return token
  } catch (e) {
    console.log(e)
    return ''
  }
}

export const clearToken = () => {
  removeCookie('token')
}

// 防止不斷刷新
let refreshTokenPromise: any = null
// 刷新原因
const refreshReasonQueue: Array<string> = []

/**
 * @author Caleb
 * @description 刷新token(登入)狀態
 *              以後可能會改用JWT實作
 * @param {String} refreshReason 刷新原因( API / RouterChange )
 */
export const refreshToken = (refreshReason?: string) => {
  refreshReasonQueue.push(refreshReason)
  if (refreshTokenPromise) return refreshTokenPromise

  refreshTokenPromise = new Promise((resolve, reject) => {
    // 更新時間 1 分鐘, 防止不斷更新
    setTimeout(() => {
      try {
        // 目前由前端手動更新
        // 以後改由後端
        const loginTime = getCookie('loginTime')
        const token = getToken(loginTime)
        // console.log('REFRES_TIMEOUT', token, loginTime, refreshReason)
        const { userId = -1 } = token ?? {}
        if (!Number.isNaN(userId) && userId > 0) {
          const newToken = setToken(userId, loginTime ?? '')
          resolve(newToken)
        } else {
          resolve(token)
        }

      } catch (e) {
        console.log(e)
        reject(null)
      }
    }, 60 * 1000)
  })

  refreshTokenPromise.finally(() => {
    // 清空原因
    refreshReasonQueue.splice(0)
    refreshTokenPromise = null
  })
}
