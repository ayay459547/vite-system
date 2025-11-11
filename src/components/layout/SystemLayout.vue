<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, ref, inject, reactive, nextTick } from 'vue'
import { storeToRefs } from 'pinia'

import type { Navigation } from '@/types/types_routes'
import type { UseHook } from '@/types/types_hook' // 全域功能類型
import { useAsyncComponent } from '@/lib/lib_hook' // 自訂Composition API

import { useLayoutStore } from '@/stores/useLayoutStore'
import { defaultModuleType } from '@/declare/declare_i18n'
import { tipLog } from '@/lib/lib_utils' // 工具

import CustomModal from '@/components/feature/CustomModal/CustomModal.vue'
import MenuUser from '@/components/layout/Menu/MenuUser.vue'

const Layout1 = useAsyncComponent<typeof import('@/components/layout/Layout-1/Layout-1.vue')['default']>(
  () => import('@/components/layout/Layout-1/Layout-1.vue'), 'rect'
)
const Layout2 = useAsyncComponent<typeof import('@/components/layout/Layout-2/Layout-2.vue')['default']>(
  () => import('@/components/layout/Layout-2/Layout-2.vue'), 'rect'
)
const Layout3 = useAsyncComponent<typeof import('@/components/layout/Layout-3/Layout-3.vue')['default']>(
  () => import('@/components/layout/Layout-3/Layout-3.vue'), 'rect'
)
// 偏好設定
const UserPreference = useAsyncComponent<typeof import('@/components/layout/Preference/UserPreference.vue')['default']>(
  () => import('@/components/layout/Preference/UserPreference.vue'), 'rect'
)

const useHook = inject('useHook') as UseHook
const { i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

const props = defineProps({
  showRoutes: {
    type: Array as PropType<Navigation[]>,
    default: () => []
  },
  currentNavigation: {
    type: [Object, null] as PropType<Navigation | null>,
    default: () => {
      return {}
    }
  },
  isIframe: {
    type: Boolean as PropType<boolean>,
    default: false
  }
})

const emit = defineEmits(['logout'])

const layoutStore = useLayoutStore()
const { isDark, layout } = storeToRefs(layoutStore)

export type CurrentRouteName = {
  level1: string
  level2: string
  level3: string
}
const currentRouteName = computed(() => {
  const [
    level1Active = '',
    level2Active = '',
    level3Active = ''
  ] = props.currentNavigation?.breadcrumbName ?? []

  return {
    level1: level1Active,
    level2: level2Active,
    level3: level3Active
  }
})

const layoutAttr = computed(() => {
  return {
    showRoutes: props.showRoutes,
    currentNavigation: props.currentNavigation,
    currentRouteName: currentRouteName.value
  }
})

  // 打開偏好設定
const preference = () => {
  modal.preference = true
}

// 登出
const logout = () => {
  emit('logout')
}

// modal
const modal = reactive({
  preference: false
})

const Layout1Ref = ref<InstanceType<typeof Layout1>>()
const Layout2Ref = ref<InstanceType<typeof Layout2>>()
const Layout3Ref = ref<InstanceType<typeof Layout3>>()

const init = async () => {
  await nextTick()

  setTimeout(() => {
    switch (layout.value) {
      case 'layout1':
        Layout1Ref.value?.init()
        break
      case 'layout2':
        Layout2Ref.value?.init()
        break
      case 'layout3':
        Layout3Ref.value?.init()
        break
      default:
        tipLog('找不到對應的Layout', [layout.value])
        break
    }
  }, 320)
}

defineExpose({
  init
})

</script>

<template>
  <div class="system-layout">
    <template v-if="!props.isIframe">
      <!-- 偏好設定 -->
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
        <UserPreference :is-dark="isDark" @init="init" />
      </CustomModal>

      <Layout1
        ref="Layout1Ref"
        v-if="layout === 'layout1'"
        v-bind="layoutAttr"
      >
        <template #logo>
          <slot name="logo"></slot>
        </template>
        <template #version>
          <slot name="version"></slot>
        </template>

        <template #content>
          <slot name="content"></slot>
        </template>
        <template #MenuUser>
          <MenuUser @preference="preference" @logout="logout" />
        </template>
      </Layout1>

      <Layout2
        ref="Layout2Ref"
        v-else-if="layout === 'layout2'"
        v-bind="layoutAttr"
      >
        <template #logo>
          <slot name="logo"></slot>
        </template>
        <template #version>
          <slot name="version"></slot>
        </template>

        <template #content>
          <slot name="content"></slot>
        </template>
        <template #MenuUser>
          <MenuUser @preference="preference" @logout="logout" />
        </template>
      </Layout2>

      <Layout3
        ref="Layout3Ref"
        v-else-if="layout === 'layout3'"
        v-bind="layoutAttr"
      >
        <template #logo>
          <slot name="logo"></slot>
        </template>
        <template #version>
          <slot name="version"></slot>
        </template>

        <template #content>
          <slot name="content"></slot>
        </template>
        <template #MenuUser>
          <MenuUser @preference="preference" @logout="logout" />
        </template>
      </Layout3>

      <div v-else class="fill">
        <slot name="content"></slot>
      </div>
    </template>

    <!-- isIframe -->
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
