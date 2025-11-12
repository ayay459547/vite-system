/**
 * @see https://github.com/axios/axios
 * @see https://axios-http.com/
 */

import axios from 'axios'
import type { AxiosRequestConfig, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { ElMessage } from 'element-plus'

import type { AjaxOptions, Api } from '@/types/types_ajax'
import { hasOwnProperty, isEmpty, message, fetchFakeData } from '@/lib/lib_utils' // 工具
import { refreshToken } from '@/lib/lib_token'

const baseURL = (import.meta as any).env.VITE_API_BASE_URL
const connectApi = (import.meta as any).env.VITE_API_CONNECT_API

// 虛擬api
const fakeApi = <ResData = any, ResDataMore = any>(
  config: AxiosRequestConfig,
  options: AjaxOptions<ResData>
): PromiseLike<Api<ResData, ResDataMore>> => {
  const {
    fakeData, // 假資料(包含狀態, 其他)
    fakeDataPath,
    delay, // 回傳假資料的時間
    callback // 自訂回傳假資料
  } = options

  return new Promise(async resolve => {
    let resFakeData = fakeData?.data ?? null
    // get 取假資料
    if (typeof fakeDataPath === 'string' && fakeDataPath.length > 0) {
      resFakeData = await fetchFakeData(fakeDataPath)
    }

    // 自訂回傳資料
    if (typeof callback === 'function') {
      resFakeData = await callback(resFakeData, config)
      setTimeout(() => {
        resolve({ ...fakeData, data: resFakeData } as Api<ResData, ResDataMore>)
      }, delay)

    // 直接返回假資料
    } else {
      setTimeout(() => {
        resolve({ ...fakeData, data: resFakeData } as Api<ResData, ResDataMore>)
      }, delay)
    }
  })
}

const timeout = 1000 * 60 * 30
// 真實api
const axiosApi = async <ResData = any, ResDataMore = any>(config: AxiosRequestConfig, baseUrl: string = baseURL): Promise<Api<ResData, ResDataMore>> => {
  // 建立
  const instance = axios.create({
    baseURL: baseUrl,
    timeout,
    // 允許帶 cookie
    withCredentials: true,
    headers: {
      // Expires: '0',
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json;charset=utf8'
    }
  })

  // 攔截 request
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig<any>) => config,
    (error: AxiosError<any>) => {
      const [apiUrl, errorCode, errorMessage] = [
        error?.request?.responseURL ?? 'undefined',
        error?.code ?? 'undefined',
        error?.message ?? 'undefined'
      ]

      console.log('🆖 API Request Error', error)
      message({
        type: 'error',
        message: `<div class="ajax-message">
          <h2>API Request Error ( ${errorCode} )</h2>
          <div>url: ${apiUrl}</div>
          <div>message: ${errorMessage}</div>
        </div>`,
        customClass: 'i-message',
        dangerouslyUseHTMLString: true,
        duration: 120000
      })
    }
  )

  // 攔截 response
  instance.interceptors.response.use(
    (res: AxiosResponse<any, any>) => res,
    (error: AxiosError<any>) => {
      const [apiUrl, errorCode, errorMessage, errorStatus] = [
        error?.request?.responseURL ?? 'undefined',
        error?.code ?? 'undefined',
        error?.message ?? 'undefined',
        error?.response?.status ?? 'undefined'
      ]

      console.log('🆖 API Response Error', error)
      message({
        type: 'error',
        message: `<div class="ajax-message">
          <h2>API Response Error ( ${errorCode } )</h2>
          <div>url: ${apiUrl}</div>
          <div>message: ${errorMessage}</div>
          <div>status: ${errorStatus}</div>
        </div>`,
        customClass: 'i-message',
        dangerouslyUseHTMLString: true,
        duration: 120000
      })
    }
  )

  // 送出api
  try {
    const resAjax = await instance(config)
    const { data, status = -1 } = resAjax ?? {}

    // 統一處理後端API格式
    const {
      data: __data__ = null,
      size = 0,
      status: __status__ = null,
      // 目前後端有給的訊息格式
      msg = null,
      message = null,
      errorMsg = null
    } = data ?? {}

    const isSuccess = (
      status > 0 &&
      ['success', true].includes(__status__)
    )

    return {
      ...data,
      data: __data__ ?? data?.result,
      size,
      status: isSuccess ? 'success' : 'error',
      msg: msg ?? message ?? errorMsg
    } as Api<ResData, ResDataMore>

  } catch (error) {
    console.log('🆖 axios instance error', error)

    return {
      data: null,
      size: -1,
      status: 'error',
      msg: `${error}`
    } as Api<ResData, ResDataMore>
  }
}

/**
 * @author Caleb
 * @see https://github.com/axios/axios
 * @description 對後端發送請求用
 *              送api 更新 token
 * @param {AxiosRequestConfig} config 設定
 *              url: api網址
 *              method: get | post | put | delete
 *              data: 傳到後端資料
 * @param {AjaxOptions<ResData>} options
 *              isFakeData: 是否取的假資料
 *              fakeDataPath: 假資料的位置 (fetch 取資料)
 *              fakeData: 如果是取假資料 返回的資料
 *                  data: 資料
 *                  status: 資料返回狀態
 *              isLog: 顯示資訊(沒設定使用isFakeData判斷)
 *              delay: 模擬延遲取得資料
 *              callback: 自訂回傳假資料
 * @returns {PromiseLike<ResData>}
 */
export const ajax = <ResData, ResDataMore = {}>(
  config: AxiosRequestConfig,
  options: AjaxOptions<ResData> = {}
): PromiseLike<Api<ResData, ResDataMore>> => {
  const {
    isFakeData = false,
    fakeDataPath = null,
    fakeData = null,
    isLog = null,
    delay = 0,
    callback = null
  } = options

  // 刷新 Token
  const apiUrl = `API: ${config?.baseURL ?? baseURL}${config.url}`
  refreshToken(apiUrl)

  switch (connectApi) {
    case 'true':
      return axiosApi<ResData, ResDataMore>(config, baseURL)
    case 'false':
      return fakeApi<ResData, ResDataMore>(config, { ...options, fakeData, delay, callback })
    case 'auto':
    default:
      if (isLog ?? isFakeData) {
        console.groupCollapsed('%c%s', 'color: #409EFF', `📧 API 資訊: (${config.method}) ${config.url}`)
        console.log('config: ', config)
        console.log('isFakeData: ', isFakeData)
        console.log('fakeDataPath: ', fakeDataPath)
        console.log('fakeData: ', fakeData)
        console.groupEnd()
      }
      if (isFakeData) {
        return fakeApi<ResData, ResDataMore>(config, { ...options, fakeData, delay, callback })
      } else {
        return axiosApi<ResData, ResDataMore>(config, baseURL)
      }
  }
}

export default ajax

type WebSocketConfig = {
  baseWs?: string
  baseUrl?: string
  url: string
  onopen?: ((...args: any[]) => any)
  onclose?: ((...args: any[]) => any)
  onerror?: ((...args: any[]) => any)
  onmessage?: ((this: WebSocket, ev: MessageEvent) => any) | null
}
/**
 * @deprecated 棄用 使用 useWebSocket 代替
 *             使用 自訂 Composition Api (Hook) 替代 class 寫法
 * @author Caleb
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
 * @description WebScoket
 *
 *   使用範例
 *   const ws = ref(null)
 *   ws.value = new IWebScoket({
 *     baseUrl: '127.0.0.1:8080',
 *     url: '/...'
 *   })
 *   ws.value.init()
 */
export class IWebScoket {
  socket: WebSocket // WebSocket
  config: WebSocketConfig // 設定

  baseWs: string // 路徑前綴
  baseUrl: string // 基本路徑
  url: string // 路徑
  connectUrl: string // 連結路徑

  isReConnect: boolean // 是否重新連接
  isError: boolean // 是否錯誤 會觸發1分鐘後重新連接
  isClose: boolean // 是否關閉 close 將不再重新連接

  sendMessageCount: number // 送出訊息次數
  connectCount: number

  timer: number | undefined // 計時器

  // 重新連接
  #reconnect(delay: number) {
    if (this.isReConnect) return

    if (this.socket.readyState === 1 || this.socket.readyState === 0) {
      this.isReConnect = false
      this.isError = false
    } else {
      this.isReConnect = true

      const msg = `reconnect after ${delay} second`
      console.log('%c%s', 'font-size: 1.1em; color: #E6A23C;', `ws ${msg}: ${this.connectUrl}`)

      this.timer = setTimeout(() => {
        this.init(this.config)
      }, delay)
    }
  }

  // 預設事件
  #onopen(onopen: ((...args: any[]) => any) | undefined) {
    if (typeof onopen === 'function') {
      onopen()
    } else {
      const msg = 'connect success'
      console.log('%c%s', 'font-size: 1.1em; color: #67C23A;', `ws ${msg}: ${this.connectUrl}`)
    }
    this.connectCount++

    this.isReConnect = false
  }
  #onclose(onclose: ((...args: any[]) => any) | undefined) {
    if (typeof onclose === 'function') {
      onclose()
    } else {
      const msg = 'close connect'
      console.log('%c%s', 'font-size: 1.1em; color: #909399;', `ws ${msg}: ${this.connectUrl}`)
    }

    this.isReConnect = false
    if (!this.isClose) {
      // 發生錯誤時 1分鐘後 自動重新連接
      // 手動關閉 1秒後 自動重新連接
      if (this.isError) {
        this.#reconnect(60000)
      } else {
        this.#reconnect(1000)
      }
    }
  }
  #onerror(onerror: ((...args: any[]) => any) | undefined) {
    // 至少要連過一次 才會執行
    if (typeof onerror === 'function' && this.connectCount > 0) {
      onerror()
    } else {
      const msg = 'connect error'
      console.log('%c%s', 'font-size: 1.1em; color: #F56C6C;', `ws ${msg}: ${this.connectUrl}`)
    }
    this.isError = true
  }
  #onmessage(msg: MessageEvent) {
    console.log('%c%s', 'color: #409EFF;', `get message: ${this.connectUrl} (${msg})`)

    return msg
  }

  constructor(config: WebSocketConfig) {
    this.baseWs = ''
    this.baseUrl = window.location.host
    this.url = ''
    this.connectUrl = ''

    this.socket = new WebSocket(this.connectUrl)
    this.config = config

    this.isReConnect = false
    this.isError = false
    this.isClose = false

    this.sendMessageCount = 0
    this.connectCount = 0
    this.timer = undefined

    if (hasOwnProperty(window, 'WebSocket')) {
      this.init(config)
    } else {
      ElMessage({
        message: 'Not supported webSocket.',
        type: 'error'
      })
    }
  }

  /**
   * 初始化 WebSocket
   * @param {Object} config 設定檔案
   */
  init(config: WebSocketConfig) {
    if (isEmpty(config)) return

    const { baseWs, baseUrl, url, onopen, onclose, onerror, onmessage } = config

    this.baseWs = baseWs ?? 'ws://'
    this.baseUrl = baseUrl ?? window.location.host
    if (!isEmpty(url)) {
      this.url = url
    } else {
      ElMessage({
        message: 'Unable to connect to the server.',
        type: 'error'
      })

      throw new Error('url Empty')
    }
    this.isReConnect = false
    this.isError = false
    this.isClose = false

    this.connectUrl = `${this.baseWs}${this.baseUrl}${this.url}`
    this.socket = new WebSocket(this.connectUrl)

    // 開啟連結
    this.socket.onopen = this.#onopen.bind(this, onopen)
    // 關閉連結
    this.socket.onclose = this.#onclose.bind(this, onclose)
    // 連結錯誤
    this.socket.onerror = this.#onerror.bind(this, onerror)
    // 接收訊息
    this.socket.onmessage = onmessage ?? this.#onmessage.bind(this)
  }

  /**
   * 發送訊息
   * @param {*} data 送出資料
   */
  send(data: any) {
    let _timer: number | undefined = undefined

    try {
      // 可送出訊息
      if (this.socket.readyState === 1) {
        this.sendMessageCount = 0
        clearTimeout(_timer)
        console.log(`send ${this.connectUrl} `, data)
        this.socket.send(data)
      } else {
        // 無法送出訊息 重新送出10次
        if (this.sendMessageCount <= 10) {
          console.log(this.socket.readyState)

          ++this.sendMessageCount
          _timer = setTimeout(() => {
            this.send(data)
          }, 100 * this.sendMessageCount)
        } else {
          this.sendMessageCount = 0
          clearTimeout(_timer)
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  // 重連 WebSocket, 手動關閉 會在1秒後重新連接
  reconnect() {
    clearTimeout(this.timer)
    this.socket.close()
  }

  // 關閉 WebSocket, 手動關閉
  close() {
    this.isClose = true
    clearTimeout(this.timer)
    this.socket.close()
  }
}
