import { optimizer } from '@electron-toolkit/utils'
import { defineLoader } from '@main/loader.ts'
import { app } from 'electron'

export default defineLoader(() => {
  // 屏蔽 F12
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
})
