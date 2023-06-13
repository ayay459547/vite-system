# CustomButton API
### 使用範例
```vue=
<script setup lang="ts">
  import { ref } from 'vue'
  import { CustomCheckbox } from '@/components'

  const ischeck = ref(false)

  const test = () => {
    console.log('test checkbox')
  }
</script>

<template>
  <CustomCheckbox v-model="ischeck" @change="test">
</template>
```
## Element UI Plus
https://element-plus.org/en-US/component/checkbox.html

### Attributes ( props )
| 屬姓名     | 說明             | 类型    | 默認值     |
| --------- | ---------------- | ------- | --------- |
| label     | 顯示文字          | string  | ''        |

### 找圖示(要下過濾是 Free)
https://fontawesome.com/search

### Slots
| 插槽名     | 說明          |
| --------- | ------------- |

### Events ( emit )
| 事件名     | 說明         | 傳值類型  |
| --------- | ------------ | -------- |
| change    | 按鈕點擊      |          |

### Exposes
| 屬姓名     | 說明         | 類型   |
| --------- | ------------ | ------ |
|           |              |        |