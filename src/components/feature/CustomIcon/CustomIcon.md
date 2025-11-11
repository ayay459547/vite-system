# CustomIcon

## 圖示

### 使用範例

```vue
<script setup lang="ts">
import type { IconType } from '@/components/feature'
import { CustomIcon } from '@/components/feature'

const testIcon: [IconType, string] = ['fas', 'check']
const testType: IconType = 'far'
const testName = 'folder-open'
</script>

<template>
  <CustomIcon :icon="['far', 'user']" />
  <CustomIcon :icon="testIcon" />

  <CustomIcon type="fas" name="user" />
  <CustomIcon :type="testType" :name="testName" />
</template>
```

## Font Awesome Icon

### 找圖示(要下過濾是 Free)

[https://fontawesome.com/search?o=r&m=free](https://fontawesome.com/search?o=r&m=free)

### XIcon

[https://www.xicons.org/#/](https://www.xicons.org/#/)

### 使用 slot

* 可使用 CustomSvg
* 圖示參考 [https://www.svgrepo.com/](https://www.svgrepo.com/)

### Attributes ( props )

| 屬姓名    | 說明       | 類型   | 預設值            |
| --------- | ---------- | ------ | ----------------- |
| icon      | 圖示       | Array  | []                |
| type      | 圖示類型   | enum   | 'fas'             |
| xType     | 圖示類型   | enum   | ''                |
| name      | 圖示名稱   | string | 'circle-question' |
| size      | 大小       | string | 'default'         |
| iconClass | 圖示 class | string | ''                |

### Slots

| 插槽名  | 說明          | 類型   |
| ------- | ------------ | ------ |
| default | 自訂顯示圖示  |        |

### Events ( emits )

無

### Expose

無
