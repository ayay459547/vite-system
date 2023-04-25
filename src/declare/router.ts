/**
 * 路由樹設定 類型
 */
export declare interface RouterTree {
  name: string        // 唯一值，不能重複
  title: string       // 顯示文字
  inject?: boolean    // 是否加入路由，也就是是否顯示在頁面上
  complete?: boolean  // 是否完成，未完成會有icon，打包時過濾
  meta?: {}           // 額外其他參數
  Leaves?: RouterTree[]   // 子路由設定
  path?: string           // 網址
  component?: () => void  // 頁面組件
}