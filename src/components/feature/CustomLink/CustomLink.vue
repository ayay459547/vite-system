<script setup lang="ts">
import { inject } from 'vue'
import { useRouter } from 'vue-router'

// 引入類型
import type { UseHook } from '@/declare/hook' // 全域功能類型
// 引入組件原型
import { ElLink } from 'element-plus'
import { CustomTooltip, CustomIcon } from '@/components' // 系統組件
// 工具包
import { aesEncrypt, getUuid } from '@/lib/lib_utils' // 工具
// 組件參數設定
import { version, props as linkProps } from './CustomLinkInfo'

// 接收 GlobalView.vue 的 useHook
const useHook = inject('useHook') as UseHook 
const { env, i18nTranslate, i18nTest } = useHook()

const scopedId = getUuid(version)

const props = defineProps(linkProps)

const router = useRouter()
const newWindow = (link: any) => {

  const fromPage = link?.fromPage ?? props.fromPage
  const toPage = link.toPage
  const storageKey = link?.storageKey ?? props?.storageKey
  const data = link?.data ?? props?.data
  const isModal = link?.isModal ?? false

  const currentEnv = env()

  if(storageKey) localStorage.setItem(storageKey, data)

  const queryData = aesEncrypt(storageKey ?? data, currentEnv.QUERY_KEY)

  const routeData = router.resolve({
    name: toPage,
    query: {
      from: fromPage,
      data: queryData,
      isModal: isModal ? 'true' : 'false'
    }
  })

  if (isModal) {
    window.open(
      routeData.href,
      toPage,
      `
        toolbar=no,
        menubar=no,
        width=1200,
        height=800,
        left=80,
        top=80
      `
    )
  } else {
    window.open(routeData.href, '_blank')
  }
}

const getI18nTranslate = (link: any) => {
  if (i18nTest(link?.i18nDescription)) return i18nTranslate(link?.i18nDescription)
  if (link?.description) return link.description

  return i18nTranslate(link.toPage)
}

</script>

<template>
  <div :class="scopedId">
    <CustomTooltip
      placement="right"
      :offset="10"
      :show-after="200"
    >
      <slot>
        <div class='tooltip-default'>
          <CustomIcon
            class="tooltip-default-icon"
            name="link"
            size="small"
          />
          <div class="tooltip-default-text">
            {{ props.label }}
          </div>
        </div>
      </slot>

      <template #content>
        <div class="tooltip-options">
          <template v-for="(link) in props.options" :key="`link-${link}-${scopedId}`">
            <ElLink
              :type="props.type"
              :underline="props.underline"
              :disabled="link?.disabled"
              @click="newWindow(link)"
            >
              {{ getI18nTranslate(link) }}
            </ElLink>
          </template>
        </div>
      </template>
    </CustomTooltip>
  </div>
</template>

<style lang="scss" scoped>
div[class*="__CustomLink"] .tooltip {
  &-default {
    width: fit-content;
    display: flex;
    gap: 8px;

    &-icon {
      color: var(--el-color-primary);
    }
  }
}

.tooltip {
  &-options {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 2px;
    gap: 6px;
  }
}
</style>
