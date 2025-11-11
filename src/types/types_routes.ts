export type RoutesLevel = 'Basic' | 'Advanced' | 'Premium'

interface Meta {
  // 是否放在 <KeepAlive></KeepAlive> 中
  isKeepAlive?: boolean

  /**
   * 路由圖示 (目前只有第一層用到圖示)
   * 依據 CustomIcon 傳 {...}
   */
  icon?: Record<string, any> | any

  /**
   * 權限(2進制)
   * 如果後端沒有對應權限 給指定路由預設權限
   * 沒給指定路由就使用預設權限
   */
  permission?: number

  isEnabled?: boolean // 是否啟用
  isInProgress?: boolean // 功能開發中
  isFix?: boolean // 功能維護中
  isMain?: boolean // 主要功能, 首頁點擊模組優先使用

  /**
   * 服務等級
   * 僅引響 選單顯示
   * 不引響功能使用
   */
  serviceLevels?: RoutesLevel
}

interface CommonTree {
  name: string
  title: string // 顯示文字
  meta: Meta // 額外其他參數

  leaves?: RouterTree[] // 子路由設定
  component?: () => void | any // 頁面組件
}
/**
 * 路由樹設定 類型
 */
export declare interface RouterTree extends CommonTree {}

export declare interface Navigation extends CommonTree {
  leaves?: Navigation[] // 子路由
  breadcrumbName?: Array<string> // 左側選單確認 是否 active 用
  breadcrumbTitle?: Array<string> // header 麵包屑
}
