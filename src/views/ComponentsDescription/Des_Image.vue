<script setup lang="ts">
import { ref } from 'vue'

import markdown from '@/components/feature/CustomImage/CustomImage.md?raw'
import {
  type CustomImageProps,
  CustomInput,
  CustomDivider,
  CustomMarkdown,
  CustomIcon,
  CustomImage
} from '@/components'

const fitOptions = [
  { label: 'cover', value: 'cover' },
  { label: 'fill', value: 'fill' },
  { label: 'contain', value: 'contain' },
  { label: 'none', value: 'none' },
  { label: 'scale-down', value: 'scale-down' }
]
const fit = ref<CustomImageProps.Fit>('cover')

// slot
const srcText = ref(
  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/215px-Vue.js_Logo_2.svg.png'
)

const urlList = [
  'https://avatars.githubusercontent.com/u/6128107?s=200&v=4',
  'https://repository-images.githubusercontent.com/37153337/9d0a6780-394a-11eb-9fd1-6296a684b124',
  'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
  'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
  'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
  'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
  'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
  'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
  'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg'
]

const viewIndex = ref(0)

const onUrlClick = (url: string, urlIndex: number) => {
  srcText.value = url
  viewIndex.value = urlIndex
}
const onLoad = (e: Event) => {
  console.log(e)
}
const onError = (e: Error) => {
  console.log(e)
}
const onShow = () => {
  console.log('show')
}
</script>

<template>
  <div class="page">
    <CustomInput label="圖片網址" v-model="srcText" clearable class="i-mb-md" />

    <CustomInput label="Fit 類型" type="radio" v-model="fit" :options="fitOptions" />

    <div class="page-image">
      <CustomImage
        :src="srcText"
        :fit="fit"
        :initial-index="viewIndex"
        :preview-src-list="urlList"
        @load="onLoad"
        @error="onError"
        @show="onShow"
      >
        <template #placeholder>
          <div class="page-icon">
            <CustomIcon type="fas" name="spinner" />
            <h3>圖片讀取中 slot { placeholder }</h3>
          </div>
        </template>
        <template #error>
          <div class="page-icon">
            <CustomIcon type="fas" name="triangle-exclamation" />
            <h3>加載失敗 slot { error }</h3>
          </div>
        </template>
      </CustomImage>
    </div>

    <div class="page-list">
      <div
        v-for="(url, urlIndex) in urlList"
        :key="url"
        class="page-item card-primary"
        @click="onUrlClick(url, urlIndex)"
      >
        {{ url }}
      </div>
    </div>

    <CustomDivider>markdown</CustomDivider>
    <CustomMarkdown :text="markdown" />
  </div>
</template>

<style lang="scss" scoped>
.page {
  padding: 16px;

  &-image {
    width: 450px;
    height: 450px;
    border: 1px solid gray;
    margin: 12px 0;
    padding: 12px;
    border-radius: 6px;
  }

  &-list {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  &-item {
    border-radius: 6px;
    padding: 8px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background-color: #79bbff;
    }
  }

  &-icon {
    font-size: 1.5em;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
</style>
