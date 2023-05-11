/// <reference types="vite/client" />

interface Object {
  $forEach (callback: Function, thisArg?: any): void
  $map (callback: Function, thisArg?: any): any
  $filter (callback: Function, thisArg?: any): any
  $some (callback: Function, thisArg?: any): booelan
  $every (callback: Function, thisArg?: any): booelan
  $reduce (callback: Function, temp: any, thisArg?: any): any
}