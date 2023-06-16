# CustomIcon API
### 使用範例
```vue
<script setup lang="ts">
import type { IconType } from '@/components'
import { CustomIcon } from '@/components'

const testIcon: [IconType, string] = ['fas', 'check']
const testType: IconType = 'far'
const testName = 'folder-open'

</script>

<template>
  <CustomIcon :icon="['far', 'user']"/>
  <CustomIcon :icon="testIcon"/>

  <CustomIcon type="fas" name="user"/>
  <CustomIcon :type="testType" :name="testName"/>
</template>
```
## Font Awesome Icon

### 找圖示(要下過濾是 Free)
https://fontawesome.com/search?o=r&m=free

### Attributes ( props )
| 屬姓名     | 說明         | 类型    | 默認值             |
| --------- | ------------ | ------- | ----------------- |
| icon      | 圖示          | Array  | []                 |
| type      | 圖示類型      | enum    | 'fas'             |
| name      | 圖示名稱      | string  | 'circle-question' |
| size      | 大小          | string  | 'default'         |
| iconClass | 圖示class     | string  | ''                |
