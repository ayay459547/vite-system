/* 讓 object 有類似 array 的方法 */
import { hasOwnProperty } from '@/lib/lib_utils.ts'

type That = Object | Array<any> | Record<string, any>

/**
 * @author Caleb
 * @description 使用範例
 * const test = { a: 1, b: 2, c: 3 }
 *
 * object_forEach(test, (value, key) => {
 *   console.log(key, ' => ', value)
 * })
 */
export const object_forEach = <T extends any>(that: That, callback: Function, thisArg?: any): T => {
  thisArg = thisArg || window

  for (const key in that) {
    if (hasOwnProperty(that, key)) {
      callback.call(thisArg, that[key], key, that)
    }
  }

  return that as T
}

/**
 * @author Caleb
 * @description 使用範例
 * const test = { a: 1, b: 2, c: 3 }
 *
 * const res = object_map(test, (value, key) => {
 *   return { ...value, key }
 * })
 */
export const object_map = <T extends any>(that: That, callback: Function, thisArg?: any): T => {
  thisArg = thisArg || window

  const resObj = new (that as any).constructor()
  for (const key in that) {
    if (hasOwnProperty(that, key)) {
      resObj[key] = callback.call(thisArg, that[key], key, that)
    }
  }
  return resObj as T
}

/**
 * @author Caleb
 * @description 使用範例
 * const test = { a: 1, b: 2, c: 3 }
 *
 * const res = object_filter(test, (value, key) => {
 *   return value > 1
 * })
 */
export const object_filter = <T extends any>(that: That, callback: Function, thisArg?: any): T => {
  thisArg = thisArg || window

  const resObj = new (that as any).constructor()
  for (const key in that) {
    if (hasOwnProperty(that, key) && callback.call(thisArg, that[key], key, that)) {
      resObj[key] = that[key]
    }
  }
  return resObj as T
}

/**
 * @author Caleb
 * @description 使用範例
 * const test = { a: 1, b: 2, c: 3 }
 *
 * const res = object_some(test, (value, key) => {
 *   return value > 1
 * })
 */
export const object_some = (that: That, callback: Function, thisArg?: any): boolean => {
  thisArg = thisArg || window

  for (const key in that) {
    if (hasOwnProperty(that, key) && callback.call(thisArg, that[key], key, that)) {
      return true
    }
  }
  return false
}

/**
 * @author Caleb
 * @description 使用範例
 * const test = { a: 1, b: 2, c: 3 }
 *
 * const res = object_every(test, (value, key) => {
 *   return value > 1
 * })
 */
export const object_every = (that: That, callback: Function, thisArg?: any): boolean => {
  thisArg = thisArg || window

  for (const key in that) {
    if (hasOwnProperty(that, key) && !callback.call(thisArg, that[key], key, that)) {
      return false
    }
  }
  return true
}

/**
 * @author Caleb
 * @description 使用範例
 * const test = { a: 1, b: 2, c: 3 }
 *
 * const res = object_reduce(test, (res, value, key) => {
 *   if (value > 1) {
 *     res.push(key)
 *   }
 *   return res
 * }, [])
 */
export const object_reduce = <T extends any>(
  that: That,
  callback: Function,
  temp: any,
  thisArg?: any
): T => {
  thisArg = thisArg || window

  for (const key in that) {
    if (hasOwnProperty(that, key)) {
      temp = callback.call(thisArg, temp, that[key], key, that)
    }
  }
  return temp as T
}
