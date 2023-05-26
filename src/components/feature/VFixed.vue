<script lang="ts">
import throttle from '@/lib/throttle'
import debounce from '@/lib/debounce'
import type { PropType } from 'vue'
import { defineComponent } from 'vue'

export interface ElAttr {
  left?: number
  top?: number
  width?: number
  height?: number
}

export interface Options {
  text?: string
  textClass?: string | Record<string, any> | any[]
  textStyle?: string | Record<string, any>
}

export default defineComponent({
  name: 'v-fixed',
  props: {
    elAttr: {
      typs: Object as PropType<ElAttr>,
      default () {
        return {
          left: 0,
          top: 0,
          width: 0,
          height: 0
        }
      }
    },
    options: {
      typs: Object as PropType<Options>,
      default () {
        return {
          text: '',
          textClass: '',
          textStyle: ''
        }
      }
    }
  },
  data () {
    return {
      isShow: false,
      isHovering: false,
      mousePos: {
        left: 0,
        top: 0
      },
      // 防報錯誤訊息
      // Type 'Function' provides no match for the signature '(payload: WheelEvent): void'
      throttleOnWheelChange: throttle(this.close, 150, { noLeading: true }) as (payload: WheelEvent) => void,
      debounceSetMousePos: debounce(this.setMousePos, 100)
    }
  },
  watch: {
    isShow (newValue) {
      if (newValue) {
        window.addEventListener('mousemove', this.debounceSetMousePos)
        this.openTimer()
      } else {
        window.removeEventListener('mousemove', this.debounceSetMousePos)
        this.mousePos.left = 0
        this.mousePos.top = 0
        this.closeTimer()
      }
    }
  },
  computed: {
    fixedStyle ({ elAttr, options }) {
      const textStyle = options.textStyle
      const type = Object.prototype.toString.call(textStyle)

      let strStyle = `
        left: ${elAttr.left}px;
        top: ${elAttr.top}px;
        min-width: ${elAttr.width}px;
        min-height: ${elAttr.height}px;
      `

      switch (type) {
        case '[object Object]':
          return {
            left: `${elAttr.left}px`,
            top: `${elAttr.top}px`,
            minWidth: `${elAttr.width}px`,
            minHeight: `${elAttr.height}px`,
            ...textStyle
          }

        case '[object String]':
          return strStyle += textStyle

        case '[object Null]':
        default:
          return strStyle
      }
    },
    fixedClass ({ isHovering, options }) {
      const textClass = options.textClass
      const type = Object.prototype.toString.call(textClass)

      switch (type) {
        case '[object Array]':
          return [{ hovering: isHovering }].concat(textClass)

        case '[object Object]':
          return {
            ...textClass,
            hovering: isHovering
          }

        case '[object Null]':
        default:
          return isHovering ? 'hovering' : ''
      }
    }
  },
  methods: {
    open () {
      this.isHovering = true
    },
    close () {
      this.isHovering = false
      this.isShow = false
    },
    // 滑鼠超出範圍 關閉fixed
    setMousePos (e: MouseEvent) {
      this.mousePos.left = e.clientX
      this.mousePos.top = e.clientY
    },
    openTimer (tolerance = 50) {
      this.timer = setInterval(() => {
        const { left, top, width, height } = this.elAttr
        const { left: mouseLeft, top: mouseTop} = this.mousePos

        if (
          mouseLeft + tolerance < left ||
          mouseLeft > left + width + tolerance ||
          mouseTop + tolerance < top ||
          mouseTop > top + height + tolerance
        ) {
          this.close()
        }
      }, 480)
    },
    closeTimer () {
      clearInterval(this.timer)
    },
    async wait (delay: number) {
      await new Promise(resolve => {
        setTimeout(() => {
          resolve(delay)
        }, delay)
      })
    }
  },
  created () {
    (async function (that) {
      await that.wait(80)
      that.open()
    })(this)
    this.isShow = true
  }
})
</script>

<template>
  <div v-if="isShow">
    <div
      ref="fixed"
      class="fixed-wrapper"
      :class="fixedClass"
      :style="fixedStyle"
      @wheel="throttleOnWheelChange"
    >
      {{ options.text }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.fixed {
  &-wrapper {
    width: fit-content;
    height: fit-content;
    color: #fff;
    background-color: lighten($system-bg-color, 5%);
    border-radius: 6px;
    padding: 2px 4px;
    cursor: default;
    position: fixed;
    z-index: 99;
    pointer-events: none;
    @extend %flex-center;

    transition: transform 0.2s, opacity 0.1s;
    transform: translateX(0px);
    opacity: 0;

    &.hovering {
      transform: translateX(1px);
      opacity: 1;
    }
  }
}
</style>