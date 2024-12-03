## CustomPopover

### 使用範例

```vue
<script setup lang="ts">
import { CustomPopover, CustomButton } from '@/components'
</script>

<template>
  <CustomPopover>
    <div>顯示內容1 Popover</div>
    <template #reference>
      <CustomButton label="滑鼠點擊 Popover" />
    </template>
  </CustomPopover>

  <CustomPopover :width="300" title="內容2標題" trigger="hover" placement="right">
    <div>顯示內容2 Popover --------------</div>
    <template #reference>
      <CustomButton label="滑鼠移入 Popover" />
    </template>
  </CustomPopover>
</template>
```

### Element UI Plus

https://element-plus.org/zh-CN/component/popover.html

### Attributes ( props )

| 屬姓名      | 說明     | 類型    | 預設值   |
| ----------- | -------- | ------- | -------- |
| visible     | 是否顯示 | boolean | false    |
| width       | 寬度     | number  | 150      |
| title       | 內容標題 | string  | ''       |
| placement   | 出現位置 | enum    | 'top'    |
| trigger     | 切換方式 | enum    | 'click'  |
| popperStyle | 自訂樣式 | string  | ''       |

### Slots

| 插槽名    | 說明           |
| --------- | -------------- |
| default   | 顯示內容       |
| reference | 觸發事件的元素 |

### Events ( emit )

| 事件名         | 說明     | 傳值類型 |
| -------------- | -------- | -------- |
| update:visible | 顯示切換 | boolean  |
