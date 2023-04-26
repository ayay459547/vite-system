/**
 * 路由樹設定 類型
 */
export declare interface RouterTree {
  name: string        // 唯一值，不能重複
  title: string       // 顯示文字
  inject: boolean     // 是否加入路由，也就是是否顯示在頁面上
  complete: boolean   // 是否完成，未完成會有維修圖示，打包時過濾

  icon?: string           // 第一層路由的圖示
  meta?: {}               // 額外其他參數
  /**
   * 如果沒有子路由 就切換頁面 需要 path + component
   * 如果有 需要 leaves
   */
  leaves?: RouterTree[]   // 子路由設定
  path?: string           // 網址
  component?: () => void  // 頁面組件
}