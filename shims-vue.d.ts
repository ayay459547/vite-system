/// <reference types="./vite-env-override.d.ts" />
/* eslint-disable */
import type { DefineComponent } from 'vue'

declare module '*.vue' {
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
  	$log: (any: any) => string
  }
}

// declare module '*.module.scss' {
//   const classes: any
//   export default classes
// }

declare module '@/components' {
  const content: any
  export default content
}

declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'

declare global {
  interface Object {
    $forEach (callback: Function, thisArg?: any): void
    $map (callback: Function, thisArg?: any): any
    $filter (callback: Function, thisArg?: any): any
    $some (callback: Function, thisArg?: any): boolean
    $every (callback: Function, thisArg?: any): boolean
    $reduce (callback: Function, temp: any, thisArg?: any): any
  }
}