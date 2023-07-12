# CustomDatePicker API
### 使用範例
```vue
<script setup lang="ts">
  import { ref } from 'vue'
  import { CustomDatePicker } from '@/components'

  const dateValue = ref(null)

  const onDateChange = (v) => {
    console.log(v)
  }
</script>

<template>
  <CustomDatePicker
    v-model="dateValue"
    label="日期測試"
    @change="onDateChange"
  />
</template>
```
## Element UI Plus
https://element-plus.org/en-US/component/date-picker.html

### Attributes ( props )
| 屬姓名           | 說明                       | 类型    | 默認值    | 是否必填 |
| ---------------- | ------------------------- | ------- | --------- | ------- |
| modelValue       | v-model 綁定的值           | string  | ''        | V      |
| direction        | 文字與輸入框的方向          | string  | 'column'  |        |
| label            | 輸入框標題                 | string  | ''        |        |
| hiddenLabel      | 是否隱藏輸入框標題          | boolean | false     |        |
| type             | 類型                       | string  | 'date'    |        |  
| clearable        | 是否有一件清除的按鈕        | boolean | false     |        |
| disabled         | 是否不能輸入               | boolean | false     |        |

### Slots
| 插槽名          | 說明                      |
| --------------- | ------------------------ |
| default         | 自訂日期內容              |
| range-separator | daterange 中間的分隔      |

### Events ( emits )
| 事件名  | 說明                  | 傳值類型        |
| ------- | -------------------- | --------------- |
| focus   | 當輸入框聚焦時         | FocusEvent      |
| blur    | 輸入框沒有聚焦時       | FocusEvent      |
| change  | modelValue 發生改變時  | string | null   |
