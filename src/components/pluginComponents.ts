import type { App } from 'vue'

// fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// element plus
// import { vLoading } from 'element-plus'
import 'element-plus/dist/index.css'

// feature
import CustomIcon from './feature/icon/CustomIcon.vue'
import CustomTabs from './feature/CustomTabs.vue'
import CustomButton from './feature/button/CustomButton.vue'
import CustomTable from './feature/table/CustomTable.vue'
import CustomModal from './feature/modal/CustomModal.vue'

// form
import FormDatePicker from './form/FormDatePicker.vue'
import FormInput from './form/FormInput.vue'
import FormSelect from './form/FormSelect.vue'

const pluginComponents = {
  install (app: App): void {
    library.add(fas, fab, far)
    app.component('font-awesome-icon', FontAwesomeIcon)

    app.component('CustomIcon', CustomIcon)
    app.component('CustomTabs', CustomTabs)
    app.component('CustomButton', CustomButton)
    app.component('CustomTable', CustomTable)
    app.component('CustomModal', CustomModal)

    app.component('FormDatePicker', FormDatePicker)
    app.component('FormInput', FormInput)
    app.component('FormSelect', FormSelect)
  }
}

export default pluginComponents