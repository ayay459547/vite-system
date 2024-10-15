<script setup lang="ts">
import { inject, computed } from 'vue'

import type { UseHook, AuthData } from '@/declare/hook'
import { CustomIcon, CustomTooltip } from '@/components'
import { getCookie } from '@/lib/lib_cookie'
import { defaultModuleType } from '@/i18n/i18n_setting'

const useHook: UseHook = inject('useHook')
const { eventList, i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

const props = defineProps<{
  authData: AuthData
}>()

const emit = defineEmits<{
  (e: 'logout'): void
  (e: 'preference'): void
}>()

const openUserEffect = (e: MouseEvent) => {
  eventList(
    e,
    [
      {
        icon: ['fas', 'gear'],
        label: i18nTranslate('preference', defaultModuleType),
        event: () => emit('preference')
      },
      {
        icon: ['fas', 'right-from-bracket'],
        label: i18nTranslate('logout', defaultModuleType),
        event: () => emit('logout')
      }
    ],
    {
      width: 180
    }
  )
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
        <CustomTooltip placement="bottom">
          <div class="user-md">
            <CustomIcon name="user" class="icon" />
            <span>{{ userName }}</span>
          </div>

          <template #content>
            <div @click="openUserEffect">
              <span>{{ `${i18nTranslate('login', defaultModuleType)}${i18nTranslate('time')} : ` }}</span>
              <span>{{ loginTime }}</span>
            </div>
          </template>
        </CustomTooltip>
      </div>
      <div class="user-xs">
        <CustomTooltip placement="bottom">
          <CustomIcon name="user" />

          <template #content>
            <div class="user-xs" @click="openUserEffect">
              <span>{{ userName }}</span>
              <div>
                <span>{{ `${i18nTranslate('login', defaultModuleType)}${i18nTranslate('time')} : ` }}</span>
                <span>{{ loginTime }}</span>
              </div>
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
