## FormInput

### 使用範例

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { FormInput } from '@/components'

const value = ref('')
</script>

<template>
  <FormInput v-model="value"></FormInput>
</template>
```

### Element UI Plus

[https://element-plus.org/en-US/component/input.html](https://element-plus.org/en-US/component/input.html)


### Attributes ( props )

| 屬姓名          | 說明                       | 類型    | 預設值    |
| --------------- | ------------------------- | ------- | --------- |
| round           | 四捨五入                   | number  | undefined |
| floor           | 無條件捨去                 | number  | undefined |
| ceil            | 無條件進位                 | number  | undefined |
| modelValue      | 綁定值 v-model="..."       | string / number | undefined |
| type            | 類型                       | string  | 'text' |
| maxlength       | 最大輸入長度                | string / number  | undefined |
| minlength       | 最小輸入長度                | string / number  | undefined |
| showWordLimit   | 是否顯示統計字數            | boolean  | false |
| placeholder     | 輸入框佔位文字              | string   | undefined |
| clearable       | 是否顯示清除按鈕            | boolean  | false |
| formatter       | 指定輸入值的格式            | Function | undefined |
| parser          | 指定從格式化器輸入中提取的值 | Function | undefined |
| showPassword    | 是否顯示切換密碼圖示        | boolean  | false |
| disabled        | 是否禁用                   | boolean  | false |
| size            | 輸入框尺寸                 | string   | undefined |
| prefixIcon      | 自訂前綴圖標               | string / Component | undefined |
| suffixIcon      | 自訂後綴圖標               | string / Component | undefined |
| rows            | 顯示的行數                 | number   | 2 |
| autosize        | 高度是否自適應             | boolean / Object | false |
| autocomplete    | 原生 autocomplete 屬性     | string   | 'off' |
| name            | 原生 name 屬性             | string   | undefined |
| readonly        | 是否唯讀                   | boolean  | false |
| max             | 最大值                     | number   | undefined |
| min             | 最小值                     | number   | undefined |
| step            | 設定輸入欄位的數字間隔      | string    | undefined |
| resize          | 控制是否能被使用者縮放      | string    | undefined |
| autofocus       | 自動取得焦點               | boolean   | undefined |
| form            | 原生屬性                   | string    | undefined |
| ariaLabel       | aria-label 屬性 (a11y)     | string    | undefined |
| tabindex        | 輸入框的 tabindex          | string / number | undefined |
| validateEvent   | 輸入時是否觸發表單的驗證     | boolean   | false |
| inputStyle      | style                      | string / object | '' |

### Slots

| 插槽名  | 說明           |
| ------- | ------------- |
| prepend | 輸入框頭部內容 |
| append  | 輸入框尾部內容 | 
| prefix  | 輸入框前置內容 |
| suffix  | 輸入框後置內容 |


### Events ( emits )

| 事件名              | 說明        | 類型   |
| ------------------ | ----------- | ------ |
| update:model-value | v-model     | (value: any) => void |
| blur               | 失去焦點     | (event: FocusEvent) => void |
| focus              | 聚焦         | (event: FocusEvent) => void |
| change             | 按鈕點擊     | (value: string | number) => void |
| input              | 輸入框值改變 | (value: string | number) => void |
| clear              | 清除        | () => void |

### Expose

| 事件名         | 說明               | 類型       |
| -------------- | ----------------- | ---------- |
| blur           | 失去焦點           | () => void |
| clear          | 清除               | () => void |
| focus          | 聚焦               | () => void |
| resizeTextarea | 改變 textarea 大小 | () => void |
| select         | 選擇input文字      | () => void |
