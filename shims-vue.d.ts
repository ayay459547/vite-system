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

// CSS modules
// type CSSModuleClasses = { readonly [key: string]: string }
// declare module '*.module.scss' {
//   const classes: CSSModuleClasses
//   export default classes
// }

declare module '@/components.*' {
  const content: any
  export default content
}

declare module '*?b64' {
  const b64: any
  export default b64
}

// declare module '*.md' {
//   const markdown: string
//   export default markdown
// }
// declare module '*raw' {
//   const markdown: string
//   export default markdown
// }

declare module '*sheetjs' {
  const excel: any
  export default excel
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