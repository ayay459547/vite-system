## CustomButton

### 使用範例

```vue
<script setup lang="ts">
import type { ButtonSize } from '@/components'
import { CustomButton } from '@/components'

const test = () => {
  console.log('test click')
}
const size: ButtonSize = 'large'
</script>

<template>
  <CustomButton label="ButtonLabel" :size="size" @click="onClick" />
</template>
```

### Element UI Plus

[https://element-plus.org/en-US/component/button.html](https://element-plus.org/en-US/component/button.html)

### 找圖示

[https://fontawesome.com/search?o=r&m=free](https://fontawesome.com/search?o=r&m=free)

### Attributes ( props )

| 屬姓名   | 說明                | 類型    | 預設值    |
| -------- | ------------------- | ------- | --------- |
| label    | 顯示文字            | string  | ''        |
| size     | 按鈕大小            | enum    | 'default' |
| type     | 按鈕類型            | enum    | 'default' |
| text     | 文字樣式            | boolean | false     |
| plain    | 樸素樣式            | boolean | false     |
| round    | 是否圓角            | boolean | false     |
| circle   | 是否圓形            | boolean | false     |
| disabled | 是否禁用            | boolean | false     |
| loading  | 是否加載中          | boolean | false     |
| color    | 自訂按鈕顏色        | string  | ''        |
| iconType | 圖示類型            | enum    | 'fas'     |
| iconName | 圖示名稱            | string  | ''        |
| iconMove | 圖示 hover 移動方式 | enum    | 'none'    |

### Slots

| 插槽名  | 說明           |
| ------- | -------------- |
| icon    | 前面圖示的位置 |
| default | 文字顯示內容   |

### Events ( emits )

| 事件名 | 說明     |
| ------ | -------- |
| click  | 按鈕點擊 |
