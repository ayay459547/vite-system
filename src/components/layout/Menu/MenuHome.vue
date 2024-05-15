<script setup lang="ts">
import { inject } from 'vue'
import { useRouter } from 'vue-router'

import type { UseHook } from '@/declare/hook'
import { CustomIcon, CustomTooltip } from '@/components'
import { defaultModuleType } from '@/i18n/i18n_setting'

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

const router = useRouter()

const emit = defineEmits(['routerChange'])

const toHome = () => {
  emit('routerChange')
  router.push({ name: 'locatehome' })
}
</script>

<template>
  <div class="locatehome-conatiner" @click="toHome">
    <div class="locatehome-md">
      <CustomIcon name="home" class="icon" />
      <span>{{ i18nTranslate('locatehome', defaultModuleType) }}</span>
    </div>

    <div class="locatehome-xs">
      <CustomTooltip>
        <CustomIcon name="home" />

        <template #content>
          <span>{{ i18nTranslate('locatehome', defaultModuleType) }}</span>
        </template>
      </CustomTooltip>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.locatehome {
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
