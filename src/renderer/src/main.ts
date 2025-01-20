import { createApp } from 'vue'
import { createPinia } from 'pinia'

// 引入组件库的少量全局样式变量
import 'tdesign-vue-next/es/style/index.css'
import '@renderer/assets/base.scss'

import App from '@renderer/App.vue'
import router from '@renderer/router/index.ts'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
