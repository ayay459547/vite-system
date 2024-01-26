<script setup lang="ts">
import { useRouter } from 'vue-router'

import { CustomIcon, CustomTooltip } from '@/components'
import { useLocalI18n } from '@/lib/lib_utils'

import i18nMessage from '../i18n'

const { i18nTranslate } = useLocalI18n(i18nMessage)

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
