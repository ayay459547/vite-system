/* 讓 object 有類似 array 的方法 */
import { hasOwnProperty } from '@/lib/lib_utils' // 工具

type That = Array<any> | Record<string, any> | any

/**
 * @author Caleb
 * @description 使用範例
 * const test = { a: 1, b: 2, c: 3 }
 *
 * object_forEach(test, (value, key) => {
 *   // a => 1
 *   // b => 2
 *   // c => 3
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
 *
 * console.log(res) // { a: { a: 1, key: 'a' }, b: { b: '2', key: 'b' }, c: { c: 3, key: 'c' } }
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
 *
 * console.log(res) // [{ b: 2}, {c: 3}]
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
 *
 * console.log(res) // true
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
 *
 * console.log(res) // false
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
 *
 * console.log(res) // [{ b: 2}, {c: 3}]
 */
export const object_reduce = <T extends any>(that: That, callback: Function, temp: any, thisArg?: any): T => {
  thisArg = thisArg || window

  for (const key in that) {
    if (hasOwnProperty(that, key)) {
      temp = callback.call(thisArg, temp, that[key], key, that)
    }
  }
  return temp as T
}

/**
 * @author Caleb
 * @description 使用範例
 * const test = { a: 1, b: 2, c: 3 }
 *
 * const res = object_findIndex<string>(test, (value, key) => {
 *   return value > 1
 * })
 *
 * console.log(res) // 'b'
 */
export const object_findIndex = <T extends (number | string | null)>(that: That, callback: Function, thisArg?: any): T | undefined => {
  thisArg = thisArg || window

  for (const key in that) {
    if (hasOwnProperty(that, key) && callback.call(thisArg, that[key], key, that)) {
      return key as T
    }
  }

  if (Array.isArray(that)) return -1 as T
  return undefined
}

/**
 * @author Caleb
 * @description 使用範例
 * const test = { a: 1, b: 2, c: 3 }
 *
 * const res = object_find<string>(test, (value, key) => {
 *   return value > 1
 * })
 *
 * console.log(res) // 2
 */
export const object_find = <T extends any>(that: That, callback: Function, thisArg?: any): (T | undefined) => {
  thisArg = thisArg || window

  for (const key in that) {
    if (hasOwnProperty(that, key) && callback.call(thisArg, that[key], key, that)) {
      return that[key] as T
    }
  }
  return undefined
}

