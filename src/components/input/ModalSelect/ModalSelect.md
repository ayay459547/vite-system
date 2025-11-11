## ModalSelect

### 表格選取資料
* 建議配合 CustomInput 使用
* 也可以直接使用 ModalSelect
* 使用 /stores_components/CustomModal.ts 與 ModalSelectManagement 通訊
* 資料來源 ModalSelectManagement

### 配合 CustomInput 使用範例
```vue
<script setup lang="ts">
import { ref } from 'vue'

const machineId = ref('')
</script>

<template>
  <CustomInput
    class="grid-col-xs-24"
    v-model="machineId"
    type="text"
    :modal-select="{
      searchType: 'machine',
      multiple: false
    }"
    @modal-select-submit="(selectedValue) => {
      const [rowData] = selectedValue
      machineId = rowData?.machineId ?? ''
    }"
  />
</template>
```

### 直接使用範例
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ModalSelect } from '@/components/input'

const machineId = ref('')
</script>

<template>
  <ModalSelect
    search-type="machine"
    multiple
    :multiple-limit="0"
    @submit="(selectedValue) => {
      if (!Array.isArray(selectedValue)) return
      const [rowData] = selectedValue
      machineId = rowData?.machineId ?? ''
    }"
  />
</template>
```

### Attributes ( props )

| 屬姓名        | 說明              | 類型       | 預設值   |
| ------------- | ---------------- | ---------- | ------- |
| modelValue    | 綁定值            | any        | null    |
| searchType    | 選擇資料的類型類型 | string     | ''      |
| multiple      | 是否多選          | boolean    | false   |
| multipleLimit | 是否隱藏標記      | number     | 0       |

### Slots

無

### Events ( emits )

無

### Expose

無
