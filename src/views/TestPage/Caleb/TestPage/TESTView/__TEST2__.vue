<script setup lang="ts">
import { ref } from 'vue'
import { CustomButton } from '@/components/feature'

const isVIf_visible = ref(true)
const isVElseIf_visible = ref(true)

const isVShow_visible = ref(true)
</script>

<template>
  <div class="i-page flex-column i-ga-md" style="width: 300px;">
    <h3 v-if="isVIf_visible">v-if</h3>
    <h3 v-else-if="isVElseIf_visible">v-else-if</h3>
    <h3 v-else>v-else</h3>

    <CustomButton @click="isVIf_visible = !isVIf_visible" type="success" plain>
      change isVIf_visible : {{ isVIf_visible }}
    </CustomButton>
    <CustomButton @click="isVElseIf_visible = !isVElseIf_visible" type="primary">
      change isVElseIf_visible : {{ isVElseIf_visible }}
    </CustomButton>

    <div class="i-my-md"></div>

    <h3 v-show="isVShow_visible">v-show</h3>
    <button @click="() => {
      isVShow_visible = !isVShow_visible
      console.log({
        isVIf_visible,
        isVElseIf_visible,
        isVShow_visible
      })
    }">change isVShow_visible</button>
  </div>
</template>

<style lang="scss" scoped></style>
