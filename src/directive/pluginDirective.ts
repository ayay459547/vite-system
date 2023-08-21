import type { App } from 'vue'

// 點擊組件外觸發事件
import vClickOutside from 'click-outside-vue3'

// element plus
import { vLoading } from 'element-plus'

// table 滾動到底 emit load 事件
// https://yujinpan.github.io/el-table-infinite-scroll/
import { default as vElTableInfiniteScroll } from 'el-table-infinite-scroll'

// 文字懸浮
import { vFixed } from './fixed'

const pluginDirective = {
  install (app: App): void {
    app.use(vClickOutside)

    app.directive('i-loading', vLoading)
    app.directive('el-table-infinite-scroll', vElTableInfiniteScroll)

    app.directive('i-fixed', vFixed)
  }
}

export default pluginDirective