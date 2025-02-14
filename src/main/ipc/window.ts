import { nowConfig } from '@main/ipc/config.ts'
import { defineLoader } from '@main/loader.ts'
import { success } from '@main/utils/response.ts'
import { app, dialog } from 'electron'

export interface IsMaximized {
  isMaximized: boolean
}

export interface SelectedFolder {
  cancel: boolean
  folder: string
}

export default defineLoader((ipc, _emitter, windows) => {
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

  ipc.handle('window.selectFoloder', async () => {
    if (!windows.main) {
      return success({
        cancel: false,
        folder: nowConfig.aria2.dir
      })
    }
    const result = await dialog.showOpenDialog(windows.main, { properties: ['openDirectory'] })
    return success({
      cancel: result.canceled,
      folder: result.filePaths[0]
    })
  })

  ipc.handle('window.alert', () => {
    if (!windows.main) return success()

    if (!windows.main.isMinimized()) windows.main.minimize()
    windows.main.show()

    return success()
  })
})
