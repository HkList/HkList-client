import { defineInitLoader } from '@main/loader.ts'
import { optimizer } from '@electron-toolkit/utils'

export default defineInitLoader((app) => {
  // 屏蔽 F12
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
})
