## CustomPopover API

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

https://element-plus.org/zh-CN/component/progress.html

### Attributes ( props )

| 屬姓名        | 說明               | 類型                    | 預設值  | 說明                              |
| ------------- | ------------------ | ----------------------- | ------- | --------------------------------- |
| percentage    | 進度               | number                  | 0       |                                   |
| type          | 類型               | enum                    | 'line'  | 'line', 'circle', 'dashboard'     |
| strokeWidth   | 進度條寬度         | number                  | 6       |                                   |
| textInside    | 文字是否在進度條中 | boolean                 | false   | 限定 line 可使用                  |
| status        | 進度條狀態         | enum                    | ''      | 'success', 'exception', 'warning' |
| indeterminate | 是否為動畫進度條   | boolean                 | false   |                                   |
| duration      | 控制動畫速度       | number                  | 3       |                                   |
| color         | 背景顏色           | string, function, Array | ''      |                                   |
| showText      | 是否顯示文字       | boolean                 | true    |                                   |
| strokeLinecap | 兩端形狀           | enum                    | 'round' | 限定 circle/dashboard 可使用      |
| format        | 格式化顯示文字     | function                | null    |                                   |
| striped       | 進度條上顯示條紋   | boolean                 | false   |                                   |
| stripedFlow   | 條紋是否流動       | boolean                 | false   |                                   |

### Slots

| 插槽名  | 說明     |
| ------- | -------- |
| default | 顯示內容 |
