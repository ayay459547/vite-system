# CustomModal API
### 使用範例
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { CustomModal, CustomButton } from '@/components'

const modalShow = ref<boolean>(false)

const openModal = () => {
  modalShow.value = true
}
const onModalCancel = () => {
  console.log('取消')
}
const onModalSubmit = () => {
  console.log('確認')
}
</script>

<template>
  <CustomButton label="OpenModal" @click="openModal"/>

  <CustomModal
    v-model="modalShow"
    title="ModalTitle"
    @cancel="onModalCancel"
    @submit="onModalSubmit"
  >
    <div class="i-pa-xl">
      test-modal
    </div>
  </CustomModal>
</template>
```
### Attributes ( props )
| 屬姓名        | 說明               | 类型    | 默認值     |
| ------------ | ------------------ | ------- | --------- |
| modelValue   | v-modal 綁定的值    | boolean | false     |
| title        | 標題                | string  | ''       |
| clickOutside | 點擊外面是否關閉     | boolean | false    |
| widthSize    | 寬度大小            | enum    | 'default' |
| heightSize   | 高度大小            | enum    | 'default' |
| hiddenFooter | 是否隱藏最下面的區域 | boolean | false     |
| hiddenSubmit | 是否隱藏確認按鈕     | boolean | false     |
| hiddenCancel | 是否隱藏取消按鈕     | boolean | false     |

### Slots
| 插槽名     | 說明            |
| --------- | --------------- |
| default   | 中間顯示內容     |
| header    | 標題的位置       |
| footer    | 最底下按鈕的位置  |

### Events ( emit )
| 事件名              | 說明         | 傳值類型  |
| ------------------ | ------------ | -------- |
| update:modelValue  | v-modal 用   | boolean  |
| cancel             | 取消按鈕按下  |          |
| submit             | 確認按鈕按下  |          |
