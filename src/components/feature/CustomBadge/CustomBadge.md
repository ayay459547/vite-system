# CustomBadge

### 使用範例

```vue
<script setup lang="ts">
import type { BadgeType } from '@/components'
import { CustomBadge } from '@/components'

const type = ref<BadgeType>('primary')
</script>

<template>
  <CustomBadge :value="30" :type="type" :max="50">
    <div class="card-info i-pa-xs">slot</div>
  </CustomBadge>
</template>
```

## Element UI Plus

[https://element-plus.org/en-US/component/badge.html#basic-usage](https://element-plus.org/en-US/component/badge.html#basic-usage)

### Attributes ( props )

| 屬姓名     | 說明            | 类型             | 默認值    |
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

| 插槽名  | 說明         |
| ------- | ------------ |
| default | 文字顯示內容 |

### Events ( emits )

無

### Expose

無
