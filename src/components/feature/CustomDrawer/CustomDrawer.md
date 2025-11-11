## CustomDrawer

### 抽屜

### 使用範例

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { CustomButton, CustomDrawer } from '@/components/feature'

const isShow = ref(false)

</script>

<template>
  <div>
    <CustomButton label="開啟Drawer" @click="isShow = true" />
    <CustomDrawer v-model="isShow" title="title">
      <template #header>
        <div>header</div>
      </template>
      <template #footer>
        <div>footer</div>
      </template>
      <div>CustomDrawer</div>
    </CustomDrawer>
  </div>
</template>
```

### Element UI Plus

[https://element-plus.org/en-US/component/drawer.html](https://element-plus.org/en-US/component/drawer.html)

### Attributes ( props )

| 屬姓名              | 說明               | 類型     | 預設值 |
| ------------------ | ------------------ | -------- | ------ |
| modelValue         | v-modal 綁定的值    | boolean  | false  |
| appendToBody       | 是否插入 body       | boolean  | false  |
| appendTo           | 掛載到哪個 DOM      | string   | 'body' |
| lockScroll         | 是否 body 滾動鎖定  | boolean  | true   |
| beforeClose        | 關閉前的回調        | Function | undefined |
| closeOnClickModal  | 是否可點擊modal關閉 | boolean  | false  |
| closeOnPressEscape | 是否可按下ESC關閉   | boolean  | false  |
| openDelay          | 打開的延遲時間      | number   | 0      | 
| closeDelay         | 關閉的延遲時間      | number   | 0      |
| destroyOnClose     | 關閉是否銷毀子元素  | boolean  | false  |
| modal              | 是否需要遮罩        | boolean  | true   |
| direction          | 打開方向            | enum    | 'rtl'  |
| showClose          | 是否顯示關閉按鈕    | boolean  | true   |
| size               | 視窗大小           | string   | ''     |
| title              | 標題               | string   | ''     |
| withHeader         | 是否顯示header欄   | boolean  | true   |
| modalClass         | 遮罩自訂 class     | string   | ''     |
| zIndex             | 設定 z-index       | number   | undefined |
| headerAriaLevel    | header的aria-level屬性 | string   | undefined |

### Slots

| 插槽名  | 說明             |
| ------- | ---------------- |
| default | 中間顯示內容     |
| header  | 標題的位置       |
| footer  | 最底下按鈕的位置 |

### Events ( emit )

| 事件名             | 說明                             | 傳值類型 |
| ------------------ | ------------------------------- | -------- |
| update:model-value | v-modal 用                      | boolean  |
| open               | Drawer 打開的回調                |          |
| opened             | Drawer 打開動畫結束時的回調       |          |
| close              | Drawer 關閉的回調                |          |
| closed             | Drawer 關閉動畫結束時的回調       |          |
| open-auto-focus    | 輸入焦點聚焦在 Drawer 內容時的回調 |          |
| close-auto-focus   | 輸入焦點從 Drawer 內容失焦時的回調 |          |

### Expose

| 事件名       | 說明                                           | 傳參        |
| ----------- | ---------------------------------------------- | ----------- |
| handleClose | 用於關閉Drawer,此方法會呼叫傳入的before-close方法 |             |
