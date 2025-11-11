## CustomBadge

### 徽章, Dom元素右上角顯示 標記/訊息

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

[https://element-plus.org/en-US/component/badge.html#basic-usage](https://element-plus.org/en-US/component/badge.html#basic-usage)

### Attributes ( props )

| 屬姓名     | 說明            | 類型             | 預設值    |
| ---------- | -------------- | ---------------- | --------- |
| value      | 顯示的值        | string / number  | ''        |
| max        | 最大值          | boolean          | false     |
| isDot      | 是否顯示小圓點   | boolean          | false     |
| hidden     | 是否隱藏標記     | boolean          | false     |
| type       | 類型            | enum             | 'primary' |
| showZero   | 是否顯示0       | boolean          | true      |
| color      | 背景色          | string           | undefined |
| offset     | 偏移量          | [number, number] | undefined |
| badgeStyle | 自訂style       | object           | undefined |
| badgeStyle | 自訂class       | string           | undefined |

### Slots

| 插槽名  | 說明          | 類型   |
| ------- | ------------ | ------ |
| default | 自訂預設內容  |        |
| content | 自訂顯示內容  | object |

### Events ( emits )

無

### Expose

無
