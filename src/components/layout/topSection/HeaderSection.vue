<script setup lang="ts">
import type { WritableComputedRef, ComputedRef } from 'vue'
import { computed, inject } from 'vue'

import HamburgerIcon from './HamburgerIcon.vue'
import { useRoutesStore } from '@/stores/routes'

import { options as langOptions } from '@/i18n/i18n'
import { useLocaleStore } from '@/stores/locale'
import type { Hook, EventItem } from '@/declare/hook'

import { useRouter } from 'vue-router'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
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
  return routesStore.breadcrumb.reduce((res: Breadcrumb[], crumb, crumbIndex): Breadcrumb[] => {
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

const userName = 'AAT'

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

const openUserEffect = (e: MouseEvent) => {
  eventList(e, [
    {
      icon: ['fas', 'right-from-bracket'],
      label: '登出',
      event: () => {
        loading(true, '登出中')
        router.push({ name: 'login' })

        setTimeout(() => {
          loading(false)
        }, 500)
      }
    },
    {
      icon: ['fas', 'window-restore'],
      label: '視窗模式切換',
      event: () => {
        console.log('window screen change')
      }
    },
    {
      icon: ['fas', 'history'],
      label: '歷史資訊',
      event: () => {
        console.log('show history')
      }
    },
    {
      icon: ['fas', 'broom'],
      label: '清除歷史資訊',
      event: () => {
        console.log('clear history')
      }
    }
  ], {
    width: 200
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
        <CustomIcon
          name="location-dot"
          icon-class="text-danger"
          tooltip
        >
          <span>{{ breadcrumbSpan }}</span>
        </CustomIcon>
      </div>
    </div>

    <div class="header-right">
      <div class="header-right-effect" @click="openLangType">
        <div class="lang-md">
          <CustomIcon name="earth-americas" class="icon"/>
          <span>{{ $t('langType') }}</span>
        </div>

        <div class="lang-xs">
          <CustomIcon name="earth-americas" tooltip>
            <span>{{ $t('langType') }}</span>
          </CustomIcon>
        </div>
      </div>

      <div class="header-right-effect"  @click="openUserEffect">
        <div class="user-md">
          <CustomIcon name="user" class="icon"/>
          <span>{{ 'hi! ' + userName }}</span>
        </div>
        <div class="user-xs">
          <CustomIcon name="user" tooltip>
            <span>{{ 'hi! ' + userName }}</span>
          </CustomIcon>
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