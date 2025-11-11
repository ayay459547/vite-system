## CustomText

### 文字

### 使用範例

```vue
<script setup lang="ts">
import { CustomText } from '@/components/feature'

</script>

<template>
  <CustomText>
    text
  </CustomText>
</template>
```

### Element UI Plus

[https://element-plus.org/en-US/component/text.html](https://element-plus.org/en-US/component/text.html)

### Attributes ( props )

| 屬姓名          | 說明                    | 類型    | 預設值    |
| --------------- | ---------------------- | ------- | --------- |
| size            | 尺寸                   | enum    | undefined |
| type            | 類型                   | enum    | undefined |
| truncated       | 顯示省略號              | boolean | false     |
| text            | 最大行數                | number  | undefined     |
| tag             | 自訂元素標籤            | string / Components  | 'span'  |
| label           | 文字                   | string   | ''  |

### Slots

| 插槽名  | 說明           |
| ------- | ------------- |
| default | 自訂內容       |


### Events ( emits )

無

### Expose

無
