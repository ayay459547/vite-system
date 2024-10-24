import type { App } from 'vue'

// fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// element plus
import { ElCollapseTransition } from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/base.css'
// Transition name="el-...name"

// feature
import CustomIcon from './feature/CustomIcon/CustomIcon.vue'
import CustomButton from './feature/CustomButton/CustomButton.vue'
// import CustomTable from './feature/CustomTable/CustomTable.vue'

// markdown
import VMdPreview from '@kangc/v-md-editor/lib/preview'
import '@kangc/v-md-editor/lib/style/preview.css'
// VuePress 樣式
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js'
import '@kangc/v-md-editor/lib/theme/style/vuepress.css'
// 代碼亮色
import Prism from 'prismjs'
import 'prismjs/components/prism-json'

VMdPreview.use(vuepressTheme, { Prism })

const pluginComponents = {
  install(app: App): void {
    library.add(fas, fab, far)
    app.component('FontAwesomeIcon', FontAwesomeIcon)
    app.use(VMdPreview)

    app.component(ElCollapseTransition.name, ElCollapseTransition)

    /**
     * 建議從 import { Custom... } from '@/components' // 系統組件 引入
     * 不引入直接可以用
     */
    app.component('CustomIcon', CustomIcon)
    app.component('CustomButton', CustomButton)
    // app.component('CustomTable', CustomTable)
  }
}

export default pluginComponents
