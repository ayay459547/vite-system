## CustomEmpty

### 使用範例

```vue
<script setup lang="ts">
import { CustomEmpty, CustomIcon } from '@/components'
</script>

<template>
  <div>
    <CustomEmpty :image-size="60" description="empty-test">
      <template #image>
        <CustomIcon name="cube" />
      </template>
      <span>{{ 'test' }}</span>
    </CustomEmpty>
  </div>
</template>
```

### Element UI Plus

[https://element-plus.org/en-US/component/empty.html](https://element-plus.org/en-US/component/empty.html)

### Attributes ( props )

| 屬姓名      | 說明           | 類型   | 預設值  |
| ----------- | -------------- | ------ | ------- |
| image       | 圖片的 url     | string | ''      |
| imageSize   | 圖片寬度 width | number | 'solid' |
| description | 文字訊息       | string | ''      |

### Slots

| 插槽名      | 說明         |
| ----------- | ------------ |
| default     | 顯示內容     |
| image       | 圖片顯示內容 |
| description | 文字顯示內容 |
