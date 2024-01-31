<script setup lang="ts">
import { type ComputedRef, computed, inject } from 'vue'

import type { UseHook } from '@/declare/hook'
import { CustomIcon, CustomTooltip } from '@/components'

type TextAlign = 'start' | 'end'

const useHook: UseHook = inject('useHook')
const { i18nTest, i18nTranslate } = useHook()

const props = defineProps<{
  breadcrumbName: string[]
  breadcrumbTitle: string[]
  textAlign: TextAlign
}>()

type Breadcrumb = {
  type: string
  name: string
}
const currentPath:ComputedRef<Breadcrumb[]> = computed(() => {
  return props.breadcrumbName.reduce((res: Breadcrumb[], crumb, crumbIndex): Breadcrumb[] => {
    const name = i18nTest(crumb) ? i18nTranslate(crumb) : props.breadcrumbTitle[crumbIndex]


    if (crumbIndex === 0){
      res.push({ type: 'text', name })
    } else {
      res.push(
        { type: 'icon', name: ' / '},
        { type: 'text', name }
      )
    }

    return res
  }, [])
})

const breadcrumbSpan = computed<string>(() => {
  return currentPath.value.reduce((res, crumb) => {
    return res + crumb.name
  }, '')
})

</script>

<template>
  <div class="breadcrumb-container">
    <div class="breadcrumb-lg" :class="props.textAlign">
      <CustomIcon
        name="location-dot"
        class="icon"
        icon-class="text-danger"
      />
      <div class="text ellipsis">{{ breadcrumbSpan }}</div>
    </div>

    <div class="breadcrumb-xs">
      <CustomTooltip placement="right">
        <CustomIcon
          name="location-dot"
          class="breadcrumb-icon"
          icon-class="text-danger"
        />

        <template #content>
          <div class="breadcrumb-text">{{ breadcrumbSpan }}</div>
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

  &-text {
    padding: 8px;
    font-size: 1.5em;
  }

  &-lg {
    width: 100%;
    height: fit-content;
    display: flex;
    align-items: center;
    flex: 1;
    position: relative;
    &.start {
      .icon,
      .text {
        position: absolute;
      }
      .text {
        max-width: 100%;
        width: fit-content;
        // 文字超出 ellipsis
        left: 26px;
      }
    }
    &.end {
      justify-content: flex-end;
      gap: 12px;
    }

    &.end {
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
