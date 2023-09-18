import type { AxiosRequestConfig } from 'axios'
import type { AjaxOptions } from '@/declare/ajax'
import axios from 'axios'
import Swal from 'sweetalert2'

const baseUrl = (import.meta as any).env.VITE_API_BASE_URL
const connectApi = (import.meta as any).env.VITE_API_CONNECT_API

const fakeApi = <ResData>(config: AxiosRequestConfig, options: AjaxOptions<ResData>): PromiseLike<ResData> => {
  const { fakeData, delay, callback } = options

  return new Promise((resolve) => {
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

const timeout = 1000 * 60 * 5
const axiosApi = <ResData>(config: AxiosRequestConfig, baseUrl: string): PromiseLike<ResData> => {
  const instance = axios.create({
    baseURL: baseUrl,
    timeout,
    //   withCredentials: true
    headers: {
      'Content-Type': 'application/json'
    }
  })

  instance.interceptors.request.use(
    (config) => {
      return config
    },
    (error) => {
      console.log('request error', error)
    }
  )

  instance.interceptors.response.use(
    (res) => {
      return res.data
    },
    (error) => {
      console.log('response error', error)

      Swal.fire({
        icon: 'error',
        reverseButtons: true,
        confirmButtonText: '確認',
        title: 'Api Error',
        text: error.message
      })
    }
  )

  return instance(config)
}

/**
 * @author Caleb
 * @description 抓後端資料用
 * @param {Object} config 設定
 *              url: api網址
 *              method: get | post | put | delete
 *              data: 傳到後端資料
 * @param {Object} options
 *              getFakeData: 是否取的假資料
 *              fakeData: 如果是取假資料 返回的資料
 *              status: 資料返回狀態
 *              callback: 自訂回傳假資料
 * @returns {Promise}
 */
export const ajax = <ResData>(
  config: AxiosRequestConfig,
  options: AjaxOptions<ResData> = {}
): PromiseLike<ResData> => {

  const {
    getFakeData = false,
    fakeData = null,
    delay = 0,
    callback = null
  } = options

  switch (connectApi) {
    case 'true':
      return axiosApi<ResData>(config, baseUrl)
    case 'false':
      return fakeApi<ResData>(config, { fakeData, delay, callback })
    case 'auto':
    default:
      if (getFakeData) {
        return fakeApi<ResData>(config, { fakeData, delay, callback })
      } else {
        return axiosApi<ResData>(config, baseUrl)
      }
  }
}

export default ajax
