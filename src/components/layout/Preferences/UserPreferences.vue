<script setup lang="ts">
import type { UseHook } from '@/declare/hook'
import { CustomIcon, CustomButton } from '@/components'
import type { ButtonType } from '@/components'
import { inject, ref, onMounted } from 'vue'
import { options as langOptions } from '@/i18n'
import { useLocaleStore } from '@/stores/stores_locale'
import { useLayoutStore } from '@/stores/stores_layout'
import { storeToRefs } from 'pinia'

import Layout1 from './Layout-1.vue'
import Layout2 from './Layout-2.vue'

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook()

// 語言
const localeStore = useLocaleStore()
const { elLocale } = storeToRefs(localeStore)

// 瀏覽器顯示
const browserViewOptions = [
  { label: 'windows', value: 'windows' },
  { label: 'fullScreen', value: 'fullScreen' }
]
const browserView = ref('windows')
const changeBrowserView = (view: string) => {
  browserView.value = view

  if (document.fullscreenElement) {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  } else {
    document.documentElement.requestFullscreen()
  }
}

onMounted(() => {
  if (document.fullscreenElement) {
    browserView.value = 'fullScreen'
  } else {
    browserView.value = 'windows'
  }
})

// 布局
const layoutStore = useLayoutStore()
const { layout } = storeToRefs(layoutStore)

const emit = defineEmits<{
  (e: 'changeLayout'): void
}>()

const getLayoutView = (layoutNumber: string) => {
  switch (layoutNumber){
    case '1': return Layout1
    case '2': return Layout2
  }
}

const onClickLayout = (layoutValue: string) => {
  layoutStore.currentLayout = layoutValue
  emit('changeLayout')
}

</script>

<template>
  <div class="modal-container">
    <div class="modal-list">
      <!-- 語言設定 -->
      <div class="modal-item">
        <div class="modal-label">
          <div class="icon">
            <CustomIcon name="earth-americas"/>
          </div>
          <label>{{ i18nTranslate('language') }}</label>
        </div>

        <div class="modal-select">
          <CustomButton
            v-for="langOption in langOptions"
            :key="langOption.value"
            :type="((elLocale === langOption.value ? 'primary' : 'default') as ButtonType)"
            :label="i18nTranslate(langOption.label)"
            @click="localeStore.currentLang = langOption.value"
          />
        </div>
      </div>

      <!-- 瀏覽器顯示模式 -->
      <div class="modal-item">
        <div class="modal-label">
          <div class="icon">
            <CustomIcon type="far" name="window-restore"/>
          </div>
          <label>{{ i18nTranslate('browser') + i18nTranslate('mode') }}</label>
        </div>

        <div class="modal-select">
          <CustomButton
            v-for="viewOption in browserViewOptions"
            :key="viewOption.value"
            :type="((browserView === viewOption.value ? 'primary' : 'default') as ButtonType)"
            :label="i18nTranslate(viewOption.label)"
            @click="changeBrowserView(viewOption.value)"
          />
        </div>
      </div>

      <!-- 布局切換 -->
      <div class="modal-item">
        <div class="modal-label">
          <div class="icon">
            <CustomIcon name="chalkboard-user"/>
          </div>
          <label>{{ i18nTranslate('layout') }}</label>
        </div>

        <div class="modal-select">
          <div
            v-for="layoutOption in layoutStore.options"
            :key="layoutOption.value"
            :class="{ active: layout === layoutOption.value }"
            class="layout cursor-pointer"
            @click="onClickLayout(layoutOption.value)"
          >
            <div class="i-mb-sm">{{ i18nTranslate('layout') + layoutOption.label }}</div>
            <component :is="getLayoutView(layoutOption.label)"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal {
  &-container {
    width: 100%;
    height: fit-content;
    padding: 16px 24px;

    .icon {
      width: 36px;
      @extend %flex-center;
    }
  }

  &-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: inherit;
  }

  &-item {
    width: inherit;
  }
  &-label {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  &-select {
    display: flex;
    width: 100%;
    gap: 12px;
    padding: 12px 0px;
    flex-wrap: wrap;

    .layout {
      padding: 16px;
      border-radius: 6px;
      border: 2px solid #ffffff00;
      transition-duration: 0.2s;

      &:hover {
        background-color: lighten(#409eff, 30%);
      }

      &.active {
        border-color: lighten(#409eff, 10%);
      }
    }
  }
}
</style>
