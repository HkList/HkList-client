import type { windows } from '@main/loader.ts'
import { app } from 'electron'

import createWindow from '@main/function/createWindow.ts'
import macos from '@main/function/macos.ts'
import preventF12 from '@main/function/preventF12.ts'
import setAppUserModelId from '@main/function/setAppUserModelId.ts'
import aria2 from '@main/ipc/aria2.ts'
import config from '@main/ipc/config.ts'
import parse from '@main/ipc/parse.ts'
import window from '@main/ipc/window.ts'

app.whenReady().then(async () => {
  const windows: windows = {}

  await setAppUserModelId(windows)
  await preventF12(windows)
  await window(windows)
  await config(windows)
  await parse(windows)
  await aria2(windows)

  windows.main = await createWindow(windows)

  await macos(windows)
})
