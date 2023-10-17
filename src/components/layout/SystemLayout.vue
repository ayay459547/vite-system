<script setup lang="ts">
import Layout1 from '@/components/layout/Layout-1/Layout-1.vue'
import Layout2 from '@/components/layout/Layout-2/Layout-2.vue'

import type { Navigation } from '@/declare/routes'
import type { AuthData } from '@/stores/stores_api'

import { computed, ref, onMounted, nextTick } from 'vue'

const props = defineProps<{
  isShow: boolean

  showRoutes: Navigation[]
  currentRouteName: string
  breadcrumbName: string[]

  historyIsOpen: boolean
  authData: AuthData
  breadcrumbTitle: string[]
}>()

const emit = defineEmits<{
  (e: 'logout'): void
  (e: 'changeHistory', value: boolean): void
  (e: 'changeLocale'): void
}>()

// layout1
const navIsOpen = ref(false)
onMounted(() => {
  const _navIsOpen = localStorage.getItem('navIsOpen')
  navIsOpen.value = _navIsOpen === 'true'
})
defineExpose({
  setModalView: async () => {
    await nextTick()

    navIsOpen.value = false
    emit('changeHistory', false)
  }
})


const layoutAttr = computed(() => {
  return {
    isShow: props.isShow,

    showRoutes: props.showRoutes,
    currentRouteName: props.currentRouteName,
    breadcrumbName: props.breadcrumbName,

    historyIsOpen: props.historyIsOpen,
    authData: props.authData,
    breadcrumbTitle: props.breadcrumbTitle
  }
})

const layoutEvent = {
  logout: () => emit('logout'),
  changeHistory: ($event: boolean) => emit('changeHistory', $event),
  changeLocale: () => emit('changeLocale')
}

</script>

<template>
  <div class="system-layout">
    <Layout1
      v-model:is-open="navIsOpen"
      v-bind="layoutAttr"
      v-on="layoutEvent"
    >
      <template #menu-header="{ isShow }">
        <slot name="menu-header" :is-show="isShow"></slot>
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

    <!-- <Layout2
      v-bind="layoutAttr"
      v-on="layoutEvent"
    >
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
    </Layout2> -->
  </div>
</template>

<style lang="scss" scoped>
.system-layout {
  display: contents;
  width: 100vw;
  height: 100vh;
}
</style>
