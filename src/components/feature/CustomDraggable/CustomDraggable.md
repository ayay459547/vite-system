# CustomDraggable
### 使用範例
```vue
<script setup lang="ts">
import { CustomDraggable } from '@/components'
import { ref } from 'vue'

const list = ref([
  { id: 1, label: 'test-1', value: 'test-1' },
  { id: 2, label: 'test-2', value: 'test-2' },
  { id: 3, label: 'test-3', value: 'test-3' },
  { id: 4, label: 'test-4', value: 'test-4' },
  { id: 5, label: 'test-5', value: 'test-5' }
])

</script>

<template>
  <div>
    <CustomDraggable v-model="list" class="border-info">
      <template #item="{ element }">
        <div class="i-pa-md">
          {{ `slot item(必填插槽): ${element.label}` }}
        </div>
      </template>
    </CustomDraggable>
  </div>
</template>
```

## 使用說明
[https://github.com/SortableJS/vue.draggable.next](https://github.com/SortableJS/vue.draggable.next)

## 線上範例
[https://sortablejs.github.io/vue.draggable.next/#/simple](https://sortablejs.github.io/vue.draggable.next/#/simple)

### Attributes ( props )
| 屬姓名          | 說明             | 类型     | 默認值          | 是否必填 |
| -------------- | ---------------- | -------- | -------------- | ------- |
| modelValue     | v-modal 綁定的值  | boolean  |                | V       |
| itemKey        | 每筆資料的key     | string   | 'id'           |         |
| handle         | 指定可拖拉的元素   | string   | '.__draggable' |         |
| class          | 外層class         | string   | ''             |         |
| rowClass       | 資料列class       | string   | ''             |         |
| tag            | 外層html標籤      | string   | 'ul'           |         |
| clone          | 自訂拷貝方式       | Function | (o) => o      |         |
| move           | 移動後的回調函數   | Function  | undefined     |         |
| ghostClass     | 移動中的class     | string    | ''            |         |
| direction      | 方向              | enum      | 'column'      |         |
| group          | 群組        |  string, Object | 'name'        |         |

### Slots
| 插槽名     | 說明            | 是否必填 |
| --------- | --------------- | ------- |
| item      | 列表顯示內容     | V       |
| header    | 最上方的位置     |         | 
| footer    | 最底下的位置     |         |

### Events ( emit )
| 事件名              | 說明         | 傳值類型         |
| ------------------ | ------------ | --------------- |
| update:modelValue  | v-modal 用   | boolean         |
| start              | 開始移動      |                 |
| add                | 新增資料      |                 |
| remove             | 移除資料      |                 |
| end                | 結束移動      |                 |
| choose             | 點選時        |                 |
| unchoose           | 放開點選      |                 |
| clone              | clone執行     |                 |
| change             | 移動變動資料   | DraggableChange |
