<script setup lang="ts">
import type { Hook } from '@/declare/hook'

import Layout1 from '@/components/layout/Layout-1/Layout-1.vue'
import Layout2 from '@/components/layout/Layout-2/Layout-2.vue'
import Preferences from '@/components/layout/Preferences/UserPreferences.vue'

import { CustomModal } from '@/components'

import type { Navigation } from '@/declare/routes'
import type { AuthData } from '@/stores/api'

import { useLayoutStore } from '@/stores/stores_layout'
import { storeToRefs } from 'pinia'

import { computed, ref, reactive, onMounted, inject, nextTick } from 'vue'

const hook: Hook = inject('hook')
const { i18nTranslate } = hook()

const props = defineProps<{
  isShow: boolean

  currentNavigation: Navigation
  showRoutes: Navigation[]
  breadcrumbName: string[]

  historyIsOpen: boolean
  authData: AuthData
  breadcrumbTitle: string[]
}>()

const emit = defineEmits<{
  (e: 'logout'): void
  (e: 'changeHistory', value: boolean): void
}>()

const layoutStore = useLayoutStore()
const { layout } = storeToRefs(layoutStore)

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

    breadcrumbName: props.breadcrumbName,
    currentRouteName: currentRouteName.value,

    historyIsOpen: props.historyIsOpen,
    authData: props.authData,
    breadcrumbTitle: props.breadcrumbTitle
  }
})

const layoutEvent = {
  logout: () => emit('logout'),
  changeHistory: ($event: boolean) => emit('changeHistory', $event),
  preferences: () => {
    modal.preferences = true
  }
}

// modal
const preferencesRef = ref(null)
const modal = reactive({
  preferences: false
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
    emit('changeHistory', false)
  },
  init
})

const onChangeLayout = () => {
  init()
}

</script>

<template>
  <div class="system-layout">
    <div class="user-modal">
      <CustomModal
        v-model="modal.preferences"
        hidden-footer
        click-outside
      >
        <template #header>
          <label>{{ i18nTranslate('preferences') }}</label>
        </template>
        <Preferences ref="preferencesRef" @change-layout="onChangeLayout"/>
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
