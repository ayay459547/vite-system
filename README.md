# demo

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

### 安裝套件
```sh
npm install -l
```

### 代碼類型檢查
```sh
npm run type-check
```
### 代碼格式檢查+修正
```sh
npm run lint
```
### 代碼格式化
```sh
npm run format
```

### 運行開發環境
```sh
npm run dev
```
### 運行上線環境
```sh
npm run pro
```

### 打包開發環境
```sh
npm run build-only:dev
```
### 打包上線環境
```sh
npm run build-only:pro
```
