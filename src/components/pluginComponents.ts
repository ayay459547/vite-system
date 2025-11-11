import type { App } from 'vue'

/**
 * Element Plus UI
 * 1. <Transition name="el-...name"></Transition>
 * 2. CSS
 * 3. CSS變數
 * 4. CSS變數 (暗黑模式)
 */
import { ElCollapseTransition } from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

// CustomMarkdown
import 'md-editor-v3/lib/style.css'

// VueFlow
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'
import '@vue-flow/minimap/dist/style.css'
import '@vue-flow/node-resizer/dist/style.css'

// VxeTable
import 'vxe-pc-ui/styles/cssvar.scss'
import 'vxe-table/styles/cssvar.scss'

// icon
import { library } from '@fortawesome/fontawesome-svg-core'
// 全部引入
// import { fas } from '@fortawesome/free-solid-svg-icons'
// import { far } from '@fortawesome/free-regular-svg-icons'
// import { fab } from '@fortawesome/free-brands-svg-icons'

// 按需引入
import fas from './feature/CustomIcon/fontawesome/fas'
import far from './feature/CustomIcon/fontawesome/far'
import fab from './feature/CustomIcon/fontawesome/fab'
import CustomIcon from './feature/CustomIcon/CustomIcon.vue'

// button
import CustomButton from './feature/CustomButton/CustomButton.vue'

/**
 * 全域組件
 * 不引入 可直接使用
 */
const pluginComponents = {
  install(app: App): void {
    library.add(fas, far, fab)
    app.component(ElCollapseTransition?.name ?? 'ElCollapseTransition', ElCollapseTransition)

    // 建議使用 import { Custom... } from '@/components...
    app.component('CustomIcon', CustomIcon)
    app.component('CustomButton', CustomButton)
  }
}

export default pluginComponents
