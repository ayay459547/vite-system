# CustomSwitch

### 使用範例

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { CustomSwitch } from '@/components'

const value = ref(false)
</script>

<template>
  <CustomSwitch v-model="value" />
</template>
```

## Element UI Plus

[https://element-plus.org/en-US/component/switch.html#basic-usage](https://element-plus.org/en-US/component/switch.html#basic-usage)

### Attributes ( props )

| 屬姓名       | 說明             | 類型            | 預設值 |
| ------------ | ---------------- | --------------- | ------ |
| modelValue   | v-modal 綁定的值 | boolean         | false  |
| activeText   | 啟用文字         | string          | ''     |
| inactiveText | 不啟用文字       | string          | ''     |
| disable      | 是否禁用         | boolean         | false  |
| loading      | 是否讀取中       | boolean         | false  |
| size         | 大小             | enum            | ''     |
| width        | 寬度             | string / number | ''     |

### Events ( emit )

| 事件名            | 說明       | 傳值類型 |
| ----------------- | ---------- | -------- |
| update:modelValue | v-modal 用 | boolean  |
| change            | 值變化     | boolean  |
