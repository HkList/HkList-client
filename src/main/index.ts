import type { Windows } from '@main/loader.ts'
import { app } from 'electron'
import type { IpcEvents } from '@main/ipc/type.ts'

import createWindow from '@main/function/createWindow.ts'
import macos from '@main/function/macos.ts'
import preventF12 from '@main/function/preventF12.ts'
import setAppUserModelId from '@main/function/setAppUserModelId.ts'
import aria2 from '@main/ipc/aria2.ts'
import config from '@main/ipc/config.ts'
import parse from '@main/ipc/parse.ts'
import window from '@main/ipc/window.ts'
import { IpcListener } from '@electron-toolkit/typed-ipc/main'
import { handleError } from '@main/utils/handleError.ts'

app.whenReady().then(async () => {
  const windows: Windows = {}
  const ipc = new IpcListener<IpcEvents>()

  ipc.handle = ((originFunction) => {
    originFunction = originFunction.bind(ipc)
    return (name, fn) =>
      originFunction(name, async (e, ...args) => {
        try {
          return await fn(e, ...args)
        } catch (error) {
          return handleError(error) as any
        }
      })
  })(ipc.handle)

  await setAppUserModelId(ipc, windows)
  await preventF12(ipc, windows)
  await window(ipc, windows)
  await config(ipc, windows)
  await parse(ipc, windows)
  await aria2(ipc, windows)

  windows.main = await createWindow(ipc, windows)

  await macos(ipc, windows)
})
