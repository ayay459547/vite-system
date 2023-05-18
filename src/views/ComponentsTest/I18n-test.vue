<script setup lang="ts">
import { inject } from 'vue'
import type { Hook } from '@/declare/hook'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const hook: () => Hook = inject('hook')
const { i18nTranslate } = hook()

</script>

<template>
  <div class="input-test">
    <h2 class="i-mb-md text-primary">{{ $t('test') }}</h2>
    <h2 class="i-mb-md text-primary">{{ $t('test123') }}</h2>

    <h2 class="i-mb-md text-success">{{ t('test') }}</h2>
    <h2 class="i-mb-md text-success">{{ t('test456') }}</h2>

    <h2 class="i-mb-md text-danger">{{ i18nTranslate('test') }}</h2>
    <h2 class="i-mb-md text-danger">{{ i18nTranslate('test789') }}</h2>

  </div>
</template>

<style lang="scss" scoped>
.input-test {
  width: 100%;
  height: 100%;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>