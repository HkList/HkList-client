import type { BrowserWindow } from 'electron'

export type windows = {
  main?: BrowserWindow
}

export type initLoader = (app: Electron.App) => Promise<void> | void
export type windowLoader = (app: Electron.App) => Promise<BrowserWindow> | BrowserWindow
export type ipcLoader = (app: Electron.App, windows: windows) => Promise<void> | void

export const defineInitLoader = (loader: initLoader) => loader
export const defineWindowLoader = (loader: windowLoader) => loader
export const defineIpcLoader = (loader: ipcLoader) => loader
