# CustomCollapse

### 使用範例

```vue
<script setup lang="ts">
import { CustomCollapse } from '@/components'

const active = ref([])
</script>

<template>
  <CustomCollapse
    v-model="active"
    :options="[
      { label: '選項1', value: 'options1' },
      { label: '選項2', value: 'options2', disabled: true },
      { label: '選項3', value: 'options3' }
    ]"
  >
    <template #default="{ label, value, disabled }">
      <div class="flex-column i-ga-md">
        <label>{{ `文字: ${label}` }}</label>
        <label>{{ `值: ${value}` }}</label>
        <label class="text-danger">{{ `是否鎖定: ${disabled}` }}</label>
      </div>
    </template>
  </CustomCollapse>
</template>
```

## Element UI Plus

[https://element-plus.org/en-US/component/collapse.html](https://element-plus.org/en-US/component/collapse.html)

### Attributes ( props )

| 屬姓名    | 說明             | 类型                    | 默認值 |
| --------- | ---------------- | ----------------------- | ------ |
| value     | 展開的選項       | string / number / Array | ''     |
| accordion | 是否為手風琴模式 | boolean                 | false  |
| options   | 是否顯示小圓點   | Array                   | []     |

### Slots

| 插槽名  | 說明         |
| ------- | ------------ |
| default | 文字顯示內容 |
