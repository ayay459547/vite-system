# CustomDivider
### 使用範例
```vue
<script setup lang="ts">
import { CustomDivider } from '@/components'

</script>

<template>
  <div>
    <CustomDivider
      directio="horizontal"
      border-style="solid"
      content-position="center"
    >
      test
    </CustomDivider>
  </div>
</template>
```

## Element UI Plus
[https://element-plus.org/en-US/component/divider.html#basic-usage](https://element-plus.org/en-US/component/divider.html#basic-usage)

### Attributes ( props )
| 屬姓名     | 說明        | 类型    | 默認值        |
| --------- | ----------- | ------- | ------------ |
| label     | 方向        | enum    | 'horizontal' |
| size      | 線的style   | enum    | 'solid'      |
| type      | 文字位置     | enum    | 'center'     |

### Slots
| 插槽名     | 說明          |
| --------- | ------------- |
| default   | 文字顯示內容   |