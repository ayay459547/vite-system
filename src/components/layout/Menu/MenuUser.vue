<script setup lang="ts">
import { inject, computed } from 'vue'

import type { UseHook } from '@/declare/hook'
import type { AuthData } from '@/declare/hook'
import { CustomIcon, CustomTooltip } from '@/components'
import { useLocalI18n } from '@/lib/lib_utils'
import { getCookie } from '@/lib/lib_cookie'

import i18nMessage from '../i18n'

const useHook: UseHook = inject('useHook')
const { eventList } = useHook()

const { i18nTranslate } = useLocalI18n(i18nMessage)

const props = defineProps<{
  authData: AuthData
}>()

const emit = defineEmits<{
  (e: 'logout'): void
  (e: 'preference'): void
}>()

const openUserEffect = (e: MouseEvent) => {
  eventList(e, [
    {
      icon: ['fas', 'gear'],
      label: i18nTranslate('preference'),
      event: () => emit('preference')
    },
    {
      icon: ['fas', 'right-from-bracket'],
      label: i18nTranslate('logout'),
      event: () => emit('logout')
    }
  ], {
    width: 180
  })
}

const userName = computed(() => {
  return props.authData?.user?.loginName ?? ''
})

const loginTime = computed(() => {
  const _loginTime = getCookie('loginTime') ?? ''
  return _loginTime.split('_').join(' ')
})

</script>

<template>
  <div class="user-wrapper">
    <div class="user-container" @click="openUserEffect">
      <div class="user-md">
        <CustomTooltip>
          <div class="user-md">
            <CustomIcon name="user" class="icon"/>
            <span>{{ userName }}</span>
          </div>

          <template #content>
            <div @click="openUserEffect">
              <span>{{ loginTime }}</span>
            </div>
          </template>
        </CustomTooltip>
      </div>
      <div class="user-xs">
        <CustomTooltip>
          <CustomIcon name="user"/>

          <template #content>
            <div class="user-xs" @click="openUserEffect">
              <span>{{ userName }}</span>
              <span>{{ loginTime }}</span>
            </div>
          </template>
        </CustomTooltip>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user {
  // 防止被最外層
  &-modal {
    color: #324157;
    &:hover {
      color: #324157;
    }
  }

  &-container {
    width: fit-content;
    height: fit-content;
    cursor: pointer;
  }

  &-md {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  &-xs {
    display: none;
  }

  @media (max-width: 768px) {
    &-md {
      display: none;
    }
    &-xs {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
  }
}
</style>
