<script setup lang="ts">
import type { Component } from 'vue'
import { defineComponent, computed } from 'vue'

import { getUuid, hasOwnProperty } from '@/lib/lib_utils' // 工具

import { version, props as svgProps } from './CustomSvgInfo'

import SvgCommand from './Components/SvgCommand.vue'
import SvgCss from './Components/SvgCss.vue'
import SvgDefault from './Components/SvgDefault.vue'
import SvgDocx from './Components/SvgDocx.vue'
import SvgGo from './Components/SvgGo.vue'
import SvgHtml from './Components/SvgHtml.vue'
import SvgJava from './Components/SvgJava.vue'
import SvgJs from './Components/SvgJs.vue'
import SvgJson from './Components/SvgJson.vue'
import SvgLogicAND from './Components/SvgLogicAND.vue'
import SvgLogicOR from './Components/SvgLogicOR.vue'
import SvgMd from './Components/SvgMd.vue'
import SvgPDF from './Components/SvgPDF.vue'
import SvgPptx from './Components/SvgPptx.vue'
import SvgPython from './Components/SvgPython.vue'
import SvgScss from './Components/SvgScss.vue'
import SvgText from './Components/SvgText.vue'
import SvgTs from './Components/SvgTs.vue'
import SvgVue from './Components/SvgVue.vue'
import SvgXlsx from './Components/SvgXlsx.vue'
import SvgZip from './Components/SvgZip.vue'

const scopedId = getUuid(version)

const props = defineProps(svgProps)

/**
 * @description svg模板
 * @see https://www.svgrepo.com/
 */
const svgMap: Record<string, Component> = {
  bat: SvgCommand,
  css: SvgCss,
  default: SvgDefault, // 預設圖示
  docx: SvgDocx,
  go: SvgGo,
  html: SvgHtml,
  java: SvgJava,
  js: SvgJs,
  json: SvgJson,
  logicAND: SvgLogicAND,
  logicOR: SvgLogicOR,
  md: SvgMd,
  pdf: SvgPDF,
  pptx: SvgPptx,
  py: SvgPython,
  scss: SvgScss,
  txt: SvgText,
  log: SvgText,
  ts: SvgTs,
  vue: SvgVue,
  xlsx: SvgXlsx,
  zip: SvgZip,
  rar: SvgZip,
  tgz: SvgZip,
  '7z': SvgZip
}

// 確保 getIcon 是正確的 Vue 組件
const getIcon = computed((): ReturnType<typeof defineComponent> => {
  return hasOwnProperty(svgMap, props.name) ? svgMap[props.name] : svgMap.default
})
</script>

<template>
  <component :is="getIcon" :class="scopedId"></component>
</template>

<style lang="scss" scoped></style>
