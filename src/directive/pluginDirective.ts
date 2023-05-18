import type { App } from 'vue'

// 點擊組件外觸發事件
import vClickOutside from 'click-outside-vue3'

// element plus
import { vLoading } from 'element-plus'

const pluginDirective = {
  install (app: App): void {
    app.use(vClickOutside)
    app.directive('loading', vLoading)
  }
}

export default pluginDirective