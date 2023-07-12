# CustomOperator API
### 使用範例
```vue
<script setup lang="ts">
  import { ref } from 'vue'
  import { CustomOperator } from '@/components'

  const operatorValue = ref([null, null])

  const onDateChange = (v) => {
    console.log(v)
  }
</script>

<template>
  <CustomOperator
    v-model="operatorValue"
    label="Operator測試"
    @change="onOperatorChange"
  />
</template>
```

### Attributes ( props )
| 屬姓名           | 說明                       | 类型    | 默認值    | 是否必填 |
| ---------------- | ------------------------- | ------- | --------- | ------- |
| modelValue       | v-model 綁定的值           | string  | ''        | V      |
| direction        | 文字與輸入框的方向          | string  | 'column'  |        |
| label            | 輸入框標題                 | string  | ''        |        |
| hiddenLabel      | 是否隱藏輸入框標題          | boolean | false     |        | 
| clearable        | 是否有一件清除的按鈕        | boolean | false     |        |
| disabled         | 是否不能輸入               | boolean | false     |        |

### Events ( emits )
| 事件名  | 說明                  | 傳值類型        |
| ------- | -------------------- | --------------- |
| focus   | 當輸入框聚焦時         | FocusEvent      |
| clear   | 點擊 clearable的按鈕時 |                 |
| blur    | 輸入框沒有聚焦時       | FocusEvent      |
| change  | modelValue 發生改變時  | string | null   |
| input   | 輸入框的值 發生改變時   | string | null   |
