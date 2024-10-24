<script setup lang="ts">
import { ref } from 'vue'
import { ElRow, ElCol, ElAnchor, ElAnchorLink } from 'element-plus'

import { CustomDivider, CustomAnchor } from '@/components' // 系統組件

const containerRef = ref<HTMLElement | null>(null)
const containerRef2 = ref<HTMLElement | null>(null)

const handleClick = (e: MouseEvent) => {
  e.preventDefault()
}
</script>

<template>
  <div class="i-page">
    <ElRow>
      <ElCol :span="18">
        <div
          style="
            height: 30px;
            width: 70%;
            background: #000;
            position: absolute;
            top: 0;
            left: 0;
            color: #fff;
          "
        >
          Fixed Top Block
        </div>
        <div ref="containerRef2" style="height: 300px; overflow-y: auto">
          <div
            id="part4"
            style="
              height: 300px;
              background: rgba(255, 0, 0, 0.02);
              margin-top: 30px;
            "
          >
            part4
          </div>
          <div
            id="part5"
            style="
              height: 300px;
              background: rgba(0, 255, 0, 0.02);
              margin-top: 30px;
            "
          >
            part5
          </div>
          <div
            id="part6"
            style="
              height: 300px;
              background: rgba(0, 0, 255, 0.02);
              margin-top: 30px;
            "
          >
            part6
          </div>
        </div>
      </ElCol>
      <ElCol :span="6">
        <CustomAnchor
          :container="containerRef2"
          direction="vertical"
          type="default"
          :offset="30"
          :links="[
            { href: '#part4', title: 'part4' },
            { href: '#part5', title: 'part5' },
            { href: '#part6', title: 'part6' },
          ]"
          @click="handleClick"
        ></CustomAnchor>
      </ElCol>
    </ElRow>

    <CustomDivider />

    <ElRow>
      <ElCol :span="18">
        <div
          style="
            height: 30px;
            width: 70%;
            background: #000;
            position: absolute;
            top: 0;
            left: 0;
            color: #fff;
          "
        >
          Fixed Top Block
        </div>
        <div ref="containerRef" style="height: 300px; overflow-y: auto">
          <div
            id="part1"
            style="
              height: 300px;
              background: rgba(255, 0, 0, 0.02);
              margin-top: 30px;
            "
          >
            part1
          </div>
          <div
            id="part2"
            style="
              height: 300px;
              background: rgba(0, 255, 0, 0.02);
              margin-top: 30px;
            "
          >
            part2
          </div>
          <div
            id="part3"
            style="
              height: 300px;
              background: rgba(0, 0, 255, 0.02);
              margin-top: 30px;
            "
          >
            part3
          </div>
        </div>
      </ElCol>
      <ElCol :span="6">
        <ElAnchor
          :container="containerRef"
          direction="vertical"
          type="default"
          :offset="30"
          @click="handleClick"
        >
          <ElAnchorLink href="#part1" title="part1" />
          <ElAnchorLink href="#part2" title="part2" />
          <ElAnchorLink href="#part3" title="part3" />
        </ElAnchor>
      </ElCol>
    </ElRow>
  </div>
</template>

<style lang="scss" scoped></style>
