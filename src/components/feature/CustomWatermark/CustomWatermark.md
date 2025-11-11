## CustomWatermark

### 浮水印

### 使用範例

```vue
<script setup lang="ts">
import { CustomWatermark } from '@/components/feature'

const mainFont = {
  color: 'rgba(0,0,255,1)',
  fontSize: 20
}

const subFont = {
  color: 'rgba(255,0,0,1)'
}

const subWatermark: SubWatermark[] = [
  {
    width: 40,
    height: 40,
    image: '/src/assets/images/AAicon-qrcodeuse.png',
    shift: [170, 130, -7]
  },
  { content: 'RTDS', font: subFont, shift: [110, 0, 0] }
]
</script>

<template>
  <div style="width: 800px; height: 500px; background-color: gray;">
    <CustomWatermark
      :width="200"
      :height="100"
      :z-index="7"
      :gap="[100, 40]"
      :offset="[0, 40]"
      :font="mainFont"
      :sub="subWatermark"
    >
      <CustomWatermark
        :width="100"
        :height="100"
        :rotate="0"
        :gap="[50, 40]"
        :offset="[0, 40]"
        :size-fit="'children'"
      >
        <div style=" width:600px; height:400px ; background-color: white;"></div>
      </CustomWatermark>
    </CustomWatermark>
  </div>
</template>
```

### Element UI Plus

[https://element-plus.org/en-US/component/watermark.html](https://element-plus.org/en-US/component/watermark.html)

### Attributes ( props )

| 屬性名  | 說明                 | 類型              | 預設值                | 是否必填 |
| ------- | -------------------- | ----------------- | --------------------- | -------- |
| width   | 單個浮水印寬度       | number            | 120                   |          |
| height  | 單個浮水印高度       | number            | 64                    |          |
| rotate  | 浮水印旋轉角度       | number            | -22                   |          |
| zIndex  | 浮水印的 zIndex      | number            | 9                     |          |
| image   | 浮水印的圖片         | string            | ''                    |          |
| content | 浮水印的文字內容     | string / string[] | 'demo'               |          |
| font    | 浮水印的字體設定     | Font              | Font                  |          |
| gap     | 浮水印的間距         | [number, number]  | [100, 100]            |          |
| offset  | 浮水印的起始位移     | [number, number]  | [ gap[0]/2, gap[1]/2] |          |
| sizeFit | 浮水印覆蓋範圍       | enum              | 'parent'              |          |
| sub     | 定義複數種類的浮水印 | subWatermark[]    | []                    |          |

### Type Font

| 屬性名       | 說明     | 類型    | 預設值            | 是否必填 |
| ------------ | -------- | ------- | ----------------- | -------- |
| color        | 文字顏色 | string  | 'rgba(0,0,0,.15)' |          |
| fontsize     | 文字大小 | nunmber | 16                |          |
| fontWeight   | 文字粗細 | enum    | 'normal'          |          |
| fontFamily   | 文字字型 | string  | 'sans-serif'      |          |
| fontStyle    | 字型變體 | enum    | 'normal'          |          |
| textAlign    | 水平位置 | enum    | 'center'          |          |
| textBaseline | 垂直位置 | enum    | 'type'            |          |

### Type SubWatermark

| 屬性名  | 說明                 | 類型                     | 預設值       | 是否必填 |
| ------- | -------------------- | ------------------------ | ------------ | -------- |
| width   | 單個子浮水印寬度     | number                   | props.width  |          |
| height  | 單個子浮水印高度     | number                   | props.height |          |
| image   | 子浮水印的圖片       | string                   | ''           |          |
| content | 子浮水印的文字內容   | string / string[]        | ''           |          |
| font    | 子浮水印的字體設定   | Font                     | props.font   |          |
| shift   | 相對於主浮水印的位移 | [number, number, number] | [0, 0, 0]    |          |
