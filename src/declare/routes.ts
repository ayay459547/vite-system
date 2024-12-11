import type { CustomIconProps } from '@/components' // 系統組件
import type { RouterType } from '@/router/setting'

interface Meta {
  // 是否放在 <KeepAlive></KeepAlive> 中
  keepAlive?: boolean

  // 打包類型 對應預設圖示
  systemType?: RouterType[]

  // 路由圖示 (目前只有第一層用到圖示)
  icon?: string | [CustomIconProps.Type, string]

  permission?: number // 路由預設權限 (2進制)

  isInProgress?: boolean // 功能開發中
  isFix?: boolean // 功能維護中

  note?: string // 備註
}

interface BaseTree {
  name: string // 路由名稱 唯一值，不能重複
  title: string // 顯示文字
  meta?: Meta // 額外其他參數

  // 權限(2進制)
  // 如果後端沒有對應權限 給指定路由預設權限
  // 沒給指定路由就使用預設權限
  permission?: number // 系統初始化後 最後的權限大小
}
interface RootTree extends BaseTree {
  leaves?: RouterTree[] // 子路由設定
}
interface LeafTree extends BaseTree {
  // path?: string // 網址 => `${systemUrl}/${name}`
  component?: () => void | any // 頁面組件
}
/**
 * 路由樹設定 類型
 */
export declare interface RouterTree extends RootTree, LeafTree {}

export declare interface Navigation extends RootTree, LeafTree {
  leaves?: Navigation[] // 子路由
  breadcrumbName?: Array<string> // 左側選單確認 是否 active 用
  breadcrumbTitle?: Array<string> // header 麵包屑
}
