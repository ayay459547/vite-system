import type { App } from 'vue'

// fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// element plus
// import ElementPlus from 'element-plus'
import { ElButton } from 'element-plus'
import 'element-plus/dist/index.css'

// feature
import AdvantIcon from './feature/AdvantIcon.vue'
import AdvantTabs from './feature/AdvantTabs.vue'

const pluginComponents = {
  install (app: App): void {
    app.component('ElButton', ElButton)

    library.add(fas, fab, far)
    app.component('font-awesome-icon', FontAwesomeIcon)

    app.component('AdvantIcon', AdvantIcon)
    app.component('AdvantTabs', AdvantTabs)
  }
}

export default pluginComponents