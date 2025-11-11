<script setup lang="ts">
import type { PropType } from 'vue'
import { inject, ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'

import type { UseHook } from '@/types/types_hook' // 全域功能類型
import { useI18nStore } from '@/stores/useI18nStore'
import { useLayoutStore } from '@/stores/useLayoutStore'
import { defaultModuleType, langOptions } from '@/declare/declare_i18n'

import CustomIcon from '@/components/feature/CustomIcon/CustomIcon.vue'
import FormRadio from '@/components/input/FormRadio/FormRadio.vue'
import CustomDivider from '@/components/feature/CustomDivider/CustomDivider.vue'

import TranslationSettings from './TranslationSettings/TranslationSettings.vue'
import Layout1 from './Layout-1.vue'
import Layout2 from './Layout-2.vue'
import Layout3 from './Layout-3.vue'

const useHook = inject('useHook') as UseHook
const { i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

const props = defineProps({
  isDark: {
    type: Boolean as PropType<boolean>,
    default: false
  }
})

const emit = defineEmits(['init'])

// 語言
const i18nStore = useI18nStore()
const { systemLocale } = storeToRefs(i18nStore)

const langValue = computed({
  get: () => {
    return systemLocale.value
  },
  set: (lang: string) => {
    i18nStore.setSystemLocale(lang)
  }
})

// 瀏覽器顯示
const browserView = ref('windows')
const browserViewOptions = [
  { label: 'windows', value: 'windows' },
  { label: 'full-screen', value: 'full-screen' }
]
const browserValue = computed({
  get: () => browserView.value,
  set: (view: string) => {
    browserView.value = view

    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    } else {
      document.documentElement.requestFullscreen()
    }
  }
})

onMounted(() => {
  if (document.fullscreenElement) {
    browserView.value = 'full-screen'
  } else {
    browserView.value = 'windows'
  }
})

// 布局
const layoutStore = useLayoutStore()
const { layout } = storeToRefs(layoutStore)

// 色調

const colorToneOptions = [
  { label: 'light', value: 'light' },
  { label: 'dark', value: 'dark' }
]
const colorTone = computed({
  get: () => props.isDark ? 'dark' : 'light',
  set: (colorTone: string) => {
    layoutStore.setColorTone(colorTone)
  }
})

const getLayoutView = (layoutNumber: string) => {
  switch (layoutNumber) {
    case '1':
      return Layout1
    case '2':
      return Layout2
    case '3':
      return Layout3
  }
}

const onClickLayout = (layoutType: string) => {
  layoutStore.setLayout(layoutType)
  emit('init')
}
</script>

<template>
  <div class="modal-container grid-row">
    <div class="grid-col-xs-24 grid-col-xl-12">
      <div class="modal-list">
        <!-- 語言設定 -->
        <div class="modal-item">
          <div class="modal-label">
            <div class="icon">
              <CustomIcon name="earth-americas" />
            </div>
            <label>{{ i18nTranslate('language') }}</label>
          </div>

          <div class="modal-select">
            <FormRadio v-model="langValue" :options="langOptions">
              <template #options="{ label }">
                {{ i18nTranslate(label) }}
              </template>
            </FormRadio>
          </div>
        </div>

        <!-- 瀏覽器顯示模式 -->
        <div class="modal-item">
          <div class="modal-label">
            <div class="icon">
              <CustomIcon type="far" name="window-restore" />
            </div>
            <label>{{ i18nTranslate(['view', 'mode']) }}</label>
          </div>

          <div class="modal-select">
            <FormRadio v-model="browserValue" :options="browserViewOptions">
              <template #options="{ label }">
                {{ i18nTranslate(label) }}
              </template>
            </FormRadio>
          </div>
        </div>

        <!-- 色調 -->
        <div class="modal-item">
          <div class="modal-label">
            <div class="icon">
              <CustomIcon type="fas" name="palette"/>
            </div>
            <label>{{ `${i18nTranslate('color-tone')}` }}</label>
          </div>

          <div class="modal-select">
            <FormRadio
              v-model="colorTone"
              :options="colorToneOptions"
            >
              <template #options="{ label }">
                {{ i18nTranslate(label) }}
              </template>
            </FormRadio>
          </div>
        </div>

      </div>
    </div>

    <!-- 布局切換 -->
    <div class="grid-col-xs-24 grid-col-xl-12">
      <div class="modal-label">
        <div class="icon">
          <CustomIcon name="chalkboard-user" />
        </div>
        <label>{{ i18nTranslate('layout') }}</label>
      </div>

      <div class="modal-select">
        <div
          v-for="layoutOption in layoutStore.layoutOptions"
          :key="layoutOption.value"
          :class="{ active: layout === layoutOption.value }"
          class="layout cursor-pointer"
          @click="onClickLayout(layoutOption.value)"
        >
          <div class="i-mb-sm">{{ i18nTranslate('layout') + layoutOption.label }}</div>
          <component :is="getLayoutView(layoutOption.label)" />
        </div>
      </div>
    </div>

    <CustomDivider>{{ i18nTranslate('setting-advanced') }}</CustomDivider>
    <!-- 進階設定 -->
    <div class="grid-col-xs-24">
      <TranslationSettings />
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
        background-color: var(--el-color-primary-light-7);
      }

      &.active {
        border-color: var(--el-color-primary);
      }
    }
  }
}
</style>
