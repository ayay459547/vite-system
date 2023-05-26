import type { App } from 'vue'

// 點擊組件外觸發事件
import vClickOutside from 'click-outside-vue3'

// element plus
import { vLoading } from 'element-plus'

// 文字懸浮
import { debounceCreateHandler, removeHandler } from './fixed'

const mouseenter = 'mouseenter'
const mouseleave = 'mouseleave'

const pluginDirective = {
  install (app: App): void {
    app.use(vClickOutside)
    app.directive('loading', vLoading)

    app.directive('fixed', {
      updated (el, { value: options }) {
        el.addEventListener(mouseenter, debounceCreateHandler.bind(el, options))
        el.addEventListener(mouseleave, removeHandler.bind(el, options))
      },
      mounted (el, { value: options }) {
        el.addEventListener(mouseenter, debounceCreateHandler.bind(el, options))
        el.addEventListener(mouseleave, removeHandler.bind(el, options))
      },
      unmounted (el, { value: options }) {
        el.removeEventListener(mouseenter, debounceCreateHandler.bind(el, options))
        el.removeEventListener(mouseleave, removeHandler.bind(el, options))
      }
    })
  }
}

export default pluginDirective