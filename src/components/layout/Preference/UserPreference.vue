<script setup lang="ts">
import type { PropType } from 'vue'
import { inject, ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'

import type { UseHook } from '@/declare/hook'
import { CustomIcon, FormRadio } from '@/components'
import { options as langOptions } from '@/i18n'
import { useLocaleStore } from '@/stores/stores_locale'
import { useColorToneStore } from '@/stores/stores_colorTone'
import { useLayoutStore } from '@/stores/stores_layout'
import { defaultModuleType } from '@/i18n/i18n_setting'

import Layout1 from './Layout-1.vue'
import Layout2 from './Layout-2.vue'

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

const props = defineProps({
  isDark: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  historyIsOpen: {
    type: Boolean as PropType<boolean>,
    default: false
  }
})

const emit = defineEmits(['historyChange', 'changeLayout'])

// 語言
const localeStore = useLocaleStore()
const { elLocale } = storeToRefs(localeStore)
const langValue = computed({
  get() {
    return elLocale.value
  },
  set(lang: string) {
    localeStore.currentLang = lang
  }
})

// 瀏覽器顯示
const browserView = ref('windows')
const browserViewOptions = [
  { label: 'windows', value: 'windows' },
  { label: 'fullScreen', value: 'fullScreen' }
]
const browserValue = computed({
  get() {
    return browserView.value
  },
  set(view: string) {
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

// 色調
const colorToneStore = useColorToneStore()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const colorToneOptions = [
  { label: 'light', value: 'light' },
  { label: 'dark', value: 'dark' }
]
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const colorTone = computed({
  get() {
    return props.isDark ? 'dark' : 'light'
  },
  set(colorTone: string) {
    const _isDark = colorTone === 'dark'
    colorToneStore.toggleDark(_isDark)
  }
})

// 標籤連結
const tagLinkOptions = [
  { label: 'show', value: true },
  { label: 'hidden', value: false }
]
const tagLinkValue = computed({
  get() {
    return props.historyIsOpen
  },
  set(isShow: boolean) {
    emit('historyChange', isShow)
  }
})

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

const getLayoutView = (layoutNumber: string) => {
  switch (layoutNumber) {
    case '1':
      return Layout1
    case '2':
      return Layout2
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
            <CustomIcon name="earth-americas" />
          </div>
          <label>{{ i18nTranslate('language') }}</label>
        </div>

        <div class="modal-select">
          <FormRadio v-model="langValue" :options="langOptions">
            <template #option="{ label }">
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
          <label>{{ i18nTranslate('browser') + i18nTranslate('mode') }}</label>
        </div>

        <div class="modal-select">
          <FormRadio v-model="browserValue" :options="browserViewOptions">
            <template #option="{ label }">
              {{ i18nTranslate(label) }}
            </template>
          </FormRadio>
        </div>
      </div>

      <!-- 色調 -->
      <!-- <div class="modal-item">
        <div class="modal-label">
          <div class="icon">
            <CustomIcon type="fas" name="palette"/>
          </div>
          <label>{{ `${i18nTranslate('colorTone')}` }}</label>
        </div>

        <div class="modal-select">
          <FormRadio
            v-model="colorTone"
            :options="colorToneOptions"
          >
            <template #option="{ label }">
              {{ i18nTranslate(label) }}
            </template>
          </FormRadio>
        </div>
      </div> -->

      <!-- 是否顯示標籤頁碼 -->
      <div class="modal-item">
        <div class="modal-label">
          <div class="icon">
            <CustomIcon type="fas" name="hashtag" />
          </div>
          <label>{{ `${i18nTranslate('tagLink')}` }}</label>
        </div>

        <div class="modal-select">
          <FormRadio v-model="tagLinkValue" :options="tagLinkOptions">
            <template #option="{ label }">
              {{ i18nTranslate(label) }}
            </template>
          </FormRadio>
        </div>
      </div>

      <!-- 布局切換 -->
      <div class="modal-item">
        <div class="modal-label">
          <div class="icon">
            <CustomIcon name="chalkboard-user" />
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
            <component :is="getLayoutView(layoutOption.label)" />
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
