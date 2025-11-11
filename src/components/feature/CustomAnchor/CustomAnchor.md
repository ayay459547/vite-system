## CustomAnchor

### 錨點, 可快速滾動到指定位置

### 使用範例

```vue
<script setup lang="ts">
import type { CustomBadgeProps } from '@/components/feature'
import { CustomBadge } from '@/components/feature'

const type = ref<BadgeType['type']>('primary')
</script>

<template>
  <CustomBadge :value="30" :type="type" :max="50">
    <div class="card-info i-pa-xs">slot</div>
  </CustomBadge>
</template>
```

### Element UI Plus

[https://element-plus.org/en-US/component/anchor.html](https://element-plus.org/en-US/component/anchor.html)

### Attributes ( props )

| 屬姓名          | 說明                       | 類型                           | 預設值    |
| --------------- | ------------------------- | ------------------------------ | --------- |
| container       | 滾動的容器                 | string | HTMLElement | Window  | ''        |
| offset          | 設定錨點滾動的偏移量        | number                         | ''        |
| bound           | 觸發錨點的元素的位置偏移量  | number                         | ''        |
| duration        | 設定容器滾動持續時間(毫秒)  | number                         | ''        |
| marker          | 是否顯示標記               | boolean                        | ''        |
| type            | 設定錨點類型               | enum                           | 'default' |
| direction       | 設定錨點方向               | enum                           | 'vertical' |
| selectScrollTop | 捲動時，連結是否選取位於頂部 | boolean                        | false     |
| links           | 連結                       | Array                          | []        |
| i18nModule      | i18nTitle                 | string                         |            |

### Slots

| 插槽名  | 說明          |
| ------- | ------------ |
| default | 文字顯示內容  |

### Events ( emits )

| 事件名  | 說明             | 傳參        |
| ------ | ---------------- | ----------- |
| change | Link 改變時的回調 |             |
| click  | 點擊連結          |             |

### Expose

| 事件名    | 說明             | 傳參        |
| -------- | ---------------- | ----------- |
| scrollTo | 手動滾動到特定位置 |             |
