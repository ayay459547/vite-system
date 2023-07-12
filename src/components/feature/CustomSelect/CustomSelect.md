# CustomSelect API
### 使用範例
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { CustomSelect } from '@/components'

const selectValue = ref(null)
const options = [
  { label: '選項一', value: 0 },
  { label: '選項二', value: 1 },
  { label: '選項三', value: 2 }
]

</script>

<template>
  <CustomSelect
    v-model="selectValue"
    label="選項測試"
    :options="options"
  />
</template>
```
## Element UI Plus
https://element-plus.org/en-US/component/select.html

### Attributes ( props )
| 屬姓名           | 說明                  | 类型    | 默認值    | 是否必填 |
| ---------------- | -------------------- | ------- | --------- | ------- |
| modelValue       | v-model 綁定的值      | string  | ''        | V      |
| direction        | 文字與輸入框的方向     | string  | 'column'  |        |
| label            | 輸入框標題            | string  | ''        |        |
| hiddenLabel      | 是否隱藏輸入框標題     | boolean | false     |        |
| options          | 選項                  | Array   | []        |        |
| clearable        | 是否有一件清除的按鈕   | boolean | false     |        |
| disabled         | 是否不能輸入           | boolean | false     |        |

### Slots
| 插槽名     | 說明                      |
| ---------- | ------------------------ |
| default    | 選項內容                  |
| prefix     | 輸入框內 前面加上一個區塊  |
| suffix     | 輸入框內 後面加上一個區塊  |

### Events ( emits )
| 事件名             | 說明                  | 傳值類型        |
| ----------------- | -------------------- | --------------- |
| update:modelValue |  v-modal 用           | boolean        |
| focus             | 當輸入框聚焦時         | FocusEvent      |
| clear             | 點擊 clearable的按鈕時 |                 |
| blur              | 輸入框沒有聚焦時       | FocusEvent      |
| change            | modelValue 發生改變時  | string | null   |
| input             | 輸入框的值 發生改變時   | string | null   |