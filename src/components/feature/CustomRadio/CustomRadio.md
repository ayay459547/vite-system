# CustomRadio API
### 使用範例
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { CustomRadio } from '@/components'

const valueTest = ref('')
const options = [
  { label: '選項一', value: 0 },
  { label: '選項二', value: 1 },
  { label: '選項三', value: 2 }
]

</script>

<template>
  <CustomRadio
    v-model="valueTest"
    :options="options"
  />
</template>
```
## Element UI Plus
https://element-plus.org/en-US/component/radio.html

### Attributes ( props )
| 屬姓名           | 說明                | 类型    | 默認值    | 是否必填 |
| ---------------- | ------------------ | ------- | --------- | ------- |
| modelValue       | v-model 綁定的值    | string  | ''        | V      |
| options          | 選項                | Array   | []        |        |

### Events ( emit )
| 事件名            | 說明         | 傳值類型  |
| ----------------- | ------------ | -------- |
| update:modelValue |  v-modal 用  | boolean  |
| change            | 值發生變化    | boolean  |