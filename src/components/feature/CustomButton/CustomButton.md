# CustomButton API

## Element UI Plus
https://element-plus.org/zh-CN/component/button.html

### Attributes ( props )
| 屬姓名     | 說明             | 类型    | 默認值     |
| --------- | ---------------- | ------- | --------- |
| label     | 顯示文字          | string  | ''        |
| size      | 按鈕大小          | enum    | 'default' |
| type      | 按鈕類型          | enum    | 'default' |
| text      | 文字樣式          | boolean | false     |
| plain     | 樸素樣式          | boolean | false     |
| round     | 是否圓角          | boolean | false     |
| circle    | 是否圓形          | boolean | false     |
| disabled  | 是否禁用          | boolean | false     |
| color     | 自訂按鈕顏色      | string  | ''        |
| iconType  | 圖示類型          | enum    | 'fas'     |
| iconName  | 圖示名稱          | string  | ''        |
| iconMove  | 圖示hover移動方式 | enum    | 'none'    |

### 找圖示(要下過濾是 Free)
https://fontawesome.com/search

### Slots
| 插槽名     | 說明          |
| --------- | ------------- |
| default   | 文字顯示內容   |
| icon      | 前面圖示的位置 |

### Events ( emit )
| 事件名     | 說明         | 傳值類型  |
| --------- | ------------ | -------- |
| click     | 按鈕點擊      |          |

### Exposes
| 屬姓名     | 說明         | 類型   |
| --------- | ------------ | ------ |
|           |              |        |