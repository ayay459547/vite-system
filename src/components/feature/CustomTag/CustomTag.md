# CustomTag API

### 使用範例

```vue
<script setup lang="ts">
import { CustomTag } from '@/components'
</script>

<template>
  <div>
    <CustomTag size="large">Large</CustomTag>
    <CustomTag>Default</CustomTag>
    <CustomTag size="small">Small</CustomTag>
  </div>
</template>
```

## Element UI Plus

https://element-plus.org/zh-US/component/tag.html

### Attributes ( props )

| 屬姓名   | 說明       | 类型    | 默認值 |
| -------- | ---------- | ------- | ------ |
| type     | 類型       | enum    | ''     |
| closable | 是否可關閉 | boolean | false  |

### Slots

| 插槽名  | 說明         |
| ------- | ------------ |
| default | 文字顯示內容 |
