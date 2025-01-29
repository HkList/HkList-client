import { defineLoader } from '@main/loader.ts'
import { success } from '@main/utils/response.ts'
import { app } from 'electron'

export interface IsMaximized {
  isMaximized: boolean
}

export default defineLoader((ipc, windows) => {
  ipc.handle('window.minimize', () => {
    windows?.main?.minimize()
    return success()
  })

  ipc.handle('window.maximize', () => {
    windows?.main?.maximize()
    return success()
  })

  ipc.handle('window.unMaximize', () => {
    windows?.main?.unmaximize()
    return success()
  })

  ipc.handle('window.getIsMaximized', () => {
    const isMaximized = windows?.main?.isMaximized() ?? false
    return success({ isMaximized })
  })

  ipc.handle('window.close', () => {
    app.quit()
    return success()
  })
})
