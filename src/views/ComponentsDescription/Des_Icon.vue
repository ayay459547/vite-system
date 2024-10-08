<script setup lang="ts">
import { ref } from 'vue'

import markdown from '@/components/feature/CustomIcon/CustomIcon.md?raw'
import {
  type CustomIconProps,
  CustomDivider,
  CustomMarkdown,
  CustomInput,
  CustomIcon,
  CustomButton
} from '@/components'

const typeOptions = [
  { label: 'fas', value: 'fas' },
  { label: 'far', value: 'far' },
  { label: 'fab', value: 'fab' }
]
const type = ref<CustomIconProps.Type>('fab')

const xTypeOptions = [
  { label: 'null', value: '' },
  { label: 'fluent', value: 'fluent' },
  { label: 'ionicons4', value: 'ionicons4' },
  { label: 'ionicons5', value: 'ionicons5' },
  { label: 'antd', value: 'antd' },
  { label: 'material', value: 'material' },
  { label: 'fa', value: 'fa' },
  { label: 'tabler', value: 'tabler' },
  { label: 'carbon', value: 'carbon' }
]
const xType = ref<CustomIconProps.XType>('')

const name = ref('vuejs')

const onClick = (iconType: CustomIconProps.Type, iconName: string) => {
  type.value = iconType
  name.value = iconName
}
</script>

<template>
  <div class="page">
    <CustomInput v-model="type" label="類型" type="radio" :options="typeOptions" />
    <CustomInput v-model="xType" label="xicon類型" type="radio" :options="xTypeOptions" />

    <CustomInput v-model="name" label="圖示名稱" type="text" />
    <div class="page-icon">
      <CustomIcon :name="name" :type="type" :x-type="xType" />
    </div>

    <h3 class="i-my-md">fas 填滿</h3>
    <div class="icon-list">
      <CustomButton
        v-for="keyword in [
          'user',
          'comment',
          'wand-magic-sparkles',
          'poo',
          'film',
          'handshake-slash',
          'cash-register',
          'language',
          'robot',
          'otter',
          'wheat-awn-circle-exclamation',
          'virus-covid-slash',
          'truck-plane'
        ]"
        :key="keyword"
        type="primary"
        plain
        :label="keyword"
        :icon-name="keyword"
        @click="onClick('fas', keyword)"
      />
    </div>

    <h3 class="i-my-md">far 描邊</h3>
    <div class="icon-list">
      <CustomButton
        v-for="keyword in [
          'user',
          'folder-open',
          'window-restore',
          'file-video',
          'chart-bar',
          'chess-pawn',
          'face-grin-hearts',
          'face-laugh-squint',
          'hand-point-left',
          'hard-drive',
          'copyright',
          'paper-plane'
        ]"
        :key="keyword"
        type="success"
        plain
        :label="keyword"
        :icon-name="keyword"
        @click="onClick('far', keyword)"
      />
    </div>

    <h3 class="i-my-md">fab 特殊</h3>
    <div class="icon-list">
      <CustomButton
        v-for="keyword in [
          'github',
          'react',
          'docker',
          'figma',
          'html5',
          'css3-alt',
          'square-js',
          'node',
          'java',
          'instagram',
          'apple',
          'stack-overflow',
          'windows'
        ]"
        :key="keyword"
        type="warning"
        plain
        :label="keyword"
        :icon-name="keyword"
        icon-type="fab"
        @click="onClick('fab', keyword)"
      />
    </div>

    <CustomDivider>markdown</CustomDivider>
    <CustomMarkdown :text="markdown" />
  </div>
</template>

<style lang="scss" scoped>
.page {
  padding: 16px;

  &-icon {
    padding: 12px 0;
    font-size: 5em;
    color: #409eff;
    width: 100%;
    height: 150px;
  }

  .icon-list {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }
}
</style>
