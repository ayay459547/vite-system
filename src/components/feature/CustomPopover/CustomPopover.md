# CustomButton API

## Element UI Plus
https://element-plus.org/zh-CN/component/popover.html

### Attributes ( props )
| 屬姓名       | 說明       | 类型    | 默認值   |
| ----------- | ---------- | ------- | ------- |
| visible     | 是否顯示    | boolean | false   |
| width       | 寬度        | number  | 150     |
| title       | 按鈕類型    | string  | ''       |
| placement   | 出現位置    | enum    | 'bottom' |
| trigger     | 切換方式    | enum    | 'click'  |
| popperStyle | 自訂樣式    | string  | ''       |

### Slots
| 插槽名     | 說明    |
| --------- | ------- |
| default   | 顯示內容 |
| reference | 按鈕位置 |

### Events ( emit )
| 事件名         | 說明          | 傳值類型 |
| -------------- | ------------ | ------- |
| update:visible | 顯示切換      | boolean |

### Exposes
| 屬姓名     | 說明         | 類型   |
| --------- | ------------ | ------ |
|           |              |        |