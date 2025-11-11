## CustomButtonGroup

### 按鈕群組, 配合 CustomButton 使用

### 使用範例

```vue
<script setup lang="ts">
import { CustomButton, CustomButtonGroup } from '@/components/feature'

</script>

<template>
  <CustomButtonGroup>
    <CustomButton label="Button1" />
    <CustomButton label="Button2" />
  </CustomButtonGroup>
</template>
```

### Element UI Plus

[https://element-plus.org/en-US/component/button.html](https://element-plus.org/en-US/component/button.html)

### Attributes ( props )
| 屬姓名          | 說明      | 類型    | 預設值    |
| --------------- | -------- | ------- | --------- |
| size            | 尺寸      | enum    | undefined |
| type            | 類型      | enum    | undefined |

### Slots

| 插槽名  | 說明             |
| ------- | --------------- |
| default | 放 CustomButton |


### Events ( emits )

無

### Expose

無