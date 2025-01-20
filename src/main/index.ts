import { app } from 'electron'
import type { windows } from '@main/loader.ts'

import setAppUserModelId from '@main/init/setAppUserModelId.ts'
import preventF12 from '@main/init/preventF12.ts'
import macos from '@main/init/macos.ts'
import createWindow from '@main/window/createWindow.ts'
import window from '@main/ipc/window.ts'

app.whenReady().then(async () => {
  setAppUserModelId(app)
  preventF12(app)

  let windows: windows = {}

  window(app, windows)

  windows.main = await createWindow(app)
  macos(app)
})
