# Demo v1.0.0

### v2024-04-01.3 (Caleb)

- 假資料使用方式變更
  1. 變更假資料位置
  2. 使用參數 fakeDataPath, 可用get方式取得
- 變更檔案名稱: _\_specification =>_\_spec
- 圖片位置變更: /browser/.png => /images/browser/.png

### v2024-04-01.2 (Caleb)

- lib: fakeDataPath 可使用get取得假資料
- WebViewTable: 新增 props fakeDataPath

### v2024-03-31.1 (Caleb)

- CustomModal: 修正 header 寬度

### v2024-03-27.4 (Caleb)

- 調整前端暫存:
  1. 新增系統參數 VITE_API_STORAGE_KEY_PREFIX
  2. 統一 Cookie, SessionStorage, LocalStorage key前綴
  3. 優化更新前端Token寫法
  4. 使用 lib_storage + lib_token 代替 lib_cookie
- 假資料減量

### v2024-03-26.1 (Caleb)

- package: 更新套件
- CustomIcon: fontawesome 改按需引入

### v2024-03-20.2 (Caleb)

- 假資料減量(優化開發時, 系統讀取資料效能)

### v2024-03-20.1 (Caleb)

- 統一文字大小 em => rem
- 修正取動態欄位 api 位置錯誤

### v2024-03-18.1 (Caleb)

- layout: 本地語言設定 移動到 偏好設定中
- WeekSchedule: 機台工時使用
  1. 可刪除整天分配
  2. 可快速新增某一個小時的時間給整周
  3. 新增使用 Shift+方向鍵 調整開始時間
  4. 新增使用 Alt+方向鍵 調整結束時間

### v2024-03-17.2 (Caleb)

- lib_ajax: ajax 回傳類型統一

### v2024-03-06.1 (Caleb)

- routes: 變更成動態載入
- layout: 移除沒使用的參數
- 統一 table 的操作欄位: 使用 slot row-operations

### v2024-03-05.1 (Caleb)

- GlobalView: useHook 新增 routeData
- routes:
  1. 新增 serviceLevels, usableTiers, 移除 customerLevel
  2. 調整 excel 架構

### v2024-03-04.1 (Caleb)

- WeekSchedule: 一周時間分配
  1. 修正編輯後, 移動到最後一個編輯的元素會複製
  2. 新增使用方向鍵, 移動 指定區塊/全部區塊
  3. 新增刪除一周相同時間
  4. 新增防呆 防止設定重疊的時間

### v2024-02-27.2 (Caleb)

- declare 中定義的類型 移動到 types

### v2024-02-26.1 (Caleb)

- style:
  1. 調整註解
  2. Grid System 新增 flex 版
  3. 調整 Grid System 間距
- CustomTooltip: expose 新增 updatePopper
- CustomInput: 調整警示出現位置
- FormList: 新增一鍵清除
- CustomTable: TableMain => BasicTable
- layout: 修正提示文字

### v2024-02-19.1 (Caleb)

- package: 套件更新
- ModalSelectManagement: 新增 規格類型, 規格, 訂單 選擇表
- WebViewTable: 新增勾選資訊顯示
- FormInput: 新增 type = 'number' 無法輸入 e, +

### v2024-02-19.1 (Caleb)

- 首頁 Copyright 顯示今年
- UI調整: 新增的Icon不轉動

### v2024-02-12.1 (Caleb)

- lib: 新增 usePostMessage
- stores: 顏色/語系的EventBus 統一stores發送事件
- 新增參數 VITE_API_COMPANY
- 網頁的 baseUrl 使用 vite.config.ts 控
- package:
  1. 新增 tsx 套件
  2. 調整指令 lint => eslint-check, lint-debug => eslint-debug, format => prettier, profile => open-profile, transform => transform-debug
  3. 新增指令 transform-excel 將excel轉換成json

### v2024-02-08.1 (Caleb)

- CustomInput: 優化 ModalSelect 監聽事件
- BlockSortingSubTable: 統一管理區塊設定在表格的顯示
- 移除沒使用的組件和code

### v2024-02-07.1 (Caleb)

- ModalSelect: 新增途程
- 整合複用參數
- 整合相似API
- CustomInput:
  1. props 新增: modalSelect (新增輸入框可從表格選資料)
  2. 修正 autocomplete 選項 z-index 太低

### v2024-02-06.1 (Caleb)

- 排程順序管理: 修正 到站時間 顯示 小 -> 大
- i18n: 變更key zhCn => zh_CN, zhTw => zh_TW
- CustomTable: props 新增 selectable
- 新增組件 ModalSelect, ModalSelectManagement

### v2024-02-05.2 (Caleb)

- WebViewTable: 下載設定調整
  1. 變更 excel/pdf 圖示
  2. 加入翻譯模組
  3. 修正下載路徑

### v2024-02-04.2 (Caleb)

- 調整警示UI: swal() => message()
- SimpleFilter: tsx => vueTemplate

### v2024-02-04.1 (Caleb)

- 調整說明文件
- TimeLineTable: 增加Emits類型, 修改變數名稱

### v2024-02-03.1 (Caleb)

- CustomSvg: 新增圖示

### v2024-01-24.1 (Caleb)

- lib: 權限寫法調整
- CustomIcon: 變更 XIcon 位置
- CustomUpload: 邊更上傳檔案後, 檔案顯示圖示
- CustomSvg: svg組件, 特殊圖示

### v2024-01-23.1 (Caleb)

- NetworkView:
  1. 只在開發中才顯示
  2. 事件可穿透
- CustomInput: props 新增 operatorType
- FormOperator: input 參數新增 type, max, min
- lib:
  1. formatDateTimeRange => webViewFormat.dateTimeRange
  2. formatOperator => webViewFormat.operator

### v2024-01-22.2 (Caleb)

- eslint: 新增註解格式檢查
- FormSelect: 調整註解
- ajax: 修正無資料格式提示

### v2024-01-21.1 (Caleb)

- GlobalView: useHook > eventList > icon 支援 array/object 兩種格式

### v2024-01-16.1 (Caleb)

- 新增運行前端服務.bat
- WebViewTable: getColumnOperator 新增參數

### v2024-01-15.1 (Caleb)

- 變更打包後 檔案的hash名稱
- CustomBadge: 修正slot content 無名稱
- CustomIcon:
  1. 新增圖示
     antd: FontSizeOutlined
     fa: Stroopwafel
     ionicons5: HardwareChipSharp
     tabler: Package
  2. XIcon 置中顯示
- CustomInput: 調整props順序

### v2024-01-13.1 (Caleb)

- CustomAnchor:
  1. props 新增 selectScrollTop
  2. 調整說明文件
- CustomBadge:
  1. slot 新增 content
  2. 調整說明文件
- CustomButton:
  1. props 新增 nativeType
  2. 調整說明文件
- CustomImage:
  1. props 新增 hideOnClickModal, loading, lazy, scrollContainer, crossorigin, previewSrcList, zIndex, closeOnPressEscape, infinite, zoomRate, minScale, maxScale
  2. 調整說明文件
- CustomColor:
  1. props 新增 disabled, showAlpha, colorFormat, popperClass, predefine, validateEvent, tabIndex, label, ariaLabel, id, teleported
  2. emits 新增 change, activeChange, focus, blur
  3. expose 新增 color, show, hide, focus, blur
  4. 調整說明文件
- CustomScrollbar:
  1. props 新增 native, tabindex
  2. 調整說明文件

### v2024-01-09.1 (Caleb)

- 調整系統log訊息
- CustomSearch: 調整表格文字不跑版
- CustomPopover: 修正檢驗錯誤

### v2024-01-08.1 (Caleb)

- package: 升級套件
- VxeTable 降版本, 修正欄位合併顯示錯誤: 4.10.0 => 4.8.16
- 代碼格式化

### v2024-01-06.1 (Caleb)

- declare namespace => interface
- 代碼格式化(去空白, 去多餘的逗號)
- 修正打包無結束點
- 類型檢查 不檢查打包後的文件

### v2024-01-03.1 (Caleb)

- package: 升級套件
- CustomIcon: XIcon 套件升級
- 修正打包無結束點

### v2024-01-02.1 (Caleb)

- 調整打包測試.bat
- 打包優化
  1. Element UI Plus 按需引入
  2. 防止重複引用
- style: 變更 reset 的引用
- CustomMarkdown: v-md-editor => md-editor-v3
- CustomIcon: 變更 FontAwesomeIcon 的引入位置
- 變更 element ui 的引用
- 代碼格式化+修正類型檢驗

### v2024-12-31.1 (Caleb)

- 調整打包測試.bat
- router
  1. routes 來源從變數 => excel 打包後的 json
  2. 變更 icon 結構
- tsconfig: 驗證調整
- 代碼格式化 + 修正類型檢驗

### v2024-12-27.2 (Caleb) 💥重大變更

- package: 升級套件 vite4 => vite6
- 代碼格式化+修正類型檢驗:

### v2024-12-26.2 (Caleb)

- 參數 VITE_API_ALL_PERMISSION 變更: 'true' => 'false'
- package:
  1. 更新 @types/node
  2. 新增 chokidar
  3. 打包指定變更(新增 excel 轉 json)
- i18n: 變更監聽 excel 變化方式

### v2024-12-26.1 (Caleb)

- 新增參數 VITE_API_ALL_PERMISSION
- style:
  1. 調整註解說明
  2. 代碼格式化
- 代碼格式化
- CustomDrawer:
  1. 新增 props: appendToBody, appendTo, lockScroll, beforeClose, closeOnClickModal, closeOnPressEscape, openDelay, closeDelay, withHeader, zIndex, headerAriaLevel
  2. 新增 emits: open-auto-focus, close-auto-focus
  3. 新增 expose: handleClose

### v2024-12-24.1 (Caleb)

- package: 新增 @types/uuid, @types/crypto-js
- 修正類型檢驗錯誤
- 代碼格式化: 移除空白
- 調整Element Plus UI 樣式引用

### v2024-12-23.1 (Caleb)

- DevelopmentTest: 開發測試
  1. 新增快捷鍵 '/' 切換色系
  2. 新增快捷鍵 '+' 切換布局
- style:
  1. 調整Element Plus UI 引入路徑
  2. 新增說明
- CustomTable: 調整表格 border 顏色
- HierarchiesGantt: 新增暗黑模式
- 代碼格式化: 移除空白
- 修正類型檢驗錯誤

### v2024-12-20.1 (Caleb)

- CustomModal 代碼調整: 移除console.log

### v2024-12-19.1 (Caleb)

- tsconfig: 調整設定
- 代碼格式化
- 修正類型檢驗錯誤
- views: fakeData.ts => fakeData.json

### v2024-12-18.2 (Caleb)

- style: 移除 normalize
- CustomButton: style 移除 line-height
- CustomIcon: 新增圖示
- CustomProgress: slot 加傳參數
- SchedulingObserver: 排停 api => websocket
- lib:
  1. 修正類型錯誤
  2. IWebScoket 標記 @deprecated
  3. 移除 useId useState useEffect
- SchedulingObserver: 檢查排停預設顯示
- SchedulingObserver: 排程中 其他功能 隱藏 => disabled

### v2024-12-17.1 (Caleb)

- styles: 新增 .flex-1 ~ .flex-10
- HierarchiesGantt: 移除 only-number
- CustomSearch: 修正選項key錯誤
- WebViewTable: emit 新增 columns-change格

### v2024-12-16.2 (Caleb)

- WebViewTable: 調整進階搜尋限制邏輯
- type-check: 修正類型檢驗錯誤

### v2024-12-16.1 (Caleb)

- TimeLineTable: props 新增 version, settingKey
- CustomSearch: 優化代碼

### v2024-12-12.2 (Caleb)

- WebViewTable: 設定進階條件可用選項, 必需有指定參數

### v2024-12-11.1 (Caleb)

- env: 系統參數新增客戶
- CustomIcon: 新增圖示
- WebViewTable, CustomSearch: 進階搜尋 限制可用條件
- router: 參數新增 isInProgress, isFix

### v2024-12-09.1 (Caleb)

- 調整無權限的顯示方式: 跳頁 => 顯示無權限
- 變更浮水印文字大小

### v2024-12-06.1 (Caleb)

- CustomIcon: 新增slot, 機台相關icon
- CustomButton: 調整 icon slot 位置
- CustomTabs: slot 屬性加傳 i18nLabel
- CustomTable:
  1. 修正重製排序條件錯誤
  2. 變更 excel, pdf 下載圖示

### v2024-12-05.1 (Caleb)

- CustomSearch: 修正進階搜尋 無法刪除
- CustomTable: 修改loading樣式
- lib_cookie: 移除log訊息

### v2024-11-22.2 (Caleb)

- package: 移除 vee-validate, @vee-validate/i18n
- CustomInput: 移除 useField, 覆寫驗證
- CustomTour:
  1. 修正 ElTourStep 綁定參數警告
  2. props: 新增 showArrow, contentStyle, showClose, closeOnPressEscape, scrollIntoViewOptions, targetAreaClickable

### v2024-11-20.1 (Caleb)

- 重構 CustomInput: tsx => vue template

### v2024-11-15.2 (Caleb)

- useEventBus routerBus:
  1. 變更名稱 busRouterChange => beforeRouterChange
  2. 觸發時機: router.beforeEach
  3. 開啟遮罩
  4. 新增 routerChange
  5. 觸發時機: RouterView 中的 component@vue:mounted
  6. 關閉遮罩
  7. 設定網頁頁籤名稱

### v2024-11-15.1 (Caleb)

- 優化動態生成ref
- CustomTabs 新增props: beforeLeave
- CustomTag 新增emits: close
- CustomSwitch 新增props: inlinePrompt, activeIcon, inactiveIcon, activeActionIcon, inactiveActionIcon, activeText, inactiveText, activeValue, inactiveValue, name, validateEvent, beforeChange, id, tabindex, ariaLabel
- SimpleTable, FormList 新增expose: toggleRowExpansion
- FormCheckbox: 調整選項間距 24px => 16px

### v2024-11-14.1 (Caleb)

- WebViewTable: api的回傳訊息 接收 msg, message, errorMsg
- SimpleTable: slot(row-expand) 顯示 v-if => v-show
- FormRadio: 縮小選項間距 24px => 16px
- CustomInput: 修正 props(text) 下 radio, checkbox 無翻譯

### v2024-11-11.1 (Caleb)

- SimpleTable
  1. 變更寫法: vue(h) => template
  2. 新增slot: row-expand
  3. itemKey變更預設值: key => id
- 調低深色模式的顏色
- 途程型態分類管理: 使用客製化api, 讀取資料有遮

### v2024-11-08.3 (Caleb)

- package: 移除 @element-plus/icons-vue
- FormAutocomplete 新增props: valueKey, loadingText, noMatchText, noDataText, teleported, appendTo, persistent, automaticDropdown, fitInputWidth, emptyValues, valueOnClear

### v2024-11-08.1 (Caleb)

- package: 新增 @element-plus/icons-vue
- FormInput:
  1. 新增props: maxlength, minlength, showWordLimit, formatter, parser, readonly, step, ariaLabel, tabindex, inputStyle
  2. 移除props: onlyNumber
- FormSelect 新增props: valueKey, loadingText, noMatchText, noDataText, teleported, appendTo, persistent, automaticDropdown, fitInputWidth, emptyValues, valueOnClear
- CustomPopover 新增props: transition, showArrow, popperOptions, hideAfter, autoClose, tabindex, teleported, persistent
- CustomDivider: 調整文字外寬 直角=>圓角
- CustomModal: 調整header區 z-index, 防止底線被中間內容蓋住

### v2024-11-05.4 (Caleb)

- CustomInput: props.type 新增 number
- lib_hook: 新增 useEventSource, useWebSocket, useWebWorker

### v2024-10-23.1 (Caleb)

- Laylut 選單文字加上陰影

### v2024-10-30.1

- 調整警示顯示層級 z-index
- CustomInput 新增 props: autosize, autocomplete, name
- GlobalView
  1. 調整系統初始化
  2. 登入加入瀏覽器預設選填
  3. 新增網路目前狀態圖示

### v2024-10-28.2 (Caleb)

- CustomButton: 優化 scss
- IndexedDB: 修正無成功建立資料表錯誤

### v2024-10-25.1 (Caleb)

- CustomTable: 當IndexedDB未成功建立 使用頁面資料
- DevelopmentTest
  1. 新增測試 IndexedDB
  2. UI 變成分頁
- IndexedDB
  1. 優化初始化邏輯
  2. 版本過低時 自動刪除現有的DB
- views
  1. 部分頁面假資料 .ts => .json
  2. 優化初始化 style 的寫法
  3. 調整註解

### v2024-10-23.1 (Caleb)

- WebViewTable: 優化初始化資料時機
- VxeTable: 移除語系設定

### v2024-10-22.2 (Caleb)

- CustomInput
  1. 修正透過 v-model 改資料無驗證
  2. 修正slot樣式跑版
- views
  1. 修正頁面無取得資料
  2. 註解無用到的code

### v2024-10-17.3 (Caleb)

- CustomDividerView: 修正阻擋事件 使表格拖拉無效
- assets/style
  1. 重構scss寫法
  2. 調整組件跑版

### v2024-10-15.3 (Caleb)

- pluginDirective: 增加說明
- 修正類型錯誤(npm run check-type)

### v2024-10-15.2 (Caleb)

- package

1. 移除 click-outside-vue3
2. 新增 @vueuse/components

- pluginDirective
  1. 新增 v-on-click-outside, v-element-size, v-element-hover, v-element-visibility, v-on-key-stroke
  2. 移除 v-click-outside
- CustomTooltip 新增 props: appendTo, content, rawContent, fallbackPlacements, hideAfter, autoClose, triggerKeys, persistent, ariaLabel
- CustomTour: 修正警告 class無法傳遞
- layout
  1. layout-1 選單文字使用CustomTooltip
  2. 滑鼠移入模組圖示 顯示名稱
  3. 新增 layout-3

### v2024-10-09.2 (Caleb)

- DevelopmentTest: 新增開發用工具(i18n翻譯使用紀錄下載)
- 新增 文字組件 CustomText

### v2024-10-08.2 (Caleb)

- CustomCollapse 新增 props: i18nModule
- CustomLockView: 優化 scss 寫法

### v2024-10-04.3 (Caleb)

- CustomTour 新增翻譯
- CustomButton
  1. 新增 props: bg, link, loadingIcon, icon, autofocus, nativeType, autoInsertSpace, tag
  2. 新增 slot: icon, loading

### v2024-10-04.1 (Caleb)

- CustomBadge 新增 props: showZero, color, offset, badgeStyle, badgeClass
- CustomButton
  1. 新增 props: bg, link, loadingIcon, icon, autofocus, nativeType, autoInsertSpace, tag
  2. 新增 slot: icon, loading

2. 新增組件 按鈕群組組件 CustomButtonGroup

- Layout

1. 調整layout2樣式
2. 移除沒使用的slot

### v2024-09-30.1 (Caleb)

- Components: 優化 css 寫法
- Layout: 優化寫法
- i18n
  1. 優化寫法
  2. 移除 useLocalI18n
- CustomIcon: 加強防呆
- CustomTag: 修正 icon為空字串 錯誤
- lib_utils: 加強 isEmpty 判斷

### v2024-08-29.3 (Caleb)

- 優化 v-for key的綁定: CustomLink, CustomTable, TableMain, WebViewTable

### v2024-08-21.1 (Caleb)

- WebViewTable 通用查詢表格組件: 修正載入更多顯示錯誤
- CustomInput 輸入框組件
- SimpleFilter 簡易搜尋組件: 調整寫法讓vue devtools可識別

### v2024-08-20.4 (Caleb)

- 使用者管理 Nodoc-23: 新增帳戶名稱過濾
- CustomTable, CustomTableV2 表格組件: 調整響應式作法
- 系統初始化
  1. 新增系統未載入的讀取畫面
  2. 修正讀取圖片錯誤
  3. Polyfill 新增 findLast
- 新增套件
  1. vxe-table
  2. vite-plugin-lazy-import

### v2024-08-13.1 (Caleb)

- 重構 scss
- 組件加載異步執行 useAsyncComponent
  1. 新增加載組件時 顯示骨架畫面 Async_Skeleton.vue
  2. 新增加載組件時 顯示錯誤畫面 Async_Error.vue

### v2024-08-12.1 (Caleb)

- CustomTable 自動計算欄位寬度(不包含子欄位)
- 封裝 vueuse

### v2024-08-08.1 (Caleb)

- 看板管理
  1. 隱藏選項 看板分層代碼/看板層內排序/看板分層規則/看板層內排序方法
  2. 群組階層設定 選擇 in / not in 提示如何輸入
  3. 工作站區域設定 輸入文字 => 多選
- 輸入框 CustomInput
  1. 新增參數 reserveKeyword
  2. 驗證失敗 顯示錯誤

### v2024-08-06.1 (Caleb)

- 參數設定及排程(排程管理)
  1. 全部進行排程(舊)
  2. 選單進行排程(新)
- 機台工單排程順序管理: 新增SHR
- 修正提示彈窗跑版(swal)
- 升級開發套件
- vee-validate升版 調整CustomInput值傳遞邏輯

### v2024-08-01.1 (Caleb)

- 修正 通用多條件搜尋 錯誤
- 移除舊版本的機台工時

### v2024-07-30.1 (Caleb)

- 優化caches
- 調整看板偏好設定

### v2024-07-26.1 (Caleb)

- 機台工單排程順序管理
  1. 變更選項名稱: 機台分配順序 => 機台分配
  2. 變更顯示順序: 鎖定區>插單區>開工區 => 開工區>插單區>鎖定區
- 組件 WebViewTable: 修正 多條件搜尋 api 送出格式錯誤

### v2024-07-08.1 (Caleb)

- 新增 element ui 深色模式
- 路由移除預設翻譯模組

### v2024-05-29.1 (Caleb)

- 優化系統初始化效能
- 重構組件類型

### v2024-05-27.1 (Caleb)

- 使用 CustomSelectV2 + CustomTreeV2 優化頁面效能
- 更新 element-plus 版本 (2.4.3 => 2.7.3)
- 新增虛擬選擇框 CustomSelectV2
- 新增虛擬樹 CustomTreeV2 (beta)

### v2024-05-23.1 (Caleb)

- 移除 Object.prototype 上的自訂函數

# demo RTDS v1.4.0

### v2023-10-01.1 (Caleb)

- 布局重構
- 加入 CustomScrollbar 組件

### v2023-05-01.1 (Caleb)

- 加入 CustomInput 組件
- 輸入框驗證
- 加入 CustomPopover 組件

### v2023-04-01.1 (Caleb)

- 初始化專案
- 系統路由
- 布局
