<script setup lang="ts">
// Composition API
import { useSlots, inject } from 'vue'
import { useRouter } from 'vue-router'

// 引入類型
import type { UseHook } from '@/declare/hook'
// 引入組件原型
import { ElLink } from 'element-plus'
import { CustomTooltip, CustomIcon } from '@/components'
// 工具包
import { aesEncrypt, getUuid } from '@/lib/lib_utils'
// 組件參數設定
import { version, props as linkProps } from './CustomLinkInfo'

// 接收 GlobalView.vue 的 useHook
const useHook: UseHook = inject('useHook')
const { env, i18nTranslate, i18nTest } = useHook()

const scopedName = '__i-link__'
const scopedId = getUuid(scopedName)

const props = defineProps(linkProps)

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}
const router = useRouter()
const newWindow = (link: any) => {

  const fromPage = link?.fromPage ?? props.fromPage
  const toPage = link.toPage
  const storageKey = link?.storageKey ?? props?.storageKey
  const data =  link?.data ?? props?.data
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

const getI18nTranslate = link => {
  if (i18nTest(link?.i18nDescription)) return i18nTranslate(link?.i18nDescription)
  if (link?.description) return link.description

  return i18nTranslate(link.toPage)
}

</script>

<template>
  <div
    :class="[
      `CustomLinkInfo_${version}`,
      scopedId,
      scopedName
    ]"
  >
    <CustomTooltip
      placement="right"
      :offset="10"
      :show-after="200"
    >
      <template v-if="hasSlot('default')">
        <slot name="default"></slot>
      </template>
      <template v-else>
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
      </template>

      <template #content>
        <div class="tooltip-options">
          <template v-for="(link) in props.options" :key="link">
            <div>
              <ElLink
                :type="props.type"
                :underline="props.underline"
                :disabled="link?.disabled"
                @click="newWindow(link)"
              >
                {{ getI18nTranslate(link) }}
              </ElLink>
            </div>
          </template>
        </div>
      </template>
    </CustomTooltip>
  </div>
</template>

<style lang="scss" scoped>
.__i-link__ .tooltip {
  &-default {
    width: fit-content;
    display: flex;
    gap: 8px;

    &-icon {
      color: #409eff;
    }
    // &-text {
    // }
  }
  &-options {
    display: flex;
    flex-direction: column;
    padding: 4px;
    gap: 4px;
  }
}
</style>
