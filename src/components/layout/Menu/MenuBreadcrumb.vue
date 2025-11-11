<script setup lang="ts">
import type { ComputedRef } from 'vue'
import { computed, inject } from 'vue'
import { storeToRefs } from 'pinia'

import type { UseHook } from '@/types/types_hook' // 全域功能類型
import { defaultModuleType } from '@/declare/declare_i18n'
import { useRoutesStore } from '@/stores/useRoutesStore'

import CustomIcon from '@/components/feature/CustomIcon/CustomIcon.vue'
import CustomTooltip from '@/components/feature/CustomTooltip/CustomTooltip.vue'

type TextAlign = 'start' | 'end'
type Breadcrumb = {
  type: string
  name: string
}

const useHook = inject('useHook') as UseHook
const { i18nTest, i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

const props = defineProps<{
  textAlign: TextAlign
}>()

const emit = defineEmits<{
  (e: 'setRouter', value: string[]): void
}>()


// 路由
const routesStore = useRoutesStore()
const { breadcrumbName, breadcrumbTitle } = storeToRefs(routesStore)

const currentPath: ComputedRef<Breadcrumb[]> = computed(() => {
  return breadcrumbName.value.reduce((res: Breadcrumb[], crumb, crumbIndex): Breadcrumb[] => {
    const name = i18nTest(crumb) ? i18nTranslate(crumb) : breadcrumbTitle.value[crumbIndex]

    if (crumbIndex === 0) {
      res.push({ type: 'text', name })
    } else {
      res.push({ type: 'icon', name: ' / ' }, { type: 'text', name })
    }
    return res
  }, [])
})

const onBreadcrumbTextClick = (index: number) => {
  const targetLength = Math.floor(index / 2)
  const targetRoutePath = breadcrumbName.value.slice(0, targetLength + 1)

  emit('setRouter', targetRoutePath)
}
</script>

<template>
  <div class="breadcrumb-container">
    <div class="breadcrumb-lg" :class="props.textAlign">
      <CustomIcon
        name="location-dot"
        class="breadcrumb-icon"
        icon-class="text-danger"
      />
      <div class="breadcrumb-path">
        <div
          v-for="(item, index) in currentPath"
          :key="index"
          class="breadcrumb-text"
          @click="onBreadcrumbTextClick(index)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>

    <div class="breadcrumb-xs">
      <CustomTooltip trigger="click" placement="right" :show-after="300">
        <CustomIcon
          name="location-dot"
          class="breadcrumb-icon"
          icon-class="text-danger"
        />
        <template #content>
          <div class="breadcrumb-path">
            <div
              v-for="(item, index) in currentPath"
              :key="index"
              class="breadcrumb-text"
              @click="onBreadcrumbTextClick(index)"
            >
              {{ item.name }}
            </div>
          </div>
        </template>
      </CustomTooltip>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.breadcrumb {
  &-container {
    width: 100%;
    max-width: 50vw;
    height: fit-content;
    display: flex;
    align-items: flex-end;
    gap: 8px;
  }

  &-icon {
    position: relative;
  }
  &-path {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  &-text {
    cursor: pointer;
    font-size: 18px;
    transition: 0.3s color;
    color: var(--i-color-breadcrumb-text);
    &:hover {
      color: var(--i-color-breadcrumb-text-hover);
    }
  }

  &-lg {
    width: 100%;
    height: fit-content;
    display: flex;
    align-items: center;
    flex: 1;
    position: relative;
    gap: 8px;
    &.start {
      justify-content: flex-start;
    }
    &.end {
      justify-content: flex-end;
    }
  }
  &-xs {
    display: none;
  }

  @media (max-width: 992px) {
    &-lg {
      display: none;
    }
    &-xs {
      display: block;
    }
  }
}
</style>
