<script>
import throttle from '@/lib/throttle'
import debounce from '@/lib/debounce'
import { deepClone } from '@/lib/utils'
// import vClickOutside from 'click-outside-vue3'

export default {
  name: 'v-fixed',
  data () {
    return {
      isShow: false,

      elAttr: {
        left: 0,
        top: 0,
        width: 0,
        height: 0
      },
      text: '',
      textClass: null,
      textStyle: null,

      mousePos: {
        left: 0,
        top: 0
      },
      timer: null,

      throttleOnWheelChange: throttle(this.close, 150, { noLeading: true }),
      debounceOpen: debounce(this.open, 100),
      debounceSetMousePos: debounce(this.setMousePos, 100)
    }
  },
  watch: {
    isShow (newValue) {
      if (newValue) {
        window.addEventListener('mouseover', this.debounceSetMousePos)
        this.openTimer()
      } else {
        window.removeEventListener('mouseover', this.debounceSetMousePos)
        this.$set(this.mousePos, 'left', 0)
        this.$set(this.mousePos, 'top', 0)
        this.closeTimer()
      }
    }
  },
  computed: {
    fixedStyle ({ elAttr, textStyle }) {
      const type = Object.prototype.toString.call(textStyle)

      let strStyle = `left: ${elAttr.left}px; top: ${elAttr.top}px;`

      switch (type) {
        case '[object Object]':
          return {
            left: `${elAttr.left}px`,
            top: `${elAttr.top}px`,
            ...textStyle
          }

        case '[object String]':
          return strStyle += textStyle

        case '[object Null]':
        default:
          return strStyle
      }
    },
    fixedClass ({ isShow, textClass }) {
      const type = Object.prototype.toString.call(textClass)

      switch (type) {
        case '[object Array]':
          return [{ hovering: isShow }].concat(textClass)

        case '[object Object]':
          return {
            ...textClass,
            hovering: isShow
          }

        case '[object Null]':
        default:
          return isShow ? 'hovering' : ''
      }
    }
  },
  methods: {
    open (elAttr, options) {
      this.settingAttr(elAttr, options)
      this.isShow = true
    },
    close () {
      this.isShow = false
      this.settingAttr()
    },
    settingAttr (elAttr = {}, options = {}) {
      elAttr = {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        ...elAttr
      }
      options = {
        text: '',
        textClass: null,
        textStyle: null,
        ...options
      }

      this.elAttr = deepClone({}, elAttr)

      this.text = options.text
      this.textClass = options.textClass
      this.textStyle = options.textStyle
    },
    setMousePos (e) {
      this.$set(this.mousePos, 'left', e.clientX)
      this.$set(this.mousePos, 'top', e.clientY)
    },
    // 滑鼠超出範圍 關閉fixed
    openTimer (tolerance = 50) {
      this.timer = setInterval(() => {
        let { left, top, width, height } = this.elAttr
        let { left: mouseLeft, top: mouseTop} = this.mousePos

        if (
          mouseLeft + tolerance < left ||
          mouseLeft > left + width + tolerance ||
          mouseTop + tolerance < top ||
          mouseTop > top + height + tolerance
        ) {
          this.close()
        }
      }, 500)
    },
    closeTimer () {
      clearInterval(this.timer)
    }
  }
}

</script>

<template>
  <div
    v-click-outside="close"
    class="fixed-wrapper"
    :class="fixedClass"
    :style="fixedStyle"
    @mouseleave="close"
    @wheel="throttleOnWheelChange"
  >
    {{ text }}
  </div>
</template>

<style lang="scss" scoped>
.fixed {
  &-wrapper {
    width: fit-content;
    height: fit-content;
    color: #444;
    background-color: #ffce6b;
    border-radius: 6px;
    margin: -2px -4px;
    padding: 2px 4px;
    cursor: default;
    position: fixed;

    transition: transform 0.3s, opacity 0.3s;
    transform: translateX(0px);
    opacity: 0;
    &.hovering {
      transform: translateX(1px);
      opacity: 1;
    }
  }
}
</style>