import { defineAsyncComponent, h } from 'vue'

import Async_Skeleton from '@/views/Common/Async_Skeleton.vue'
import Async_Error from '@/views/Common/Async_Error.vue'

export type Variant = string
  |'p' | 'text'
  | 'h1' | 'h3' | 'caption'
  |'button' | 'empty' | 'image'
  | 'circle' | 'rect'

/**
 * @author Caleb
 * @description 懶加載組件
 * @param {Function} loader () => import('@/components/MyAsyncComponent.vue')
 * @param {Variant} variant 類型
 */
export const useAsyncComponent = <T = any>(loader: () => Promise<any>, variant: string = 'rect') => {
  return defineAsyncComponent<T>({
    loader,
    // 自定義加載組件
    loadingComponent: {
      render: () => h(Async_Skeleton, { variant })
    },
    // 自定義錯誤組件
    errorComponent: {
      render: () => h(Async_Error, { variant })
    },
    delay: 300, // 延遲顯示加載組件
    timeout: 60000, // 超過時間顯示錯誤組件
    suspensible: false // Suspense
  })
}
