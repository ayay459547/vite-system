# 系統前端開發

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
npm install
```
### 運行開發環境
```sh
npm run dev
```
### 運行上線環境
```sh
npm run pro
```
### 打包
```sh
npm run build
```

### 單元測試
#### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```
#### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```
### 依據 ESLint 配置修正文件
#### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
