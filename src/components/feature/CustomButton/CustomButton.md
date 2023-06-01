# CustomButton API

## Element UI Plus
https://element-plus.org/zh-CN/component/button.html

### Attributes ( props ): 配合 Element UI
| 屬姓名     | 說明         | 类型    | 默認值     |
| --------- | ------------ | ------- | --------- |
| size      | 按鈕大小      | enum    | 'default' |
| type      | 按鈕類型      | enum    | 'default' |
| plain     | 是否樸素      | boolean | false     |
| round     | 是否圓角      | boolean | false     |
| circle    | 是否圓形      | boolean | false     |
| disabled  | 是否禁用      | boolean | false     |
| color     | 自訂按鈕顏色   | string  | ''       |

### Attributes ( props ): 專案
| 屬姓名     | 說明             | 类型    | 默認值     |
| --------- | ---------------- | ------- | --------- |
| label     | 顯示文字          | string  | ''        |
| iconType  | 圖示類型          | enum    | 'fas'     |
| iconName  | 圖示名稱          | string  | ''        |
| iconMove  | 圖示hover移動方式 | enum    | 'none'    |

### 找圖示(要下過濾是 Free)
https://fontawesome.com/search

### Slots
| 插槽名     | 說明         |
| --------- | ------------ |
| default   | 字定顯示內容  |

### Events ( emit )
| 事件名     | 說明         | 类型     |
| --------- | ------------ | -------- |
| click     | 按鈕點擊      | function |

### Exposes
| 屬姓名     | 說明         | 类型   |
| --------- | ------------ | ------ |
|           |              |        |