<script setup lang="ts">
import { ref, inject } from 'vue'
import { ElAnchor, ElAnchorLink } from 'element-plus'

import type { UseHook } from '@/declare/hook'
import { getUuid, isEmpty } from '@/lib/lib_utils' // 工具

import type { Emits, Expose } from './CustomAnchorInfo'
import { version, props as anchorProps } from './CustomAnchorInfo'

const scopedId = getUuid(version)

const props = defineProps({ ...anchorProps })

const emit = defineEmits(['change', 'click'])

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook({
  i18nModule: props.i18nModule
})
const getText = (text: string, i18nText: string | string[]) => {
  if (isEmpty(i18nText)) return text ?? ''
  return i18nTranslate(i18nText)
}

const onChange: Emits.Change = (href: string) => {
  emit('change', href)
}
const onClick: Emits.Click = ($event: MouseEvent, href?: string) => {
  emit('click', $event, href)
  $event.preventDefault()
}

const anchorRef = ref()
const scrollTo: Expose.ScrollTo = (href: string) => {
  anchorRef.value?.scrollTo(href)
}

defineExpose({
  scrollTo
})

</script>

<template>
  <ElAnchor
    ref="anchorRef"
    :container="props.container"
    :offset="props.offset"
    :bound="props.bound"
    :duration="props.duration"
    :marker="props.marker"
    :type="props.type"
    :direction="props.direction"
    :class="scopedId"
    @change="onChange"
    @click="onClick"
  >
    <ElAnchorLink
      v-for="(link, linkIndex) in props.links"
      :key="`link-${linkIndex}-${scopedId}`"
      :title="link.title"
      :href="link.href"
    >
      <template #default>
        <slot name="default" v-bind="link">
          <span>{{ getText(link.title, link.i18nTitle) }}</span>
        </slot>
      </template>

      <template v-if="Array.isArray(link.links) && link.links.length > 0" #sub-link>
        <ElAnchorLink
          v-for="(subLink, subLinkIndex) in link.links"
          :key="`sub-link-${subLinkIndex}-${scopedId}`"
          :title="subLink.title"
          :href="subLink.href"
        >
          <slot name="sub-link" v-bind="subLink">
            <span>{{ getText(subLink.title, subLink.i18nTitle) }}</span>
          </slot>
        </ElAnchorLink>
      </template>
    </ElAnchorLink>
  </ElAnchor>
</template>

<style lang="scss" scoped>
div[class*="__CustomAnchor"] {
  font-size: 1.2em;
}
</style>
