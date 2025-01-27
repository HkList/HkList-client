import { defineLoader } from '@main/loader.ts'
import { defineIpcHandle } from '@main/utils/defineIpcHandle.ts'
import { success } from '@main/utils/response.ts'
import { app } from 'electron'

export interface isMaximized {
  isMaximized: boolean
}

export default defineLoader((windows) => {
  defineIpcHandle('window.minimize', () => {
    windows?.main?.minimize()
    return success()
  })

  defineIpcHandle('window.maximize', () => {
    windows?.main?.maximize()
    return success()
  })

  defineIpcHandle('window.unMaximize', () => {
    windows?.main?.unmaximize()
    return success()
  })

  defineIpcHandle<null, isMaximized>('window.getIsMaximized', () => {
    const isMaximized = windows?.main?.isMaximized()
    return success(isMaximized)
  })

  defineIpcHandle('window.close', () => {
    app.quit()
    return success()
  })
})
