import { createPinia } from 'pinia'
import { createApp } from 'vue'

// 引入组件库的少量全局样式变量
import '@renderer/assets/base.scss'
import 'tdesign-vue-next/es/style/index.css'

import App from '@renderer/App.vue'
import router from '@renderer/router/index.ts'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
