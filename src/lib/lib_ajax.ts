import axios from 'axios'
import type { AxiosRequestConfig, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { ElMessage } from 'element-plus'

import type { AjaxOptions } from '@/declare/ajax'
import { hasOwnProperty, isEmpty, message } from '@/lib/lib_utils' // 工具
import { updateToken } from '@/lib/lib_cookie'

const baseURL = (import.meta as any).env.VITE_API_BASE_URL
const connectApi = (import.meta as any).env.VITE_API_CONNECT_API

const fakeApi = <ResData>(
  config: AxiosRequestConfig,
  options: AjaxOptions<ResData>
): PromiseLike<ResData> => {
  const { fakeData, delay, callback } = options

  return new Promise(resolve => {
    // 自訂回傳資料
    if (typeof callback === 'function') {
      const resFakeData = callback(config, fakeData)
      setTimeout(() => {
        resolve(resFakeData)
      }, delay)
      // 直接返回假資料

    } else {
      setTimeout(() => {
        resolve(fakeData)
      }, delay)
    }
  })
}

const timeout = 1000 * 60 * 30
const axiosApi = async <ResData>(config: AxiosRequestConfig, baseUrl: string): Promise<ResData> => {
  const instance = axios.create({
    baseURL: baseUrl,
    timeout,
    // 允許帶 cookie
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json;charset=utf8'
      // 'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
      // Pragma: 'no-cache',
      // Expires: '0'
    }
  })

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig<any>) => config,
    (error: AxiosError<any>) => {
      const [apiUrl, errorCode, errorMessage] = [
        error?.request?.responseURL ?? '',
        error?.code ?? '',
        error?.message ?? ''
      ]

      console.table(error)
      message({
        type: 'error',
        message: `<div class="ajax-message">
          <h2>API Request Error ( ${errorCode} )</h2>
          <div>${apiUrl}</div>
          <div>${errorMessage}</div>
        </div>`,
        customClass: 'i-message',
        dangerouslyUseHTMLString: true,
        duration: 120000
      })

    }
  )

  instance.interceptors.response.use(
    (res: AxiosResponse<any, any>) => res,
    (error: AxiosError<any>) => {
      const [apiUrl, errorStatus, errorMessage] = [
        error?.request?.responseURL ?? '',
        error?.response?.status ?? '',
        error?.message ?? ''
      ]

      console.table(error)
      message({
        type: 'error',
        message: `<div class="ajax-message">
          <h2>API Response Error ( ${errorStatus} )</h2>
          <div>${apiUrl}</div>
          <div>${errorMessage}</div>
        </div>`,
        customClass: 'i-message',
        dangerouslyUseHTMLString: true,
        duration: 120000
      })
    }
  )

  try {
    const resAjax = await instance(config)
    const { data, status = -1, statusText = 'Error' } = resAjax ?? {}

    return data ?? {
      result: null,
      data,
      size: 0,
      status: status,
      msg: statusText,
      message: statusText,
      errorMsg: statusText
    }

  } catch (e) {
    console.log(e)
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
 *              fakeData: 如果是取假資料 返回的資料
 *              status: 資料返回狀態
 *              callback: 自訂回傳假資料
 * @returns {PromiseLike<ResData>}
 */
export const ajax = <ResData>(
  config: AxiosRequestConfig,
  options: AjaxOptions<ResData> = {}
): PromiseLike<ResData> => {
  const { isFakeData = false, fakeData = null, isLog = null, delay = 0, callback = null } = options

  updateToken('ajax')

  switch (connectApi) {
    case 'true':
      return axiosApi<ResData>(config, baseURL)
    case 'false':
      return fakeApi<ResData>(config, { fakeData, delay, callback })
    case 'auto':
    default:
      if (isLog ?? isFakeData) {
        const style = `
          font-size: 1em;
          color: #409EFF;
        `
        const { url, method, data } = config

        console.group('%c%s', style, 'api 資訊')
        console.log('%c%s', style, `url: ${url}`)
        console.log('%c%s', style, `method: ${method}`)
        console.log('%c%s', style, `data: ${data}`)
        console.table(data)
        console.groupEnd()
      }
      if (isFakeData) {
        return fakeApi<ResData>(config, { fakeData, delay, callback })
      } else {
        return axiosApi<ResData>(config, baseURL)
      }
  }
}

export default ajax

const baseWS = (import.meta as any).env.VITE_API_BASE_WS
const baseWSURL = (import.meta as any).env.VITE_API_BASE_WS_URL

export type WebSocketConfig = {
  baseWs?: string
  baseUrl?: string
  url: string
  onopen?: Function
  onclose?: Function
  onerror?: Function
  onmessage?: Function
}
/**
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
  // WebSocket
  socket: WebSocket | null
  // 設定
  config: WebSocketConfig

  // 路徑前綴
  baseWs: string
  // 基本路徑
  baseUrl: string
  // 路徑
  url: string
  // 連結路徑
  connectUrl: string

  // 是否重新連接
  isReConnect: boolean
  // 是否錯誤 會觸發1分鐘後重新連接
  isError: boolean
  // 是否關閉 close 將不再重新連接
  isClose: boolean
  // 送出訊息次數
  sendMessageCount: number

  connectCount: number

  // 計時器
  timer: NodeJS.Timeout | null

  /**
   * 重新連接
   */
  #reconnect(delay: number) {
    if (this.isReConnect) return

    if (this.socket.readyState === 1 || this.socket.readyState === 0) {
      this.isReConnect = false
      this.isError = false
    } else {
      this.isReConnect = true

      const msg = `reconnect after ${delay} second`
      console.log('%c%s', 'font-size: 1.1em; color: #E6A23C;', `ws ${msg}: ${this.connectUrl}`)
      // message({ type: 'warning', message: msg, duration: delay })

      this.timer = setTimeout(() => {
        this.init(this.config)
      }, delay)
    }
  }

  // 預設事件
  #onopen(onopen: Function | undefined) {
    if (!isEmpty(onopen)) {
      onopen()
    } else {
      const msg = 'connect success'
      console.log('%c%s', 'font-size: 1.1em; color: #67C23A;', `ws ${msg}: ${this.connectUrl}`)
      // message({ type: 'success', message: msg, duration: 3000 })
    }
    this.connectCount++

    this.isReConnect = false
  }
  #onclose(onclose: Function | undefined) {
    if (!isEmpty(onclose)) {
      onclose()
    } else {
      const msg = 'close connect'
      console.log('%c%s', 'font-size: 1.1em; color: #909399;', `ws ${msg}: ${this.connectUrl}`)
      // message({ type: 'info', message: msg, duration: 3000 })
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
  #onerror(onerror: Function | undefined) {
    // 至少要連過一次 才會執行
    if (!isEmpty(onerror) && this.connectCount > 0) {
      onerror()
    } else {
      const msg = 'connect error'
      console.log('%c%s', 'font-size: 1.1em; color: #F56C6C;', `ws ${msg}: ${this.connectUrl}`)
      // message({ type: 'error', message: msg, duration: 10000 })
    }
    this.isError = true
  }
  #onmessage(msg: MessageEvent) {
    console.log('%c%s', 'color: #409EFF;', `get message: ${this.connectUrl} (${msg})`)

    return msg
  }

  constructor(config: WebSocketConfig) {
    this.baseWs = ''
    this.baseUrl = ''
    this.url = ''

    this.socket = null
    this.config = config

    this.isReConnect = false
    this.isError = false
    this.isClose = false
    this.sendMessageCount = 0
    this.connectCount = 0

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

    this.baseWs = baseWs ?? `${baseWS}`
    this.baseUrl = baseUrl ?? `${isEmpty(baseWSURL) ? window.location.host : baseWSURL}`
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
    let _timer: NodeJS.Timeout | null = null

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

  /**
   * 重連 WebSocket
   * 手動關閉 會在1秒後重新連接
   */
  reconnect() {
    clearTimeout(this.timer)
    this.socket.close()
  }

  /**
   * 關閉 WebSocket
   * 手動關閉
   */
  close() {
    this.isClose = true
    clearTimeout(this.timer)
    this.socket.close()
  }
}

// 尚未封裝
export type EventSourceConfig = {}
/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/EventSource
 * @description EventSource
 */
export class IEventSource {}
