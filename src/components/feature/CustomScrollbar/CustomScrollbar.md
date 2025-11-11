## CustomScrollbar

### 滾輪

### 使用範例

```vue
<script setup lang="ts">
import { CustomScrollbar } from '@/components/feature'

</script>

<template>
  <CustomScrollbar height="400px">
    <div style="height: 1200px; border: 1px solid gray;"></div>
  </CustomScrollbar>
</template>
```

### Element UI Plus
[https://element-plus.org/en-US/component/scrollbar.html](https://element-plus.org/en-US/component/scrollbar.html)

### Attributes ( props )

| 屬姓名           | 說明                 | 類型          | 預設值    |
| --------------- | -------------------- | ------------- | --------- |
| height          | 滾動條高度            | string/number | undefined |
| maxHeight       | 滾動條最大高度        | string/number | undefined |
| native          | 是否採用原有捲軸樣式   | boolean       | false     |
| wrapStyle       | 容器自訂style         | string/Array  | undefined |
| wrapClass       | 容器自訂class         | string        | undefined |
| viewStyle       | 視圖自訂style         | string/Array  | undefined |
| viewClass       | 視圖自訂class         | string        | undefined |
| noresize        | 是否不應容器變化       | boolean       | false     |
| tag             | 視圖標籤              | string        | 'div'     |
| always          | 滾動條是否總是顯示     | boolean       | false     |
| minSize         | 滾動條最小尺寸         | number        | 20        |
| id              | 視圖id                | string        | undefined |
| role            | 視圖角色              | string        | undefined |
| ariaLabel       | 視圖 aria-label       | string        | undefined |
| ariaOrientation | 視圖 aria-orientation | string        | undefined |
| tabindex        | 容器的tabindex        | string/number | undefined |

### Slots

| 插槽名    | 說明         |
| --------- | ----------- |
| default   | 自訂預設內容 |


### Events ( emits )

| 事件名  | 說明         | 類型       |
| ------- | ----------- | ---------- |
| scroll  | 自訂預設內容 | ({ scrollLeft: number, scrollTop: number }) => void |  

### Expose

| 事件名        | 說明                 | 類型       |
| ------------- | ------------------- | ---------- |
| handleScroll  | 觸發滾動事件         | () => void |    
| scrollTo      | 捲動到一組特定座標    | (options: ScrollToOptions | number, yCoord?: number) => void |
| setScrollTop  | 設定滾動條到頂部的距離 | (scrollTop: number) => void |
| setScrollLeft | 設定滾動條到左邊的距離 | (scrollLeft: number) => void |
| update        | 手動更新滾動條狀態     | () => void |
| wrapRef       | 捲軸包裹的ref 對象     | () => Ref<HTMLDivElement> | void |

