## v1.0.0

### v2024-11-11.1 (Caleb)
* SimpleTable
  * 變更寫法: vue(h) => template
  * 新增slot: row-expand
    * 功能等同於CustomTable的slot row-expand

### v2024-08-21.1 (Caleb)
* WebViewTable 通用查詢表格組件
  * 修正載入更多顯示錯誤
* CustomInput 輸入框組件
* SimpleFilter 簡易搜尋組件
  * 調整寫法讓vue devtools可識別
  
### v2024-08-20.4 (Caleb)
* CustomTable, CustomTableV2 表格組件
  * 調整響應式作法
* 系統初始化
  1. 新增系統未載入的讀取畫面
  2. 修正讀取圖片錯誤
  3. Polyfill 新增 findLast
* 新增套件
  1. vxe-table
  2. vite-plugin-lazy-import

### v2024-08-13.1 (Caleb)
* 重構 scss
* 組件加載異步執行 useAsyncComponent
  * 新增加載組件時 顯示骨架畫面 Async_Skeleton.vue
  * 新增加載組件時 顯示錯誤畫面 Async_Error.vue

### v2024-08-06.1 (Caleb)
* 修正提示彈窗跑版(swal)
* 升級開發套件
* vee-validate升版 調整CustomInput值傳遞邏輯

### v2024-07-08.1 (Caleb)
* 新增 element ui 深色模式
* 路由移除預設翻譯模組

### v2024-05-29.1 (Caleb)
* 優化系統初始化效能
* 重構組件類型

### v2024-05-27.1 (Caleb)
* 使用 CustomSelectV2 + CustomTreeV2 優化頁面效能
* 更新 element-plus 版本 (2.4.3 => 2.7.3)
* 新增虛擬選擇框 CustomSelectV2
* 新增虛擬樹 CustomTreeV2 (beta)

### v2024-05-23.1 (Caleb)
* 移除Object.prototype 上的自訂函數

### v2023-10-01.1 (Caleb)
* 布局重構
* 加入 CustomScrollbar 組件

### v2023-05-01.1 (Caleb)
* 加入 CustomInput 組件
* 輸入框驗證
* 翻譯
* 加入 CustomPopover 組件
* Loader

### v2023-04-01.1 (Caleb)
* 初始化專案
* 系統路由
* 布局
