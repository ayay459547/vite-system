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

declare module '@/components.*' {
  const content: any
  export default content
}

declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
