# 系統前端開發

### 安裝套件
```sh
# Project Setup
npm install
```
### 運行環境 
```sh
# Compile and Hot-Reload for Development
npm run dev
```
### 打包
```sh
# Type-Check, Compile and Minify for Production
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
