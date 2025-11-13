<script setup lang="ts">
import type { PropType } from 'vue'
import { inject } from 'vue'

import type { UseHook } from '@/types/types_hook' // 全域功能類型


const useHook = inject('useHook') as UseHook
const { i18nTranslate } = useHook({
  i18nModule: 'system'
})

interface Mark {
  active: boolean
  param: string
  color: string
  i18nLabel: string
}
const props = defineProps({
  marks: {
    type: Array as PropType<Array<Mark>>,
    required: true
  },
  title: {
    type: String as PropType<string>,
    required: true
  }
})

const colorStyle = mark => {
  if(!mark.active) return {}
  return {
    'background-color': mark.color
  }
}
const markText = mark => {
  return i18nTranslate(mark.i18nLabel)
}

const changeMarkActive = mark => {
  mark.active = !mark.active
}


</script>

<template>
  <div class="mark-container">
    <div class="mark-head">
      {{ props.title }}

    </div>
    <div class="mark-body">
      <template v-for="mark in props.marks" :key=mark.param>
        <div class="mark-item" @click="changeMarkActive(mark)">
          <div class="mark-item-color" :style="colorStyle(mark)"></div>
          <div class='mark-item--text'> {{ markText(mark) }}</div>
        </div>
      </template>
    </div>
  </div>


</template>

<style lang="scss" scoped>
  :root {
    --markinfo-border-color: rgb(241, 241, 241);
  }

  .mark {
    &-container {
      position: relative;
      width: fit-content;
      height: fit-content;
      border-radius: 4px;
      border: 1px solid  rgb(241, 241, 241);
      // position: s;
    }
    &-head {
      display: flex;
      align-items: center;

      border-bottom: 2px dashed rgb(241, 241, 241);
      background-color: var(--vxe-ui-table-header-background-color);
      width: 100%;
      height: 36px;
      padding: 8px;
      font-weight: bolder;
    }
    &-body {
      display: flex;
      flex-direction: column;
      width: fit-content;
      height: fit-content;
    }

    &-item {
      min-width: 160px;
      width: fit-content;
      height: 36px;
      padding: 8px;
      gap: 8px;
      display: flex;
      flex-direction: row;
      align-items: center;

      cursor: pointer;
      &:hover {
        background-color: var(--el-fill-color-light);
        padding-left: 12px;
        // border-left: 8px solid var(--el-color-primary-light-9);
        // transform: translateX(4px);
      }

      &-color {
        border: 1px solid lightgray;
        border-radius: 2px;
        width: 15px;
        height: 15px;
      }
    }
  }

</style>
