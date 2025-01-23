import { app } from 'electron'
import type { windows } from '@main/loader.ts'

import setAppUserModelId from '@main/init/setAppUserModelId.ts'
import preventF12 from '@main/init/preventF12.ts'
import macos from '@main/init/macos.ts'
import createWindow from '@main/window/createWindow.ts'
import window from '@main/ipc/window.ts'
import config from '@main/ipc/config.ts'
import parse from '@main/ipc/parse.ts'

app.whenReady().then(async () => {
  await setAppUserModelId()
  await preventF12()

  let windows: windows = {}

  window(windows)
  config(windows)
  parse(windows)

  windows.main = await createWindow()

  macos()
})
