import type { IconType } from '@/components'
import type { RouterType } from '@/router/setting'
import type { ScopeKey } from '@/i18n/i18n_setting'

interface Meta {
  // 是否放在 <KeepAlive></KeepAlive> 中
  keepAlive: boolean

  // 檢驗進度用
  status?: 'completed' | 'inProgress' | 'new' | string
  startDate?: string
  completedDate?: string
}

interface BaseTree {
  name: string                        // 唯一值，不能重複
  title: string                       // 顯示文字
  systemType: RouterType[]            // 路由類型

  icon?: string | [IconType, string]  // 第一層路由的圖示
  meta?: Meta                         // 額外其他參數

  // 權限(2進制)
  // 如果後端沒有對應權限 給指定路由預設權限
  // 沒給指定路由就使用預設權限
  permission?: number
}
interface RootTree extends BaseTree {
  leaves?: RouterTree[]       // 子路由設定
}
interface LeafTree extends BaseTree {
  path?: string               // 網址
  component?: () => void |any // 頁面組件

  // i18n Excel檔案(i18n.xlsx) 對應的模組
  i18nModule?: ScopeKey
}
/**
 * 路由樹設定 類型
 */
export declare interface RouterTree extends RootTree, LeafTree {}

export declare interface Navigation extends RootTree, LeafTree {
  leaves?: Navigation[]             // 子路由
  breadcrumbName?: Array<string>    // 左側選單確認 是否 active 用
  breadcrumbTitle?: Array<string>   // header 麵包屑
}
