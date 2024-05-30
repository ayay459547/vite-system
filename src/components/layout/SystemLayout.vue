<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, ref, inject, reactive, nextTick } from 'vue'
import { storeToRefs } from 'pinia'

import type { Navigation } from '@/declare/routes'
import type { AuthData, UseHook } from '@/declare/hook'
import { CustomModal } from '@/components'
import { useLayoutStore } from '@/stores/stores_layout'
import { defaultModuleType } from '@/i18n/i18n_setting'
import { tipLog } from '@/lib/lib_utils'

import Layout1 from '@/components/layout/Layout-1/Layout-1.vue'
import Layout2 from '@/components/layout/Layout-2/Layout-2.vue'
import UserPreference from '@/components/layout/Preference/UserPreference.vue'

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
  isHistoryOpen: {
    type: Boolean as PropType<boolean>,
    default: false
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
  }
})

const emit = defineEmits([
  'lang-change',
  'logout',
  'history-show-change'
])

const layoutStore = useLayoutStore()
const { isDark, layout, isNavOpen, isNavHover } = storeToRefs(layoutStore)

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
    isHistoryOpen: props.isHistoryOpen,
    authData: props.authData,

    breadcrumbName: props.breadcrumbName,
    breadcrumbTitle: props.breadcrumbTitle
  }
})

const layoutEvent = {
  logout: () => emit('logout'),
  historyShowChange: ($event: boolean) => emit('history-show-change', $event),
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
        layout1Ref.value.init()
        break
      case 'layout2':
        layout2Ref.value.init()
        break
      default:
        tipLog('找不到對應的Layout')
        break
    }
  }, 100)
}

defineExpose({
  setModalView: async () => {
    await nextTick()

    isNavOpen.value = false
    emit('history-show-change', false)
  },
  init
})

const onLangChange = () => {
  emit('lang-change')
}

const onHistoryChange = ($event: boolean) => {
  emit('history-show-change', $event)
}

const onLayoutChange = () => {
  init()
}
</script>

<template>
  <div class="system-layout">
    <div class="user-modal">
      <CustomModal v-model="modal.preference" hidden-footer draggable click-outside>
        <template #header>
          <label>{{ i18nTranslate('preference', defaultModuleType) }}</label>
        </template>
        <UserPreference
          ref="preferenceRef"
          :is-dark="isDark"
          :is-history-open="props.isHistoryOpen"
          @lang-change="onLangChange"
          @history-show-change="onHistoryChange"
          @layout-change="onLayoutChange"
        />
      </CustomModal>
    </div>

    <Layout1
      ref="layout1Ref"
      v-if="layout === 'layout1'"
      v-model:isNavOpen="isNavOpen"
      :isNavHover="isNavHover"
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
      <template #default>
        <slot></slot>
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
      <template #default>
        <slot></slot>
      </template>
    </Layout2>
  </div>
</template>

<style lang="scss" scoped>
.system-layout {
  display: contents;
  width: 100vw;
  height: 100vh;
}
</style>
