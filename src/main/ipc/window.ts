import { defineIpcLoader } from '@main/loader.ts'
import { ipcMain } from 'electron'

export default defineIpcLoader((app, windows) => {
  ipcMain.handle('window.minimize', () => {
    if (!windows.main) return
    windows.main.minimize()
  })

  ipcMain.handle('window.maximize', () => {
    if (!windows.main) return
    windows.main.maximize()
  })

  ipcMain.handle('window.unMaximize', () => {
    if (!windows.main) return
    windows.main.unmaximize()
  })

  ipcMain.handle('window.isMaximized', () => {
    if (!windows.main) return
    return windows.main.isMaximized()
  })

  ipcMain.handle('window.close', () => {
    app.quit()
  })
})
