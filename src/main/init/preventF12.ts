import { optimizer } from '@electron-toolkit/utils'
import { defineInitLoader } from '@main/loader.ts'
import { app } from 'electron'

export default defineInitLoader(() => {
  // 屏蔽 F12
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
})
