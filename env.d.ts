/// <reference types="vite/client" />
// declare module 'envConfig'

interface Object {
  $forEach (callback: Function, thisArg?: any): void
  $map (callback: Function, thisArg?: any): any
  $filter (callback: Function, thisArg?: any): any
  $some (callback: Function, thisArg?: any): boolean
  $every (callback: Function, thisArg?: any): boolean
  $reduce (callback: Function, temp: any, thisArg?: any): any
}