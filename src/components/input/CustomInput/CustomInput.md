# CustomInput API

### 使用範例

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { CustomInput } from '@/components'

const text = ref('')

const onFocus = ($event: FocusEvent) => {
  console.log('onFocus', $event)
}
const onClear = () => {
  console.log('onClear')
}
const onBlur = ($event: FocusEvent) => {
  console.log('onBlur', $event)
}
const onChange = (value: string) => {
  console.log('onChange', value)
}
const onInput = (value: string) => {
  console.log('onInput', value)
}
</script>

<template>
  <CustomInput
    v-model="text"
    label="測試一般輸入框"
    class="i-mt-xl"
    clearable
    @focus="onFocus"
    @clear="onClear"
    @blur="onBlur"
    @change="onChange"
    @input="onInput"
  >
    <template #prepend>
      <span>prepend</span>
    </template>
    <template #append>
      <span>append</span>
    </template>
    <template #prefix>
      <CustomIcon name="check" />
    </template>
  </CustomInput>
</template>
```

## Element UI Plus

https://element-plus.org/en-US/component/input.html

### Attributes ( props )

| 屬姓名       | 說明                         | 類型    | 預設值   | 是否必填 |
| ------------ | ---------------------------- | ------- | -------- | -------- |
| modelValue   | v-model 綁定的值             | string  | ''       | V        |
| direction    | 文字與輸入框的方向           | string  | 'column' |          |
| label        | 輸入框標題                   | string  | ''       |          |
| hiddenLabel  | 是否隱藏輸入框標題           | boolean | false    |          |
| type         | 類型                         | string  | 'text'   |          |
| clearable    | 是否有一件清除的按鈕         | boolean | false    |          |
| disabled     | 是否不能輸入                 | boolean | false    |          |
| showPassword | 是否有切換是否顯示密碼的按鈕 | boolean | false    |          |

### Slots

| 插槽名  | 說明                      |
| ------- | ------------------------- |
| prepend | 輸入框前 加上一個區塊     |
| append  | 輸入框後 加上一個區塊     |
| prefix  | 輸入框內 前面加上一個區塊 |
| suffix  | 輸入框內 後面加上一個區塊 |

### Events ( emits )

| 事件名            | 說明                    | 傳值類型   |
| ----------------- | ----------------------- | ---------- | ---- |
| update:modelValue | v-modal 用              | boolean    |
| focus             | 當輸入框聚焦時          | FocusEvent |
| clear             | 點擊 clearable 的按鈕時 |            |
| blur              | 輸入框沒有聚焦時        | FocusEvent |
| change            | modelValue 發生改變時   | string     | null |
| input             | 輸入框的值 發生改變時   | string     | null |
