# Polyfill

## 作用

當某個 JavaScript 新特性（例如 ES6 的一些方法）在舊版瀏覽器中無法使用時，開發者可以使用 Polyfill 來為這些瀏覽器提供替代方案，使其能夠運行這些新功能。

### 例子

比如 ES6 中的 Array.prototype.includes() 方法，在某些舊瀏覽器中可能無法使用。我們可以通過 Polyfill 來手動添加這個方法：

```javascript
if (!Array.prototype.includes) {
  Array.prototype.includes = function(value) {
    return this.indexOf(value) !== -1;
  };
}
```

這樣一來，舊瀏覽器即使不原生支持 includes() 方法，也能使用這段 Polyfill 程式碼來達到相同效果。

### 總結

Polyfill 主要用於確保舊版瀏覽器或環境能夠支持和運行新版本的 JavaScript 特性。這對跨瀏覽器相容性很有幫助。
