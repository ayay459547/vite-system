## TimeLineTable

### 使用須知
1. 盡量配合 useTableSetting, 以後調整功能統一管理
2. columnSetting 中定義 timeLineType, timeIndex

### columnSetting 說明

| key          | 類型   | 說明                                             |
| ------------ | ------ | ------------------------------------------------ |
| timeLineType | string | group(群組-左側), date(時間線-右側), none(不使用)  |
| timeIndex    | number | 顯示順序                                          |

```ts
const columnSetting = {
  machineId: {
    label: '機台編號',
    i18nLabel: 'machine-no',
    table: {
      width: 150,
      sortable: false,

      timeLineType: 'group',
      timeIndex: 0
    }
  }
}
```

### 使用範例

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { TimeLineTable } from '@/components/feature'

// 引入表格設定類型
import type { TableOptions } from '@/types/types_columnSetting'
import { useTableSetting } from '@/lib/lib_columns'

import { columnSetting } from './columns'

const tableData = ref([])

const tableOptions: TableOptions = {
  title: 'TimeLineTable',
  i18nTitle: 'TimeLineTable',
  version: '1.0.0',
  settingKey: 'TimeLineTable-test'
}
const { tableSetting } = useTableSetting(columnSetting, 'table', tableOptions)

const TimeLineTableRef = ref<InstanceType<typeof TimeLineTable>>()

const initData = async () => {
  tableData.value = []
  await nextTick()
  TimeLineTableRef.value?.initData()
}

onMounted(() => {
  initData()
})
</script>

<template>
  <TimeLineTable
    ref="TimeLineTableRef"
    :version="tableSetting.version"
    :settingKey="tableSetting.settingKey"
    :table-columns="tableSetting.tableColumns"
    :table-data="tableData"
    i18n-module="system"
  ></TimeLineTable>
</template>
```

### Attributes ( props )

| 屬姓名       | 說明              | 類型   | 預設值  |
| ------------ | ---------------- | ------ | ------ |
| i18nModule   | 指定翻譯用模組    | string | ''     |
| version      | 欄位設定的版本    | string | ''     |
| settingKey   | 欄位設定的key     | string | ''     |
| tableColumns | 表格欄位顯示用設定 | Array  | []     |
| tableData    | 表格資料          | Array  | []     |


### Slots

| 插槽名  | 說明         |
| ------- | ------------ |
| default | 文字顯示內容 |

### Events ( emits )

| 事件名    | 說明                 | 傳參    |
| --------- | ------------------- | ------- |
| changeKey | 更換群組日期線用的key | string  |

### Expose

| 事件名    | 說明    | 傳參                               |
| -------- | ------- | ---------------------------------- |
| init     | 初始化   | (isCheckSetting?: boolean) => void |
