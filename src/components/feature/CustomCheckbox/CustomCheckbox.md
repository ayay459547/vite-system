# CustomCheckbox API
### 使用範例
```vue
<script setup lang="ts">
  import { ref } from 'vue'
  import { CustomCheckbox } from '@/components'

  const ischeck = ref(false)

  const testCheck = (v: boolean) => {
    console.log('test checkbox', v)
  }
</script>

<template>
  <CustomCheckbox
    label="是否確認"
    v-model="ischeck"
    @change="testCheck"
  />
</template>
```
## Element UI Plus
https://element-plus.org/en-US/component/checkbox.html

### Attributes ( props )
| 屬姓名      | 說明             | 类型    | 默認值     |
| ----------- | ---------------- | ------- | --------- |
| modelValue  | v-modal 綁定的值  | boolean | false     |
| label       | 顯示文字          | string  | ''        |

### Events ( emit )
| 事件名            | 說明         | 傳值類型  |
| ----------------- | ------------ | -------- |
| update:modelValue |  v-modal 用  | boolean  |
| change            | 值發生變化    | boolean  |
