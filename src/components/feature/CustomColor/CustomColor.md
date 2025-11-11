## CustomColor

### 顏色選擇器

### 使用範例

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { CustomColor } from '@/components/feature'

const colorValue = ref('#409EFF')
</script>

<template>
  <CustomColor v-model="colorValue" />
</template>
```

### Element UI Plus
[https://element-plus.org/en-US/component/color-picker.html](https://element-plus.org/en-US/component/color-picker.html)

### Attributes ( props )

| 屬姓名         | 說明                              | 類型    | 預設值    |
| ------------- | --------------------------------- | ------- | --------- |
| modelValue    | 選取項目綁定值                     | string  | undefined |
| disabled    	| 是否取消                          | boolean | false     |
| size    	    | 尺寸                              | enum    | undefined |
| showAlpha    	| 是否支援寬度選擇                   | boolean | false     |
| colorFormat   | 寫入v-model的顏色的格式            | enum    | 'rgb'     |
| popperClass   | 寫入v-model的顏色的格式            | string  | undefined |
| predefine    	| 預定義顏色                        | object   | undefined |
| validateEvent | 輸入時是否觸發表單的校驗            | boolean | false |
| tabIndex    	| ColorPicker 的 tabindex           | string/number  | 0 |
| ariaLabel    	| ColorPicker 的 aria-label         | string  | undefined |
| id    	      | ColorPicker 的 id                 | string  | undefined |
| teleported    | 是否將popover的下拉清單渲染到body下 | boolean | undefined |

### Slots

無

### Events ( emits )

| 事件名       | 說明                         | 類型                         |
| ------------ | ------- ------------------- | --------------------------- |
| change       | 當綁定值變化時觸發            | (value: string) => void     |
| activeChange | 面板中目前顯示的顏色改變時觸發 | (value: string) => void     |
| focus        | 當獲得焦點時觸發              | (event: FocusEvent) => void |
| blur         | 當失去焦點時觸發              | (event: FocusEvent) => void |

### Expose

| 事件名  | 說明             | 類型       |
| ------ | ---------------- | ---------- |
| color  | 目前顏色object    | object     |    
| show   | 手動顯示顏色選擇器 | () => void |
| hide   | 隱藏手動顏色選擇器 | () => void |
| focus  | 讓揀貨員得焦點     | () => void |
| blur   | 讓揀貨員失去焦點   | () => void |
