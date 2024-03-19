import { hasOwnProperty } from '@/lib/lib_utils'

export declare namespace Callback {
  type ForEach<T extends any> = (value: T, key: string, obj: Record<string, T>) => any | void
  type Map<T extends any, Res extends any> = (value: T, key: string, obj: Record<string, T>) => Res
}

/**
 * @author Caleb
 * @description 可讓object 可使用類似 Array.forEach 的函數
 * @param obj
 * @param callback
 */
export const forEach = <T>(obj: Object, callback: Callback.ForEach<T>): void => {
  for (const key in obj) {
    if (hasOwnProperty(obj, key)) {
      callback.call(obj, obj[key], key, obj)
    }
  }
}

/**
 * @author Caleb
 * @description 可讓object 可使用類似 Array.map 的函數
 * @param obj
 * @param callback
 */
export const map = <T, Res>(obj: Object, callback: Callback.Map<T, Res>): Record<string, Res> => {
  const resObj = new (obj as any).constructor()
  for (const key in obj) {
    if (hasOwnProperty(obj, key)) {
      resObj[key] = callback.call(obj, obj[key], key, obj)
    }
  }
  return resObj
}
