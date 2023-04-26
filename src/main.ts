import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'
import pluginComponents from '@/components/pluginComponents'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(pluginComponents)

app.mount('#app')
