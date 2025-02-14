import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { resolve } from 'path'
import { TDesignResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@': resolve('./'),
        '@main': resolve('./src/main')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
      Components({
        dirs: ['public'],
        resolvers: [
          TDesignResolver({
            library: 'vue-next'
          })
        ]
      })
    ],
    resolve: {
      alias: {
        '@': resolve('./'),
        '@main': resolve('./src/main'),
        '@renderer': resolve('./src/renderer/src')
      }
    }
  }
})
