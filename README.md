# demo

### 常用
```sh
#### 安裝套件
npm install

#### 代碼類型檢查
npm run type-check

### 運行開發環境(測試效能用)
npm run transform

#### 運行開發環境
npm run dev

#### 運行上線環境
npm run pro

### 代碼格式檢查+修正
npm npm run lint #### 不使用, 尚未設定完全

#### 代碼格式化 (全部的檔案)
npm run format #### 不使用, 尚未設定完全
```

### 打包
```sh
### 打包上線環境
npm run build-only:pro

#### 打包開發環境
npm run build-only:dev
```

### 套件管理
```sh
#### 檢查package版本漏洞(不一定要修, 由於不是直接安裝)
npm audit

#### 更新套件
npm update

#### 線上最新版本, 本地套件版本 比對
npm outdated
```

### commit message
* feat: 新增/修改功能 (feature)。
* fix: 修補 bug (bug fix)。
* docs: 文件 (documentation)。
* style: 格式 (不影響程式碼運行的變動 white-space, formatting, missing semi colons, etc)。
* refactor: 重構 (既不是新增功能，也不是修補 bug 的程式碼變動)。
* perf: 改善效能 (A code change that improves performance)。
* test: 增加測試 (when adding missing tests)。
* chore: 建構程序或輔助工具的變動 (maintain)。
* revert: 撤銷回覆先前的 commit 例如：revert: type(scope): subject (回覆版本：xxxx)


# License
| package            |  說明               | License |
| ------------------ | ------------------- | ------- |
| fortawesome        | 圖示                | https://github.com/FortAwesome/Font-Awesome/blob/6.x/LICENSE.txt |
| v-md-editor        | README              | https://github.com/code-farmer-i/vue-markdown-editor/blob/dev/LICENSE |
| js-cookie          | cookie              | https://github.com/js-cookie/js-cookie/blob/main/LICENSE |
| vee-validate       | 資料驗證             | https://github.com/logaretm/vee-validate/blob/main/LICENSE |
| vueuse             | 自訂CompositionApi  | https://github.com/vueuse/vueuse/blob/main/LICENSE |
| axios              | ajax                | https://github.com/axios/axios/blob/v1.x/LICENSE |
| click-outside-vue3 | 其他directive       | https://github.com/andymark-by/click-outside-vue3/blob/master/LICENSE |
| crypto-js          | 加密                | https://github.com/brix/crypto-js/blob/develop/LICENSE |
| dayjs              | 日期,時間           | https://github.com/iamkun/dayjs/blob/dev/LICENSE |
| echarts            | 圖表                | https://github.com/apache/echarts/blob/master/LICENSE |
| element-plus       | UI                 | https://github.com/element-plus/element-plus/blob/dev/LICENSE |
| exceljs            | Excel              | https://github.com/exceljs/exceljs/blob/master/LICENSE |
| idb                | indexedDB          | https://github.com/jakearchibald/idb/blob/main/LICENSE |
| pinia              | vue stores         | https://github.com/vuejs/pinia/blob/v2/LICENSE |
| sweetalert2        | 提示               | https://github.com/sweetalert2/sweetalert2/blob/main/LICENSE |
| uuid               | 生成隨機id         | https://github.com/uuidjs/uuid/blob/main/LICENSE.md |
| vue                | js 框架            | https://github.com/vuejs/core/blob/main/LICENSE |
| vue-i18n           | 翻譯               | https://github.com/kazupon/vue-i18n/blob/v8.x/LICENSE |
| vue-qr             | QRCode             | https://github.com/Binaryify/vue-qr/blob/master/LICENSE.txt |
| vue-router         | 路由               | https://github.com/vuejs/router/blob/main/LICENSE |
| vuedraggable       | 拖拉               | https://github.com/SortableJS/Vue.Draggable/blob/master/LICENSE |
| xlsx               | Excel              | https://github.com/SheetJS/sheetjs/blob/github/LICENSE |


### JSON 替換 fakeData 文字

* 查詢尚未替換的檔案 vitesystemfakeData.ts

* 替換1
\s\s(?=[a-zA-Z])
  "

* 替換2
:\s(?=.)
": 

* 替換3
'
"
