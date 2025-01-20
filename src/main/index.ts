import { app, type BrowserWindow } from 'electron'

import setAppUserModelId from '@main/init/setAppUserModelId.ts'
import preventF12 from '@main/init/preventF12.ts'
import macos from '@main/init/macos.ts'
import createWindow from '@main/window/createWindow.ts'
import window from '@main/ipc/window.ts'

app.whenReady().then(async () => {
  setAppUserModelId(app)
  preventF12(app)

  let mainWindow: BrowserWindow | undefined = undefined

  window(app, mainWindow)

  mainWindow = await createWindow(app)
  macos(app)
})
