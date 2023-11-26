# CustomTootip API
### 使用範例
```vue
<script setup lang="ts">
  import { CustomTooltip, CustomButton } from '@/components'
</script>

<template>
  <CustomTooltip>
      <CustomButton label="滑鼠移入 Tooltip" type="primary"/>
      <template #content>
        <div>Tooltip 內容1</div>
      </template>
    </CustomTooltip>

    <CustomTooltip trigger="click">
      <CustomButton label="滑鼠點擊 Tooltip" type="success"/>
      <template #content>
        <div>Tooltip 內容2</div>
      </template>
    </CustomTooltip>
</template>
```
## Element UI Plus
[https://element-plus.org/en-US/component/tooltip.html]
(https://element-plus.org/zh-US/component/tooltip.html)

### Attributes ( props )
| 屬姓名       | 說明           | 类型    | 默認值   |
| ----------- | -------------- | ------- | ------- |
| visible     | 是否顯示        | boolean | false   |
| placement   | 出現位置        | enum    | 'bottom' |
| trigger     | 切換方式        | enum    | 'click'  |
| popperClass | 自訂樣式        | string  | ''       |
| showArrow   | 是否顯示箭頭     | boolean | true    |
| offset      | 出現位置的偏移量 | number   | 0      |

### Slots
| 插槽名     | 說明          |
| --------- | ------------- |
| default   | 觸發事件的元素 |
| content   | 顯示內容       |

### Events ( emit )
| 事件名         | 說明          | 傳值類型 |
| -------------- | ------------ | ------- |
| update:visible | 顯示切換      | boolean |
