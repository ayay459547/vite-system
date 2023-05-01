<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoutesStore } from '@/stores/routes'

const currentTab = ref('')
const routesStore = useRoutesStore()
const { historyNavigation } = storeToRefs(routesStore)

const tabs = computed(() => {
  const res = []
  historyNavigation.value.forEach((value, key) => {
    res.push({ key, value })
  })
  return res
})

const log = () => {
  console.log(historyNavigation.value)
}

</script>

<template>
  <div class="history-wrapper">
    <AdvantTabs
      v-model="currentTab"
      :list="tabs"
      class="history-tabs"
    >
      <template #default="slotProps">
        {{ slotProps.data.title }}
      </template>
    </AdvantTabs>
    <div class="history-clear" @click="log">test</div>
  </div>
</template>

<style lang="scss" scoped>
.history {
  &-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
  }
  &-tabs {
    width: inherit;
    flex: 1;
  }
  &-clear {
    width: 56px;
    @extend %flex-center;
  }
}
</style>