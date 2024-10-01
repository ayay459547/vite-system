<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, ref, inject, reactive, nextTick } from 'vue'
import { storeToRefs } from 'pinia'

import type { Navigation } from '@/declare/routes'
import type { AuthData, UseHook } from '@/declare/hook'
import { CustomModal } from '@/components'
import { useAsyncComponent } from '@/lib/lib_hook'

import { useLayoutStore } from '@/stores/stores_layout'
import { defaultModuleType } from '@/i18n/i18n_setting'
import { tipLog } from '@/lib/lib_utils'

const Layout1 = useAsyncComponent(() => import('@/components/layout/Layout-1/Layout-1.vue'), 'rect')
const Layout2 = useAsyncComponent(() => import('@/components/layout/Layout-2/Layout-2.vue'), 'rect')
const UserPreference = useAsyncComponent(() => import('@/components/layout/Preference/UserPreference.vue'), 'rect')

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

const props = defineProps({
  isShow: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  currentNavigation: {
    type: Object as PropType<Navigation>,
    default: () => {
      return {}
    }
  },
  showRoutes: {
    type: Array as PropType<Navigation[]>,
    default: () => {
      return []
    }
  },
  breadcrumbName: {
    type: Array as PropType<string[]>,
    default: () => {
      return []
    }
  },
  breadcrumbTitle: {
    type: Array as PropType<string[]>,
    default: () => {
      return []
    }
  },
  authData: {
    type: Object as PropType<AuthData>,
    default: () => {
      return {
        user: {},
        role: {},
        roleFunction: [],
        groups: []
      } as AuthData
    }
  },
  isIframe: {
    type: Boolean as PropType<boolean>,
    default: false
  }
})

const emit = defineEmits([
  'lang-change',
  'logout'
])

const layoutStore = useLayoutStore()
const { isDark, layout } = storeToRefs(layoutStore)

export type CurrentRouteName = {
  level1: string
  level2: string
  level3: string
}
const currentRouteName = computed(() => {
  const [level1Active = '', level2Active = '', level3Active = ''] = props.breadcrumbName

  return {
    level1: level1Active,
    level2: level2Active,
    level3: level3Active
  }
})

const layoutAttr = computed(() => {
  return {
    isShow: props.isShow,
    showRoutes: props.showRoutes,
    currentNavigation: props.currentNavigation,

    currentRouteName: currentRouteName.value,
    authData: props.authData,

    breadcrumbName: props.breadcrumbName,
    breadcrumbTitle: props.breadcrumbTitle
  }
})

const layoutEvent = {
  // 登出
  logout: () => emit('logout'),
  // 打開偏好設定
  preference: () => {
    modal.preference = true
  }
}

// modal
const preferenceRef = ref(null)
const modal = reactive({
  preference: false
})

const layout1Ref = ref()
const layout2Ref = ref()

const init = async () => {
  await nextTick()

  setTimeout(() => {
    switch (layout.value) {
      case 'layout1':
        layout1Ref.value?.init()
        break
      case 'layout2':
        layout2Ref.value?.init()
        break
      default:
        tipLog('找不到對應的Layout')
        break
    }
  }, 320)
}

defineExpose({
  init
})

const onLangChange = () => {
  emit('lang-change')
}

const onLayoutChange = () => {
  init()
}
</script>

<template>
  <div class="system-layout">
    <template v-if="!props.isIframe">
      <div class="user-modal">
        <CustomModal
          v-model="modal.preference"
          :modal="false"
          hidden-footer
          draggable
          :hidden-collapse="false"
        >
          <template #header>
            <label>{{ i18nTranslate('preference', defaultModuleType) }}</label>
          </template>
          <UserPreference
            ref="preferenceRef"
            :is-dark="isDark"
            @lang-change="onLangChange"
            @layout-change="onLayoutChange"
          />
        </CustomModal>
      </div>

      <Layout1
        ref="layout1Ref"
        v-if="layout === 'layout1'"
        v-bind="layoutAttr"
        v-on="layoutEvent"
      >
        <template #logo="{ isShow }">
          <slot name="logo" :is-show="isShow"></slot>
        </template>
        <template #menu-footer="{ isShow }">
          <slot name="menu-footer" :is-show="isShow"></slot>
        </template>

        <template #header-left>
          <slot name="header-left"></slot>
        </template>
        <template #header-right>
          <slot name="header-right"></slot>
        </template>

        <template #content>
          <slot name="content"></slot>
        </template>
      </Layout1>

      <Layout2
        ref="layout2Ref"
        v-else-if="layout === 'layout2'"
        v-bind="layoutAttr"
        v-on="layoutEvent"
      >
        <template #logo>
          <slot name="logo" :is-show="true"></slot>
        </template>
        <template #menu-left>
          <slot name="menu-left"></slot>
        </template>
        <template #menu-right>
          <slot name="menu-right"></slot>
        </template>

        <template #content>
          <slot name="content"></slot>
        </template>
      </Layout2>
    </template>

    <div v-else class="fill">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.system-layout {
  width: 100vw;
  height: 100vh;
  background-color: var(--i-color-system-bg);
  overflow: hidden;
}
</style>
