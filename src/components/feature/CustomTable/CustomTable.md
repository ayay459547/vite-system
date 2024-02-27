# CustomTable API
### 使用範例
```vue
<script setup lang="ts">
import { CustomTable } from '@/components'

import { getTableSetting } from '@/lib/lib_columns'

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
  </div>

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
[https://element-plus.org/en-US/component/table.html](https://element-plus.org/en-US/component/table.html)


### Attributes ( props )
| 屬姓名           | 說明             | 类型    | 默認值                    | 是否必填 |
| ---------------- | --------------- | ------- | ------------------------ | ------- |
| title            | 標題            | string  | ''                        |         |
| version          | 欄位的版本       | string  | ''                        | V      |
| settingKey       | 欄位設定的key    | string  | ''                        | V      |
| settingWidth     | 欄位設定框寬度   | number  | 0                         |        |
| tableColumns     | 欄位參數         | Array   | []                        | V      |  
| tableData        | 顯示資料         | Array   | []                        | V      |
| tableDataCount   | 資料總數         | number  | 0                         |        |
| rowKey           | 如果有第二層需填  | string  | 'id'                      |        |
| defaultExpandAll | children是否展開 | boolean | false                     |        |
| spanMethod       | 資料跨欄         | Function | -                        |        |
| rowClassName     | 自訂rowClass    | Function | -                        |        |
| rowStyle         | 自訂rowStyle    | Function | -                        |        |
| cellClassName    | 自訂columnClass  | Function | -                        |        |
| cellStyle        | 自訂columnStyle  | Function | -                        |        |
| page             | 當前分頁         | number  | 1                         |        |
| pageSize         | 顯示筆數         | number  | 100                       |        |
| sort             | 預設排序設定     | object  | { key: null, order: null } |        |
| showType         | 資料顯示類型     | enum    | 'custom'                   |        |
| isHiddenExcel      | 是否隱藏下載excel | boolean | false                     |        |
| isShowNo           | 是否顯示編號      | boolean | false                     |        |
| isSorting          | 是否有多欄位排序  | boolean | false                     |        |
| lazyLoading      | 是否啟用懶加載    | boolean | false                     |        |
| lazyLoadingStatus | 懶加載狀態       | enum    | 'noMore'                  |        |

### Slots
| 插槽名              | 說明                        |
| ------------------ | --------------------------- |
| header-{{欄位key}}  | 指定對應欄位的header顯示內容 |
| header-all          | header顯示內容              |
| column-{{欄位key}}  | 指定對應欄位 資料的顯示內容   |
| column-all          | 資料的顯示內容              |
| row-expand       | 展開的顯示內容              |
| empty               | 沒資料的顯示內容            |

### Events ( emits )
| 事件名         | 說明                       | 傳值類型                     |
| -------------- | ------------------------- | ---------------------------- |
| header-click   | 行被點擊                   | column, event                |
| row-click      | 行被點擊                   | row, column, event           |
| excel          | excel按鈕被點擊            | { tableColumns, tableData }  |
| columns-change | 欄位設定更動               | Array                        |
| sort-change    | 排序切換                   | { key, order }               |
| page-change    | 換分頁                     | { page, pageSize }           |
| size-change    | 換顯示筆數                 | { page, pageSize }           |
| show-change    | 排序切換、換分頁、換顯示筆數 | { page, pageSize }           |
| expand-change  | 展開的column欄位切換時      | row, expanded                |
| header-dragend | header欄位拖拉             | column, event                |
| load           | table滾到底(loadMore)      | { page, pageSize } |

### Exposes
| 屬姓名         | 說明         | 類型     | 傳參               |
| -------------- | ----------- | -------- | ------------------ |
| pageChange     | 換頁         | function | page, pageSize     |
| getTableParams | 取得表格屬性 | function |                    |
| setTableParams | 設定表格屬性 | function | { page, size } |