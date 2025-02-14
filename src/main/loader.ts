import type { IpcEmitter, IpcListener } from '@electron-toolkit/typed-ipc/main'
import type { IpcEvents, IpcRendererEvent } from '@main/ipc/type.ts'
import type { BrowserWindow } from 'electron'

export type Windows = {
  main?: BrowserWindow
}

export type Loader<T> = (
  ipc: IpcListener<IpcEvents>,
  emitter: IpcEmitter<IpcRendererEvent>,
  windows: Windows
) => Promise<T> | T

export const defineLoader = <T = void>(loader: Loader<T>) => loader
