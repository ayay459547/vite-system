import type { RouterType } from '@/router/setting'

interface BaseTree {
  name: string              // 唯一值，不能重複
  title: string             // 顯示文字
  systemType: RouterType[]  // 路由類型

  icon?: string             // 第一層路由的圖示
  meta?: {}                 // 額外其他參數
}
interface RootTree extends BaseTree {
  leaves?: RouterTree[]     // 子路由設定
}
interface LeafTree extends BaseTree {
  path?: string             // 網址
  component?: () => void    // 頁面組件
}
/**
 * 路由樹設定 類型
 */
export declare interface RouterTree extends RootTree, LeafTree {}

export declare interface Navigation extends RootTree, LeafTree {
  leaves?: Navigation[]
  breadcrumbName?: Array<string>
  breadcrumbTitle?: Array<string>
}