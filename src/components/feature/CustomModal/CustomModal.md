# CustomModal API
### Attributes ( props )
| 屬姓名      | 說明             | 类型    | 默認值     |
| ---------- | ---------------- | ------- | --------- |
| modelValue | v-modal 綁定的值  | boolean | false     |

| size       | 按鈕大小          | enum    | 'default' |
| type       | 按鈕類型          | enum    | 'default' |
| text       | 文字樣式          | boolean | false     |
| plain      | 樸素樣式          | boolean | false     |
| round      | 是否圓角          | boolean | false     |
| circle     | 是否圓形          | boolean | false     |
| disabled   | 是否禁用          | boolean | false     |
| color      | 自訂按鈕顏色      | string  | ''        |
| iconType   | 圖示類型          | enum    | 'fas'     |
| iconName   | 圖示名稱          | string  | ''        |
| iconMove   | 圖示hover移動方式 | enum    | 'none'    |
### Slots
| 插槽名     | 說明           |
| --------- | -------------- |
| default   | 中間顯示內容    |
| header    | 標題的位置      |
| footer    | 最底下按鈕的位置 |

### Events ( emit )
| 事件名             | 說明         | 傳值類型  |
| ------------------ | ------------ | -------- |
| update:modelValue  | v-modal 用   | boolean  |
| cancel             | 取消按鈕按下  |          |
| update:modelValue  | 確認按鈕按下  |          |

### Exposes
| 屬姓名     | 說明         | 类型   |
| --------- | ------------ | ------ |
|           |              |        |