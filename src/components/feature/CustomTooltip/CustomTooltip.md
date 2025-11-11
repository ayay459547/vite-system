## CustomTooltip

### 提示框, 效果類似 CustomPopover

### 使用範例

```vue
<script setup lang="ts">
import { CustomTooltip, CustomButton } from '@/components/feature'
</script>

<template>
  <CustomTooltip>
    <CustomButton label="滑鼠移入 Tooltip" type="primary" />
    <template #content>
      <div>Tooltip 內容1</div>
    </template>
  </CustomTooltip>

  <CustomTooltip trigger="click">
    <CustomButton label="滑鼠點擊 Tooltip" type="success" />
    <template #content>
      <div>Tooltip 內容2</div>
    </template>
  </CustomTooltip>
</template>
```

### Element UI Plus

[https://element-plus.org/en-US/component/tooltip.html]
(https://element-plus.org/zh-US/component/tooltip.html)

### Attributes ( props )

| 屬姓名             | 說明                     | 類型    | 預設值      |
| ------------------ | ----------------------- | ------- | ---------- |
| appendTo           | Tooltip內容 指定DOM      | string  | HTMLElement | undefined |
| content            | 顯示的內容               | string  | ''         |
| rawContent         | 是否以 HTML 字串處理      | boolean | false     |
| placement          | 出現位置                 | enum    | 'bottom'  |
| fallbackPlacements | Tooltip 可用的 positions | enum    | undefined |
| visible            | 是否顯示                 | boolean | false     |
| disabled           | 是否禁用                 | boolean | false     |
| offset             | 出現位置的偏移量          | number  | 6         |
| transition         | 動畫名稱                 | string  | undefined |
| popperOptions      | popper.js 参数           | Object  | {}        |
| showAfter          | 觸發後多久顯示內容        | number  | 0         |
| showArrow          | 是否顯示箭頭             | boolean | true       |
| hideAfter          | 觸發後多久顯示內容        | number  | 200       |
| autoClose          | 出現後自動隱藏式延遲      | number  | 0         |
| popperClass        | 自訂樣式                 | string  | ''        |
| enterable          | 滑鼠是否可進到 tooltip 中 | boolean | true      |
| teleported         | 是否使用 teleport        | boolean | true      |
| trigger            | 如何觸發 Tooltip         | string  | 'hover'   |
| virtualTriggering  | 用來標識虛擬觸發是否已啟用 | boolean | undefined |
| virtualRef         | 標識虛擬觸發時的觸發元素   | Object  | undefined |
| triggerKeys        | 按鍵控制顯示              | Array   | ['Enter', 'Space'] |
| persistent         | 長時間不觸發 會被刪除     | boolean | undefined |
| ariaLabel          | aria-label 屬性          | string  | undefined |

### Slots

| 插槽名  | 說明           |
| ------- | -------------- |
| default | 觸發事件的元素 |
| content | 顯示內容       |

### Events ( emit )

| 事件名         | 說明     | 傳值類型 |
| -------------- | -------- | -------- |
| update:visible | 顯示切換 | boolean  |
