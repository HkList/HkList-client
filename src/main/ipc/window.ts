import { defineIpcLoader } from '@main/loader.ts'
import { defineIpcHandle } from '@main/utils/defineIpcHandle.ts'
import { success } from '@main/utils/response.ts'
import { app } from 'electron'

export default defineIpcLoader((windows) => {
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

  defineIpcHandle('window.isMaximized', () => {
    const isMaximized = windows?.main?.isMaximized()
    return success(isMaximized)
  })

  defineIpcHandle('window.close', () => {
    app.quit()
    return success()
  })
})
