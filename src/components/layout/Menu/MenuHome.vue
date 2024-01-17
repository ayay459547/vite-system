<script setup lang="ts">
import { inject } from 'vue'
import { useRouter } from 'vue-router'

import type { UseHook } from '@/declare/hook'
import { CustomIcon, CustomTooltip } from '@/components'

const hook: UseHook = inject('useHook')
const { i18nTranslate } = hook()

const router = useRouter()

const emit = defineEmits(['routerChange'])

const toHome = () => {
  emit('routerChange')
  router.push({ name: 'home' })
}

</script>

<template>
  <div class="home-conatiner" @click="toHome">
    <div class="home-md">
      <CustomIcon name="home" class="icon"/>
      <span>{{ i18nTranslate('home') }}</span>
    </div>

    <div class="home-xs">
      <CustomTooltip>
        <CustomIcon name="home"/>

        <template #content>
          <span>{{ i18nTranslate('home') }}</span>
        </template>
      </CustomTooltip>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {
  &-conatiner {
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
