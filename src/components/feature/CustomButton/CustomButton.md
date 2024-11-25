## CustomButton

### 使用範例

```vue
<script setup lang="ts">
import { CustomButton } from '@/components'

</script>

<template>
  <CustomButton label="ButtonLabel" />
</template>
```

### Element UI Plus

[https://element-plus.org/en-US/component/button.html](https://element-plus.org/en-US/component/button.html)

### 找圖示

[https://fontawesome.com/search?o=r&m=free](https://fontawesome.com/search?o=r&m=free)

### Attributes ( props )

| 屬姓名          | 說明                    | 類型    | 預設值    |
| --------------- | ---------------------- | ------- | --------- |
| size            | 尺寸                   | enum    | undefined |
| type            | 類型                   | enum    | undefined |
| plain           | 是否為樸素按鈕          | boolean | false     |
| text            | 是否為文字按鈕          | boolean | false     |
| bg              | 是否顯示文字按鈕背景顏色 | boolean | false     |
| link            | 是否為連結按鈕          | boolean | false     |
| round           | 是否為圓角按鈕          | boolean | false     |
| circle          | 是否為圓形按鈕          | boolean | false     |
| loading         | 是否為載入中狀態        | boolean | false     |
| loadingIcon     | 自訂載入中狀態圖示組件  | string / Components | undefined |
| disabled        | 按鈕是否為停用狀態      | boolean | false     |
| icon            | 圖示組件               | string / Components | undefined |
| autofocus       | 原生 autofocus 屬性    | boolean  | false    |
| nativeType      | 原生 type 屬性         | string  | 'button'  |
| autoInsertSpace | 自動在兩個字元插入空格  | boolean  | undefined |
| color           | 自訂按鈕顏色           | string  | ''        |
| dark            | dark 模式             | boolean  | false     |
| tag             | 自訂元素標籤           | string / Components  | 'button'  |
| label           | 顯示文字               | string  | ''        |
| iconSize        | 圖示尺寸               | enum    | 'default' |
| iconType        | 圖示類型               | enum    | 'fas'     |
| iconXType       | 圖示Xicon類型          | enum    | ''        |
| iconName        | 圖示名稱               | string  | ''        |
| iconMove        | 圖示 hover 移動方式    | enum    | 'none'    |
| textColor       | 文字顏色               | string  | undefined |
| style           | 自訂樣式               | string  | ''        |

### Slots

| 插槽名  | 說明           |
| ------- | ------------- |
| default | 自訂預設內容   |
| loading | 自訂載入中元件 | 
| icon    | 自訂圖示組件   |


### Events ( emits )

| 事件名 | 說明     |
| ------ | ------- |
| click  | 按鈕點擊 |

### Expose

無
