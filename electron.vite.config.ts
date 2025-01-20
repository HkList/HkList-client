import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import { TDesignResolver } from 'unplugin-vue-components/resolvers'

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
        '@renderer': resolve('./src/renderer/src')
      }
    }
  }
})
