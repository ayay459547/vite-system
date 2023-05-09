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
import AdvantButton from './feature/AdvantButton.vue'

// form
import FormInput from './form/FormInput.vue'
import FormSelect from './form/FormSelect.vue'

const pluginComponents = {
  install (app: App): void {
    library.add(fas, fab, far)
    app.component('font-awesome-icon', FontAwesomeIcon)

    app.component('el-button', ElButton)

    app.component('AdvantIcon', AdvantIcon)
    app.component('AdvantTabs', AdvantTabs)
    app.component('AdvantButton', AdvantButton)

    app.component('FormInput', FormInput)
    app.component('FormSelect', FormSelect)
  }
}

export default pluginComponents