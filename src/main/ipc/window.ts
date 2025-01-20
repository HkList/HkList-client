import { defineIpcLoader } from '@main/loader.ts'
import { ipcMain } from 'electron'

export default defineIpcLoader((app, window) => {
  ipcMain.handle('window.minimize', () => {
    if (!window) return
    window.minimize()
  })

  ipcMain.handle('window.maximize', () => {
    if (!window) return
    window.maximize()
  })

  ipcMain.handle('window.unMaximize', () => {
    if (!window) return
    window.unmaximize()
  })

  ipcMain.handle('window.isMaximized', () => {
    if (!window) return
    return window.isMaximized()
  })

  ipcMain.handle('window.close', () => {
    app.quit()
  })
})
