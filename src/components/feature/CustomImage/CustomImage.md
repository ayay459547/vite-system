# CustomImage
### 使用範例
```vue
<script setup lang="ts">
import { CustomImage } from '@/components'

const onLoad = (e: Event) => {
  console.log(e)
}
const size: ButtonSize = 'large'
</script>

<template>
  <div style="width: 300px">
    <CustomImage
      src="https://avatars.githubusercontent.com/u/6128107?s=200&v=4"
      @load="onLoad"
    />
  </div>
</template>
```
## Element UI Plus
[https://element-plus.org/en-US/component/image.html](https://element-plus.org/en-US/component/image.html)

### Attributes ( props )
| 屬姓名            | 說明                    | 类型    | 默認值     |
| ----------------- | ---------------------- | ------- | --------- |
| src               | 圖片網址                | string  | ''        |
| fit               | css object-fit         | enum    | ''        |
| alt               | 原生屬性 alt            | string  | ''        |
| loading           | 原生屬性 loading        | enum    | -         |
| referrerpolicy    | 原生屬性 referrerpolicy | boolean | false     |
| zoomRate          | 瀏覽圖片縮放比           | number  | 1.2      |
| initialIndex      | 預覽圖片的索引值         | number  | 0        |
| previewSrcList    | 圖片預覽列表            | array   | []       |
| hideOnClickModal  | 是否可點及遮罩關閉預覽   | boolean | false     |
| previewTeleported | 是否插入至 body         | boolean | false     |

### Slots
| 插槽名       | 說明          |
| ----------- | ------------- |
| placeholder | 圖片讀取中     |
| error       | 圖片載入失敗   |

### Events ( emits )
| 事件名     | 說明         |
| --------- | ------------ |
| load      | 加載成功      |
| error     | 加載失敗      |
| switch    | 預覽切換      |
| close     | 關閉預覽      |
| show      | 開啟預覽      |
