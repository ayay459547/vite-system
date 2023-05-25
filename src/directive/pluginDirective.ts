import type { App } from 'vue'

// 點擊組件外觸發事件
import vClickOutside from 'click-outside-vue3'

// element plus
import { vLoading } from 'element-plus'

// 文字懸浮
import { createhandler, removehandler } from './fixed'

const mouseenter = 'mouseenter'
const mouseleave = 'mouseleave'

const pluginDirective = {
  install (app: App): void {
    app.use(vClickOutside)
    app.directive('loading', vLoading)

    app.directive('fixed', {
      updated (el, { value: options }) {
        el.addEventListener(mouseenter, createhandler.bind(el, options))
        el.addEventListener(mouseleave, removehandler.bind(el, options))
      },
      mounted (el, { value: options }) {
        el.addEventListener(mouseenter, createhandler.bind(el, options))
        el.addEventListener(mouseleave, removehandler.bind(el, options))
      },
      unmounted (el, { value: options }) {
        el.removeEventListener(mouseenter, createhandler.bind(el, options))
        el.removeEventListener(mouseleave, removehandler.bind(el, options))
      }
    })
  }
}

export default pluginDirective