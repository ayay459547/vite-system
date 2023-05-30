<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent } from 'vue'
import type { Navigation } from '@/declare/routes'

export default defineComponent({
  name: 'FeatureTree',
  props: {
    tree: {
      type: Array as PropType<Navigation[]>,
      default () {
        return []
      }
    },
    level: {
      type: Number as PropType<number>,
      default: 1
    }
  },
  data () {
    return {}
  },
  computed: {
    routes ({ tree }) {
      return tree
    },
    routesLength () {
      return this.routes.length
    }
  },
  methods: {
    hasLeaves (route: Navigation) {
      const temp = route?.leaves ?? []

      return temp.length > 0
    }
  },
  created () {},
  mounted () {}
})
</script>

<template>
  <ul
    :class="[
      'tree-list',
      `level-${level}`
    ]"
  >
    <li v-for="route in routes" :key="route.name" class="tree-item">
      <span :class="['tree-item-title', `level-${level}`]">{{ route.title }}</span>

      <template v-if="hasLeaves(route)">
        <FeatureTree
          :tree="route.leaves"
          :level="level + 1"
        >
        </FeatureTree>
      </template>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.tree {
  &-list {
    width: 100%;
    // border: 1px solid skyblue;

    &.level-1 {
      padding-left: 0;
    }
    &.level-2 {
      padding-left: 24px;
    }
    &.level-3 {
      padding-left: 48px;
    }
  }

  &-item {
    // border: 1px solid gray;
    width: 100%;
  }
}
</style>