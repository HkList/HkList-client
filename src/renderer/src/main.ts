import { createApp } from 'vue'
import { createPinia } from 'pinia'

import '@renderer/assets/base.scss'

import App from '@renderer/App.vue'
import router from '@renderer/router/index.ts'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
