<script setup lang="ts">
import { type ComputedRef, computed, inject } from 'vue'

import type { UseHook } from '@/declare/hook' // 全域功能類型
import { CustomIcon, CustomTooltip } from '@/components' // 系統組件
import { defaultModuleType } from '@/i18n/i18n_setting'

type TextAlign = 'start' | 'end'

const useHook: UseHook = inject('useHook')
const { i18nTest, i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

const props = defineProps<{
  breadcrumbName: string[]
  breadcrumbTitle: string[]
  textAlign: TextAlign
}>()

const emit = defineEmits<{
  (e: 'setRouter', value: string[]): void
}>()

type Breadcrumb = {
  type: string
  name: string
}
const currentPath: ComputedRef<Breadcrumb[]> = computed(() => {
  return props.breadcrumbName.reduce((res: Breadcrumb[], crumb, crumbIndex): Breadcrumb[] => {
    const name = i18nTest(crumb) ? i18nTranslate(crumb) : props.breadcrumbTitle[crumbIndex]

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
  const targetRoutePath = props.breadcrumbName.slice(0, targetLength + 1)

  emit('setRouter', targetRoutePath)
}
</script>

<template>
  <div class="breadcrumb-container">
    <div class="breadcrumb-lg" :class="props.textAlign">
      <CustomIcon name="location-dot" class="breadcrumb-icon" icon-class="text-danger" />
      <div
        v-for="(item, index) in currentPath"
        :key="index"
        class="breadcrumb-path"
        @click="onBreadcrumbTextClick(index)"
      >
        {{ item.name }}
      </div>
    </div>

    <div class="breadcrumb-xs">
      <CustomTooltip placement="right">
        <CustomIcon name="location-dot" class="breadcrumb-icon" icon-class="text-danger" />

        <template #content>
          <div
            v-for="(item, index) in currentPath"
            :key="index"
            class="breadcrumb-text"
            @click="onBreadcrumbTextClick(index)"
          >
            <div v-if="item.type === 'text'">{{ item.name }}</div>
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
    height: fit-content;
  }

  &-icon {
    position: relative;
  }
  &-text {
    cursor: pointer;
    padding: 8px;
    font-size: 1.5em;
  }
  &-path {
    cursor: pointer;
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
      .icon,
      .text {
        position: absolute;
        cursor: pointer;
      }
      .text {
        max-width: 100%;
        width: fit-content;
        // 文字超出 ellipsis
        left: 36px;
      }
    }
    &.end {
      justify-content: flex-end;
      gap: 12px;
    }

    &.end {
      .icon,
      .text {
        cursor: pointer;
      }
      .text {
        max-width: 100%;
        width: fit-content;
        // 文字超出 ellipsis
        right: 12px;
      }
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
