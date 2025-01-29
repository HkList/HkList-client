import type { IpcListener } from '@electron-toolkit/typed-ipc/main'
import type { BrowserWindow } from 'electron'
import type { IpcEvents } from '@main/ipc/type.ts'

export type Windows = {
  main?: BrowserWindow
}

export type Loader<T> = (ipc: IpcListener<IpcEvents>, windows: Windows) => Promise<T> | T

export const defineLoader = <T = void>(loader: Loader<T>) => loader
