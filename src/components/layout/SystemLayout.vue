<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, ref, inject, reactive, onMounted, nextTick } from 'vue'
import { storeToRefs } from 'pinia'

import type { Navigation } from '@/declare/routes'
import type { AuthData, UseHook } from '@/declare/hook'
import { CustomModal } from '@/components'
import { useColorToneStore } from '@/stores/stores_colorTone'
import { useLayoutStore } from '@/stores/stores_layout'
import { defaultModuleType } from '@/i18n/i18n_setting'

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
  historyIsOpen: {
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
      }
    }
  },
  breadcrumbTitle: {
    type: Array as PropType<string[]>,
    default: () => {
      return []
    }
  }
})

const emit = defineEmits([
  'logout',
  'history-change',
  'change-page'
])

const layoutStore = useLayoutStore()
const { layout } = storeToRefs(layoutStore)

// 色調
const colorToneStore = useColorToneStore()
const { isDark } = storeToRefs(colorToneStore)

// layout1
const navIsOpen = ref(false)
onMounted(() => {
  const _navIsOpen = localStorage.getItem('navIsOpen')
  navIsOpen.value = _navIsOpen === 'true'
})

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
  ] = props.breadcrumbName

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
    historyIsOpen: props.historyIsOpen,
    authData: props.authData,

    breadcrumbName: props.breadcrumbName,
    breadcrumbTitle: props.breadcrumbTitle
  }
})

const layoutEvent = {
  logout: () => emit('logout'),
  historyChange: ($event: boolean) => emit('history-change', $event),
  preference: () => {
    modal.preference = true
  },
  changePage: () => emit('change-page')
}

// modal
const preferenceRef = ref(null)
const modal = reactive({
  preference: false
})

const layout1Ref = ref()
const layout2Ref = ref()

const init =  async () => {
    await nextTick()

    setTimeout(() => {
      switch (layout.value) {
        case 'layout1':
          layout1Ref.value.init()
          break
        case 'layout2':
          layout2Ref.value.init()
          break
      }
    }, 100)
  }

defineExpose({
  setModalView: async () => {
    await nextTick()

    navIsOpen.value = false
    emit('history-change', false)
  },
  init
})

const onChangeLayout = () => {
  init()
}

const onHistoryChange = ($event: boolean) => {
  emit('history-change', $event)
}

</script>

<template>
  <div class="system-layout">
    <div class="user-modal">
      <CustomModal
        v-model="modal.preference"
        hidden-footer
        draggable
        click-outside
      >
        <template #header>
          <label>{{ i18nTranslate('preference') }}</label>
        </template>
        <UserPreference
          ref="preferenceRef"
          :is-dark="isDark"
          :history-is-open="props.historyIsOpen"
          @history-change="onHistoryChange"
          @change-layout="onChangeLayout"
        />
      </CustomModal>
    </div>

    <Layout1
      ref="layout1Ref"
      v-if="layout === 'layout1'"
      v-model:is-open="navIsOpen"
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
