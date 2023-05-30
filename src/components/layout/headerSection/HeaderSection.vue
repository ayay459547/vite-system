<script setup lang="ts">
import type { WritableComputedRef, ComputedRef } from 'vue'
import { ref, computed, inject } from 'vue'

import HamburgerIcon from './HamburgerIcon.vue'
import { useRoutesStore } from '@/stores/routes'

import { options as langOptions } from '@/i18n/i18n'
import { useLocaleStore } from '@/stores/locale'
import type { Hook, EventItem } from '@/declare/hook'

import { useRouter } from 'vue-router'

import { CustomIcon, CustomTooltip } from '@/components'

import { useAuthStore } from '@/stores/auth'

const props = defineProps<{
  isOpen: boolean,
  historyIsOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
  (e: 'changeHistory', value: boolean): void
}>()

const tempIsOpen: WritableComputedRef<boolean> = computed({
  get: () => props.isOpen,
  set: value => emit('update:isOpen', value)
})

const routesStore = useRoutesStore()

type Breadcrumb = {
  type: string
  name: string
}
const currentPath:ComputedRef<Breadcrumb[]> = computed(() => {
  return routesStore.breadcrumbTitle.reduce((res: Breadcrumb[], crumb, crumbIndex): Breadcrumb[] => {
    if (crumbIndex === 0){
      res.push({
        type: 'text',
        name: crumb
      })
    } else {
      res.push({
        type: 'icon',
        name: '/'
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

// auth
const authStore = useAuthStore()
const { userName, clearToken } = authStore

const localeStore = useLocaleStore()

const hook: Hook = inject('hook')
const { eventList, loading } = hook()

const langCallbackList = computed<EventItem[]>(() => {
  return langOptions.map(option => {
    return {
      icon: [],
      label: option.label,
      event: () => {
        localeStore.currentLang = option.value
      }
    }
  })
})

const openLangType = (e: MouseEvent) => {
  eventList(e, langCallbackList.value, { width: 150 })
}

const router = useRouter()
const isFullScreen = ref(false)
const toggleFullScreen = () => {
  if (isFullScreen.value) {
    if (document.exitFullscreen) {
      document.exitFullscreen()
      isFullScreen.value = false
    }
  } else {
    document.documentElement.requestFullscreen()
    isFullScreen.value = true
  }
}

const openUserEffect = (e: MouseEvent) => {
  eventList(e, [
    {
      icon: ['fas', 'right-from-bracket'],
      label: '登出',
      event: () => {
        loading(true, '登出中')
        clearToken()
        router.push({ name: 'login' })

        setTimeout(() => {
          loading(false)
        }, 480)
      }
    },
    {
      icon: ['fas',  isFullScreen.value ? 'window-restore' : 'expand'],
      label: isFullScreen.value ? '視窗模式' : '全螢幕模式',
      event: () => {
        toggleFullScreen()
      }
    },
    {
      icon: ['fas', props.historyIsOpen ? 'eye-slash' : 'history'],
      label: `${props.historyIsOpen ? '隱藏' : '顯示' }路由選項`,
      event: () => {
        emit('changeHistory', !props.historyIsOpen)
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
      <HamburgerIcon v-model:isOpen="tempIsOpen"></HamburgerIcon>

      <div class="header-breadcrumb-lg">
        <template v-for="(path, pathIndex) in currentPath" :key="pathIndex">
            <span v-if="path.type === 'text'">{{ path.name }}</span>
            <span v-else style="font-weight: 600;">{{ ' / ' }}</span>
          </template>
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
          <span>{{ userName }}</span>
        </div>
        <div class="user-xs">
          <CustomTooltip>
            <CustomIcon name="user"/>

            <template #content>
              <span>{{ userName }}</span>
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

  &-breadcrumb-lg {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
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