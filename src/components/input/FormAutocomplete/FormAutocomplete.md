## FormAutocomplete

## CustomButton

### 使用範例

```vue
<script setup lang="ts">
import { CustomButton } from '@/components/feature'

</script>

<template>
  <CustomButton label="ButtonLabel" />
</template>
```

### Element UI Plus

[https://element-plus.org/en-US/component/autocomplete.html](https://element-plus.org/en-US/component/autocomplete.html)

### Attributes ( props )

| 屬姓名          | 說明                    | 類型    | 預設值    |
| --------------- | ---------------------- | ------- | --------- |
| errorMessage    | 錯誤訊息 驗證用         | string  | ''        |
| modelValue      | v-model                | string  | number | undefined |
| placeholder     | 輸入框佔位文字          | string  | undefined |
| clearable       | 是否顯示清除按鈕        | boolean  | false   |
| disabled        | 是否禁用                | boolean | false   |
| valueKey        | 選項取值 用的key        | string   | 'value' |

### Slots

| 插槽名  | 說明    |
| ------- | ------ |
| default |        |
| prefix  |        | 
| suffix  |        |
| prepend |        |
| append  |        |
| loading |        |


### Events ( emits )

| 事件名 | 說明     |
| ------ | ------- |
| blur   |         |
| focus  |         |
| input  |         |
| clear  |         |
| select |         |
| change |         |

### Expose

| 事件名 | 說明     |
| ------ | ------- |
| focus  |         |
| blur   |         |
