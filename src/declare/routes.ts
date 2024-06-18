import type { IconProps } from '@/components'
import type { RouterType } from '@/router/setting'
import type { ScopeKey } from '@/i18n/i18n_setting'

interface Meta {
  // 是否放在 <KeepAlive></KeepAlive> 中
  keepAlive?: boolean

  // 路由圖示 (目前只有第一層用到圖示)
  systemType?: RouterType[]

  // 路由圖示
  icon?: string | [IconProps.Type, string]

  // i18n Excel檔案(i18n.xlsx) 對應的模組
  i18nModule?: ScopeKey

  // 權限(2進制)
  // 如果後端沒有對應權限 給指定路由預設權限
  // 沒給指定路由就使用預設權限
  permission?: number

  // 備註
  note?: string
}

interface BaseTree {
  name: string // 路由名稱 唯一值，不能重複
  title: string // 顯示文字
  meta?: Meta // 額外其他參數
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
