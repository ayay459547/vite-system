<script setup lang="ts">
import type { WritableComputedRef, ComputedRef } from 'vue'
import { ref, computed, inject, useSlots } from 'vue'

import HamburgerIcon from './HamburgerIcon.vue'

import { useLocaleStore } from '@/stores/stores_locale'

import { options as langOptions } from '@/i18n'
import type { Hook, EventItem } from '@/declare/hook'

import { CustomIcon, CustomTooltip } from '@/components'
import type { AuthData } from '@/stores/stores_api'

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}

const props = defineProps<{
  isOpen: boolean
  historyIsOpen: boolean
  authData: AuthData
  breadcrumbTitle: string[]
}>()

const emit = defineEmits<{
  (e: 'logout'): void
  (e: 'update:isOpen', value: boolean): void
  (e: 'changeHistory', value: boolean): void
  (e: 'changeLocale'): void
}>()

const tempIsOpen: WritableComputedRef<boolean> = computed({
  get () { return props.isOpen },
  set (value) {
    localStorage.setItem('navIsOpen', `${value}`)
    emit('update:isOpen', value)
  }
})

type Breadcrumb = {
  type: string
  name: string
}
const currentPath:ComputedRef<Breadcrumb[]> = computed(() => {
  return props.breadcrumbTitle.reduce((res: Breadcrumb[], crumb, crumbIndex): Breadcrumb[] => {
    if (crumbIndex === 0){
      res.push({
        type: 'text',
        name: crumb
      })
    } else {
      res.push({
        type: 'icon',
        name: ' / '
      }, {
        type: 'text',
        name: crumb
      })
    }

    return res
  }, [])
})

const breadcrumbSpan = computed<string>(() => {
  return currentPath.value.reduce((res, crumb) => {
    return res + crumb.name
  }, '')
})

const getBreadcrumbSpan = () => {
  return breadcrumbSpan.value
}

const localeStore = useLocaleStore()

const hook: Hook = inject('hook')
const { eventList } = hook()

const langCallbackList = computed<EventItem[]>(() => {
  return langOptions.map(option => {
    return {
      icon: [],
      label: option.label,
      event: () => {
        localeStore.currentLang = option.value
        emit('changeLocale')
      }
    }
  })
})

const openLangType = (e: MouseEvent) => {
  eventList(e, langCallbackList.value, { width: 150 })
}

const isFullScreen = ref(false)
const toggleFullScreen = () => {
  if (document.fullscreenElement) {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  } else {
    document.documentElement.requestFullscreen()
  }
}

const openUserEffect = (e: MouseEvent) => {
  if (document.fullscreenElement) {
    isFullScreen.value = true
  } else {
    isFullScreen.value = false
  }

  eventList(e, [
    {
      icon: ['fas', 'right-from-bracket'],
      label: '登出',
      event: () => emit('logout')
    },
    {
      icon: ['fas',  isFullScreen.value ? 'window-restore' : 'expand'],
      label: isFullScreen.value ? '視窗模式' : '全螢幕模式',
      event: () => toggleFullScreen()
    },
    {
      icon: ['fas', props.historyIsOpen ? 'eye-slash' : 'history'],
      label: `${props.historyIsOpen ? '隱藏' : '顯示' }分頁`,
      event: () => {
        const value = !props.historyIsOpen
        localStorage.setItem('historyIsOpen', `${value}`)
        emit('changeHistory', value)
      }
    }
  ], {
    width: 180
  })
}

</script>

<template>
  <div class="header-container">
    <div class="header-left">
      <HamburgerIcon class="header-hamburger" v-model:isOpen="tempIsOpen"></HamburgerIcon>
      <slot name="header-left"></slot>

      <div class="header-breadcrumb-lg">
        <div
          v-fixed="{
            text: getBreadcrumbSpan,
            class: 'text-white',
            style: ''
          }"
          class="text ellipsis"
        >{{ breadcrumbSpan }}</div>
      </div>
      <div class="header-breadcrumb-xs">
        <CustomTooltip>
          <CustomIcon name="location-dot" icon-class="text-danger"/>

          <template #content>
            <span>{{ breadcrumbSpan }}</span>
          </template>
        </CustomTooltip>
      </div>
    </div>

    <div class="header-right">

      <div v-if="hasSlot('header-right')" class="header-right-effect">
        <slot name="header-right"></slot>
      </div>

      <div class="header-right-effect" @click="openLangType">
        <div class="lang-md">
          <CustomIcon name="earth-americas" class="icon"/>
          <span>{{ $t('langType') }}</span>
        </div>

        <div class="lang-xs">
          <CustomTooltip>
            <CustomIcon name="earth-americas"/>

            <template #content>
              <span>{{ $t('langType') }}</span>
            </template>
          </CustomTooltip>
        </div>
      </div>

      <div class="header-right-effect"  @click="openUserEffect">
        <div class="user-md">
          <CustomIcon name="user" class="icon"/>
          <span>{{ props.authData.name }}</span>
        </div>
        <div class="user-xs">
          <CustomTooltip>
            <CustomIcon name="user"/>

            <template #content>
              <span>{{ props.authData.name }}</span>
            </template>
          </CustomTooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  &-container {
    width: 100%;
    height: 64px;

    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    font-size: 1.2em;
  }

  // 至少要 992px 才可以定住選單
  &-hamburger {
    display: none;
    @media (min-width: 992px) {
      display: block;
    }
  }

  &-breadcrumb-lg {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
    flex: 1;
    width: 100%;
    height: 40px;
    position: relative;
    .text {
      max-width: 100%;
      width: fit-content;
      line-height: 40px;

      position: absolute;
      left: 0;
      top: 0;
    }
  }
  &-breadcrumb-xs {
    display: none;
  }

  @media (max-width: 992px) {
    &-breadcrumb-lg {
      display: none;
    }
    &-breadcrumb-xs {
      display: block;
    }
  }

  &-left {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
  }

  &-right {
    display: flex;
    width: fit-content;
    align-items: center;
    gap: 8px;

    &-effect {
      display: flex;
      justify-content: flex-start;
      width: fit-content;
      align-items: center;
      padding: 8px;
      gap: 8px;
      cursor: pointer;
      overflow: hidden;
      white-space: nowrap;
      transition-duration: 0.3s;
      color: #535353;

      .lang,
      .user {
        &-md {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        &-xs {
          display: none;
        }
      }

      @media (max-width: 768px) {
        .lang,
        .user {
          &-md {
            display: none;
          }
          &-xs {
            display: block;
          }
        }
      }
      &:hover {
        color: $primary;
      }
    }
  }
}
</style>