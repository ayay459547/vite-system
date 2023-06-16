# CustomTable API
### 使用範例
```vue
<script setup lang="ts">
import { CustomTable } from '@/components'

import { getTableSetting } from '@/lib/columns'

const tableData1 = [
  { name: '小名', age: 13, address: '台北市大安區' },
  { name: '小華', age: 22, address: '桃園市中壢區' },
  { name: '小安', age: 34, address: '桃園市楊梅區' }
]

const tableColumns1 = [
  { key: 'name', label: '名稱', prop: 'name', width: 150 },
  { key: 'age', label: '年齡', prop: 'age', width: 120 },
  { key: 'address', label: '地址', prop: 'address', minWidth: 200 }
]

const columnSetting = {
  date: {
    label: '生日',
    table: {
      width: 150,
      align: 'center'
    }
  },
  name: {
    label: '姓名',
    table: {
      width: 150
    }
  },
  address: {
    label: '地址',
    table: {
      minWidth: 300
    }
  }
}

const tableOptions = {
  title: '測試表單',
  version: '1.0.0',
  settingKey: 'test'
}
const { tableSetting, downloadExcel } = getTableSetting(columnSetting, 'table', tableOptions)

const download = () => {
  downloadExcel(tableData2)
}

const tableData2 = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-02',
    name: 'Caleb',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-04',
    name: 'Peter',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-01',
    name: 'Amy',
    address: 'No. 189, Grove St, Los Angeles'
  }
]
</script>

<template>
  <div style="width: 800px; height: 500px;">
    <CustomTable
      title="表單組件測試"
      version="1.0.0"
      setting-key="test-table-1"
      :table-data="tableData1"
      :table-columns="tableColumns1"
    />
  </div>

  <div style="width: 800px; height: 500px;">
    <CustomTable
      title="表單組件測試"
      version="1.0.0"
      setting-key="test-table-2"
      :table-data="tableData"
      :table-columns="tableColumns"
    >
      <template #header-all="{ column }">
        {{ column.label + '-header' }}
      </template>
      <template #column-all="{ data }">
        {{ data + '-column' }}
      </template>
    </CustomTable>

    <div style="width: 800px; height: 500px;">
      <CustomTable
        :table-data="tableData2"
        v-bind="tableSetting"
        @excel="download"
      >
        <template #header-all="{ column }">{{ column.label }}</template>
      </CustomTable>
    </div>
</template>
```
## Element UI Plus
https://element-plus.org/en-US/component/table.html

### Attributes ( props )
| 屬姓名           | 說明             | 类型    | 默認值    | 是否必填 |
| ---------------- | --------------- | ------- | --------- | ------- |
| title            | 標題            | string  | ''        |         |
| version          | 欄位的版本       | string  | ''        | V      |
| settingKey       | 欄位設定的key    | string  | ''        | V      |
| tableColumns     | 欄位參數         | Array   | []        | V      |  
| tableData        | 顯示資料         | Array   | []        | V      |
| rowKey           | 如果有第二層需填  | string  | 'id'      |        |
| defaultExpandAll | 是否圓形         | boolean | false     |        |
| total            | 資料總數         | number  | 0         |        |

### Slots
| 插槽名              | 說明                        |
| ------------------ | --------------------------- |
| header-{{欄位key}}  | 指定對應欄位的header顯示內容 |
| header-all          | header顯示內容              |
| column-{{欄位key}}  | 指定對應欄位 資料的顯示內容   |
| column-all          | 資料的顯示內容              |

### Events ( emits )
| 事件名      | 說明           | 傳值類型                     |
| ----------- | -------------- | ---------------------------- |
| row-click   | 行被點擊        | row, column, event           |
| excel       | excel按鈕被點擊 | { tableColumns, tableData }  |
| change-page | 換分頁          | { page, pageSize }           |
| change-size | 換顯示筆數      | { page, pageSize }           |

### Exposes
| 屬姓名     | 說明         | 類型     | 傳參           |
| ---------- | ----------- | -------- | -------------- |
| page       | 當前頁碼     | number   |                |
| pageSize   | 顯示筆數     | number   |                |
| ChangePage | 換頁         | function | page, pageSize |