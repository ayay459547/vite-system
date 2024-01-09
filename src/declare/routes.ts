import type { IconType } from '@/components'
import type { RouterType } from '@/router/setting'

interface Meta {
  // 顯示時，決定是否放在 <KeepAlive></KeepAlive> 中
  keepAlive: boolean

  // 檢驗進度用
  status?: 'completed' | 'inProgress' | 'new'
  startDate?: string
  completedDate?: string
}

interface BaseTree {
  name: string                        // 唯一值，不能重複
  title: string                       // 顯示文字
  systemType: RouterType[]            // 路由類型

  icon?: string | [IconType, string]  // 第一層路由的圖示
  meta?: Meta                         // 額外其他參數

  // 如果後端沒有對應權限 給指定路由預設權限
  // 沒給指定路由就使用預設權限
  permission?: number
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
  leaves?: Navigation[]             // 子路由
  permission?: number               // 權限(2進制)
  breadcrumbName?: Array<string>    // 左側選單確認 是否 active 用
  breadcrumbTitle?: Array<string>   // header 麵包屑
}
