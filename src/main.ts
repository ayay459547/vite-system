import objectFunction from './lib/objectFunction'
for (const key in objectFunction) {
  if (!Object.prototype[key]) {
    Object.defineProperty(Object.prototype, key, {
      get () {
        return objectFunction[key]
      }
    })
  }
}

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import './assets/main.css'

import router from './router'
import pluginComponents from '@/components/pluginComponents'
import i18n from '@/i18n/i18n'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(pluginComponents)
app.use(i18n)

app.mount('#app')
