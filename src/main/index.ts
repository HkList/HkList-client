import type { IpcEvents, IpcRendererEvent } from '@main/ipc/type.ts'
import type { Windows } from '@main/loader.ts'

import { IpcEmitter, IpcListener } from '@electron-toolkit/typed-ipc/main'
import createWindow from '@main/function/createWindow.ts'
import macos from '@main/function/macos.ts'
import preventF12 from '@main/function/preventF12.ts'
import setAppUserModelId from '@main/function/setAppUserModelId.ts'
import aria2 from '@main/ipc/aria2.ts'
import clipboard from '@main/ipc/clipboard.ts'
import config from '@main/ipc/config.ts'
import parse from '@main/ipc/parse.ts'
import window from '@main/ipc/window.ts'
import { rewriteIpcHandle } from '@main/utils/rewriteIpcHandle.ts'
import { app } from 'electron'

app.disableHardwareAcceleration()

app.whenReady().then(async () => {
  const windows: Windows = {}
  const ipc = new IpcListener<IpcEvents>()
  const emitter = new IpcEmitter<IpcRendererEvent>()

  rewriteIpcHandle(ipc)

  await setAppUserModelId(ipc, emitter, windows)
  await preventF12(ipc, emitter, windows)
  await window(ipc, emitter, windows)
  await config(ipc, emitter, windows)
  await parse(ipc, emitter, windows)
  await aria2(ipc, emitter, windows)
  await clipboard(ipc, emitter, windows)

  windows.main = await createWindow(ipc, emitter, windows)

  await macos(ipc, emitter, windows)
})
