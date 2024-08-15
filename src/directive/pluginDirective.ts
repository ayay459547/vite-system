import type { App } from 'vue'

// 點擊組件外觸發事件
import vClickOutside from 'click-outside-vue3'

// element plus
import { vLoading, ElInfiniteScroll } from 'element-plus'

// 文字懸浮
import { vFixed } from './fixed'

const pluginDirective = {
  install(app: App): void {
    app.use(vClickOutside)

    app.directive('loading', vLoading)
    app.use(ElInfiniteScroll)

    app.directive('fixed', vFixed)
  }
}

export default pluginDirective
