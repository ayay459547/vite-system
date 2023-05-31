<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent } from 'vue'
import type { Navigation } from '@/declare/routes'
import { CustomIcon } from '@/components'

export default defineComponent({
  name: 'FeatureTree',
  components: {
    'CustomIcon': CustomIcon
  },
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
    return {
      // 當前節點
      isListOpen: {},
      // 子節點使用
      isOpen: false,
      bindStyle: {},
      baseHeight: 56
    }
  },
  computed: {
    routes ({ tree }) {
      return tree
    },
    routesLength () {
      return this.getLength(this.routes)
    }
  },
  methods: {
    hasLeaves (route: Navigation) {
      const temp = route?.leaves ?? []

      return temp.length > 0
    },
    getLength (routes: Navigation[]) {
      return routes.reduce((res: number, curr: Navigation) => {
        if (curr.leaves && curr.leaves.length > 0) {
          res += this.getLength(curr.leaves)
        }

        return res + 1
      }, 0)
    },
    changeOpen (routeName: string) {
      const el = this.$refs[`feature-tree-${routeName}`]

      if (el) {
        this.isListOpen[routeName] = !this.isListOpen[routeName] ?? false
        el[0].changeOpenTree()
      }
    },
    changeOpenTree () {
      if (this.isOpen) {
        this.closeTree()
      } else {
        this.openTree()
      }
    },
    openTree () {
      const el = this.$refs.currentRef

      if (el) {
        this.isOpen = true
        const height = this.routesLength * this.baseHeight
        this.bindStyle = {
          'max-height': `${height}px`
        }
      }
    },
    closeTree () {
      const el = this.$refs.currentRef

       if (el) {
        this.isOpen = false
        this.bindStyle = {
          'max-height': '0px'
        }
      }
    }
  },
  created () {},
  mounted () {
    this.routes.forEach((route: Navigation) => {
      this.changeOpen(route.name)
    })
  }
})
</script>

<template>
  <ul
    ref="currentRef"
    :class="['tree-list', `level-${level}`]"
    :style="bindStyle"
  >
    <li v-for="route in routes" :key="route.name" class="tree-item">
      <div :class="['tree-item-title', `level-${level}`,]" @click="changeOpen(route.name)">
        <div :class="['tree-item-icon', isListOpen[route.name] ? 'is-open' : 'is-close']">
          <CustomIcon v-if="hasLeaves(route)" name="caret-right"/>
        </div>
        <span>{{ route.title }}</span>
      </div>

      <template v-if="hasLeaves(route)">
        <FeatureTree
          :ref="`feature-tree-${route.name}`"
          :tree="route.leaves"
          :level="level + 1"
        />
      </template>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
$base-left: 24px;
.tree {
  &-list {
    width: 100%;
    height: fit-content;
    transition-duration: 0.3s;
    overflow: hidden;
  }

  &-item {
    &-icon {
      width: 24px;
      height: 24px;
      color: #324157;
      transition-duration: 0.3s;
      @extend %flex-center;

      &.is-open {
        transform: rotateZ(90deg);
      }
      &.is-close {
        transform: rotateZ(0deg);
      }
    }
    &-title {
      padding: 16px;
      background-color: #fff;
      transition-duration: 0.2s;
      display: flex;
      align-items: center;
      gap: 12px;
      &.level-1 {
        padding-left: $base-left;
      }
      &.level-2 {
        padding-left: calc($base-left + 24px);
      }
      &.level-3 {
        padding-left: calc($base-left + 48px);
      }

      &:hover {
        background-color: #ebeef5;
      }
    }
    width: 100%;
  }
}
</style>