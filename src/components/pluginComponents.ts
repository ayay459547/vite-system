import type { App } from 'vue'

// fontawesome icon
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'

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

// feature
import CustomIcon from './feature/CustomIcon/CustomIcon.vue'
import CustomButton from './feature/CustomButton/CustomButton.vue'

/**
 * 全域組件
 * 不引入 可直接使用
 */
const pluginComponents = {
  install(app: App): void {
    library.add(fas, fab, far)
    app.component(ElCollapseTransition?.name ?? 'ElCollapseTransition', ElCollapseTransition)

    // 建議使用 import { Custom... } from '@/components'
    app.component('CustomIcon', CustomIcon)
    app.component('CustomButton', CustomButton)
  }
}

export default pluginComponents
