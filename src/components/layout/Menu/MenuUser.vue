<script setup lang="ts">
import { inject, computed } from 'vue'
import { storeToRefs } from 'pinia'

import type { UseHook } from '@/types/types_hook' // 全域功能類型
import { getCookie } from '@/lib/lib_storage'
import { defaultModuleType } from '@/declare/declare_i18n'
import { useAuthStore } from '@/stores/useAuthStore'

import CustomIcon from '@/components/feature/CustomIcon/CustomIcon.vue'
import CustomTooltip from '@/components/feature/CustomTooltip/CustomTooltip.vue'

const useHook = inject('useHook') as UseHook
const { eventList, i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

const authStore = useAuthStore()
const { authData } = storeToRefs(authStore)

const emit = defineEmits<{
  (e: 'preference'): void
  (e: 'logout'): void
}>()

const openUserEffect = (e: MouseEvent) => {
  eventList(
    e,
    [
      {
        id: 'menu-user-preference',
        icon: ['fas', 'gear'],
        label: i18nTranslate('preference'),
        event: () => emit('preference')
      },
      {
        id: 'menu-user-logout',
        icon: ['fas', 'right-from-bracket'],
        label: i18nTranslate('logout'),
        event: () => emit('logout')
      }
    ],
    { width: 200 }
  )
}

const userName = computed(() => {
  return authData.value?.user?.loginName ?? ''
})

const loginTime = computed(() => {
  const __loginTime__ = getCookie('loginTime') ?? ''
  return __loginTime__.split('_').join(' ')
})
</script>

<template>
  <div class="menu-user-container" @click="openUserEffect">
    <CustomTooltip
      placement="left"
      :show-after="1000"
      :offset="6"
      :enterable="false"
    >
      <div class="menu-user-icon">
        <CustomIcon name="user" />
        <div class="menu-user-md-hidden">
          <span>{{ userName }}</span>
        </div>
      </div>

      <template #content>
        <div class="menu-user-content">
          <div>
            <span>{{ `${i18nTranslate('users')} : ` }}</span>
            <span>{{ userName }}</span>
          </div>

          <div>
            <span>{{ `${i18nTranslate('login')}${i18nTranslate('time')} : ` }}</span>
            <span>{{ loginTime }}</span>
          </div>
        </div>
      </template>
    </CustomTooltip>
  </div>
</template>

<style lang="scss" scoped>
.menu-user {
  &-container {
    width: fit-content;
    height: fit-content;
    cursor: pointer;
  }
  &-icon {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  &-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 1.1rem;
  }

  &-md-hidden {
    display: block;
  }
  @media (max-width: 768px) {
    &-md-hidden {
      display: none;
    }
  }
}
</style>
