<script setup lang="ts">
import type { Hook } from '@/declare/hook'
import type { AuthData } from '@/stores/api'
import { CustomIcon, CustomTooltip } from '@/components'
import { inject } from 'vue'

const hook: Hook = inject('hook')
const { eventList, i18nTranslate } = hook()

const props = defineProps<{
  historyIsOpen: boolean
  authData: AuthData
}>()

const emit = defineEmits<{
  (e: 'logout'): void
  (e: 'changeHistory', value: boolean): void
  (e: 'preferences'): void
}>()

const openUserEffect = (e: MouseEvent) => {
  eventList(e, [
    {
      icon: ['fas', 'right-from-bracket'],
      label: i18nTranslate('logout'),
      event: () => emit('logout')
    },
    {
      icon: ['fas', 'gear'],
      label: i18nTranslate('preferences'),
      event: () => emit('preferences')
    },
    {
      icon: ['fas', props.historyIsOpen ? 'eye-slash' : 'history'],
      label: `${props.historyIsOpen ? i18nTranslate('hidden') : i18nTranslate('show') }${i18nTranslate('pagination')}`,
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
  <div class="user-wrapper">
    <div class="user-container" @click="openUserEffect">
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
    gap: 8px;
    align-items: center;
  }
  &-xs {
    display: none;
  }

  @media (max-width: 768px) {
    &-md {
      display: none;
    }
    &-xs {
      display: block;
    }
  }
}
</style>
