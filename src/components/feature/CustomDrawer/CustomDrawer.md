# CustomDrawer

### 使用範例

```vue
<script setup lang="ts">
import type { ButtonSize } from '@/components'
import { CustomButton } from '@/components'
import { ref } from 'vue'

const test = () => {
  console.log('test click')
}
const size: ButtonSize = 'large'
</script>

<template>
  <div>
    <CustomButton label="開啟Drawer" @click="isShow = true" />

    <CustomDrawer v-model="isShow" title="title">
      <template #header>
        <div class="fill-x border-info">header</div>
      </template>
      <template #footer>
        <div>footer</div>
      </template>
      <span>Hi there!</span>
    </CustomDrawer>
  </div>
</template>
```

## Element UI Plus

[https://element-plus.org/en-US/component/drawer.html](https://element-plus.org/en-US/component/drawer.html)

### Attributes ( props )

| 屬姓名         | 說明               | 类型    | 默認值 |
| -------------- | ------------------ | ------- | ------ |
| modelValue     | v-modal 綁定的值   | boolean | false  |
| direction      | 打開方向           | enum    | 'rtl'  |
| title          | 標題               | string  | ''     |
| destroyOnClose | 關閉是否銷毀子元素 | boolean | false  |
| customClass    | Drawer 自訂 class  | string  | ''     |
| modal          | 是否需要遮罩       | boolean | true   |
| modalClass     | 遮罩自訂 class     | string  | ''     |
| size           | 視窗大小           | string  | ''     |

### Slots

| 插槽名  | 說明             |
| ------- | ---------------- |
| default | 中間顯示內容     |
| header  | 標題的位置       |
| footer  | 最底下按鈕的位置 |

### Events ( emit )

| 事件名            | 說明       | 傳值類型 |
| ----------------- | ---------- | -------- |
| update:modelValue | v-modal 用 | boolean  |
| open              | 打開時     |          |
| opened            | 打開後     |          |
| close             | 關閉時     |          |
| closed            | 關閉後     |          |
